import { CourseAttachment } from "./course";

export type TaskAttachment = CourseAttachment;

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

export interface TaskVideo {
	title: string;
	videoId: number;
	url: string;
	cover: string;
}

export interface TaskDetail {
	title: string | null;
	content: string | null;
	attachments: TaskAttachment[];
	videos: TaskVideo[];
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