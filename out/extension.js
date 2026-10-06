"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const treeview_1 = require("./treeview");
const symbols_1 = require("./symbols");
const decorator_1 = require("./decorator");
const hover_1 = require("./hover");
const commands_1 = require("./commands");
function activate(context) {
    // 1. 各機能の初期化・登録
    (0, decorator_1.initializeDecorations)(context);
    // ツリービューの登録（返り値の変数名を treeview.ts と一致させる）
    const { machineDataProvider, colorDataProvider } = (0, treeview_1.registerTreeview)(context);
    (0, symbols_1.registerDocumentSymbolProvider)(context);
    (0, hover_1.registerHoverProvider)(context);
    // コマンド登録に machineDataProvider を渡す
    (0, commands_1.registerCommands)(context, machineDataProvider);
    // 2. イベントハンドラの設定
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor)
            (0, decorator_1.updateDecorations)();
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            (0, decorator_1.updateDecorations)();
        }
    }, null, context.subscriptions);
    // 3. 設定変更時のイベントハンドラ
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('ncCodeHelper')) {
            (0, decorator_1.refreshDecorationStyles)(); // カラー定義を再生成
            (0, decorator_1.updateDecorations)(); // 再描画
            colorDataProvider.refresh(); // カラーツリーの再読み込み
        }
    }, null, context.subscriptions);
    // 4. 初回描画
    (0, decorator_1.updateDecorations)();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map