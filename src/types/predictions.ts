export interface Prediction {
  id: string;
  user_id: string;
  question_id: number;
  answer: string;
  response_order: number;
  submitted?: boolean;
}

export interface PredictionComment {
  id: string;
  user_id: string;
  question_id: number;
  comment?: string;
}

export type GroupedPredictions = Record<number, string[]>;
export type PredictionComments = Record<number, string>;