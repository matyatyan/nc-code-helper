import * as vscode from 'vscode';
import { isNcDocument } from './utils';
import { evaluateMacroExpression, isMacroCallLine, resolveMacroValue, updateMacroVariablesFromLine } from './macroExpression';

export interface ProgramState {
    coordinateSystem: string;
    spindleTool: string;
    toolLengthOffset: string;
    toolDiameterOffset: string;
    magazineTool: string;
    feedrate: string;
    feedrateUnit: string;
    spindleSpeed: string;
}

const emptyProgramState: ProgramState = {
    coordinateSystem: '未検出',
    spindleTool: '未検出',
    toolLengthOffset: '未検出',
    toolDiameterOffset: '未検出',
    magazineTool: '未検出',
    feedrate: '未検出',
    feedrateUnit: 'mm/min',
    spindleSpeed: '未検出'
};

export function hasToolOffsetMismatch(
    spindleTool: string,
    toolOffset: string,
    offsetPrefix: 'H' | 'D'
): boolean {
    const spindleNumber = Number(spindleTool.match(/^T(\d+)$/i)?.[1]);
    const offsetNumber = Number(toolOffset.match(new RegExp(`^${offsetPrefix}(\\d+)$`, 'i'))?.[1]);
    return Number.isFinite(spindleNumber) &&
        Number.isFinite(offsetNumber) &&
        spindleNumber !== offsetNumber;
}

