# NC Code Helper

NC Code Helper は、VS Code で NC プログラム（G-code）を読み書きするための拡張機能です。コードの色分け、プログラム構造のアウトライン表示、設備ごとの M コード参照、カーソル位置のプログラム状態表示などを提供します。

## 主な機能

### NC ファイルの認識と言語機能

- `.nc`、`.gcode`、`.nd1`、`.all` ファイルを G-code として扱います（拡張子の大文字・小文字は区別しません）。
- 拡張子が異なるファイルも、NC コードのパターンを複数検出した場合は G-code として自動認識します。
- G/M コード、工具・補正番号、送り速度、主軸回転数、軸・パラメータ、括弧コメント、セミコロンコメントを TextMate 文法で認識します。

### カテゴリ別カラー表示

Explorer の **NC カラー設定**ビューで、カテゴリごとの色付けをチェックボックスから切り替えられます。無効にしたコードは灰色で表示します。括弧 `(...)` 内のコメントも灰色で表示し、カテゴリ色の対象から除外します。

| カテゴリ | 表示対象の例 |
| --- | --- |
| O | `O1001` プログラム番号 |
| N | `N100` シーケンス番号 |
| G | `G00`、`G43.1` 準備機能 |
| M | `M03`、`M08` 補助機能 |
| FS | `F500` 送り速度、`S1500` 主軸回転数 |
| XYZ | `X10`、`Y-5.5`、`Z0` 直線軸 |
| ABC | `A90`、`B0`、`C180` 回転軸 |
| THD | `T1` 工具、`H1` 工具長補正、`D1` 工具径補正 |
| OTHERS | `P`、`Q`、`R`、`I`、`J`、`K` などのパラメータ |
| MACRO | `#500`、`IF`、`GOTO`、`THEN` など |

色と有効・無効の初期値は、VS Code の設定でカテゴリごとに変更できます。

### アウトライン

VS Code 標準の **アウトライン**ビューに、行頭の O 番号と N 番号を表示します。O 番号が親、後続する N 番号が子になります。O 番号より前にある N 番号はトップレベルに表示されます。番号の後ろに記述がある場合は、その記述も項目名に含めます。

### 設備別 M コード参照

Explorer の **Mコード参照**ビューで設備 JSON を管理できます。設備を選ぶと、画面下部の **設備状態**パネルに M コード一覧を表示し、その設備の定義を M コードのホバー説明に使用します。

- 初回起動時に `sample.json` を作成します。
- **新規設備を追加...** から JSON ファイルを選択すると、拡張機能の保存先にコピーして一覧へ追加します。
- ビューのタイトルにあるフォルダーアイコンから、設備 JSON の保存先を開けます。
- M コードは `M6` と `M06` のような表記違いも照合します。

設備定義 JSON の形式:

```json
{
  "machine": "設備名",
  "description": "設備の説明",
  "version": "1.0.0",
  "mCodes": {
    "M00": "プログラムストップ",
    "M03": "主軸正転",
    "M06": "工具交換"
  }
}
```

### カーソル位置のプログラム状態

**設備状態**パネルの右側に、カーソル行までに読み取った次の状態を表示します。

- 使用座標系（G54～G59、G54.1 と P 番号）
- 使用工具、待機工具（T 番号と M06 による工具交換）
- 工具長補正（G43/G44、H 番号、G49 による解除）
- 工具径補正（G41/G42、D 番号、G40 による解除）
- 送り速度と単位（G94: mm/min、G95: mm/rev）
- 主軸回転数

数値計算および前行で定義されたマクロ変数を使用し、基本的な四則演算を評価します。状態表示はプログラムの簡易解析であり、機械制御装置の実際の状態を示すものではありません。

### NC コードチェック

A/B/C/X/Y/Z の値について、数値として認識できない値をエラー、小数点のない数値を警告として VS Code の診断（Problems）に表示します。0 は小数点不足の警告対象外です。マクロ変数（`#500`）と角括弧で囲まれた式（`[1+2]`）は数値検証の対象外です。F/S は数値チェックの対象外です。

主軸工具番号と有効な工具長補正番号の不一致も警告します。括弧 `(...)` 内とセミコロン `;` 以降のコメントはチェック対象外です。工具交換や補正の解釈はプログラムの簡易解析に基づきます。

### ホバー

- M コード上にカーソルを置くと、選択中の設備 JSON に登録された説明を表示します。
- `#100` などのマクロ変数上にカーソルを置くと、同じ O 番号ブロック内でカーソル行までに見つかった代入式を表示します。該当する代入がない場合は `NULL` と表示します。

## 使い方

1. 拡張機能をインストールし、対応する NC ファイルを開きます。
2. **Explorer → NC カラー設定**で、色付けするカテゴリを選択します。
3. **Explorer → Mコード参照**で設備を選択します。JSON の追加は **新規設備を追加...** から行います。
4. **アウトライン**ビュー、エディター上のホバー、画面下部の **設備状態**パネル、Problems ビューを必要に応じて利用します。

## 設定

設定画面で `NC Code Helper` を検索するか、`settings.json` に以下のように記述します。各カテゴリの `enable...` は表示の有効・無効、`color...` は表示色です。

```json
{
  "ncCodeHelper.enableOColor": true,
  "ncCodeHelper.colorO": "#FF1744",
  "ncCodeHelper.enableNColor": true,
  "ncCodeHelper.colorN": "#df8337",
  "ncCodeHelper.enableGColor": true,
  "ncCodeHelper.colorG": "#ffa8db",
  "ncCodeHelper.enableMColor": true,
  "ncCodeHelper.colorM": "#eaadfc",
  "ncCodeHelper.enableFSColor": true,
  "ncCodeHelper.colorFS": "#9cc4f8",
  "ncCodeHelper.enableXYZColor": true,
  "ncCodeHelper.colorXYZ": "#76ee86",
  "ncCodeHelper.enableABCColor": true,
  "ncCodeHelper.colorABC": "#b2ff94",
  "ncCodeHelper.enableToolColor": true,
  "ncCodeHelper.colorTool": "#3112e0",
  "ncCodeHelper.enableOthersColor": true,
  "ncCodeHelper.colorOthers": "#f1a88d",
  "ncCodeHelper.enableMacroColor": true,
  "ncCodeHelper.colorMacro": "#e040fb"
}
```

## 対応環境

- Visual Studio Code 1.80 以降
- `.nc`、`.gcode`、`.nd1`、`.all` の各拡張子（大文字・小文字を区別しません）

## ライセンス

本拡張機能は [MIT License](./LICENSE) のもとで提供されます。

`licenses.json` は開発用依存関係のライセンス確認レポートで、拡張機能の配布物には含まれません。依存関係を更新した場合は `npm run licenses:dev` で再生成できます。
