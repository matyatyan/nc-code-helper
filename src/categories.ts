import { CategoryConfig } from './types';

export const categories: CategoryConfig[] = [
    { key: 'enableOColor', label: 'O (プログラム番号)', icon: 'symbol-class', regex: /[Oo]\d+/g, color: '#FF1744' },
    { key: 'enableNColor', label: 'N (シーケンス番号)', icon: 'symbol-number', regex: /[Nn]\d+/g, color: '#df8337' },
    { key: 'enableGColor', label: 'G (準備機能)', icon: 'gear', regex: /[Gg]\d+(\.\d+)?/g, color: '#ffa8db' },
    { key: 'enableMColor', label: 'M (補助機能)', icon: 'tools', regex: /[Mm]\d+/g, color: '#eaadfc' },
    { key: 'enableFSColor', label: 'FS (送り・回転)', icon: 'dashboard', regex: /[FSfs][+-]?\d+(\.\d+)?/g, color: '#9cc4f8' },
    { key: 'enableXYZColor', label: 'XYZ (直線軸)', icon: 'move', regex: /[XxYyZz][+-]?\d+(\.\d+)?/g, color: '#76ee86' },
    { key: 'enableABCColor', label: 'ABC (回転軸)', icon: 'sync', regex: /[AaBbCc][+-]?\d+(\.\d+)?/g, color: '#b2ff94' },
    { key: 'enableToolColor', label: 'THD (工具・補正)', icon: 'wrench', regex: /[TtHhDd]\d+(\.\d+)?/g, color: '#3112e0' },
    { key: 'enableOthersColor', label: 'OTHERS (その他)', icon: 'symbol-parameter', regex: /[PpQqRrIiJjKkUuVvWw][+-]?\d+(\.\d+)?/g, color: '#f1a88d' }
];