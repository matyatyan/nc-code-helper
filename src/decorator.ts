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
        const processedRanges: vscode.Range[] = [];

        categories.forEach(cat => {
            const isEnabled = config.get<boolean>(cat.key, true);
            const customRanges: vscode.Range[] = [];
            let match: RegExpExecArray | null;
            cat.regex.lastIndex = 0;

            while ((match = cat.regex.exec(text)) !== null) {
                const startPos = activeEditor.document.positionAt(match.index);
                const endPos = activeEditor.document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);

                if (isInsideComment(range) || processedRanges.some(pRange => pRange.contains(range) || range.contains(pRange))) {
                    continue;
                }

                processedRanges.push(range);

                if (!isEnabled) {
                    grayRanges.push(range);
                } else {
                    customRanges.push(range);
                }
            }

            if (cat.decorationType) {
                activeEditor.setDecorations(cat.decorationType, isEnabled ? customRanges : []);
            }
        });

        activeEditor.setDecorations(grayDecorationType, grayRanges);
    } catch (error) {
        console.error('[NC Code Helper] Failed to update NC decorations.', error);
    }
}