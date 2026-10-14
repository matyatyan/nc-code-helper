import * as vscode from 'vscode';

// 差分表示用の仮想ドキュメントプロバイダ
class NCAlignDiffProvider implements vscode.TextDocumentContentProvider {
    static scheme = 'nc-align-diff';
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    readonly onDidChange = this._onDidChange.event;

    private contents = new Map<string, string>();

    set(uri: vscode.Uri, content: string) {
        this.contents.set(uri.toString(), content);
        this._onDidChange.fire(uri);
    }

    provideTextDocumentContent(uri: vscode.Uri): string {
        return this.contents.get(uri.toString()) ?? '';
    }
}

export function registerCncAligner(context: vscode.ExtensionContext) {
    const diffProvider = new NCAlignDiffProvider();
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(NCAlignDiffProvider.scheme, diffProvider)
    );

    const disposable = vscode.commands.registerCommand('ncCodeHelper.alignCncCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !editor.selection) {
            return;
        }

        // 1. 範囲選択されたテキストを取得
        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        // 2. プログラムの整列・短縮処理を実行
        const formattedText = formatAndShortenNcCode(originalText);

        // 3. 差分表示用の仮想URIを作成
        const originalUri = vscode.Uri.parse(`${NCAlignDiffProvider.scheme}:original?${Date.now()}`);
        const formattedUri = vscode.Uri.parse(`${NCAlignDiffProvider.scheme}:formatted?${Date.now()}`);

        diffProvider.set(originalUri, originalText);
        diffProvider.set(formattedUri, formattedText);

        // 4. VS CodeのDiff Viewを開く
        const title = 'CNCコード整列プレビュー (変更前 ↔ 整列後)';
        await vscode.commands.executeCommand('vscode.diff', originalUri, formattedUri, title);
    });

    context.subscriptions.push(disposable);
}

/**
 * NCコードの整列・短縮を行うロジック
 */
function formatAndShortenNcCode(code: string): string {
    const lines = code.split(/\r?\n/);
    const formattedLines = lines.map(line => {
        let trimmed = line.trim();
        if (!trimmed) return '';

        // 例: IF[#800EQ3]GOTO015 のような条件分岐の整形・スペース調整
        // キーワード間に適切なスペースを入れつつ冗長な記述を整える
        trimmed = trimmed
            .replace(/\bIF\s*\[/gi, 'IF[') .replace(/\]\s*GOTO\s*/gi, '] GOTO ')
            .replace(/\b(GOTO|M|S|F|H|D)\s+/gi, '$1');

        // カンマやブロック前後の余分なスペースを整列
        trimmed = trimmed.replace(/\s*,\s*/g, ', ');

        return trimmed;
    });

    return formattedLines.join('\n');
}