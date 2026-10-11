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
        const processedRanges: Array<{ range: vscode.Range; isMacroVariable: boolean }> = [];

        const decorationCategories = [...categories].sort((a, b) =>
            Number(b.key === 'enableMacroColor') - Number(a.key === 'enableMacroColor')
        );
        const rangesByCategory = new Map(
            categories.map(cat => [cat, [] as vscode.Range[]])
        );

        const addMatch = (cat: typeof categories[number], match: RegExpExecArray): void => {
            const matchStart = match.index;
            const matchEnd = matchStart + match[0].length;
            const matchRange = new vscode.Range(
                activeEditor.document.positionAt(matchStart),
                activeEditor.document.positionAt(matchEnd)
            );
            if (isInsideComment(matchRange)) {
                return;
            }

            const isMacroVariable = cat.key === 'enableMacroColor' && match[0].startsWith('#');
            const overlappingRanges = processedRanges.filter(
                processed => processed.range.intersection(matchRange) !== undefined
            );
            if (overlappingRanges.some(processed => !processed.isMacroVariable || isMacroVariable)) {
                return;
            }

            const isEnabled = config.get<boolean>(cat.key, true);
            let unprocessedRanges: Array<[number, number]> = [[matchStart, matchEnd]];
            for (const { range: processedRange } of overlappingRanges) {
                const processedStart = activeEditor.document.offsetAt(processedRange.start);
                const processedEnd = activeEditor.document.offsetAt(processedRange.end);
                unprocessedRanges = unprocessedRanges.flatMap(([start, end]) => {
                    if (processedEnd <= start || processedStart >= end) {
                        return [[start, end]];
                    }

                    const remaining: Array<[number, number]> = [];
                    if (start < processedStart) remaining.push([start, processedStart]);
                    if (processedEnd < end) remaining.push([processedEnd, end]);
                    return remaining;
                });
            }

            unprocessedRanges.forEach(([start, end]) => {
                if (start >= end) return;

                const range = new vscode.Range(
                    activeEditor.document.positionAt(start),
                    activeEditor.document.positionAt(end)
                );
                processedRanges.push({ range, isMacroVariable });
                if (!isEnabled) {
                    grayRanges.push(range);
                } else {
                    rangesByCategory.get(cat)?.push(range);
                }
            });
        };

        decorationCategories.forEach(cat => {
            let match: RegExpExecArray | null;
            cat.regex.lastIndex = 0;

            while ((match = cat.regex.exec(text)) !== null) {
                addMatch(cat, match);
            }
        });

        categories.forEach(cat => {
            if (cat.decorationType) {
                const isEnabled = config.get<boolean>(cat.key, true);
                activeEditor.setDecorations(cat.decorationType, isEnabled ? rangesByCategory.get(cat) ?? [] : []);
            }
        });

        activeEditor.setDecorations(grayDecorationType, grayRanges);
    } catch (error) {
        console.error('[NC Code Helper] Failed to update NC decorations.', error);
    }
}