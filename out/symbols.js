"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDocumentSymbolProvider = registerDocumentSymbolProvider;
const vscode = require("vscode");
function registerDocumentSymbolProvider(context) {
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
}
//# sourceMappingURL=symbols.js.map