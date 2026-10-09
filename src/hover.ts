// Mコードのホバー表示
// マクロ変数のホバー表示（同一O番号ブロック内限定）
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getStorageMachineFolder } from './treeview';

export function registerHoverProvider(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerHoverProvider(
        [{ scheme: 'file', language: 'nc' }, { scheme: 'file', language: 'gcode' }],
        {
            provideHover(document, position, token) {
                // 1. Mコードのホバー処理（選択・チェック中設備のMコード定義を出力）
                const mCodeRange = document.getWordRangeAtPosition(position, /M\d+/i);
                if (mCodeRange) {
                    const code = document.getText(mCodeRange).toUpperCase();

                    const selectedMachines = context.globalState.get<string[]>('selectedMachines', []);
                    if (selectedMachines.length > 0) {
                        const folder = getStorageMachineFolder(context);
                        const hoverTexts: string[] = [];

                        for (const machineName of selectedMachines) {
                            const jsonPath = path.join(folder, `${machineName}.json`);
                            if (fs.existsSync(jsonPath)) {
                                try {
                                    const rawData = fs.readFileSync(jsonPath, 'utf8');
                                    const data = JSON.parse(rawData);
                                    const mCodes = data.mCodes;

                                    if (mCodes && mCodes[code]) {
                                        hoverTexts.push(`**${data.machine || machineName}**: ${mCodes[code]}`);
                                    }
                                } catch (e) {
                                    // JSONパースエラー時は無視
                                }
                            }
                        }

                        if (hoverTexts.length > 0) {
                            const markdown = new vscode.MarkdownString();
                            markdown.appendMarkdown(`**${code}**\n\n`);
                            markdown.appendMarkdown(hoverTexts.join('\n\n'));
                            return new vscode.Hover(markdown, mCodeRange);
                        }
                    }
                }

                // 2. マクロ変数（#100, #500 等）の代入値ホバー処理（同一O番号ブロック内限定）
                const macroRange = document.getWordRangeAtPosition(position, /#\d+/);
                if (macroRange) {
                    const varName = document.getText(macroRange); // 例: "#500"
                    const currentLine = position.line;

                    // カーソル位置から上に遡り、直近の O番号（プログラム開始行）の行番号を探す
                    let startLine = 0;
                    for (let i = currentLine; i >= 0; i--) {
                        const lineText = document.lineAt(i).text;
                        const codePart = lineText.split('(')[0]; // コメント除外
                        if (/O\d+/i.test(codePart)) {
                            startLine = i;
                            break;
                        }
                    }

                    let assignedValue: string | undefined = undefined;
                    let foundLine: number | undefined = undefined;

                    // 変数への代入文判定用正規表現（例: #500=10.5 や #100 = #100 + 1）
                    const assignRegex = new RegExp(`^\\s*${varName.replace('#', '\\#')}\\s*=\\s*(.+)`, 'i');

                    // 同じO番号ブロックの先頭（startLine）から現在行（currentLine）までスキャン
                    for (let i = startLine; i <= currentLine; i++) {
                        const lineText = document.lineAt(i).text;
                        const codePart = lineText.split('(')[0];
                        const match = codePart.match(assignRegex);
                        if (match) {
                            assignedValue = match[1].trim();
                            foundLine = i + 1; // 1行ベースの行番号
                        }
                    }

                    const markdown = new vscode.MarkdownString();
                    markdown.appendMarkdown(`**マクロ変数** ${varName}\n\n`);

                    if (assignedValue !== undefined && foundLine !== undefined) {
                        markdown.appendMarkdown(`**値**: \`${assignedValue}\`` + `*(L${foundLine} 行目で設定)*`);
                    } else {
                        markdown.appendMarkdown(`*NULL*`);
                    }

                    return new vscode.Hover(markdown, macroRange);
                }

                return undefined;
            }
        }
    );

    context.subscriptions.push(provider);
}