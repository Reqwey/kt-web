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
} from "@mui/icons-material";

import {
  ColorVariant,
  TaskListData,
  getSubjectColor,
} from "../models/task_list";

function splitTime(time: string): string {
  let newTime = new Date(time);
  return newTime.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface RenderTasksProps {
  data: any[];
  setTaskDetailModalOpen(value: boolean): void;
  setTaskId(value: number): void;
}

export const RenderTasks: React.FC<RenderTasksProps> = (props) => {
  const { data, setTaskId, setTaskDetailModalOpen } = props;
  const subjectList = JSON.parse(localStorage.getItem("subjectList") || "");
  return data.map((task: any) => (
    <ListItem
      key={task.taskId}
      onClick={() => {
        setTaskId(task.taskId);
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
                  color: getSubjectColor(task.subjectId, 900 as ColorVariant),
                },
                [theme.getColorSchemeSelector("dark")]: {
                  backgroundColor: getSubjectColor(
                    task.subjectId,
                    900 as ColorVariant
                  ),
                  color: getSubjectColor(task.subjectId, 50 as ColorVariant),
                },
              })}
            >
              {subjectList.filter((x: any) => x.id === task.subjectId)[0].name}
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
  ));
};

interface TaskListProps {
  setTaskId: (value: number) => void;
  setTaskDetailModalOpen: (value: boolean) => void;
  category: string;
  setCategory: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  data: TaskListData;
}

const TaskList: React.FC<TaskListProps> = (props) => {
  const {
    setTaskId,
    setTaskDetailModalOpen,
    category,
    setCategory,
    page,
    setPage,
    data,
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  return (
    <Sheet
      variant="soft"
      sx={{ height: "100vh", overflow: "auto", width: "100%" }}
    >
      <ListSubheader
        sticky
        sx={{
          zIndex: 2,
          width: "100%",
          boxShadow: "lg",
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            marginTop: -1,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            p: 1,
            pt: 2,
            backgroundColor: "transparent",
            backdropFilter: "blur(5px)",
          }}
        >
          <Button
            disabled={page == 1}
            color={page == 1 ? "neutral" : "primary"}
            variant="plain"
            size="sm"
            startDecorator={<ArrowBackIosNewRounded />}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            上一页
          </Button>
          <RadioGroup
            orientation="horizontal"
            aria-labelledby="segmented-controls-example"
            name="query"
            value={category}
            size="sm"
            onChange={handleChange}
            sx={{
              minHeight: 37,
              padding: "4px",
              fontSize: "sm",
              borderRadius: "md",
              bgcolor: "neutral.softBg",
              "--RadioGroup-gap": "4px",
              "--Radio-actionRadius": "8px",
            }}
          >
            {[
              ["unfinished", "未完成"],
              ["finished", "已完成"],
              ["ended", "已截止"],
              ["favorited", "收藏"],
              ["material", "资料"],
            ].map((item, index) => (
              <Radio
                key={index}
                color="neutral"
                value={item[0]}
                disableIcon
                label={item[1]}
                variant="plain"
                sx={{
                  px: 2,
                  alignItems: "center",
                }}
                slotProps={{
                  action: ({ checked }) => ({
                    sx: {
                      ...(checked && {
                        bgcolor: "background.surface",
                        boxShadow: "md",
                        "&:hover": {
                          bgcolor: "background.surface",
                        },
                      }),
                    },
                  }),
                }}
              />
            ))}
          </RadioGroup>
          <Button
            disabled={!data.next}
            size="sm"
            color={!data.next ? "neutral" : "primary"}
            variant="plain"
            endDecorator={<ArrowForwardIosRounded />}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            下一页
          </Button>
        </Box>
      </ListSubheader>
      <List sx={{ marginTop: 1, width: "100%" }}>
        <RenderTasks
          data={data.results}
          setTaskId={setTaskId}
          setTaskDetailModalOpen={setTaskDetailModalOpen}
        />
      </List>
    </Sheet>
  );
};

export default TaskList;
