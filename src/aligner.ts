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

/**
 * CNC整列・短縮およびDiff表示機能を登録する関数
 */
export function registerCncAligner(context: vscode.ExtensionContext) {
    const diffProvider = new NCAlignDiffProvider();
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(NCAlignDiffProvider.scheme, diffProvider)
    );

    const disposable = vscode.commands.registerCommand('ncCodeHelper.alignCncCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const targetText = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);

        const formattedText = formatAndShortenNcCode(targetText);

        const originalUri = vscode.Uri.parse(`${NCAlignDiffProvider.scheme}:original?${Date.now()}`);
        const formattedUri = vscode.Uri.parse(`${NCAlignDiffProvider.scheme}:formatted?${Date.now()}`);

        diffProvider.set(originalUri, targetText);
        diffProvider.set(formattedUri, formattedText);

        const title = 'CNCコード整列プレビュー (変更前 ↔ 整列後)';
        await vscode.commands.executeCommand('vscode.diff', originalUri, formattedUri, title);
    });

    context.subscriptions.push(disposable);
}

/**
 * NCコードの上からの流れに沿って変数を逐次評価し、条件分岐（IF-GOTO）の判定および不要区間のスキップを行うロジック
 */
function formatAndShortenNcCode(targetText: string): string {
    const lines = targetText.split(/\r?\n/);
    const variables = new Map<string, number>();
    const skippedLines = new Set<number>();
    const jumpToLabel = (label: string, gotoLineIndex: number): number => {
        for (let j = gotoLineIndex + 1; j < lines.length; j++) {
            const targetLine = lines[j].trim();
            const nMatch = new RegExp(`\\bN0*${label}\\b`, 'i').test(targetLine);
            if (nMatch) {
                for (let skipped = gotoLineIndex + 1; skipped < j; skipped++) {
                    skippedLines.add(skipped);
                }
                return j;
            }
        }
        return -1;
    };

    // ジャンプ先から走査を再開し、後続の条件分岐も順に評価する
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();

        // 1. 変数代入（例: #800=1）を検出して記憶を更新する
        const assignMatch = /#(\d+)\s*=\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.exec(trimmed);
        if (assignMatch) {
            variables.set(assignMatch[1], Number(assignMatch[2]));
            continue;
        }

        // 2. IF[...]GOTO... のような条件付きジャンプの評価（現在の変数マップを使用）
        const ifGotoMatch = /IF\s*\[\s*#(\d+)\s*(EQ|NE|GT|LT|GE|LE)\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\]\s*GOTO\s*([0-9A-Z]+)/i.exec(trimmed);
        if (ifGotoMatch) {
            const varNum = ifGotoMatch[1];
            const op = ifGotoMatch[2].toUpperCase();
            const val = Number(ifGotoMatch[3]);
            const label = ifGotoMatch[4];

            const varVal = variables.get(varNum);
            if (varVal === undefined) {
                continue;
            }

            let conditionMet = false;
            switch (op) {
                case 'EQ': conditionMet = (varVal === val); break;
                case 'NE': conditionMet = (varVal !== val); break;
                case 'GT': conditionMet = (varVal > val); break;
                case 'LT': conditionMet = (varVal < val); break;
                case 'GE': conditionMet = (varVal >= val); break;
                case 'LE': conditionMet = (varVal <= val); break;
            }

            if (conditionMet) {
                const targetIndex = jumpToLabel(label, i);
                if (targetIndex !== -1) {
                    i = targetIndex - 1;
                }
            }
            continue;
        }

        // 3. 条件なしの単体 GOTO の場合
        const simpleGotoMatch = /\bGOTO\s*([0-9A-Z]+)/i.exec(trimmed);
        if (simpleGotoMatch) {
            const targetIndex = jumpToLabel(simpleGotoMatch[1], i);
            if (targetIndex !== -1) {
                i = targetIndex - 1;
            }
        }
    }

    // 4. ジャンプで通過した行を除外する
    const processedLines: string[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (skippedLines.has(i)) {
            continue;
        }
        processedLines.push(lines[i]);
    }

    // 5. 各行の基本的なフォーマット整列
    return processedLines.map(line => {
        let trimmed = line.trim();
        if (!trimmed) return '';

        trimmed = trimmed
            .replace(/\bIF\s*\[/gi, 'IF[')
            .replace(/\s*,\s*/g, ', ');

        return trimmed;
    }).join('\n');
}