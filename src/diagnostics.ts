// NCコードの値と主軸工具・工具長補正番号を検証
import * as vscode from 'vscode';
import { MachineWebviewProvider } from './machineWebviewProvider';
import { isNcDocument } from './utils';

export function registerNcDiagnostics(
    context: vscode.ExtensionContext,
    programStateProvider: MachineWebviewProvider
) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('ncCodeChecks');
    context.subscriptions.push(diagnosticCollection);

    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection, programStateProvider);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                updateDiagnostics(editor.document, diagnosticCollection, programStateProvider);
            }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            updateDiagnostics(event.document, diagnosticCollection, programStateProvider);
        }),
        vscode.workspace.onDidCloseTextDocument(doc => {
            diagnosticCollection.delete(doc.uri);
        })
    );
}

function updateDiagnostics(
    document: vscode.TextDocument,
    collection: vscode.DiagnosticCollection,
    programStateProvider: MachineWebviewProvider
) {
    if (!isNcDocument(document)) {
        collection.delete(document.uri);
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const programStates = programStateProvider.getProgramStates(document);

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const codeText = line.text
            .replace(/\([^)]*(?:\)|$)/g, comment => ' '.repeat(comment.length))
            .split(';', 1)[0];

        for (const match of codeText.matchAll(/([ABCXYZ])([^A-Z\s]*)/gi)) {
            if (match.index === undefined ||
                /[A-Z]/i.test(codeText[match.index - 1] ?? '')) {
                continue;
            }

            const valueStart = match.index + match[1].length;
            let value = match[2];
            let valueEnd = match.index + match[0].length;

            if (codeText[valueStart] === '[') {
                const closingBracket = codeText.indexOf(']', valueStart + 1);
                if (closingBracket !== -1) {
                    value = codeText.slice(valueStart, closingBracket + 1);
                    valueEnd = closingBracket + 1;
                }
            }

            if (/^#\d+$/.test(value) || /^\[[^\]]+\]$/.test(value)) {
                continue;
            }

            const range = new vscode.Range(
                new vscode.Position(i, match.index),
                new vscode.Position(i, valueEnd)
            );
            const numericLiteral = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value);

            if (!numericLiteral || !Number.isFinite(Number(value))) {
                const diagnostic = new vscode.Diagnostic(
                    range,
                    `【エラー】${match[1].toUpperCase()} の値「${value}」を数値として認識できません。`,
                    vscode.DiagnosticSeverity.Error
                );
                diagnostic.source = 'NC Code Helper';
                diagnostics.push(diagnostic);
                continue;
            }

            if (Number(value) !== 0 && !value.includes('.')) {
                const diagnostic = new vscode.Diagnostic(
                    range,
                    `【注意】${match[1].toUpperCase()} の値「${value}」に小数点がありません。`,
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostic.source = 'NC Code Helper';
                diagnostics.push(diagnostic);
            }
        }

        const state = programStates[i];
        const spindleTool = Number(state.spindleTool.match(/^T(\d+)$/i)?.[1]);
        const toolLengthOffset = Number(state.toolLengthOffset.match(/^H(\d+)$/i)?.[1]);

        if (!Number.isFinite(spindleTool) || !Number.isFinite(toolLengthOffset) ||
            spindleTool === toolLengthOffset) {
            continue;
        }

        for (const match of codeText.matchAll(/H(\d+)/gi)) {
            if (match.index === undefined) {
                continue;
            }

            if (Number(match[1]) !== toolLengthOffset) {
                continue;
            }

            const hIndex = match.index;
            const range = new vscode.Range(
                new vscode.Position(i, hIndex),
                new vscode.Position(i, hIndex + match[0].length)
            );
            const diagnostic = new vscode.Diagnostic(
                range,
                `【注意】使用工具 (${state.spindleTool}) と工具長補正 (${state.toolLengthOffset}) が一致していません。`,
                vscode.DiagnosticSeverity.Warning
            );
            diagnostic.source = 'NC Code Helper';
            diagnostics.push(diagnostic);
        }
    }

    collection.set(document.uri, diagnostics);
}
