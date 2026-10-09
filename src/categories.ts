// カテゴリ別の色分け
import { CategoryConfig } from './types';

export const categories: CategoryConfig[] = [
    { key: 'enableOColor', colorKey: 'colorO', label: 'O (プログラム番号)', icon: 'symbol-class', regex: /[Oo]\d+/g, defaultColor: '#FF1744' },
    { key: 'enableNColor', colorKey: 'colorN', label: 'N (シーケンス番号)', icon: 'symbol-number', regex: /[Nn]\d+/g, defaultColor: '#df8337' },
    { key: 'enableGColor', colorKey: 'colorG', label: 'G (準備機能)', icon: 'gear', regex: /[Gg](\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g, defaultColor: '#ffa8db' },
    { key: 'enableMColor', colorKey: 'colorM', label: 'M (補助機能)', icon: 'tools', regex: /[Mm](\d+|#\d+|#\[[^\]]+\])/g, defaultColor: '#eaadfc' },
    { key: 'enableFSColor', colorKey: 'colorFS', label: 'FS (送り・回転)', icon: 'dashboard', regex: /[FSfs]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g, defaultColor: '#9cc4f8' },
    { key: 'enableXYZColor', colorKey: 'colorXYZ', label: 'XYZ (直線軸)', icon: 'move', regex: /[XxYyZz]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g, defaultColor: '#76ee86' },
    { key: 'enableABCColor', colorKey: 'colorABC', label: 'ABC (回転軸)', icon: 'sync', regex: /[AaBbCc]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g, defaultColor: '#b2ff94' },
    { key: 'enableToolColor', colorKey: 'colorTool', label: 'THD (工具・補正)', icon: 'wrench', regex: /[TtHhDd](\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g, defaultColor: '#3112e0' },
    { key: 'enableOthersColor', colorKey: 'colorOthers', label: 'OTHERS (その他)', icon: 'symbol-parameter', regex: /[PpQqRrIiJjKkUuVvWw]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g, defaultColor: '#f1a88d' },
    { 
        key: 'enableMacroColor', 
        colorKey: 'colorMacro',
        label: 'MACRO (マクロ機能・制御文)', 
        icon: 'symbol-variable', 
        regex: /#\d+|#\[[^\]]+\]|\b(IF|THEN|GOTO|WHILE|DO|END|EQ|NE|GT|GE|LT|LE|AND|OR|XOR|FIX|FUP|ROUND|ABS|SQRT|SIN|COS|TAN|ATAN|EXP|LN|BIN|BCD)\b/gi, 
        defaultColor: '#e040fb' 
    }
];