export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  shared: boolean;
  likes: number;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ButtonType = 'number' | 'operator' | 'action' | 'equals';

export interface CalcButton {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
}
