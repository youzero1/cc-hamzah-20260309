'use client';

interface DisplayProps {
  expression: string;
  result: string;
  isError: boolean;
}

export default function Display({ expression, result, isError }: DisplayProps) {
  return (
    <div className="display-wrapper">
      <div className="display-expression">{expression || '\u00A0'}</div>
      <div className={`display-result${isError ? ' error' : ''}`}>
        {result || '0'}
      </div>
    </div>
  );
}
