export interface QuestionHeaderText {
  language_id: number;
  text: string;
}

export interface OptionText {
  language_id: number;
  text: string;
}

export interface QuestionOption {
  option_type: "text" | "image" | "audio";
  media_url?: string | null;
  display_order: number;
  is_correct: boolean;
  texts: OptionText[];
}

export interface QuestionPayload {
  question_header_text: QuestionHeaderText[];
  options: QuestionOption[];
  display_order?: number;
}