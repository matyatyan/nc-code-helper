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
                const lineText = document.lineAt(position.line).text;
                const character = position.character;

                // 1. Mコードのホバー処理（スペースなしで連結しているケースに対応）
                // 例: M06X0Y0 や M07M08 の中からカーソル位置の Mコードを検出
                const mCodeRegex = /M\d+/gi;
                let match: RegExpExecArray | null;

                while ((match = mCodeRegex.exec(lineText)) !== null) {
                    const start = match.index;
                    const end = start + match[0].length;

                    // カーソル位置がこの Mコードの範囲内にあるか判定
                    if (character >= start && character < end) {
                        const rawCode = match[0].toUpperCase(); // 例: "M6" または "M06"
                        const mCodeRange = new vscode.Range(
                            new vscode.Position(position.line, start),
                            new vscode.Position(position.line, end)
                        );

                        // 2桁ゼロ埋めの変形候補（"M6" -> "M06"）を作成
                        const numMatch = rawCode.match(/^M(\d+)$/i);
                        const codeVariants: string[] = [rawCode];
                        if (numMatch) {
                            const num = parseInt(numMatch[1], 10);
                            for (const variant of [
                                `M${num.toString()}`,
                                `M${num.toString().padStart(2, '0')}`
                            ]) {
                                if (!codeVariants.includes(variant)) {
                                    codeVariants.push(variant);
                                }
                            }
                        }

                        // 設備一覧で最後に選択した設備だけをホバー対象にする
                        const activeMachine = context.globalState.get<string>('activeMachine', 'sample');

                        const folder = getStorageMachineFolder(context);
                        const hoverTexts: string[] = [];

                        const jsonPath = path.join(folder, `${activeMachine}.json`);
                        if (fs.existsSync(jsonPath)) {
                            try {
                                const rawData = fs.readFileSync(jsonPath, 'utf8');
                                const data = JSON.parse(rawData);
                                const mCodes = data.mCodes;

                                if (mCodes && typeof mCodes === 'object') {
                                    const entries = Object.entries(mCodes);
                                    for (const variant of codeVariants) {
                                        const entry = entries.find(([code]) => code.toUpperCase() === variant);
                                        if (entry && typeof entry[1] === 'string' && entry[1].length > 0) {
                                            hoverTexts.push(`**${data.machine || activeMachine}**: ${entry[1]}`);
                                            break;
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error(`Failed to read M-code definitions from ${jsonPath}:`, e);
                            }
                        }

                        if (hoverTexts.length > 0) {
                            const markdown = new vscode.MarkdownString();
                            markdown.appendMarkdown(`**${rawCode}**\n\n`);
                            markdown.appendMarkdown(hoverTexts.join('\n\n'));
                            return new vscode.Hover(markdown, mCodeRange);
                        }
                    }
                }

                // 2. マクロ変数（#100, #500 等）の代入値ホバー処理（同一O番号ブロック内限定）
                const macroRange = document.getWordRangeAtPosition(position, /#\d+/);
                if (macroRange) {
                    const varName = document.getText(macroRange);
                    const currentLine = position.line;

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