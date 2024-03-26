import { CourseAttachment } from "./course";

export type ResultData = {
  id: number;
  firstName: string;
  ranking: number | null;
  trend: string | null;
  score: number;
  correctPercent: number;
  testAt: string;
  finishedAt: string;
  markAt: string;
  markBy: string;
  summary: {
    singleChoiceCount: number;
    multiChoiceCount: number;
    noChoiceCount: number;
    singleChoiceScore: number;
    multiChoiceScore: number | null;
    noChoiceScore: number | null;
    totalCount: number;
    totalScore: number;
    stemQuestionCount: number;
    vocabularyQuestionCount: number;
  };
  statis: {
    avgScore: number;
    avgCorrectPercent: number;
  };
  isOffline: boolean;
  exercises: Exercise[];
  attachments: CourseAttachment[]; // 附件类型未提供，暂时使用 any[]
  photos: any[]; // 照片类型未提供，暂时使用 any[]
  enableJudgeProper: any; // enableJudgeProper 类型未提供，暂时使用 any[]
  studentCommitPattern: any; // studentCommitPattern 类型未提供，暂时使用 any[]
  subjectId: number;
};

export type Exercise = {
  id: number;
  answer: string;
  result: 0 | 1 | 2 | 3;
  score: number;
  markAt: string;
  markBy: string | null;
  comment: string | null;
  photos: string[]; // 照片类型未提供，暂时使用 any[]
  question: Question;
  commentMediaFiles: any[]; // 评论媒体文件类型未提供，暂时使用 any[]
  markData: any; // markData 类型未提供，暂时使用 any[]
  correctPhotos: any[]; // 照片类型未提供，暂时使用 any[]
  vocabularyInfo: any; // vocabularyInfo 类型未提供，暂时使用 any[]
  studentTagged: any; // studentTagged 类型未提供，暂时使用 any[]
  shared: any[]; // shared 类型未提供，暂时使用 any[]
  children: Exercise[] | null;
};

export type Question = {
  id: number;
  parentId: number | null;
  model: number;
  modelName: string;
  subjectId: number;
  userId: number;
  level: number;
  optionAlign: number;
  isReal: boolean;
  no: string | null;
  sourceText: string | null;
  content: string;
  score: number;
  chapters: Chapter[];
  group: any; // group 类型未提供，暂时使用 any[]
  encryptMsg: string;
  proper: string;
  hasVideo: boolean;
  noChoiceAnswer: string;
  analysis: string;
  cover: any; // 封面类型未提供，暂时使用 any[]
  video: any; // 视频类型未提供，暂时使用 any[]
  videoUserId: any; // 视频用户类型未提供，暂时使用 any[]
  tkNodes: any[]; // tkNodes 类型未提供，暂时使用 any[]
  answers: Answer[];
  isOffline: boolean;
  correctPercent: number;
  exerciseCount: number;
  sourceType: number;
  pageNumber: any; // pageNumber 类型未提供，暂时使用 any[]
  audio: any; // 音频类型未提供，暂时使用 any[]
  audioAuthor: string;
  audioAuthorId: any; // 音频作者类型未提供，暂时使用 any[]
  listenAudio: any; // 听力音频类型未提供，暂时使用 any[]
  judgeProper: any; // judgeProper 类型未提供，暂时使用 any[]
  subModel: any; // subModel 类型未提供，暂时使用 any[]
  subjectQuestionType: any; // subjectQuestionType 类型未提供，暂时使用 any[]
  areaList: any[]; // 区域列表类型未提供，暂时使用 any[]
  stageList: any[]; // 阶段列表类型未提供，暂时使用 any[]
  k12GradeList: any[]; // K12 年级列表类型未提供，暂时使用 any[]
  difficulty: any; // 难度类型未提供，暂时使用 any[]
  source: any; // 来源类型未提供，暂时使用 any[]
  difficultyLevel: any; // 难度级别类型未提供，暂时使用 any[]
  paperCount: number;
  attributeId: any; // 属性 ID 类型未提供，暂时使用 any[]
  subjectQuestionTypeName: string | null;
  nodeList: any[]; // 节点列表类型未提供，暂时使用 any[]
  tkNodeList: any[]; // tkNodeList 类型未提供，暂时使用 any[]
  methodList: any[]; // 方法列表类型未提供，暂时使用 any[]
  siteId: number;
  nodes: any[]; // 节点类型未提供，暂时使用 any[]
  resultPolice: number;
};

type Answer = {
  id: number;
  answer: string;
  content: string;
};

type Chapter = {
  id: number;
  title: string;
};
