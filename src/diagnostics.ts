// NCコードの値と主軸工具・工具長補正番号を検証
import * as vscode from 'vscode';
import { hasToolOffsetMismatch, MachineWebviewProvider } from './machineWebviewProvider';
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
    let previousToolLengthMismatch = false;
    let previousToolDiameterMismatch = false;
    let toolChanged = false;
    let feedCommandedSinceToolChange = false;
    let spindleSpeedCommandedSinceToolChange = false;
    let checkedFeedAndSpeedSinceToolChange = false;

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const codeText = line.text
            .replace(/\([^)]*(?:\)|$)/g, comment => ' '.repeat(comment.length))
            .split(';', 1)[0];
        if (/(?<![A-Z])M0?6(?!\d)/i.test(codeText)) {
            toolChanged = true;
            feedCommandedSinceToolChange = false;
            spindleSpeedCommandedSinceToolChange = false;
            checkedFeedAndSpeedSinceToolChange = false;
        }

        const hasFeedCommand = /(?<![A-Z])F(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(codeText);
        const hasSpindleSpeedCommand = /(?<![A-Z])S(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(codeText);
        feedCommandedSinceToolChange ||= hasFeedCommand;
        spindleSpeedCommandedSinceToolChange ||= hasSpindleSpeedCommand;

        const hasFeedMotionCommand = /(?<![A-Z])G(?:0?[123]|73|81|83|84|85)(?![\d.])/i.test(codeText);
        if (toolChanged && hasFeedMotionCommand && !checkedFeedAndSpeedSinceToolChange) {
            checkedFeedAndSpeedSinceToolChange = true;
            const missingCommands = [
                ...(!feedCommandedSinceToolChange ? ['【警告】送り速度：Fが指令されていません'] : []),
                ...(!spindleSpeedCommandedSinceToolChange ? ['【警告】主軸回転数：Sが指令されていません'] : [])
            ];
            for (const message of missingCommands) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(
                        new vscode.Position(i, 0),
                        new vscode.Position(i, line.text.length)
                    ),
                    message,
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostic.source = 'NC Code Helper';
                diagnostics.push(diagnostic);
            }
        }

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
        const toolLengthMismatch = hasToolOffsetMismatch(
            state.spindleTool,
            state.toolLengthOffset,
            'H'
        );
        const toolDiameterMismatch = hasToolOffsetMismatch(
            state.spindleTool,
            state.toolDiameterOffset,
            'D'
        );
        const addOffsetDiagnostic = (
            offsetPrefix: 'H' | 'D',
            offsetName: string,
            offsetValue: string,
            mismatch: boolean,
            previousMismatch: boolean,
            activatesCompensation: RegExp
        ): void => {
            if (!mismatch) {
                return;
            }

            const offsetWord = new RegExp(
                `(?<![A-Z])${offsetPrefix}(?:\\[[^\\]]+\\]|#[0-9]+|[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))`,
                'i'
            ).exec(codeText);
            if (!offsetWord && previousMismatch && !activatesCompensation.test(codeText)) {
                return;
            }

            const mismatchWord = offsetWord
                ?? activatesCompensation.exec(codeText)
                ?? /(?<![A-Z])T(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.exec(codeText);
            const diagnosticStart = mismatchWord?.index ?? 0;
            const diagnosticEnd = mismatchWord
                ? diagnosticStart + mismatchWord[0].length
                : line.text.length;
            const range = new vscode.Range(
                new vscode.Position(i, diagnosticStart),
                new vscode.Position(i, diagnosticEnd)
            );
            const diagnostic = new vscode.Diagnostic(
                range,
                `【注意】使用工具 (${state.spindleTool}) と${offsetName} (${offsetValue}) が一致していません。`,
                vscode.DiagnosticSeverity.Warning
            );
            diagnostic.source = 'NC Code Helper';
            diagnostics.push(diagnostic);
        };

        addOffsetDiagnostic(
            'H',
            '工具長補正',
            state.toolLengthOffset,
            toolLengthMismatch,
            previousToolLengthMismatch,
            /(?<![A-Z])G4[34](?:\.0)?(?=[^0-9.]|$)/i
        );
        addOffsetDiagnostic(
            'D',
            '工具径補正',
            state.toolDiameterOffset,
            toolDiameterMismatch,
            previousToolDiameterMismatch,
            /(?<![A-Z])G4[12](?:\.0)?(?=[^0-9.]|$)/i
        );
        previousToolLengthMismatch = toolLengthMismatch;
        previousToolDiameterMismatch = toolDiameterMismatch;
    }

    collection.set(document.uri, diagnostics);
}
