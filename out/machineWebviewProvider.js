"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineWebviewProvider = void 0;
class MachineWebviewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        // 初期表示メッセージ
        webviewView.webview.html = this._getInitialHtml();
    }
    /**
     * 設備データを元に下部パネルの HTML を更新する
     * @param data JSONから読み込んだ設備定義オブジェクト
     * @param machineNameInput 設備名（文字列または TreeItem オブジェクト）
     */
    updateMachineData(data, machineNameInput) {
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
        }
        else {
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
                        padding: 10px 15px;
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-backgroundColor);
                    }
                    h1 {
                        font-size: 1.1em;
                        margin-bottom: 4px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 4px;
                    }
                    p.desc {
                        color: var(--vscode-descriptionForeground);
                        margin-bottom: 10px;
                        font-size: 0.9em;
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
            </body>
            </html>
        `;
    }
    _getInitialHtml() {
        return `
            <!DOCTYPE html>
            <html lang="ja">
            <body style="font-family: var(--vscode-font-family); padding: 15px; color: var(--vscode-descriptionForeground);">
                <p>ツリービューで設備を選択すると Mコード一覧が表示されます。</p>
            </body>
            </html>
        `;
    }
}
exports.MachineWebviewProvider = MachineWebviewProvider;
MachineWebviewProvider.viewType = 'ncCodeHelperMachineDetailView';
//# sourceMappingURL=machineWebviewProvider.js.map