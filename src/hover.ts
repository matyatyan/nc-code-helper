// Mコードのホバー表示
// マクロ変数のホバー表示（同一O番号ブロック内限定）
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getStorageMachineFolder } from './treeview';

export function registerHoverProvider(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerHoverProvider(
        ['gcode', 'nc'],
        {
            provideHover(document, position, token) {
                // 1. Mコードのホバー処理（Mの後に数字が1〜3桁続くパターンを抽出）
                const mCodeRange = document.getWordRangeAtPosition(position, /M\d{1,3}/i);
                if (mCodeRange) {
                    const rawCode = document.getText(mCodeRange).toUpperCase(); // 例: "M6" または "M06"
                    
                    // 2桁以下の数値Mコードは "M06" のように2桁ゼロ埋め表現の候補も作成
                    const numMatch = rawCode.match(/^M(\d+)$/i);
                    const codeVariants: string[] = [rawCode];
                    if (numMatch) {
                        const num = parseInt(numMatch[1], 10);
                        const paddedCode = `M${num.toString().padStart(2, '0')}`; // "M6" -> "M06"
                        if (!codeVariants.includes(paddedCode)) {
                            codeVariants.push(paddedCode);
                        }
                    }

                    // activeMachine または selectedMachines から対象設備を取得
                    const selectedMachines = context.globalState.get<string[]>('selectedMachines', []);
                    const activeMachine = context.globalState.get<string>('activeMachine', 'sample');

                    const targetMachines: string[] = selectedMachines.length > 0 
                        ? selectedMachines 
                        : [activeMachine];

                    const folder = getStorageMachineFolder(context);
                    const hoverTexts: string[] = [];

                    for (const machineName of targetMachines) {
                        const jsonPath = path.join(folder, `${machineName}.json`);
                        if (fs.existsSync(jsonPath)) {
                            try {
                                const rawData = fs.readFileSync(jsonPath, 'utf8');
                                const data = JSON.parse(rawData);
                                const mCodes = data.mCodes;

                                if (mCodes) {
                                    // M06 または M6 のどちらの形式でJSONに入っていてもヒットさせる
                                    for (const variant of codeVariants) {
                                        if (mCodes[variant]) {
                                            hoverTexts.push(`**${data.machine || machineName}**: ${mCodes[variant]}`);
                                            break;
                                        }
                                    }
                                }
                            } catch (e) {
                                // JSONパースエラー時は無視
                            }
                        }
                    }

                    if (hoverTexts.length > 0) {
                        const markdown = new vscode.MarkdownString();
                        markdown.appendMarkdown(`**${rawCode}**\n\n`);
                        markdown.appendMarkdown(hoverTexts.join('\n\n'));
                        return new vscode.Hover(markdown, mCodeRange);
                    }
                }

                // 2. マクロ変数（#100, #500 等）の代入値ホバー処理
                const macroRange = document.getWordRangeAtPosition(position, /#\d+/);
                if (macroRange) {
                    const varName = document.getText(macroRange);
                    const currentLine = position.line;

                    // カーソル位置から上に遡り、直近の O番号（プログラム開始行）を探す
                    let startLine = 0;
                    for (let i = currentLine; i >= 0; i--) {
                        const lineText = document.lineAt(i).text;
                        const codePart = lineText.split('(')[0];
                        if (/O\d+/i.test(codePart)) {
                            startLine = i;
                            break;
                        }
                    }

                    let assignedValue: string | undefined = undefined;
                    let foundLine: number | undefined = undefined;

                    const assignRegex = new RegExp(`^\\s*${varName.replace('#', '\\#')}\\s*=\\s*(.+)`, 'i');

                    for (let i = startLine; i <= currentLine; i++) {
                        const lineText = document.lineAt(i).text;
                        const codePart = lineText.split('(')[0];
                        const match = codePart.match(assignRegex);
                        if (match) {
                            assignedValue = match[1].trim();
                            foundLine = i + 1;
                        }
                    }

                    const markdown = new vscode.MarkdownString();
                    markdown.appendMarkdown(`**マクロ変数** ${varName}\n\n`);

                    if (assignedValue !== undefined && foundLine !== undefined) {
                        markdown.appendMarkdown(`**値**: \`${assignedValue}\` ` + `*(L${foundLine} 行目で設定)*`);
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