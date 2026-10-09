"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = registerCommands;
// エクスプローラーへの機能表示
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const treeview_1 = require("./treeview");
function registerCommands(context, treeDataProvider, webviewProvider) {
    // 1. 設備名をクリックした際：下部パネルなどの WebviewView へデータを送って表示
    const openMachineCommand = vscode.commands.registerCommand('ncCodeHelper.openMachineJson', async (itemOrName) => {
        let machineName = '';
        if (typeof itemOrName === 'string') {
            machineName = itemOrName;
        }
        else if (itemOrName && typeof itemOrName === 'object') {
            machineName = itemOrName.machineName || itemOrName.label || '';
        }
        if (!machineName) {
            vscode.window.showErrorMessage('設備名を取得できませんでした。');
            return;
        }
        const folder = (0, treeview_1.getStorageMachineFolder)(context);
        const jsonPath = path.join(folder, `${machineName}.json`);
        if (!fs.existsSync(jsonPath)) {
            vscode.window.showErrorMessage(`設定ファイルが見つかりません: ${jsonPath}`);
            return;
        }
        try {
            const rawData = fs.readFileSync(jsonPath, 'utf8');
            const data = JSON.parse(rawData);
            // ★ ホバー表示用に「現在アクティブな設備」として名前を保存
            await context.globalState.update('activeMachine', machineName);
            // 下部パネルへフォーカス＆更新（第1引数: data, 第2引数: machineName）
            await vscode.commands.executeCommand('ncCodeHelperMachineDetailView.focus');
            webviewProvider.updateMachineData(data, machineName);
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
        // ツリーの更新と下部表示の切り替え
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