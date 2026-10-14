// NCコードの値と主軸工具・工具長補正番号を検証
import * as vscode from 'vscode';
import { hasToolOffsetMismatch, MachineWebviewProvider } from './machineWebviewProvider';
import { isNcDocument } from './utils';

/**
 * NCコードの診断機能（Problemsビューへの表示）を登録するメイン関数
 */
export function registerNcDiagnostics(
    context: vscode.ExtensionContext,
    programStateProvider: MachineWebviewProvider
) {
    // 診断結果を管理するコレクションを作成し、拡張機能の破棄リストに登録[cite: 4]
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('ncCodeChecks');
    context.subscriptions.push(diagnosticCollection);

    // 起動時に既にアクティブなエディタがある場合は、すぐに診断を実行[cite: 4]
    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection, programStateProvider);
    }

    // エディタの切り替え、ドキュメントの変更・クローズ時のイベントリスナーを設定[cite: 4]
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

/**
 * 指定されたドキュメントのNCコードを走査し、各種エラーや警告の診断を行う関数
 */
function updateDiagnostics(
    document: vscode.TextDocument,
    collection: vscode.DiagnosticCollection,
    programStateProvider: MachineWebviewProvider
) {
    // 対象ドキュメントがNCファイルでない場合は診断をクリアして終了[cite: 4]
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
    let activeDNumber: string | null = null; // 工具径補正番号のモーダル引き継ぎ用変数

    // 各行を上から順にループ処理して検証[cite: 4]
    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        // コメント部分（括弧内やセミコロン以降）を除外した純粋なコード部分を取得[cite: 4]
        const codeText = line.text
            .replace(/\([^)]*(?:\)|$)/g, comment => ' '.repeat(comment.length))
            .split(';', 1)[0];
        
        // 工具交換（M06 または M6）の検出[cite: 4]
        if (/(?<![A-Z])M0?6(?!\d)/i.test(codeText)) {
            toolChanged = true;
            feedCommandedSinceToolChange = false;
            spindleSpeedCommandedSinceToolChange = false;
            checkedFeedAndSpeedSinceToolChange = false;
            activeDNumber = null; // 工具交換時にDの引き継ぎをリセット
        }

        // G40（工具径補正キャンセル）の検出
        if (/(?<![A-Z])G40(?![0-9.]|$)/i.test(codeText)) {
            activeDNumber = null; // G40が指令されたらこの行以降へDの引き継ぎはなし
        }

        // 行内で D 番号が指令されている場合はアクティブD番号を更新
        const dMatch = /(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.exec(codeText);
        if (dMatch) {
            activeDNumber = dMatch[0];
        }

        // 送り速度(F)や主軸回転数(S)の指令があるかチェック[cite: 4]
        const hasFeedCommand = /(?<![A-Z])F(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(codeText);
        const hasSpindleSpeedCommand = /(?<![A-Z])S(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(codeText);
        feedCommandedSinceToolChange ||= hasFeedCommand;
        spindleSpeedCommandedSinceToolChange ||= hasSpindleSpeedCommand;

        // 工具交換後の最初の切削送り（G01, G02, G03、固定サイクル等）で F や S が未指令の場合の警告[cite: 4]
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

        // ABCXYZ 軸の数値妥当性と小数点の有無を検証[cite: 4]
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

            // マクロ変数や括弧式の場合は検証をスキップ[cite: 4]
            if (/^#\d+$/.test(value) || /^\[[^\]]+\]$/.test(value)) {
                continue;
            }

            const range = new vscode.Range(
                new vscode.Position(i, match.index),
                new vscode.Position(i, valueEnd)
            );
            const numericLiteral = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value);

            // 有効な数値としてパースできない場合はエラー[cite: 4]
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

            // 0 以外で小数点が含まれていない場合は警告[cite: 4]
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

        // 主軸工具と工具長/工具径補正番号（H/D）の検証[cite: 4]
        const state = programStates[i];

        // 1. G43/G44 が指令されているのに H 番号が指令されていない場合のチェック
        const g43G44Match = /(?<![A-Z])G4[34](?:\.0)?(?=[^0-9.]|$)/i.exec(codeText);
        if (g43G44Match) {
            const hasHWord = /(?<![A-Z])H(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(codeText);
            if (!hasHWord && state.spindleTool && state.spindleTool !== '未検出') {
                const expectedH = state.spindleTool.toUpperCase().startsWith('T')
                    ? state.spindleTool.replace(/^T/i, 'H')
                    : 'H';
                const diagnosticStart = g43G44Match.index;
                const diagnosticEnd = diagnosticStart + g43G44Match[0].length;
                const range = new vscode.Range(
                    new vscode.Position(i, diagnosticStart),
                    new vscode.Position(i, diagnosticEnd)
                );
                const diagnostic = new vscode.Diagnostic(
                    range,
                    `【注意】工具長補正 (${expectedH}) を指令していません。`,
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostic.source = 'NC Code Helper';
                diagnostics.push(diagnostic);
            }
        }

        // 2. G41/G42 が指令されているのに D 番号（および引き継ぎ）がない場合のチェック
        const g41G42Match = /(?<![A-Z])G4[12](?:\.0)?(?=[^0-9.]|$)/i.exec(codeText);
        if (g41G42Match) {
            const hasDWord = /(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(codeText);
            
            // 行内にDがなく、かつモーダルでの引き継ぎ（activeDNumber）もない場合のみ警告
            if (!hasDWord && !activeDNumber && state.spindleTool && state.spindleTool !== '未検出') {
                const expectedD = state.spindleTool.toUpperCase().startsWith('T')
                    ? state.spindleTool.replace(/^T/i, 'D')
                    : 'D';
                const diagnosticStart = g41G42Match.index;
                const diagnosticEnd = diagnosticStart + g41G42Match[0].length;
                const range = new vscode.Range(
                    new vscode.Position(i, diagnosticStart),
                    new vscode.Position(i, diagnosticEnd)
                );
                const diagnostic = new vscode.Diagnostic(
                    range,
                    `【注意】工具径補正 (${expectedD}) を指令していません。`,
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostic.source = 'NC Code Helper';
                diagnostics.push(diagnostic);
            }
        }

        // 3. 既存の工具長補正・工具径補正の番号不一致チェック[cite: 4]
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

            if (!offsetWord && !activatesCompensation.test(codeText)) {
                return;
            }

            const mismatchWord = offsetWord;
            if (!mismatchWord) {
                return;
            }

            const diagnosticStart = mismatchWord.index;
            const diagnosticEnd = diagnosticStart + mismatchWord[0].length;
            const range = new vscode.Range(
                new vscode.Position(i, diagnosticStart),
                new vscode.Position(i, diagnosticEnd)
            );
            const diagnostic = new vscode.Diagnostic(
                range,
                `【注意】使用工具と${offsetName} (${offsetValue}) が一致していません。`,
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

    // 収集したすべての診断結果をVS Codeへ反映[cite: 4]
    collection.set(document.uri, diagnostics);
}