export interface MyCourseStudying {
  id: number;
  title: string;
  studyAt: string;
}

export interface MyCourse {
  categories: number;
  id: number;
  studing: MyCourseStudying;
  //^ Fuulea Official's Typo Error 
}

export interface MyCoursesResult {
  id: number;
  name: string;
  subjects: MyCourse[];
}

export interface MyCoursesData {
  count: number;
  results: MyCoursesResult[];
}

export interface Course {
  categories: number;
  id: number;
  subjectId: number;
  name: string;
  description: string;
  knowledgeCount: number;
  canView: boolean;
  studiedCount: number;
}

export interface CourseDetailResult {
  id: number;
  name: string;
  courses: Course[];
  studiedCount: number;
  knowledgeCount: number;
}

export interface CourseDetailData {
  count: number;
  results: CourseDetailResult[];
}

export interface CourseVideo {
  id: number;
  title: string;
  cover: string;
  video: string;
}

export interface CoursePaper {
  id: number;
  name: string;
  totalScore: number;
}

export interface CourseExercise {
  exerciseId: number;
  canMark: boolean;
}

export interface CourseAttachment {
  id: number;
  name: string;
  fileType: string;
  size: number;
  sourceFile: string;
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  type: number;
  level: number;
  videos: CourseVideo[];
  attachments: CourseAttachment[];
  paper: CoursePaper | null;
  exercise: CourseExercise | null;
  evolve: {
    finished: boolean;
    correctPercent: string | null;
  };
}