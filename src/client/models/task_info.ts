import { CourseAttachment, CourseVideo } from "./course";
import { TaskListItem } from "./task_list";

export interface TaskInfoData {
	title: string;
	firstName: string;
	modules: TaskModule[];
	unfinishedStudents: string[];
}

export interface TaskModule {
	title: string;
	extraType: number;
	userTaskDetailId: number;
}

export interface TaskDetail {
	title: string | null;
	content: string | null;
	attachments: CourseAttachment[];
	videos: CourseVideo[];
	paperId: number | null;
	task: TaskListItem;
}