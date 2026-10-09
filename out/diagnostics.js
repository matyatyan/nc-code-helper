"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerToolCheckDiagnostics = registerToolCheckDiagnostics;
// 主軸工具と待機工具の検出・主軸工具番号と補正番号の照合
const vscode = require("vscode");
const utils_1 = require("./utils");
function registerToolCheckDiagnostics(context) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('ncToolCheck');
    context.subscriptions.push(diagnosticCollection);
    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            updateDiagnostics(editor.document, diagnosticCollection);
        }
    }), vscode.workspace.onDidChangeTextDocument(event => {
        updateDiagnostics(event.document, diagnosticCollection);
    }), vscode.workspace.onDidCloseTextDocument(doc => {
        diagnosticCollection.delete(doc.uri);
    }));
}
function updateDiagnostics(document, collection) {
    // 拡張子およびプログラム内容による判定
    if (!(0, utils_1.isNcDocument)(document)) {
        collection.delete(document.uri);
        return;
    }
    const validExtensions = ['.nc', '.gcode', '.nd1', '.all'];
    const ext = document.fileName.substring(document.fileName.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(ext) && document.languageId !== 'gcode' && document.languageId !== 'nc') {
        return;
    }
    const diagnostics = [];
    let spindleTool = null; // 主軸工具
    let waitingTool = null; // 待機工具
    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        // コメント（かっこ内）を除外
        const codeText = line.text.split('(')[0].trim();
        if (!codeText)
            continue;
        // --- 1. 行頭の Tコード判定 ---
        // 先頭の記号（%等）や空白をスキップし、行頭の T1, T01, T101 を取得
        const leadingTMatch = codeText.match(/^%?\s*T(\d+)/i);
        if (leadingTMatch) {
            waitingTool = parseInt(leadingTMatch[1], 10);
        }
        // --- 2. M06判定（ツール交換） ---
        // スペースの有無を問わず M06 または M6 を判定
        if (/M0?6(?!\d)/i.test(codeText)) {
            if (waitingTool !== null) {
                spindleTool = waitingTool;
            }
        }
        // --- 3. Hコードの照合判定 ---
        // スペースなし（G43H01等）や英字連記でも H番号 を抽出
        const hMatches = [...codeText.matchAll(/H(\d+)/gi)];
        for (const match of hMatches) {
            if (match.index !== undefined) {
                const hNumber = parseInt(match[1], 10);
                // 主軸ツールがセットされており、かつ工具番号と補正番号が一致しない場合
                if (spindleTool !== null && spindleTool !== hNumber) {
                    // 元の行文字列から正確な Hコードの出現位置を取得
                    const hIndex = line.text.indexOf(match[0], match.index);
                    const range = new vscode.Range(new vscode.Position(i, hIndex), new vscode.Position(i, hIndex + match[0].length));
                    const diagnostic = new vscode.Diagnostic(range, `【注意】主軸工具 (T${spindleTool}) と工具長補正番号 (${match[0]}) が一致していません。`, vscode.DiagnosticSeverity.Warning);
                    diagnostic.source = 'NC Tool Checker';
                    diagnostics.push(diagnostic);
                }
            }
        }
    }
    collection.set(document.uri, diagnostics);
}
//# sourceMappingURL=diagnostics.js.map