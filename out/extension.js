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
function activate(context) {
    // ドキュメントが開かれた時、NCコード判定されたら言語IDを 'gcode' に割り当てる
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
    // ツール番号とH番号不一致チェックの登録
    (0, diagnostics_1.registerToolCheckDiagnostics)(context);
    // 3D ビューアの登録
    // register3DViewer(context);
    // 4. 初回描画
    (0, decorator_1.updateDecorations)();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map