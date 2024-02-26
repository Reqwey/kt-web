export interface SubjectListData {
	success?: boolean;
	subjects: SubjectDetail[];
}

export interface SubjectDetail {
	subjectId: number;
	unfinished: number;
}