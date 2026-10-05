import * as vscode from 'vscode';
import { registerTreeView } from './treeView';
import { registerDocumentSymbolProvider } from './symbols';
import { initializeDecorations, updateDecorations } from './decorator';

export function activate(context: vscode.ExtensionContext) {
    // 1. 各機能の初期化・登録
    initializeDecorations(context);
    const treeDataProvider = registerTreeView(context);
    registerDocumentSymbolProvider(context);

    // 2. イベントハンドラの設定
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) updateDecorations();
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            updateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('ncCodeHelper')) {
            updateDecorations();
            treeDataProvider.refresh();
        }
    }, null, context.subscriptions);

    // 3. 初回描画
    updateDecorations();
}

export function deactivate() {}