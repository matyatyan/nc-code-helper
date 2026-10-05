import * as vscode from 'vscode';
import { categories } from './categories';

const grayDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#808080'
});

export function initializeDecorations(context: vscode.ExtensionContext): void {
    context.subscriptions.push(grayDecorationType);

    categories.forEach(cat => {
        if (cat.color) {
            cat.decorationType = vscode.window.createTextEditorDecorationType({
                color: cat.color
            });
            context.subscriptions.push(cat.decorationType);
        }
    });
}

export function updateDecorations(): void {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor || activeEditor.document.languageId.toLowerCase() !== 'gcode') {
        return;
    }

    const config = vscode.workspace.getConfiguration('ncCodeHelper');
    const text = activeEditor.document.getText();

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

    categories.forEach(cat => {
        const isEnabled = config.get<boolean>(cat.key, true);
        const customRanges: vscode.Range[] = [];
        let match: RegExpExecArray | null;
        cat.regex.lastIndex = 0;

        while ((match = cat.regex.exec(text)) !== null) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            if (isInsideComment(range)) {
                continue;
            }

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
}