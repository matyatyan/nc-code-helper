import * as vscode from 'vscode';
import { isNcDocument } from './utils';
import { evaluateMacroExpression, isMacroCallLine, stripNcComments, updateMacroVariablesFromLine } from './macroExpression';

/** シーケンス（Nブロック）ごとの時間計測データ構造 */
interface SequenceTime {
    line: number;           // 行番号
    character: number;      // シーケンス番号の位置文字インデックス
    rapidSeconds: number;   // 早送り（G00）の累積秒数
    cuttingSeconds: number; // 切削送り（G01, G02, G03, 固定サイクル等）の累積秒数
    totalSeconds: number;   // 合計秒数
    rapidUnknown: boolean;  // 早送り速度が不明な場合のフラグ
    cuttingUnknown: boolean;// 切削送り速度が不明な場合のフラグ
    diameterCompensation: string | undefined; // 径補正情報
}

/** 3次元座標の位置情報 */
interface Position {
    x: number;
    y: number;
    z: number;
}

/** 軸の型定義 ('x' | 'y' | 'z') */
type Axis = keyof Position;

/** NCコード内のワード（例: X10.0, F500）を抽出する正規表現 */
const wordPattern = /(?<![A-Z])([A-Z])(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi;

/** 秒数を人間が読みやすい形式（分・秒）にフォーマットする関数 */
function formatSeconds(seconds: number, unknown: boolean): string {
    if (unknown) {
        return '—';
    }

    if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}分${(seconds % 60).toFixed(1)}秒`;
    }

    return `${seconds.toFixed(1)}秒`;
}

/** 円弧（G02/G03）やヘリカル切削の移動距離を計算する関数 */
function getArcLength(
    start: Position,
    end: Position,
    words: Map<string, number>,
    plane: number,
    clockwise: boolean,
    unitScale: number
): number | undefined {
    // プレーン（G17:XY面, G18:ZX面, G19:YZ面）に応じた軸の割り当て
    const planeAxes: Record<number, [Axis, Axis, Axis]> = {
        17: ['x', 'y', 'z'],
        18: ['z', 'x', 'y'],
        19: ['y', 'z', 'x']
    };
    const planeOffsets: Record<number, [string, string]> = {
        17: ['I', 'J'],
        18: ['K', 'I'],
        19: ['J', 'K']
    };
    const axes = planeAxes[plane];
    const offsets = planeOffsets[plane];
    if (!axes || !offsets) return undefined;

    const [firstAxis, secondAxis, helicalAxis] = axes;
    const firstOffset = words.get(offsets[0]);
    const secondOffset = words.get(offsets[1]);
    const radiusWord = words.get('R');
    let centerX: number;
    let centerY: number;

    // 中心座標指定（I, J, K）または半径指定（R）から円弧の中心を算出
    if (firstOffset !== undefined || secondOffset !== undefined) {
        centerX = start[firstAxis] + (firstOffset ?? 0) * unitScale;
        centerY = start[secondAxis] + (secondOffset ?? 0) * unitScale;
    } else if (radiusWord !== undefined) {
        const chordX = end[firstAxis] - start[firstAxis];
        const chordY = end[secondAxis] - start[secondAxis];
        const chord = Math.hypot(chordX, chordY);
        const radius = Math.abs(radiusWord * unitScale);
        if (chord === 0 || chord > 2 * radius) {
            return undefined;
        }

        const midpointX = (start[firstAxis] + end[firstAxis]) / 2;
        const midpointY = (start[secondAxis] + end[secondAxis]) / 2;
        const height = Math.sqrt(Math.max(0, radius * radius - chord * chord / 4));
        const perpendicularX = -chordY / chord;
        const perpendicularY = chordX / chord;
        const candidates = [
            { x: midpointX + perpendicularX * height, y: midpointY + perpendicularY * height },
            { x: midpointX - perpendicularX * height, y: midpointY - perpendicularY * height }
        ];

        const sweepFor = (center: { x: number; y: number }) => {
            const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
            const endAngle = Math.atan2(end.y - center.y, end.x - center.x);
            let sweep = endAngle - startAngle;
            if (clockwise && sweep >= 0) sweep -= 2 * Math.PI;
            if (!clockwise && sweep <= 0) sweep += 2 * Math.PI;
            return sweep;
        };

        const desiredMajorArc = radiusWord < 0;
        const selected = candidates.find(center => (Math.abs(sweepFor(center)) > Math.PI) === desiredMajorArc)
            ?? candidates[0];
        centerX = selected.x;
        centerY = selected.y;
    } else {
        return undefined;
    }

    const startRadius = Math.hypot(start[firstAxis] - centerX, start[secondAxis] - centerY);
    const endRadius = Math.hypot(end[firstAxis] - centerX, end[secondAxis] - centerY);
    if (startRadius === 0 || !Number.isFinite(startRadius) || !Number.isFinite(endRadius)) {
        return undefined;
    }

    const startAngle = Math.atan2(start[secondAxis] - centerY, start[firstAxis] - centerX);
    const endAngle = Math.atan2(end[secondAxis] - centerY, end[firstAxis] - centerX);
    let sweep = endAngle - startAngle;
    if (clockwise && sweep >= 0) sweep -= 2 * Math.PI;
    if (!clockwise && sweep <= 0) sweep += 2 * Math.PI;
    if (start[firstAxis] === end[firstAxis] && start[secondAxis] === end[secondAxis] &&
        (firstOffset !== undefined || secondOffset !== undefined)) {
        sweep = clockwise ? -2 * Math.PI : 2 * Math.PI;
    }

    const planarLength = Math.abs(sweep) * (startRadius + endRadius) / 2;
    return Math.hypot(planarLength, end[helicalAxis] - start[helicalAxis]);
}

/** 移動距離と送り速度から所要時間を計算し、シーケンスデータに加算する関数 */
function addMotionTime(
    sequence: SequenceTime | undefined,
    distance: number,
    rapid: boolean,
    feedrate: number | undefined,
    feedPerRevolution: boolean,
    spindleSpeed: number | undefined,
    unitScale: number,
    rapidTraverseRate: number
): void {
    if (!sequence || distance <= 0) return;

    // 毎分送り (G94) か 毎回転送り (G95) かを考慮して実際の分速（mm/min）を算出
    const feedInMmPerMinute = feedrate === undefined
        ? undefined
        : feedrate * unitScale * (feedPerRevolution
            ? spindleSpeed !== undefined ? spindleSpeed : Number.NaN
            : 1);
    const rate = rapid ? rapidTraverseRate : feedInMmPerMinute;
    if (rate === undefined || rate <= 0 || !Number.isFinite(rate)) {
        if (rapid) sequence.rapidUnknown = true;
        else sequence.cuttingUnknown = true;
        return;
    }

    const seconds = distance / rate * 60;
    if (rapid) sequence.rapidSeconds += seconds;
    else sequence.cuttingSeconds += seconds;
    sequence.totalSeconds += seconds;
}

/** 座標値（絶対値 / 増分値）を計算する関数 */
function getCoordinateTarget(
    current: number,
    value: number | undefined,
    absolute: boolean,
    unitScale: number
): number {
    if (value === undefined) return current;
    return absolute ? value * unitScale : current + value * unitScale;
}

/** ドキュメント全体を走査し、各シーケンスの移動時間を解析するメイン関数 */
function analyzeSequences(document: vscode.TextDocument): SequenceTime[] {
    const config = vscode.workspace.getConfiguration('ncCodeHelper');
    const rapidTraverseRate = config.get<number>('rapidTraverseRate', 10000); // 設定から早送り速度を取得
    const sequences: SequenceTime[] = [];
    let currentSequence: SequenceTime | undefined;
    let position: Position = { x: 0, y: 0, z: 0 };
    let motionMode = 0;          // G00(0), G01(1), G02(2), G03(3)
    let arcPlane = 17;           // 17:XY, 18:ZX, 19:YZ
    let absolute = true;         // G90(true) / G91(false)
    let metric = true;           // G21(true:mm) / G20(false:inch)
    let feedPerRevolution = false; // G95(true) / G94(false)
    let feedrate: number | undefined;
    let spindleSpeed: number | undefined;
    let diameterCompensation: string | undefined;
    let cannedCycle: number | undefined;
    let cycleReturnMode: 98 | 99 = 98; // G98 / G99
    let cycleR: number | undefined;
    let cycleDepth: number | undefined;
    let cycleQ: number | undefined;
    let cycleP: number | undefined;
    let cycleK = 1;
    const macroVariables = new Map<number, number>();

    // 行ごとにループして解析
    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
        const line = document.lineAt(lineNumber).text;
        const macroCallLine = isMacroCallLine(line);
        const code = macroCallLine
            ? stripNcComments(line)
            : updateMacroVariablesFromLine(line, macroVariables);
        
        // シーケンス番号の検出と記録
        const sequenceRegex = /[Nn]\d+/g;
        let sequenceMatch: RegExpExecArray | null;
        while ((sequenceMatch = sequenceRegex.exec(code)) !== null) {
            currentSequence = {
                line: lineNumber,
                character: sequenceMatch.index + sequenceMatch[0].length,
                rapidSeconds: 0,
                cuttingSeconds: 0,
                totalSeconds: 0,
                rapidUnknown: false,
                cuttingUnknown: false,
                diameterCompensation: undefined
            };
            sequences.push(currentSequence);
        }

        if (macroCallLine) continue;

        // 各コードワード（G, M, X, Y, Z, F, Sなど）を抽出して状態を更新
        const words = new Map<string, number>();
        let match: RegExpExecArray | null;
        while ((match = wordPattern.exec(code)) !== null) {
            const letter = match[1].toUpperCase();
            const rawValue = match[2];
            const value = evaluateMacroExpression(rawValue, macroVariables);
            if (value === undefined || !Number.isFinite(value)) continue;
            words.set(letter, value);

            if (letter === 'G') {
                if (value >= 0 && value <= 3) motionMode = value;
                else if (value === 20) metric = false;
                else if (value === 21) metric = true;
                else if (value === 90) absolute = true;
                else if (value === 91) absolute = false;
                else if (value === 94) feedPerRevolution = false;
                else if (value === 95) feedPerRevolution = true;
                else if (value === 17 || value === 18 || value === 19) arcPlane = value;
                else if ([73, 81, 83, 84, 85].includes(value)) cannedCycle = value;
                else if (value === 80) cannedCycle = undefined;
                else if (value === 98 || value === 99) cycleReturnMode = value;
                else if (value === 40) diameterCompensation = undefined;
                else if (value === 41 || value === 42) {
                    diameterCompensation = `G${value} ${words.has('D') ? `D${words.get('D')}` : 'D番号未指定'}`;
                }
            } else if (letter === 'F') {
                feedrate = value;
            } else if (letter === 'S') {
                spindleSpeed = value;
            } else if (letter === 'D' && diameterCompensation) {
                diameterCompensation = `${diameterCompensation.split(' ')[0]} D${value}`;
            }
        }

        if (words.has('R')) cycleR = words.get('R');
        if (words.has('Z')) cycleDepth = words.get('Z');
        if (words.has('Q')) cycleQ = words.get('Q');
        if (words.has('P')) cycleP = words.get('P');
        cycleK = Math.max(1, Math.floor(words.get('K') ?? 1));

        if (diameterCompensation && currentSequence && motionMode !== 0) {
            currentSequence.diameterCompensation = diameterCompensation;
        }

        const unitScale = metric ? 1 : 25.4;
        const hasAxisWord = ['X', 'Y', 'Z'].some(axis => words.has(axis));
        
        // 固定サイクル（G73, G81, G83, G84, G85など）の工数計算
        if (cannedCycle !== undefined && hasAxisWord) {
            const cycleStart = position;
            const target: Position = {
                x: getCoordinateTarget(position.x, words.get('X'), absolute, unitScale),
                y: getCoordinateTarget(position.y, words.get('Y'), absolute, unitScale),
                z: position.z
            };

            if (cycleR === undefined || cycleDepth === undefined) {
                if (currentSequence) currentSequence.cuttingUnknown = true;
                continue;
            }

            const rPlane = getCoordinateTarget(cycleStart.z, cycleR, absolute, unitScale);
            const depth = absolute ? cycleDepth * unitScale : rPlane + cycleDepth * unitScale;
            const returnZ = cycleReturnMode === 98 ? cycleStart.z : rPlane;
            const peckSize = cycleQ === undefined ? undefined : Math.abs(cycleQ * unitScale);
            const feedDistance = Math.abs(depth - rPlane);
            const peckCount = (cannedCycle === 73 || cannedCycle === 83) && peckSize && peckSize > 0
                ? Math.max(1, Math.ceil(feedDistance / peckSize))
                : 1;
            if ((cannedCycle === 73 || cannedCycle === 83) && (!peckSize || peckSize <= 0) && currentSequence) {
                currentSequence.cuttingUnknown = true;
            }

            for (let repeat = 0; repeat < cycleK; repeat++) {
                const xyPosition: Position = { x: target.x, y: target.y, z: cycleStart.z };
                addMotionTime(currentSequence, Math.hypot(xyPosition.x - position.x, xyPosition.y - position.y, xyPosition.z - position.z), true, feedrate, feedPerRevolution, spindleSpeed, unitScale, rapidTraverseRate);
                const rPosition: Position = { ...xyPosition, z: rPlane };
                addMotionTime(currentSequence, Math.abs(rPosition.z - xyPosition.z), true, feedrate, feedPerRevolution, spindleSpeed, unitScale, rapidTraverseRate);

                if ((cannedCycle === 73 || cannedCycle === 83) && peckCount > 1 && peckSize) {
                    const depthDirection = Math.sign(depth - rPlane);
                    for (let peck = 0; peck < peckCount; peck++) {
                        const previousDepth = rPlane + depthDirection * Math.min(feedDistance, peck * peckSize);
                        const nextDepth = rPlane + depthDirection * Math.min(feedDistance, (peck + 1) * peckSize);
                        if (cannedCycle === 83) {
                            addMotionTime(currentSequence, Math.abs(previousDepth - rPlane), true, feedrate, feedPerRevolution, spindleSpeed, unitScale, rapidTraverseRate);
                        }
                        addMotionTime(currentSequence, Math.abs(nextDepth - previousDepth), false, feedrate, feedPerRevolution, spindleSpeed, unitScale, rapidTraverseRate);
                        if (cannedCycle === 83 && peck < peckCount - 1) {
                            addMotionTime(currentSequence, Math.abs(nextDepth - rPlane), true, feedrate, feedPerRevolution, spindleSpeed, unitScale, rapidTraverseRate);
                        }
                    }
                } else {
                    addMotionTime(currentSequence, feedDistance, false, feedrate, feedPerRevolution, spindleSpeed, unitScale, rapidTraverseRate);
                }

                const usesFeedForRetract = cannedCycle === 84 || cannedCycle === 85;
                addMotionTime(currentSequence, Math.abs(depth - returnZ), !usesFeedForRetract, feedrate, feedPerRevolution, spindleSpeed, unitScale, rapidTraverseRate);
                if (cycleP !== undefined && cycleP > 0 && currentSequence) {
                    const dwellSeconds = cycleP / 1000;
                    currentSequence.cuttingSeconds += dwellSeconds;
                    currentSequence.totalSeconds += dwellSeconds;
                }
            }

            position = { ...target, z: returnZ };
            continue;
        }

        if (!hasAxisWord || motionMode < 0 || motionMode > 3) continue;

        // 通常の直線移動（G00/G01）および円弧移動（G02/G03）の計算
        const start = position;
        const end: Position = { ...position };
        for (const axis of ['X', 'Y', 'Z'] as const) {
            const value = words.get(axis);
            if (value !== undefined) {
                end[axis.toLowerCase() as 'x' | 'y' | 'z'] = absolute
                    ? value * unitScale
                    : position[axis.toLowerCase() as 'x' | 'y' | 'z'] + value * unitScale;
            }
        }

        let distance: number;
        if (motionMode === 2 || motionMode === 3) {
            distance = getArcLength(
                start,
                end,
                words,
                arcPlane,
                motionMode === 2,
                unitScale
            ) ?? Math.hypot(end.x - start.x, end.y - start.y, end.z - start.z);
        } else {
            distance = Math.hypot(end.x - start.x, end.y - start.y, end.z - start.z);
        }
        position = end;

        if (!currentSequence || distance === 0) continue;

        addMotionTime(currentSequence, distance, motionMode === 0, feedrate, feedPerRevolution, spindleSpeed, unitScale, rapidTraverseRate);
        if (motionMode !== 0) {
            if (diameterCompensation) {
                currentSequence.diameterCompensation = diameterCompensation;
            }
        }
    }

    return sequences;
}

/** VS Codeのエディタ行末に時間をヒントとして表示するためのプロバイダクラス */
class SequenceTimeInlayHintsProvider implements vscode.InlayHintsProvider {
    private readonly changeEmitter = new vscode.EventEmitter<void>();
    public readonly onDidChangeInlayHints = this.changeEmitter.event;

    public provideInlayHints(
        document: vscode.TextDocument,
        range: vscode.Range
    ): vscode.InlayHint[] {
        if (!isNcDocument(document)) {
            return [];
        }

        const sequences = analyzeSequences(document);
        return sequences
            .filter(sequence => sequence.line >= range.start.line && sequence.line <= range.end.line)
            .map(sequence => {
                // 表示するヒントの文字列を生成
                const label = `早送り ${formatSeconds(sequence.rapidSeconds, sequence.rapidUnknown)} / 切削 ${formatSeconds(sequence.cuttingSeconds, sequence.cuttingUnknown)} / 合計 ${formatSeconds(sequence.totalSeconds, sequence.rapidUnknown || sequence.cuttingUnknown)}`;
                const hint = new vscode.InlayHint(
                    new vscode.Position(sequence.line, document.lineAt(sequence.line).text.length),
                    label,
                    vscode.InlayHintKind.Type
                );
                hint.paddingLeft = true;
                return hint;
            });
    }

    public dispose(): void {
        this.changeEmitter.dispose();
    }

    public refresh(): void {
        this.changeEmitter.fire();
    }
}

/** インレイヒントプロバイダおよび設定変更イベントを登録する関数 */
export function registerSequenceTimeHints(context: vscode.ExtensionContext): void {
    const provider = new SequenceTimeInlayHintsProvider();
    context.subscriptions.push(
        vscode.languages.registerInlayHintsProvider(
            [{ language: 'gcode' }, { language: 'nc' }],
            provider
        ),
        provider,
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('ncCodeHelper.rapidTraverseRate')) {
                provider.refresh();
            }
        })
    );
}