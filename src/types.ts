import * as vscode from 'vscode';

export interface CategoryConfig {
    key: string;            // 設定のキー名
    label: string;          // 表示名
    icon: string;           // VS Code アイコン名
    regex: RegExp;          // 対象コードを抽出する正規表現
    color?: string;         // ON時のカスタムカラー
    decorationType?: vscode.TextEditorDecorationType;
}