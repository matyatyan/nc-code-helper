import * as vscode from 'vscode';
import { isNcDocument } from './utils';

interface ProgramState {
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

function evaluateMacroExpression(expression: string, variables: Map<number, number>): number | undefined {
    let index = 0;

    const skipWhitespace = (): void => {
        while (/\s/.test(expression[index] ?? '')) {
            index++;
        }
    };

    const parseFactor = (): number | undefined => {
        skipWhitespace();
        const character = expression[index];

        if (character === '+' || character === '-') {
            index++;
            const value = parseFactor();
            return value === undefined ? undefined : character === '-' ? -value : value;
        }

        if (character === '[' || character === '(') {
            const closingCharacter = character === '[' ? ']' : ')';
            index++;
            const value = parseExpression();
            skipWhitespace();
            if (expression[index] !== closingCharacter) {
                return undefined;
            }
            index++;
            return value;
        }

        const variableMatch = expression.slice(index).match(/^#(\d+)/);
        if (variableMatch) {
            index += variableMatch[0].length;
            return variables.get(Number(variableMatch[1]));
        }

        const numberMatch = expression.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?/);
        if (!numberMatch) {
            return undefined;
        }
        index += numberMatch[0].length;
        return Number(numberMatch[0]);
    };

    const parseTerm = (): number | undefined => {
        let value = parseFactor();
        if (value === undefined) {
            return undefined;
        }

        while (true) {
            skipWhitespace();
            const operator = expression[index];
            if (operator !== '*' && operator !== '/') {
                return value;
            }
            index++;
            const right = parseFactor();
            if (right === undefined) {
                return undefined;
            }
            value = operator === '*' ? value * right : value / right;
        }
    };

    const parseExpression = (): number | undefined => {
        let value = parseTerm();
        if (value === undefined) {
            return undefined;
        }

        while (true) {
            skipWhitespace();
            const operator = expression[index];
            if (operator !== '+' && operator !== '-') {
                return value;
            }
            index++;
            const right = parseTerm();
            if (right === undefined) {
                return undefined;
            }
            value = operator === '+' ? value + right : value - right;
        }
    };

    const value = parseExpression();
    skipWhitespace();
    return value !== undefined && index === expression.length && Number.isFinite(value)
        ? value
        : undefined;
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
        this._programState = editor && isNcDocument(editor.document)
            ? this._getProgramState(editor.document, editor.selection.active)
            : { ...emptyProgramState };

        this._view?.webview.postMessage({
            type: 'programState',
            state: this._programState
        });
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
                    .content {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        min-height: 150px;
                    }
                    .definitions {
                        min-width: 0;
                        padding-right: 12px;
                    }
                    .program-state {
                        border-left: 1px solid var(--vscode-widget-border);
                        padding: 10px 0 10px 16px;
                    }
                    .program-state p {
                        display: grid;
                        grid-template-columns: 9em 1em minmax(0, 1fr);
                        margin: 0 0 8px;
                        font-size: 1em;
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
                        <p><span>使用座標系</span><span>：</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        <p><span>使用工具</span><span>：</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        <p><span>工具長補正</span><span>：</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                        <p><span>工具径補正</span><span>：</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        <p><span>待機工具</span><span>：</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        <p><span>送り速度</span><span>：</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
                        <p><span>主軸回転数</span><span>：</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min⁻¹</span></p>
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

    private _getProgramState(document: vscode.TextDocument, position: vscode.Position): ProgramState {
        const state: ProgramState = { ...emptyProgramState };
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

        for (let lineNumber = 0; lineNumber <= position.line; lineNumber++) {
            const line = document.lineAt(lineNumber).text;
            const source = line;
            const commentFreeLine = source
                .replace(/\([^)]*(?:\)|$)/g, '')
                .split(';', 1)[0];
            const code = commentFreeLine.replace(
                /#(\d+)\s*=\s*(\[[^\]]*\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi,
                (assignment, variableNumber: string, expression: string) => {
                    const value = evaluateMacroExpression(expression, macroVariables);
                    if (value !== undefined) {
                        macroVariables.set(Number(variableNumber), value);
                    }
                    return ' ';
                }
            );
            const words = /([GMTFHSDP])(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi;
            let match: RegExpExecArray | null;

            while ((match = words.exec(code)) !== null) {
                const letter = match[1].toUpperCase();
                const value = match[2];

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
                            const hMatch = code.match(/H([+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);
                            if (hMatch) {
                                toolLengthOffset = `H${hMatch[1]}`;
                            }
                        } else if (/^49(?:\.0)?$/i.test(value)) {
                            toolLengthCompensationActive = false;
                            toolLengthOffset = undefined;
                            toolLengthCompensationCancelled = true;
                        } else if (/^41(?:\.0)?$/i.test(value)) {
                            toolDiameterCompensationActive = true;
                            toolDiameterCompensationCancelled = false;
                            const dMatch = code.match(/D([+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);
                            if (dMatch) {
                                toolDiameterOffset = `D${dMatch[1]}`;
                            }
                        } else if (/^42(?:\.0)?$/i.test(value)) {
                            toolDiameterCompensationActive = true;
                            toolDiameterCompensationCancelled = false;
                            const dMatch = code.match(/D([+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);
                            if (dMatch) {
                                toolDiameterOffset = `D${dMatch[1]}`;
                            }
                        } else if (/^40(?:\.0)?$/i.test(value)) {
                            toolDiameterCompensationActive = false;
                            toolDiameterOffset = undefined;
                            toolDiameterCompensationCancelled = true;
                        }
                        break;
                    case 'P':
                        if (state.coordinateSystem === 'G54.1') {
                            coordinateSystemParameter = `P${value}`;
                        }
                        break;
                    case 'T':
                        requestedTool = `T${value}`;
                        magazineTool = requestedTool;
                        break;
                    case 'M':
                        if (Number(value) === 6 && requestedTool) {
                            magazineTool = spindleTool;
                            spindleTool = requestedTool;
                            requestedTool = undefined;
                        }
                        break;
                    case 'H':
                        if (toolLengthCompensationActive) {
                            toolLengthOffset = `H${value}`;
                        }
                        break;
                    case 'D':
                        if (toolDiameterCompensationActive) {
                            toolDiameterOffset = `D${value}`;
                        }
                        break;
                    case 'F':
                        state.feedrate = String(evaluateMacroExpression(value, macroVariables) ?? value);
                        break;
                    case 'S':
                        state.spindleSpeed = String(evaluateMacroExpression(value, macroVariables) ?? value);
                        break;
                }
            }
        }

        if (coordinateSystemParameter) {
            state.coordinateSystem += ` ${coordinateSystemParameter}`;
        }
        state.spindleTool = spindleTool ?? '未検出';
        state.magazineTool = magazineTool ?? '未検出';
        state.toolLengthOffset = toolLengthCompensationActive
            ? toolLengthOffset ?? '未検出'
            : toolLengthCompensationCancelled ? 'なし' : '未検出';
        state.toolDiameterOffset = toolDiameterCompensationActive
            ? toolDiameterOffset ?? '未検出'
            : toolDiameterCompensationCancelled ? 'なし' : '未検出';
        return state;
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
                    .content {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        min-height: 150px;
                    }
                    .message {
                        color: var(--vscode-descriptionForeground);
                    }
                    .program-state {
                        border-left: 1px solid var(--vscode-widget-border);
                        padding: 10px 0 10px 16px;
                    }
                    .program-state p {
                        display: grid;
                        grid-template-columns: 9em 1em minmax(0, 1fr);
                        margin: 0 0 8px;
                        font-size: 1em;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <section class="message">
                        <p>設備を選択すると Mコード一覧が表示されます。</p>
                    </section>
                    <section class="program-state" aria-label="カーソル位置のプログラム状態">
                        <p><span>使用座標系</span><span>：</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        <p><span>使用工具</span><span>：</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        <p><span>工具長補正</span><span>：</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                        <p><span>工具径補正</span><span>：</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        <p><span>待機工具</span><span>：</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        <p><span>送り速度</span><span>：</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
                        <p><span>主軸回転数</span><span>：</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min⁻¹</span></p>
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