export type CalculatorState = {
  display: string;
  expression: string;
  result: string | null;
  hasResult: boolean;
};

export function evaluate(expression: string): string {
  try {
    // Replace display symbols with JS operators
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Safety check: only allow valid math characters
    if (!/^[0-9+\-*/.()%\s]+$/.test(sanitized)) {
      return 'Error';
    }

    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + sanitized + ')')();

    if (!isFinite(result)) {
      return 'Error';
    }

    // Format result to avoid floating point issues
    const num = parseFloat(result.toFixed(10));
    return String(num);
  } catch {
    return 'Error';
  }
}

export function formatExpression(expression: string): string {
  return expression
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/-/g, '−');
}
