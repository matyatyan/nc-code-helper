import * as vscode from 'vscode';
import { registerTreeview } from './treeview';
import { registerDocumentSymbolProvider } from './symbols';
import { initializeDecorations, updateDecorations, refreshDecorationStyles } from './decorator';
import { registerHoverProvider } from './hover';
import { registerCommands } from './commands';
import { registerToolCheckDiagnostics } from './diagnostics';
import { isNcDocument } from './utils';
import { MachineWebviewProvider } from './machineWebviewProvider'; // ★ import を追加

export function activate(context: vscode.ExtensionContext) {
    // 1. NCファイル自動判定＆言語ID設定
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(doc => {
            if (doc.languageId !== 'gcode' && isNcDocument(doc)) {
                vscode.languages.setTextDocumentLanguage(doc, 'gcode');
            }
        })
    );

    // 起動時にすでに開かれているアクティブエディタもチェック
    if (vscode.window.activeTextEditor) {
        const doc = vscode.window.activeTextEditor.document;
        if (doc.languageId !== 'gcode' && isNcDocument(doc)) {
            vscode.languages.setTextDocumentLanguage(doc, 'gcode');
        }
    }

    // 2. ツリービューの登録（DataProvider の取得）
    const { machineDataProvider, colorDataProvider } = registerTreeview(context);

    // 3. 下部 Mコード定義用 WebviewViewProvider の登録
    const provider = new MachineWebviewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(MachineWebviewProvider.viewType, provider)
    );

    // 4. 各種機能およびコマンドの登録
    initializeDecorations(context);
    registerDocumentSymbolProvider(context);
    registerHoverProvider(context);
    
    // コマンド登録（引数に machineDataProvider と provider の両方を1度だけ渡す）
    registerCommands(context, machineDataProvider, provider);

    // ツール番号とH番号の不一致チェック（Diagnostic）の登録
    registerToolCheckDiagnostics(context);

    // 3D ビューアの登録（一時停止中）
    // register3DViewer(context);

    // 5. イベントハンドラの設定
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) updateDecorations();
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            updateDecorations();
        }
    }, null, context.subscriptions);

    // 6. 設定変更時のイベントハンドラ
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('ncCodeHelper')) {
            refreshDecorationStyles(); // カラー定義を再生成
            updateDecorations();       // 再描画
            colorDataProvider.refresh(); // カラーツリーの再読み込み
        }
    }, null, context.subscriptions);

    // 7. 初回描画の実行
    updateDecorations();
}

export function deactivate() {}