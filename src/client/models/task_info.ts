import { CourseAttachment, CourseVideo } from "./course";

export type TaskInfo = {
	taskId: number;
	userTaskId: number;
}

export interface TaskInfoData {
	title: string;
	firstName: string;
	taskModules: TaskModule[];
	unfinishedStudents: string[];
}

export interface TaskModule {
	title: string;
	extraType: number;
	userTaskDetailId: number;
	taskDetailId: number;
	finishAt: string | null;
	correctAt: string | null;
	correctPercent: number | null;
	exerciseId: number;
}

export interface TaskDetail {
	title: string | null;
	content: string | null;
	attachments: CourseAttachment[];
	videos: CourseVideo[];
	paperId: number | null | undefined;
	taskDetailId: number;
	task: {
		id: number;
		allowSubmitIfDelay: boolean;
		markType: number;
		endAt: string;
		showAnswerAt: string | null;
	}
}