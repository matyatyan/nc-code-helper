import * as vscode from 'vscode';
import { registerTreeview } from './treeview';
import { registerDocumentSymbolProvider } from './symbols';
import { initializeDecorations, updateDecorations, refreshDecorationStyles } from './decorator';
import { registerHoverProvider } from './hover';

export function activate(context: vscode.ExtensionContext) {
    // 1. 各機能の初期化・登録
    initializeDecorations(context);
    const treeDataProvider = registerTreeview(context);
    registerDocumentSymbolProvider(context);
    registerHoverProvider(context);

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
            updateDecorations();        // 再描画
            treeDataProvider.refresh();
        }
    }, null, context.subscriptions);

    // 4. 初回描画
    updateDecorations();
}

export function deactivate() {}