import { CourseAttachment } from "./course";

export interface Choice {
  answer: string;
  content: string;
}

export interface PaperTree {
  id: number;
  paperQuestionId: number;
  no?: string;
  children: PaperTree[];
  model: number;
  modelName: string;
  subModel: number | null;
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
  judgeProper: {
    content: string[];
    userId: string;
  }
}

export interface PaperData {
  subjectName: string;
  name: string;
  apiSummary: string;
  questions: PaperTree[];
  attachments: CourseAttachment[];
  nonParentPaperQuestions: number[];
}

export interface Answer {
  id: number;
  no: string;
  answer: string;
}

export interface AnswerData {
  client_time: string;
  duration: number;
  answer: Answer[];
  photo: null;
  vocabularySchedule: null;
}