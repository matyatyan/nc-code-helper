import * as vscode from 'vscode';

/**
 * 対象のドキュメントがNCプログラムかどうかを判定します。
 * 1. 拡張子チェック (.nc, .gcode, .nd1, .all など)
 * 2. 拡張子で判定できない場合、テキスト先頭〜全体の内容パターンで判定
 */
export function isNcDocument(document: vscode.TextDocument): boolean {
    // 1. 言語IDの判定
    if (document.languageId === 'gcode' || document.languageId === 'nc') {
        return true;
    }

    // 2. 拡張子の判定
    const validExtensions = ['.nc', '.gcode', '.nd1', '.all'];
    const fileName = document.fileName.toLowerCase();
    if (validExtensions.some(ext => fileName.endsWith(ext))) {
        return true;
    }

    // 3. テキスト内容による判定（拡張子が不明・無拡張子・.txtなどの場合）
    const text = document.getText();
    
    // 空ファイルは対象外
    if (!text.trim()) {
        return false;
    }

    // NCプログラム特有のパターン群
    const ncPatterns = [
        /%/,                          // テープ開始/終了記号 %
        /^O\d{4,5}/m,                 // プログラム番号 O1234 または O12345
        /\bG0?[0-3]\b/i,              // G00, G01, G02, G03
        /\bM0?[123689]\b/i,           // M01, M02, M03, M06, M08, M09, M30
        /\bG43\s*H\d+/i,              // G43 Hコード
        /^N\d+\b/m,                   // シーケンス番号 N100 等
        /#\d{3,}\s*=/                 // マクロ変数定義 #500= 等
    ];

    // マッチしたパターンの数をカウント（誤判定を防ぐため2つ以上合致でNCと認定）
    let matchCount = 0;
    for (const pattern of ncPatterns) {
        if (pattern.test(text)) {
            matchCount++;
            if (matchCount >= 2) {
                return true;
            }
        }
    }

    return false;
}