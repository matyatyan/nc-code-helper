import * as vscode from 'vscode';
import { registerTreeview } from './treeview';
import { registerDocumentSymbolProvider } from './symbols';
import { initializeDecorations, updateDecorations, refreshDecorationStyles } from './decorator';
import { registerHoverProvider } from './hover';
import { registerCommands } from './commands';
import { registerToolCheckDiagnostics } from './diagnostics';
import { isNcDocument } from './utils';

export function activate(context: vscode.ExtensionContext) {
    // ドキュメントが開かれた時、NCコード判定されたら言語IDを 'gcode' に割り当てる
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

    // 1. 各機能の初期化・登録
    initializeDecorations(context);
    
    // ツリービューの登録（返り値の変数名を treeview.ts と一致させる）
    const { machineDataProvider, colorDataProvider } = registerTreeview(context);
    
    registerDocumentSymbolProvider(context);
    registerHoverProvider(context);
    
    // コマンド登録に machineDataProvider を渡す
    registerCommands(context, machineDataProvider);

    // 2. イベントハンドラの設定
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) updateDecorations();
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            updateDecorations();
        }
    }, null, context.subscriptions);

    // 3. 設定変更時のイベントハンドラ
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('ncCodeHelper')) {
            refreshDecorationStyles(); // カラー定義を再生成
            updateDecorations(); // 再描画
            colorDataProvider.refresh(); // カラーツリーの再読み込み
        }
    }, null, context.subscriptions);

    // ツール番号とH番号不一致チェックの登録
    registerToolCheckDiagnostics(context);

    // 3D ビューアの登録
    // register3DViewer(context);

    // 4. 初回描画
    updateDecorations();
}

export function deactivate() {}