export class MachineWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'ncCodeHelperMachineDetailView';
    private _view?: vscode.WebviewView;
    private _programState: ProgramState = { ...emptyProgramState };

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getInitialHtml();
    }

    public updateProgramState(editor?: vscode.TextEditor): void {
        try {
            this._programState = editor && isNcDocument(editor.document)
                ? this.getProgramState(editor.document, editor.selection.active)
                : { ...emptyProgramState };
        } catch (error) {
            console.error('[NC Code Helper] Failed to parse the active program state.', error);
            this._programState = { ...emptyProgramState };
        }

        if (this._view) {
            void this._view.webview.postMessage({
                type: 'programState',
                state: this._programState
            }).then(
                undefined,
                error => console.error('[NC Code Helper] Failed to send program state to the webview.', error)
            );
        }
    }

    /**
     * 設備データを元に下部パネルの HTML を更新する
     * @param data JSONから読み込んだ設備定義オブジェクト
     * @param machineNameInput 設備名（文字列または TreeItem オブジェクト）
     */
    public updateMachineData(data: any, machineNameInput: any) {
        if (!this._view) {
            return;
        }

        // 引数がオブジェクトで渡ってきた場合のセーフティガード
        const machineName = typeof machineNameInput === 'string'
            ? machineNameInput
            : (machineNameInput?.machineName || machineNameInput?.label || 'Unknown');

        // テーブル行の生成
        let rowsHtml = '';
        if (data && data.mCodes && typeof data.mCodes === 'object') {
            for (const [code, desc] of Object.entries(data.mCodes)) {
                rowsHtml += `
                    <tr>
                        <td class="code">${code}</td>
                        <td class="desc">${desc}</td>
                    </tr>
                `;
            }
        } else {
            rowsHtml = `<tr><td colspan="2">Mコード定義が見つかりません</td></tr>`;
        }

        const title = (data && typeof data.machine === 'string') ? data.machine : machineName;
        const description = (data && typeof data.description === 'string') ? data.description : '';

        this._view.webview.html = `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        margin: 0;
                        padding: 10px 15px;
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-backgroundColor);
                    }
                    h1 {
                        font-size: 1.1em;
                        margin-top: 0;
                        margin-bottom: 4px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 4px;
                    }
                    p.desc {
                        color: var(--vscode-descriptionForeground);
                        margin: 0 0 10px;
                        font-size: 0.9em;
                    }
                    html, body {
                        height: 100%;
                    }
                    body {
                        display: flex;
                        min-height: 0;
                    }
                    .content {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        min-height: 150px;
                        width: 100%;
                        height: 100%;
                        min-height: 0;
                    }
                    .definitions {
                        min-width: 0;
                        min-height: 0;
                        padding-right: 12px;
                        overflow-y: auto;
                    }
                    .program-state {
                        border-left: 1px solid var(--vscode-widget-border);
                        padding: 0 0 10px 16px;
                        min-width: 0;
                        min-height: 0;
                        overflow-y: auto;
                    }
                    .program-state p,
                    .program-state .double-value .field {
                        display: grid;
                        grid-template-columns: 6.6em 0.6em minmax(0, 1fr);
                        column-gap: 2px;
                        margin: 0 0 8px;
                        font-size: 1em;
                    }
                    .program-state .double-value {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        column-gap: 10px;
                        row-gap: 8px;
                        margin: 0 0 8px;
                        align-items: start;
                    }
                    .program-state .double-value .field {
                        min-width: 0;
                        margin-bottom: 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        text-align: left;
                        padding: 6px 10px;
                        border-bottom: 1px solid var(--vscode-widget-border);
                        font-size: 0.9em;
                    }
                    th {
                        background-color: var(--vscode-editor-lineHighlightBackground);
                        font-weight: bold;
                    }
                    tr:hover {
                        background-color: var(--vscode-list-hoverBackground);
                    }
                    td.code {
                        font-family: var(--vscode-editor-font-family);
                        font-weight: bold;
                        color: var(--vscode-symbolIcon-keywordForeground, #4ec9b0);
                        width: 100px;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <section class="definitions">
                        <h1>設備: ${title}</h1>
                        ${description ? `<p class="desc">${description}</p>` : ''}
                        <table>
                            <thead>
                                <tr>
                                    <th>Mコード</th>
                                    <th>説明</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </section>
                    <section class="program-state" aria-label="カーソル位置のプログラム状態">
                        <h1>加工条件データ</h1>
                        <p><span>使用座標系</span><span>：</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        <p><span>使用工具</span><span>：</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        <div class="double-value" aria-label="工具補正">
                            <p class="field"><span>工具長補正</span><span>：</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                            <p class="field"><span>工具径補正</span><span>：</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        </div>
                        <p><span>待機工具</span><span>：</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        <div class="double-value" aria-label="回転・送り">
                            <p class="field"><span>主軸回転数</span><span>：</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min⁻¹</span></p>
                            <p class="field"><span>送り速度</span><span>：</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
                        </div>
                    </section>
                </div>
                <script>
                    window.addEventListener('message', event => {
                        if (event.data.type !== 'programState') return;
                        for (const [key, value] of Object.entries(event.data.state)) {
                            const element = document.querySelector('[data-state="' + key + '"]');
                            if (element) element.textContent = value;
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }

    public getProgramState(document: vscode.TextDocument, position: vscode.Position): ProgramState {
        return this.getProgramStates(document, position.line)[position.line] ?? { ...emptyProgramState };
    }

    public getProgramStates(document: vscode.TextDocument, throughLine = document.lineCount - 1): ProgramState[] {
        const state: ProgramState = { ...emptyProgramState };
        const states: ProgramState[] = [];
        let requestedTool: string | undefined;
        let spindleTool: string | undefined;
        let magazineTool: string | undefined;
        let coordinateSystemParameter: string | undefined;
        let toolLengthCompensationActive = false;
        let toolLengthOffset: string | undefined;
        let toolLengthCompensationCancelled = false;
        let toolDiameterCompensationActive = false;
        let toolDiameterOffset: string | undefined;
        let toolDiameterCompensationCancelled = false;
        const macroVariables = new Map<number, number>();

        for (let lineNumber = 0; lineNumber <= throughLine; lineNumber++) {
            const line = document.lineAt(lineNumber).text;
            const source = line;
            if (/(?:^|[^A-Z])O\d+/i.test(source.replace(/\([^)]*(?:\)|$)/g, '').split(';', 1)[0])) {
                macroVariables.clear();
            }
            const code = isMacroCallLine(source) ? '' : updateMacroVariablesFromLine(source, macroVariables);
            const words = /(?<![A-Z])([GMTFHSDP])(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi;
            let match: RegExpExecArray | null;

            while ((match = words.exec(code)) !== null) {
                const letter = match[1].toUpperCase();
                const value = match[2];
                const resolvedValue = resolveMacroValue(value, macroVariables);

                switch (letter) {
                    case 'G':
                        if (/^94(?:\.0)?$/i.test(value)) {
                            state.feedrateUnit = 'mm/min';
                        } else if (/^95(?:\.0)?$/i.test(value)) {
                            state.feedrateUnit = 'mm/rev';
                        } else if (/^5[4-9](?:\.0)?$/i.test(value) || /^54\.1$/i.test(value)) {
                            state.coordinateSystem = `G${value}`;
                            coordinateSystemParameter = undefined;
                        } else if (/^4[34](?:\.0)?$/i.test(value)) {
                            toolLengthCompensationActive = true;
                            toolLengthCompensationCancelled = false;
                            const hMatch = code.match(/(?<![A-Z])H(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);
                            if (hMatch) {
                                toolLengthOffset = `H${resolveMacroValue(hMatch[1], macroVariables)}`;
                            }
                        } else if (/^49(?:\.0)?$/i.test(value)) {
                            toolLengthCompensationActive = false;
                            toolLengthOffset = undefined;
                            toolLengthCompensationCancelled = true;
                        } else if (/^41(?:\.0)?$/i.test(value)) {
                            toolDiameterCompensationActive = true;
                            toolDiameterCompensationCancelled = false;
                            const dMatch = code.match(/(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);
                            if (dMatch) {
                                toolDiameterOffset = `D${resolveMacroValue(dMatch[1], macroVariables)}`;
                            }
                        } else if (/^42(?:\.0)?$/i.test(value)) {
                            toolDiameterCompensationActive = true;
                            toolDiameterCompensationCancelled = false;
                            const dMatch = code.match(/(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);
                            if (dMatch) {
                                toolDiameterOffset = `D${resolveMacroValue(dMatch[1], macroVariables)}`;
                            }
                        } else if (/^40(?:\.0)?$/i.test(value)) {
                            toolDiameterCompensationActive = false;
                            toolDiameterOffset = undefined;
                            toolDiameterCompensationCancelled = true;
                        }
                        break;
                    case 'P':
                        if (state.coordinateSystem === 'G54.1') {
                            coordinateSystemParameter = `P${resolvedValue}`;
                        }
                        break;
                    case 'T':
                        requestedTool = `T${resolvedValue}`;
                        magazineTool = requestedTool;
                        break;
                    case 'M':
                        if (Number(resolvedValue) === 6 && requestedTool) {
                            magazineTool = spindleTool;
                            spindleTool = requestedTool;
                            requestedTool = undefined;
                        }
                        break;
                    case 'H':
                        if (toolLengthCompensationActive) {
                            toolLengthOffset = `H${resolvedValue}`;
                        }
                        break;
                    case 'D':
                        if (toolDiameterCompensationActive) {
                            toolDiameterOffset = `D${resolvedValue}`;
                        }
                        break;
                    case 'F':
                        state.feedrate = resolvedValue;
                        break;
                    case 'S':
                        state.spindleSpeed = resolvedValue;
                        break;
                }
            }

            states.push({
                ...state,
                coordinateSystem: coordinateSystemParameter
                    ? `${state.coordinateSystem} ${coordinateSystemParameter}`
                    : state.coordinateSystem,
                spindleTool: spindleTool ?? '未検出',
                magazineTool: magazineTool ?? '未検出',
                toolLengthOffset: toolLengthCompensationActive
                    ? toolLengthOffset ?? '未検出'
                    : toolLengthCompensationCancelled ? 'なし' : '未検出',
                toolDiameterOffset: toolDiameterCompensationActive
                    ? toolDiameterOffset ?? '未検出'
                    : toolDiameterCompensationCancelled ? 'なし' : '未検出'
            });
        }

        return states;
    }

    private _getInitialHtml(): string {
        return `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        margin: 0;
                        padding: 10px 15px;
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-backgroundColor);
                        font-family: var(--vscode-font-family);
                    }
                    html, body {
                        height: 100%;
                    }
                    body {
                        display: flex;
                        min-height: 0;
                    }
                    h1 {
                        font-size: 1.1em;
                        margin-top: 0;
                        margin-bottom: 4px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 4px;
                    }
                    .content {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        min-height: 150px;
                        width: 100%;
                        height: 100%;
                        min-height: 0;
                    }
                    .message {
                        color: var(--vscode-descriptionForeground);
                    }
                    .program-state {
                        border-left: 1px solid var(--vscode-widget-border);
                        padding: 0 0 10px 16px;
                    }
                    .program-state p,
                    .program-state .double-value .field {
                        display: grid;
                        grid-template-columns: 6.6em 0.6em minmax(0, 1fr);
                        column-gap: 2px;
                        margin: 0 0 8px;
                        font-size: 1em;
                    }
                    .program-state .double-value {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        column-gap: 10px;
                        row-gap: 8px;
                        margin: 0 0 8px;
                        align-items: start;
                    }
                    .program-state .double-value .field {
                        min-width: 0;
                        margin-bottom: 0;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <section class="message">
                        <p>設備を選択すると Mコード一覧が表示されます。</p>
                    </section>
                    <section class="program-state" aria-label="カーソル位置のプログラム状態">
                        <h1>加工条件データ</h1>
                        <p><span>使用座標系</span><span>：</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        <p><span>使用工具</span><span>：</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        <div class="double-value" aria-label="工具補正">
                            <p class="field"><span>工具長補正</span><span>：</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                            <p class="field"><span>工具径補正</span><span>：</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        </div>
                        <p><span>待機工具</span><span>：</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        <div class="double-value" aria-label="回転・送り">
                            <p class="field"><span>主軸回転数</span><span>：</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min⁻¹</span></p>
                            <p class="field"><span>送り速度</span><span>：</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
                        </div>
                    </section>
                </div>
                <script>
                    window.addEventListener('message', event => {
                        if (event.data.type !== 'programState') return;
                        for (const [key, value] of Object.entries(event.data.state)) {
                            const element = document.querySelector('[data-state="' + key + '"]');
                            if (element) element.textContent = value;
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}