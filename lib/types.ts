export type AssessmentStatus = "live" | "published" | "draft" | "closed";

export interface Assessment {
  id: string;
  name: string;
  subtitle?: string;
  status: AssessmentStatus;
  candidates?: {
    current: number;
    total: number;
  };
  date: string;
}

export type ActivityType = "start" | "complete" | "alert" | "user";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  highlight?: string;
  time: string;
}

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "short_answer";

export interface Question {
  question: string;
  options?: string[]; // optional for non-MCQ types
  question_type: QuestionType;
}

export interface QuizData {
  quiz_id: string;
  quiz_title: string;
  count: number; // total number of questions
  time_limit: number; // in seconds or minutes (your call)
  questions: Question[];
}
