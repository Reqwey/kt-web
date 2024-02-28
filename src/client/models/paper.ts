import { CourseAttachment } from "./course";

export interface Choice {
  answer: string;
  content: string;
}

export interface ProblemTree {
  id: number;
  paperQuestionId: number;
  no?: string;
  children: ProblemTree[];
  model: number;
  modelName: string;
  score: number;
  source?: string;
  content: string;
  answers?: Choice[];
  noChoiceAnswer?: string;
  proper?: string;
  analysis?: string;
  hasVideo: boolean;
  video?: string;
  cover?: string;
}

export interface PaperData {
  subjectName: string;
  name: string;
  apiSummary: string;
  questions: ProblemTree[];
  attachments: CourseAttachment[];
  nonParentPaperQuestions: number[];
}