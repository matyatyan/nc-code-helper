"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHoverProvider = registerHoverProvider;
const vscode = require("vscode");
function registerHoverProvider(context) {
    const hoverProvider = vscode.languages.registerHoverProvider({ language: 'gcode' }, {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position, /#\d+|#\[[^\]]+\]/);
            if (!range) {
                return null;
            }
            const targetVar = document.getText(range).toUpperCase(); // 例: "#900"
            const currentLineIndex = position.line;
            let foundValue = null;
            // カーソル行から上方向へ1行ずつ遡って探索
            for (let i = currentLineIndex; i >= 0; i--) {
                const lineText = document.lineAt(i).text;
                // コメント部分 ( ... ) を除去して解析
                const cleanLine = lineText.replace(/\(.*?\)/g, '').trim();
                // 1. 他の O番号（プログラム定義）に達したら、プログラム境界を越えないよう探索終了
                if (i < currentLineIndex && /^[Oo]\d+/.test(cleanLine)) {
                    break;
                }
                // 2. 代入文の検出 (#900 = 12.34 や #900=100)
                // 正規表現で「変数名 = 右辺」を抽出
                const assignmentRegex = new RegExp(`${targetVar.replace('[', '\\[').replace(']', '\\]')}\\s*=\\s*([^\\s;,]+)`, 'i');
                const match = cleanLine.match(assignmentRegex);
                if (match) {
                    foundValue = match[1];
                    break; // 直近の代入が見つかったら探索終了
                }
            }
            // ポップアップ表示用の Markdown コンテンツを生成
            const displayValue = foundValue !== null ? foundValue : 'NULL';
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**NC Macro Variable**\n\n`);
            markdown.appendMarkdown(`\`${targetVar}\` = \`${displayValue}\``);
            return new vscode.Hover(markdown, range);
        }
    });
    context.subscriptions.push(hoverProvider);
}
//# sourceMappingURL=hover.js.map