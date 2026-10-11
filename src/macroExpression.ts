export function evaluateMacroExpression(
    expression: string,
    variables: Map<number, number>
): number | undefined {
    let index = 0;

    const skipWhitespace = (): void => {
        while (/\s/.test(expression[index] ?? '')) {
            index++;
        }
    };

    const parseFactor = (): number | undefined => {
        skipWhitespace();
        const character = expression[index];

        if (character === '+' || character === '-') {
            index++;
            const value = parseFactor();
            return value === undefined ? undefined : character === '-' ? -value : value;
        }

        if (character === '[' || character === '(') {
            const closingCharacter = character === '[' ? ']' : ')';
            index++;
            const value = parseExpression();
            skipWhitespace();
            if (expression[index] !== closingCharacter) {
                return undefined;
            }
            index++;
            return value;
        }

        const variableMatch = expression.slice(index).match(/^#(\d+)/);
        if (variableMatch) {
            index += variableMatch[0].length;
            return variables.get(Number(variableMatch[1]));
        }

        const numberMatch = expression.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?/);
        if (!numberMatch) {
            return undefined;
        }
        index += numberMatch[0].length;
        return Number(numberMatch[0]);
    };

    const parseTerm = (): number | undefined => {
        let value = parseFactor();
        if (value === undefined) {
            return undefined;
        }

        while (true) {
            skipWhitespace();
            const operator = expression[index];
            if (operator !== '*' && operator !== '/') {
                return value;
            }
            index++;
            const right = parseFactor();
            if (right === undefined) {
                return undefined;
            }
            value = operator === '*' ? value * right : value / right;
        }
    };

    const parseExpression = (): number | undefined => {
        let value = parseTerm();
        if (value === undefined) {
            return undefined;
        }

        while (true) {
            skipWhitespace();
            const operator = expression[index];
            if (operator !== '+' && operator !== '-') {
                return value;
            }
            index++;
            const right = parseTerm();
            if (right === undefined) {
                return undefined;
            }
            value = operator === '+' ? value + right : value - right;
        }
    };

    const value = parseExpression();
    skipWhitespace();
    return value !== undefined && index === expression.length && Number.isFinite(value)
        ? value
        : undefined;
}

export function resolveMacroValue(
    expression: string,
    variables: Map<number, number>
): string {
    return String(evaluateMacroExpression(expression, variables) ?? expression);
}

export function stripNcComments(line: string): string {
    return line.replace(/\([^)]*(?:\)|$)/g, '').split(';', 1)[0];
}

export function isMacroCallLine(line: string): boolean {
    return /(?<![A-Z])G0*65(?![\d.])/i.test(stripNcComments(line));
}

export function updateMacroVariablesFromLine(line: string, variables: Map<number, number>): string {
    const commentFreeLine = stripNcComments(line);

    return commentFreeLine.replace(
        /#(\d+)\s*=\s*(\[[^\]]*\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi,
        (assignment, variableNumber: string, expression: string) => {
            const value = evaluateMacroExpression(expression, variables);
            if (value !== undefined) {
                variables.set(Number(variableNumber), value);
            }
            return ' ';
        }
    );
}
