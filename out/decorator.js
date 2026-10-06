"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDecorations = initializeDecorations;
exports.refreshDecorationStyles = refreshDecorationStyles;
exports.updateDecorations = updateDecorations;
const vscode = require("vscode");
const categories_1 = require("./categories");
let grayDecorationType;
let extensionContext;
function initializeDecorations(context) {
    extensionContext = context;
    grayDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#808080'
    });
    context.subscriptions.push(grayDecorationType);
    refreshDecorationStyles();
}
// 設定変更時などに装飾スタイルを再構築する関数
function refreshDecorationStyles() {
    const config = vscode.workspace.getConfiguration('ncCodeHelper');
    categories_1.categories.forEach(cat => {
        // 既存の装飾を破棄
        if (cat.decorationType) {
            cat.decorationType.dispose();
        }
        // 設定値からカラーを取得（なければデフォルト値）
        const color = config.get(cat.colorKey, cat.defaultColor);
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
function updateDecorations() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document.languageId.toLowerCase() !== 'gcode') {
        return;
    }
    const config = vscode.workspace.getConfiguration('ncCodeHelper');
    const text = activeEditor.document.getText();
    // コメント領域の取得
    const commentRanges = [];
    const commentRegex = /\(.*?\)/g;
    let commentMatch;
    while ((commentMatch = commentRegex.exec(text)) !== null) {
        const startPos = activeEditor.document.positionAt(commentMatch.index);
        const endPos = activeEditor.document.positionAt(commentMatch.index + commentMatch[0].length);
        commentRanges.push(new vscode.Range(startPos, endPos));
    }
    const isInsideComment = (range) => {
        return commentRanges.some(cRange => cRange.contains(range));
    };
    const grayRanges = [...commentRanges];
    const processedRanges = [];
    categories_1.categories.forEach(cat => {
        const isEnabled = config.get(cat.key, true);
        const customRanges = [];
        let match;
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
            }
            else {
                customRanges.push(range);
            }
        }
        if (cat.decorationType) {
            activeEditor.setDecorations(cat.decorationType, isEnabled ? customRanges : []);
        }
    });
    activeEditor.setDecorations(grayDecorationType, grayRanges);
}
//# sourceMappingURL=decorator.js.map