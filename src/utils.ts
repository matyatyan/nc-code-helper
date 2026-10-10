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
    // G/Mコードは「G1X10」や「M6T1」のような連続記述が多いため、\b だけでは
    // 連続した字句を拾い切れないことがある。前後の区切りを緩めて実際のG-code表記を拾う。
    const ncPatterns = [
        /%/,                                 // テープ開始/終了記号 %
        /(?:^|\s|[;])O\d{4,5}(?:\b|$)/im, // プログラム番号 O1234 または O12345
        /(?:^|[^A-Za-z0-9_])G0?[0-3](?=[A-Za-z0-9]|$)/i, // G00, G01, G02, G03
        /(?:^|[^A-Za-z0-9_])M0?[123689](?=[A-Za-z0-9]|$)/i, // M01, M02, M03, M06, M08, M09, M30
        /(?:^|[^A-Za-z0-9_])G43\s*H\d+/i,  // G43 Hコード
        /(?:^|\s)N\d+(?:\b|$)/im,         // シーケンス番号 N100 等
        /#\d{3,}\s*=/                      // マクロ変数定義 #500= 等
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