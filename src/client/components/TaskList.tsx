import React from "react";

import {
  Box,
  Card,
  CardOverflow,
  Chip,
  CardContent,
  Sheet,
  Button,
  RadioGroup,
  Radio,
  List,
  ListItem,
  ListSubheader,
  Typography,
  Stack,
} from "@mui/joy";

import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
  AccessTime,
  HistoryToggleOff,
  ArrowForward,
  Done,
  FileDownloadTwoTone,
  TaskTwoTone,
  VisibilityTwoTone,
  NotificationsOffTwoTone,
} from "@mui/icons-material";

import {
  ColorVariant,
  TaskListItem,
  getSubjectColor,
  splitTime,
} from "../models/task_list";

function EmptyContent() {
  return (
    <Sheet
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        bgcolor: "transparent",
      }}
    >
      <NotificationsOffTwoTone
        sx={{
          fontSize: "200px",
        }}
      />
      <Typography level="body-lg">~暂无任务qwq~</Typography>
    </Sheet>
  );
}

interface TaskListProps {
  data: TaskListItem[];
  setTaskDetailModalOpen(value: boolean): void;
  setTaskId(value: number): void;
  setUserTaskId(value: number): void;
}

const TaskList: React.FC<TaskListProps> = (props) => {
  const { data, setTaskId, setUserTaskId, setTaskDetailModalOpen } = props;
  const subjectList = JSON.parse(localStorage.getItem("subjectList") || "");
  return data.length > 0 ? (
    <List>
      {data.map((task: TaskListItem) => (
        <ListItem
          key={task.taskId}
          onClick={() => {
            setTaskId(task.taskId);
            setUserTaskId(task.userTaskId);
            setTaskDetailModalOpen(true);
          }}
        >
          <Card
            variant="plain"
            sx={{
              position: "relative",
              width: "100%",
              cursor: "pointer",
              boxShadow: "sm",
              transition: "0.2s all",
              ":hover": { boxShadow: "md" },
            }}
          >
            <Typography
              level="title-lg"
              sx={{
                my: 2,
                width: "100%",
                wordBreak: "break-all",
                overflowWrap: "break-word",
              }}
              startDecorator={
                <Chip
                  size="sm"
                  sx={(theme) => ({
                    [theme.getColorSchemeSelector("light")]: {
                      backgroundColor: getSubjectColor(
                        task.subjectId,
                        100 as ColorVariant
                      ),
                      color: getSubjectColor(
                        task.subjectId,
                        900 as ColorVariant
                      ),
                    },
                    [theme.getColorSchemeSelector("dark")]: {
                      backgroundColor: getSubjectColor(
                        task.subjectId,
                        900 as ColorVariant
                      ),
                      color: getSubjectColor(
                        task.subjectId,
                        50 as ColorVariant
                      ),
                    },
                  })}
                >
                  {
                    subjectList.filter((x: any) => x.id === task.subjectId)[0]
                      .name
                  }
                </Chip>
              }
            >
              {task.title}
            </Typography>
            {task.description && task.description.length > 0 && (
              <Typography
                level="body-sm"
                sx={{
                  width: "100%",
                  wordBreak: "break-all",
                  overflowWrap: "break-word",
                }}
              >
                {task.description}
              </Typography>
            )}
            <CardOverflow>
              <CardContent
                orientation="horizontal"
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row">
                  <Chip
                    variant="outlined"
                    color={task.allowSubmitIfDelay ? "success" : "danger"}
                    size="sm"
                    sx={{ mr: 1 }}
                  >
                    {task.allowSubmitIfDelay ? "允许晚交" : "不可晚交"}
                  </Chip>
                  {task.questionCount ? (
                    <Chip
                      variant="plain"
                      color="primary"
                      size="sm"
                      startDecorator={<TaskTwoTone fontSize="small" />}
                    >
                      {task.questionCount + " 道题"}
                    </Chip>
                  ) : task.attachmentCount ? (
                    <Chip
                      variant="plain"
                      color="primary"
                      size="sm"
                      startDecorator={<FileDownloadTwoTone fontSize="small" />}
                    >
                      {task.attachmentCount + " 个附件"}
                    </Chip>
                  ) : (
                    <></>
                  )}
                  <Chip
                    variant="plain"
                    color="warning"
                    size="sm"
                    sx={{ mx: 1 }}
                    startDecorator={<VisibilityTwoTone fontSize="small" />}
                  >
                    {["互阅", "教师批阅", "自阅"][(task.markType - 1) % 3]}
                  </Chip>
                  <Typography
                    startDecorator={<AccessTime fontSize="small" />}
                    level="body-xs"
                    sx={{ mx: 1, fontWeight: "md", color: "text.secondary" }}
                  >
                    {splitTime(task.publishedAt)}
                  </Typography>
                  {task.finishAt ? (
                    <Typography
                      startDecorator={<Done fontSize="small" />}
                      level="body-xs"
                      sx={{ mx: 1, fontWeight: "md", color: "text.secondary" }}
                    >
                      {splitTime(task.finishAt)}
                    </Typography>
                  ) : (
                    <Typography
                      startDecorator={<HistoryToggleOff fontSize="small" />}
                      level="body-xs"
                      sx={{ mx: 1, fontWeight: "md", color: "text.secondary" }}
                    >
                      {splitTime(task.endAt)}
                    </Typography>
                  )}
                </Stack>
                <Typography
                  level="body-sm"
                  sx={{ fontWeight: "md" }}
                  variant="plain"
                  color="primary"
                  endDecorator={<ArrowForward fontSize="small" />}
                >
                  查看任务
                </Typography>
              </CardContent>
            </CardOverflow>
          </Card>
        </ListItem>
      ))}
    </List>
  ) : (
    <EmptyContent />
  );
};

export default TaskList;
