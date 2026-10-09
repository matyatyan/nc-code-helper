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
const diagnostics_1 = require("./diagnostics");
const utils_1 = require("./utils");
const machineWebviewProvider_1 = require("./machineWebviewProvider"); // ★ import を追加
function activate(context) {
    // 1. NCファイル自動判定＆言語ID設定
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.languageId !== 'gcode' && (0, utils_1.isNcDocument)(doc)) {
            vscode.languages.setTextDocumentLanguage(doc, 'gcode');
        }
    }));
    // 起動時にすでに開かれているアクティブエディタもチェック
    if (vscode.window.activeTextEditor) {
        const doc = vscode.window.activeTextEditor.document;
        if (doc.languageId !== 'gcode' && (0, utils_1.isNcDocument)(doc)) {
            vscode.languages.setTextDocumentLanguage(doc, 'gcode');
        }
    }
    // 2. ツリービューの登録（DataProvider の取得）
    const { machineDataProvider, colorDataProvider } = (0, treeview_1.registerTreeview)(context);
    // 3. 下部 Mコード定義用 WebviewViewProvider の登録
    const provider = new machineWebviewProvider_1.MachineWebviewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(machineWebviewProvider_1.MachineWebviewProvider.viewType, provider));
    // 4. 各種機能およびコマンドの登録
    (0, decorator_1.initializeDecorations)(context);
    (0, symbols_1.registerDocumentSymbolProvider)(context);
    (0, hover_1.registerHoverProvider)(context);
    // コマンド登録（引数に machineDataProvider と provider の両方を1度だけ渡す）
    (0, commands_1.registerCommands)(context, machineDataProvider, provider);
    // ツール番号とH番号の不一致チェック（Diagnostic）の登録
    (0, diagnostics_1.registerToolCheckDiagnostics)(context);
    // 3D ビューアの登録（一時停止中）
    // register3DViewer(context);
    // 5. イベントハンドラの設定
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor)
            (0, decorator_1.updateDecorations)();
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            (0, decorator_1.updateDecorations)();
        }
    }, null, context.subscriptions);
    // 6. 設定変更時のイベントハンドラ
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('ncCodeHelper')) {
            (0, decorator_1.refreshDecorationStyles)(); // カラー定義を再生成
            (0, decorator_1.updateDecorations)(); // 再描画
            colorDataProvider.refresh(); // カラーツリーの再読み込み
        }
    }, null, context.subscriptions);
    // 7. 初回描画の実行
    (0, decorator_1.updateDecorations)();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map