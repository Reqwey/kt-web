import {
  blue,
  purple,
  cyan,
  pink,
  lime,
  yellow,
  red,
  orange,
  brown,
  green,
  blueGrey,
} from "@mui/material/colors";

export interface TaskListItem {
  taskId: string;
  questionCount: number | null;
  attachmentCount: number | null;
  allowSubmitIfDelay: boolean;
  title: string;
  description: string | null;
  publishedAt: string | null;
  finishAt: string | null;
  endAt: string | null;
}

export interface TaskListData {
  results: TaskListItem[];
  next: any | null;
  previous: any | null;
  count: number;
}

export type ColorVariant =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 600
  | 700
  | 800
  | 900
  | "A100"
  | "A200"
  | "A400"
  | "A700";

export function getSubjectColor(
  subjectId: number,
  variant: ColorVariant
): string {
  switch (subjectId) {
    case 1:
      return blue[variant];
    case 2:
      return purple[variant];
    case 3:
      return cyan[variant];
    case 4:
      return pink[variant];
    case 5:
      return lime[variant];
    case 6:
      return yellow[variant];
    case 7:
      return red[variant];
    case 8:
      return brown[variant];
    case 9:
      return green[variant];
    case 10:
      return orange[variant];
    default:
      return blueGrey[variant];
  }
}
