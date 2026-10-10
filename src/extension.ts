import * as vscode from 'vscode';
import { registerTreeview } from './treeview';
import { registerDocumentSymbolProvider } from './symbols';
import { initializeDecorations, updateDecorations, refreshDecorationStyles } from './decorator';
import { registerHoverProvider } from './hover';
import { registerCommands } from './commands';
import { registerNcDiagnostics } from './diagnostics';
import { isNcDocument } from './utils';
import { MachineWebviewProvider } from './machineWebviewProvider'; // ★ import を追加

function trySetNcLanguage(doc: vscode.TextDocument): void {
    if (!doc || doc.languageId === 'gcode' || doc.languageId === 'nc') {
        return;
    }

    try {
        if (isNcDocument(doc)) {
            void vscode.languages.setTextDocumentLanguage(doc, 'gcode').then(
                changedDocument => {
                    const activeEditor = vscode.window.activeTextEditor;
                    if (activeEditor?.document === changedDocument) {
                        updateDecorations();
                    }
                },
                error => console.error('[NC Code Helper] Failed to set document language.', error)
            );
        }
    } catch (error) {
        console.error('[NC Code Helper] Failed to detect or set document language.', error);
    }
}

export function activate(context: vscode.ExtensionContext) {
    // 1. NCファイル自動判定＆言語ID設定
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(doc => {
            trySetNcLanguage(doc);
        })
    );

    // 起動時にすでに開かれているアクティブエディタもチェック
    if (vscode.window.activeTextEditor) {
        trySetNcLanguage(vscode.window.activeTextEditor.document);
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

    // NCコードの値とツール番号・H番号の診断を登録
    registerNcDiagnostics(context, provider);

    // 3D ビューアの登録（一時停止中）
    // register3DViewer(context);

    // 5. イベントハンドラの設定
    vscode.window.onDidChangeActiveTextEditor(editor => {
        try {
            provider.updateProgramState(editor);
            if (editor) updateDecorations();
        } catch (error) {
            console.error('[NC Code Helper] Failed to update active editor state.', error);
        }
    }, null, context.subscriptions);

    vscode.window.onDidChangeTextEditorSelection(event => {
        try {
            provider.updateProgramState(event.textEditor);
        } catch (error) {
            console.error('[NC Code Helper] Failed to update state after cursor movement.', error);
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        try {
            if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
                updateDecorations();
                provider.updateProgramState(vscode.window.activeTextEditor);
            }
        } catch (error) {
            console.error('[NC Code Helper] Failed to update after document change.', error);
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
    provider.updateProgramState(vscode.window.activeTextEditor);
    updateDecorations();
}

export function deactivate() {}