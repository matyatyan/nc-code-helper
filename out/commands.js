"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = registerCommands;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
// ★ CategoryTreeDataProvider から MachineTreeDataProvider へ変更
const treeview_1 = require("./treeview");
// ★ 引数の型定義を MachineTreeDataProvider へ変更
function registerCommands(context, treeDataProvider) {
    // 1. 設備名をクリックした際：HTML（Webview）で綺麗な表として表示する
    const openMachineCommand = vscode.commands.registerCommand('ncCodeHelper.openMachineJson', async (machineName) => {
        const folder = (0, treeview_1.getStorageMachineFolder)(context);
        const jsonPath = path.join(folder, `${machineName}.json`);
        if (!fs.existsSync(jsonPath)) {
            vscode.window.showErrorMessage(`設定ファイルが見つかりません: ${jsonPath}`);
            return;
        }
        try {
            const rawData = fs.readFileSync(jsonPath, 'utf8');
            const data = JSON.parse(rawData);
            // Webviewパネルの作成（右側に開く）
            const panel = vscode.window.createWebviewPanel('machineCodeView', `設備: ${data.machine || machineName}`, vscode.ViewColumn.Beside, {
                enableScripts: true
            });
            // テーブル行の生成
            let rowsHtml = '';
            if (data.mCodes && typeof data.mCodes === 'object') {
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
            // VS Codeの標準デザインに馴染むHTML/CSS
            panel.webview.html = `
                    <!DOCTYPE html>
                    <html lang="ja">
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                font-family: var(--vscode-font-family);
                                padding: 20px;
                                color: var(--vscode-editor-foreground);
                                background-color: var(--vscode-editor-backgroundColor);
                            }
                            h1 {
                                font-size: 1.4em;
                                margin-bottom: 5px;
                                border-bottom: 1px solid var(--vscode-panel-border);
                                padding-bottom: 8px;
                            }
                            p.desc {
                                color: var(--vscode-descriptionForeground);
                                margin-bottom: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 10px;
                            }
                            th, td {
                                text-align: left;
                                padding: 8px 12px;
                                border-bottom: 1px solid var(--vscode-widget-border);
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
                                width: 120px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>設備: ${data.machine || machineName}</h1>
                        ${data.description ? `<p class="desc">${data.description}</p>` : ''}

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
        catch (err) {
            vscode.window.showErrorMessage(`JSONファイルの読み込みエラー: ${err}`);
        }
    });
    // 2. 「＋ 新規設備を追加...」をクリックした際：エクスプローラーからJSONを選択
    const addMachineCommand = vscode.commands.registerCommand('ncCodeHelper.addMachineJson', async () => {
        const fileUris = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: '設備JSONとして追加',
            filters: { 'JSON Files': ['json'] }
        });
        if (!fileUris || fileUris.length === 0)
            return;
        const selectedUri = fileUris[0];
        const fileName = path.basename(selectedUri.fsPath);
        const machineName = path.parse(fileName).name;
        const targetFolder = (0, treeview_1.getStorageMachineFolder)(context);
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }
        const targetPath = path.join(targetFolder, fileName);
        if (fs.existsSync(targetPath)) {
            const overwrite = await vscode.window.showWarningMessage(`「${fileName}」は既に存在します。上書きしますか？`, '上書き', 'キャンセル');
            if (overwrite !== '上書き')
                return;
        }
        fs.copyFileSync(selectedUri.fsPath, targetPath);
        vscode.window.showInformationMessage(`設備「${machineName}」を追加しました。`);
        treeDataProvider.refresh();
        await vscode.commands.executeCommand('ncCodeHelper.openMachineJson', machineName);
    });
    // 3. フォルダを開くコマンド
    const openStorageFolderCommand = vscode.commands.registerCommand('ncCodeHelper.openStorageFolder', async () => {
        const folderPath = (0, treeview_1.getStorageMachineFolder)(context);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        const folderUri = vscode.Uri.file(folderPath);
        await vscode.env.openExternal(folderUri);
    });
    context.subscriptions.push(openMachineCommand, addMachineCommand, openStorageFolderCommand);
}
//# sourceMappingURL=commands.js.map