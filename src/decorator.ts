import * as vscode from 'vscode';
import { categories } from './categories';

let grayDecorationType: vscode.TextEditorDecorationType;
let extensionContext: vscode.ExtensionContext;

export function initializeDecorations(context: vscode.ExtensionContext): void {
    extensionContext = context;

    grayDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#808080'
    });
    context.subscriptions.push(grayDecorationType);

    refreshDecorationStyles();
}

// 設定変更時などに装飾スタイルを再構築する関数
export function refreshDecorationStyles(): void {
    const config = vscode.workspace.getConfiguration('ncCodeHelper');

    categories.forEach(cat => {
        // 既存の装飾を破棄
        if (cat.decorationType) {
            cat.decorationType.dispose();
        }

        // 設定値からカラーを取得（なければデフォルト値）
        const color = config.get<string>(cat.colorKey, cat.defaultColor);

        // 新しいカラーでスタイルを構築
        cat.decorationType = vscode.window.createTextEditorDecorationType({
            color: color
        });

        // 拡張機能の解放管理に追加
        if (extensionContext) {
            extensionContext.subscriptions.push(cat.decorationType);
        }
    });
}

export function updateDecorations(): void {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor || activeEditor.document.languageId.toLowerCase() !== 'gcode') {
        return;
    }

    try {
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        const text = activeEditor.document.getText();

        // コメント領域の取得
        const commentRanges: vscode.Range[] = [];
        const commentRegex = /\(.*?\)/g;
        let commentMatch: RegExpExecArray | null;
        while ((commentMatch = commentRegex.exec(text)) !== null) {
            const startPos = activeEditor.document.positionAt(commentMatch.index);
            const endPos = activeEditor.document.positionAt(commentMatch.index + commentMatch[0].length);
            commentRanges.push(new vscode.Range(startPos, endPos));
        }

        const isInsideComment = (range: vscode.Range) => {
            return commentRanges.some(cRange => cRange.contains(range));
        };

        const grayRanges: vscode.Range[] = [...commentRanges];
        const rangesByCategory = new Map(
            categories.map(cat => [cat, [] as vscode.Range[]])
        );
        const macroCategory = categories.find(cat => cat.key === 'enableMacroColor');
        const macroKeywordSpans: { start: number; end: number }[] = [];

        if (macroCategory) {
            let match: RegExpExecArray | null;
            macroCategory.regex.lastIndex = 0;
            while ((match = macroCategory.regex.exec(text)) !== null) {
                macroKeywordSpans.push({ start: match.index, end: match.index + match[0].length });
            }
        }

        // 各カテゴリごとにマッチを抽出し、コメント内以外ならそのまま登録
        categories.forEach(cat => {
            const isEnabled = config.get<boolean>(cat.key, true);
            let match: RegExpExecArray | null;
            cat.regex.lastIndex = 0;

            while ((match = cat.regex.exec(text)) !== null) {
                const matchStart = match.index;
                const matchEnd = matchStart + match[0].length;
                if (cat !== macroCategory && macroKeywordSpans.some(span =>
                    matchStart < span.end && span.start < matchEnd
                )) {
                    continue;
                }

                const matchRange = new vscode.Range(
                    activeEditor.document.positionAt(matchStart),
                    activeEditor.document.positionAt(matchEnd)
                );

                if (isInsideComment(matchRange)) {
                    continue;
                }

                if (!isEnabled) {
                    grayRanges.push(matchRange);
                } else {
                    rangesByCategory.get(cat)?.push(matchRange);
                }
            }
        });

        // 各カテゴリのデコレーションを適用
        categories.forEach(cat => {
            if (cat.decorationType) {
                const isEnabled = config.get<boolean>(cat.key, true);
                activeEditor.setDecorations(cat.decorationType, isEnabled ? rangesByCategory.get(cat) ?? [] : []);
            }
        });

        // コメントなどのグレー表示を適用
        activeEditor.setDecorations(grayDecorationType, grayRanges);
    } catch (error) {
        console.error('[NC Code Helper] Failed to update NC decorations.', error);
    }
}