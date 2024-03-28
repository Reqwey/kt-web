import React, { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardOverflow,
  Chip,
  CardContent,
  Sheet,
  List,
  ListItem,
  Typography,
  Stack,
  IconButton,
} from "@mui/joy";

import {
  AccessTime,
  HistoryToggleOff,
  ArrowForward,
  Done,
  FileDownloadTwoTone,
  TaskTwoTone,
  VisibilityTwoTone,
  NotificationsOffTwoTone,
  StarRounded,
  StarBorderRounded,
} from "@mui/icons-material";

import { getGradeColor, getSubjectColor, splitTime } from "../models/task_list";
import { postData } from "../methods/fetch_data";
import useSWRMutation from "swr/mutation";
import { useTaskDetailModal, useTaskInfo } from "./TaskDetailProvider";
import { TaskInfo } from "../models/task_info";
import { TaskListItem } from "./../models/task_list";

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

interface TaskListCellProps {
  task: TaskListItem;
}

const TaskListCell: React.FC<TaskListCellProps> = (props) => {
  const { task } = props;
  const [, setTaskInfo] = useTaskInfo();
  const [, setTaskDetailModalOpen] = useTaskDetailModal();
  const subjectList = JSON.parse(localStorage.getItem("subjectList") || "");
  const [favorite, setFavorite] = useState(task.isFavorite);
  const { trigger: emitFavorite } = useSWRMutation(
    "/api-task-favorite",
    postData
  );

  const config = {
    id: task.taskId,
    favorite,
    username: localStorage.getItem("userName"),
    sn: localStorage.getItem("sn"),
    token: localStorage.getItem("token"),
  };

  const handleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorite(!favorite);
    try {
      await emitFavorite(config);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFavorite(task.isFavorite);
  }, [task]);

  return (
    <ListItem
      key={task.taskId}
      onClick={() => {
        setTaskInfo(task as TaskInfo);
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
                  backgroundColor: getSubjectColor(task.subjectId, 100),
                  color: getSubjectColor(task.subjectId, 900),
                },
                [theme.getColorSchemeSelector("dark")]: {
                  backgroundColor: getSubjectColor(task.subjectId, 900),
                  color: getSubjectColor(task.subjectId, 50),
                },
              })}
            >
              {subjectList.filter((x: any) => x.id === task.subjectId)[0].name}
            </Chip>
          }
          endDecorator={
            <IconButton
              color={favorite ? "warning" : "neutral"}
              variant="plain"
              onClick={handleFavorite}
            >
              {favorite ? <StarRounded /> : <StarBorderRounded />}
            </IconButton>
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
            <Stack direction="row" spacing={2}>
              {task.finishAt ? (
                task.correctPercent ? (
                  <Typography
                    level="body-xs"
                    sx={(theme) => ({
                      fontWeight: "md",
                      [theme.getColorSchemeSelector("light")]: {
                        color: getGradeColor(task.correctPercent as any, 600),
                      },
                      [theme.getColorSchemeSelector("dark")]: {
                        color: getGradeColor(task.correctPercent as any, 400),
                      },
                    })}
                  >
                    {task.correctPercent + "%"}
                  </Typography>
                ) : (
                  <Typography level="body-xs" fontWeight="md" color="success">
                    已完成
                  </Typography>
                )
              ) : (
                <Chip
                  variant="outlined"
                  color={task.allowSubmitIfDelay ? "success" : "danger"}
                  size="sm"
                >
                  {task.allowSubmitIfDelay ? "允许晚交" : "不可晚交"}
                </Chip>
              )}
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
                startDecorator={<VisibilityTwoTone fontSize="small" />}
              >
                {["互阅", "教师批阅", "自阅"][(task.markType - 1) % 3]}
              </Chip>
              <Typography
                startDecorator={<AccessTime fontSize="small" />}
                level="body-xs"
                sx={{ fontWeight: "md", color: "text.secondary" }}
              >
                {splitTime(task.publishedAt)}
              </Typography>
              {task.finishAt ? (
                <Typography
                  startDecorator={<Done fontSize="small" />}
                  level="body-xs"
                  sx={{ fontWeight: "md", color: "text.secondary" }}
                >
                  {splitTime(task.finishAt)}
                </Typography>
              ) : (
                <Typography
                  startDecorator={<HistoryToggleOff fontSize="small" />}
                  level="body-xs"
                  sx={{ fontWeight: "md", color: "text.secondary" }}
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
  );
};

interface TaskListProps {
  data: TaskListItem[];
}

const TaskList: React.FC<TaskListProps> = (props) => {
  const { data } = props;

  return data.length > 0 ? (
    <List>
      {data.map((task: TaskListItem) => (
        <TaskListCell task={task} />
      ))}
    </List>
  ) : (
    <EmptyContent />
  );
};

export default TaskList;
