"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
// 灰色装飾スタイル
const grayDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#808080'
});
const categories = [
    { key: 'enableOColor', label: 'O (プログラム番号)', icon: 'symbol-class', regex: /[Oo]\d+/g, color: '#FF1744' },
    { key: 'enableNColor', label: 'N (シーケンス番号)', icon: 'symbol-number', regex: /[Nn]\d+/g, color: '#df8337' },
    { key: 'enableGColor', label: 'G (準備機能)', icon: 'gear', regex: /[Gg]\d+(\.\d+)?/g, color: '#ffa8db' },
    { key: 'enableMColor', label: 'M (補助機能)', icon: 'tools', regex: /[Mm]\d+/g, color: '#eaadfc' },
    { key: 'enableFSColor', label: 'FS (送り・回転)', icon: 'dashboard', regex: /[FSfs][+-]?\d+(\.\d+)?/g, color: '#9cc4f8' },
    { key: 'enableXYZColor', label: 'XYZ (直線軸)', icon: 'move', regex: /[XxYyZz][+-]?\d+(\.\d+)?/g, color: '#76ee86' },
    { key: 'enableABCColor', label: 'ABC (回転軸)', icon: 'sync', regex: /[AaBbCc][+-]?\d+(\.\d+)?/g, color: '#b2ff94' },
    { key: 'enableToolColor', label: 'THD (工具・補正)', icon: 'wrench', regex: /[TtHhDd]\d+(\.\d+)?/g, color: '#3112e0' },
    { key: 'enableOthersColor', label: 'OTHERS (その他)', icon: 'symbol-parameter', regex: /[PpQqRrIiJjKkUuVvWw][+-]?\d+(\.\d+)?/g, color: '#f1a88d' }
];
// ツリービュー用のデータ項目
class CategoryTreeItem extends vscode.TreeItem {
    constructor(category, isEnabled) {
        super(category.label, vscode.TreeItemCollapsibleState.None);
        this.category = category;
        this.iconPath = new vscode.ThemeIcon(category.icon);
        this.tooltip = `${category.label} のハイライト表示切替`;
        // チェックボックスの状態を設定
        this.checkboxState = isEnabled
            ? vscode.TreeItemCheckboxState.Checked
            : vscode.TreeItemCheckboxState.Unchecked;
    }
}
// ツリービューのデータプロバイダ
class CategoryTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        return categories.map(cat => {
            const isEnabled = config.get(cat.key, true);
            return new CategoryTreeItem(cat, isEnabled);
        });
    }
}
function activate(context) {
    context.subscriptions.push(grayDecorationType);
    categories.forEach(cat => {
        if (cat.color) {
            cat.decorationType = vscode.window.createTextEditorDecorationType({
                color: cat.color
            });
            context.subscriptions.push(cat.decorationType);
        }
    });
    // 1. ツリービューの登録とチェックボックス操作イベントの処理
    const treeDataProvider = new CategoryTreeDataProvider();
    const treeView = vscode.window.createTreeView('ncCodeHelperCategoryView', {
        treeDataProvider: treeDataProvider,
        showCollapseAll: false
    });
    context.subscriptions.push(treeView);
    // チェックボックスの状態変更イベント（ユーザーがツリーでチェックを操作した時）
    context.subscriptions.push(treeView.onDidChangeCheckboxState(async (event) => {
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        for (const [item, state] of event.items) {
            const isChecked = state === vscode.TreeItemCheckboxState.Checked;
            await config.update(item.category.key, isChecked, vscode.ConfigurationTarget.Global);
        }
    }));
    // 2. アウトライン機能 (DocumentSymbolProvider)
    const provider = vscode.languages.registerDocumentSymbolProvider({ language: 'gcode' }, {
        provideDocumentSymbols(document) {
            const text = document.getText();
            const symbolRegex = /^([Oo]\d+|[Nn]\d+)(.*)/gm;
            let rawMatches = [];
            let match;
            while ((match = symbolRegex.exec(text)) !== null) {
                const matchedText = match[1];
                const lineComment = match[2].trim();
                const line = document.lineAt(document.positionAt(match.index).line);
                const isO = matchedText.toUpperCase().startsWith('O');
                const name = lineComment ? `${matchedText} ${lineComment}` : matchedText;
                rawMatches.push({
                    name,
                    isO,
                    lineIndex: line.lineNumber,
                    lineRange: line.range
                });
            }
            const rootSymbols = [];
            let currentParentO = null;
            for (let i = 0; i < rawMatches.length; i++) {
                const current = rawMatches[i];
                let endLineIndex = document.lineCount - 1;
                if (i + 1 < rawMatches.length) {
                    endLineIndex = rawMatches[i + 1].lineIndex - 1;
                    if (endLineIndex < current.lineIndex) {
                        endLineIndex = current.lineIndex;
                    }
                }
                const startPos = current.lineRange.start;
                const endPos = document.lineAt(endLineIndex).range.end;
                const fullRange = new vscode.Range(startPos, endPos);
                const symbol = new vscode.DocumentSymbol(current.name, 'NC Block', current.isO ? vscode.SymbolKind.Class : vscode.SymbolKind.Method, fullRange, current.lineRange);
                if (current.isO) {
                    rootSymbols.push(symbol);
                    currentParentO = symbol;
                }
                else {
                    if (currentParentO) {
                        if (!currentParentO.children) {
                            currentParentO.children = [];
                        }
                        currentParentO.children.push(symbol);
                        if (symbol.range.end.isAfter(currentParentO.range.end)) {
                            currentParentO.range = new vscode.Range(currentParentO.range.start, symbol.range.end);
                        }
                    }
                    else {
                        rootSymbols.push(symbol);
                    }
                }
            }
            return rootSymbols;
        }
    });
    context.subscriptions.push(provider);
    // 3. 表示更新処理
    function updateDecorations() {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || activeEditor.document.languageId.toLowerCase() !== 'gcode') {
            return;
        }
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        const text = activeEditor.document.getText();
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
        categories.forEach(cat => {
            const isEnabled = config.get(cat.key, true);
            const customRanges = [];
            let match;
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
                }
                else {
                    customRanges.push(range);
                }
            }
            // チェックがONのときのみ該当レンジを設定し、OFFのときは空の配列を渡してカラー装飾を解除する
            if (cat.decorationType) {
                activeEditor.setDecorations(cat.decorationType, isEnabled ? customRanges : []);
            }
        });
        // 全てのカラー装飾の更新が終わった後にグレー装飾を適用
        activeEditor.setDecorations(grayDecorationType, grayRanges);
    }
    // イベント登録
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor)
            updateDecorations();
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
    // 初回反映
    updateDecorations();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map