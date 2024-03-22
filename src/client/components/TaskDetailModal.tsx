import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Chip,
  Button,
  IconButton,
  Typography,
  Modal,
  ModalDialog,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Tab,
  TabList,
  Tabs,
  tabClasses,
  AspectRatio,
  Card,
  CardCover,
  Grid,
  CardContent,
  Stack,
  DialogContent,
} from "@mui/joy";
import {
  PeopleOutline,
  Close,
  ArrowForward,
  SchoolTwoTone,
  PlayArrowRounded,
  HistoryToggleOff,
  OpenInFullRounded,
  CloseFullscreenRounded,
  InfoOutlined,
  Done,
  DoneAllRounded,
} from "@mui/icons-material";
import useSWR from "swr";
import { getData, postData } from "../methods/fetch_data";
import MySuspense from "./MySuspense";
import { TaskDetail, TaskInfoData } from "../models/task_info";
import AttachmentList from "./AttachmentList";
import { splitTime } from "../models/task_list";
import useSWRMutation from "swr/mutation";
import { useVideoPlayer } from "./VideoPlayerProvider";

interface TaskDetailModalOptions {
  setOpen(value: boolean): void;
  taskId: number;
  userTaskId: number;
}

const getModalInfo = async (url: string) => {
  const res: TaskInfoData = await getData(url, {
    params: {
      username: localStorage.getItem("userName"),
      sn: localStorage.getItem("sn"),
      token: localStorage.getItem("token"),
    },
  });
  return res;
};

const getDetailInfo = async (url: string) => {
  const res: TaskDetail = await getData(url, {
    params: {
      username: localStorage.getItem("userName"),
      sn: localStorage.getItem("sn"),
      token: localStorage.getItem("token"),
    },
  });
  return res;
};

const TaskDetailModal: React.FC<TaskDetailModalOptions> = (props) => {
  const { setOpen, taskId, userTaskId } = props;
  const [layout, setLayout] = useState("center" as "center" | "fullscreen");
  const [detail, setDetail] = useState<{ index: number; id: number }>({
    index: -1,
    id: 0,
  });
  const [markFinishButtonShow, setMarkFinishButtonShow] = useState(false);

  const {
    data: modalInfo,
    isLoading: modalLoading,
    error: modalError,
  } = useSWR(`/api-task-info/${taskId}?userTaskId=${userTaskId}`, getModalInfo);

  const {
    data: detailInfo,
    isLoading: detailLoading,
    error: detailError,
    mutate: mutateDetail,
  } = useSWR(
    detail.index !== -1
      ? `/api-task-info/${taskId}?userTaskId=${userTaskId}&detailId=${detail.id}`
      : null,
    getDetailInfo
  );

  const { trigger, isMutating } = useSWRMutation("/api-mark-finish", postData);

  useEffect(() => {
    if (modalInfo && modalInfo.taskModules)
      setDetail({
        index: 0,
        id: modalInfo.taskModules[0].userTaskDetailId,
      });
  }, [modalInfo]);

  useEffect(() => {
    setMarkFinishButtonShow(true);
  }, [detail]);

  const handleMarkfinish = useCallback(async () => {
    try {
      if (!detailInfo) throw new Error("未能获取详细信息。");
      await trigger({
        taskId: detailInfo.task.id,
        detailId: detailInfo.taskDetailId,
        username: localStorage.getItem("userName"),
        sn: localStorage.getItem("sn"),
        token: localStorage.getItem("token"),
      });
      setMarkFinishButtonShow(false);
    } catch (error) {
      console.log(error);
    } finally {
      mutateDetail();
    }
  }, [detail, detailInfo]);

  const setVideoUrl = useVideoPlayer();

  return (
    <>
      <Modal open>
        <ModalDialog
          aria-labelledby="task-detail-modal-title"
          layout={layout}
          sx={{
            borderRadius: layout === "center" ? "lg" : "unset",
            width: layout === "center" ? "60dvw" : "100dvw",
            height: layout === "center" ? "60dvh" : "100dvh",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              id="task-detail-modal-title"
              component="h2"
              noWrap={true}
              startDecorator={!modalLoading && <InfoOutlined />}
              endDecorator={
                !modalLoading &&
                modalInfo && (
                  <Chip
                    variant="soft"
                    color="primary"
                    size="md"
                    startDecorator={<SchoolTwoTone />}
                  >
                    {modalInfo.firstName}
                  </Chip>
                )
              }
              sx={{ marginTop: -1 }}
            >
              <Skeleton animation="wave" loading={modalLoading}>
                {modalInfo
                  ? modalInfo.title
                  : "Lorem ipsum is placeholder text"}
              </Skeleton>
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                marginTop: -1,
                marginRight: -1,
              }}
            >
              <IconButton
                variant="soft"
                color="primary"
                size="sm"
                sx={{ borderRadius: "50%" }}
                onClick={() => {
                  setLayout(layout === "center" ? "fullscreen" : "center");
                }}
              >
                {layout === "center" ? (
                  <OpenInFullRounded />
                ) : (
                  <CloseFullscreenRounded />
                )}
              </IconButton>
              <IconButton
                variant="soft"
                color="danger"
                size="sm"
                sx={{ borderRadius: "50%" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <DialogContent>
            <MySuspense loading={modalLoading}>
              {!!modalInfo && (
                <>
                  {!!modalInfo.taskModules &&
                    modalInfo.taskModules.length > 1 && (
                      <Tabs
                        orientation="horizontal"
                        sx={{ width: "100%", mb: 1 }}
                        value={`${detail.index}/${detail.id}`}
                        onChange={(_, value) => {
                          const [index, id] = (value as string)
                            .split("/")
                            .map((x) => parseInt(x));
                          setDetail({ index, id });
                        }}
                      >
                        <TabList
                          disableUnderline
                          sx={{
                            p: 0.5,
                            gap: 0.5,
                            borderRadius: "xl",
                            bgcolor: "background.level1",
                            [`& .${tabClasses.root}[aria-selected="true"]`]: {
                              boxShadow: "sm",
                              bgcolor: "background.surface",
                            },
                          }}
                        >
                          {modalInfo.taskModules.map((module, index) => (
                            <Tab
                              disableIndicator
                              key={module.userTaskDetailId}
                              value={`${index}/${module.userTaskDetailId}`}
                            >
                              {module.title}
                            </Tab>
                          ))}
                        </TabList>
                      </Tabs>
                    )}
                  <MySuspense loading={detailLoading}>
                    {!!detailInfo && (
                      <Box width="100%">
                        {!!detailInfo.paperId && (
                          <Card
                            color="primary"
                            sx={{ boxShadow: "sm", width: "100%" }}
                          >
                            <CardContent
                              orientation="horizontal"
                              sx={{ width: "100%" }}
                            >
                              <div>
                                <Typography fontSize="lg" fontWeight="lg">
                                  {detailInfo.title || modalInfo.title}
                                </Typography>
                                {modalInfo.taskModules[detail.index]
                                  .finishAt ? (
                                  <Typography
                                    color="success"
                                    startDecorator={
                                      <Done fontSize="small" color="success" />
                                    }
                                    level="body-xs"
                                  >
                                    {splitTime(
                                      modalInfo.taskModules[detail.index]
                                        .finishAt as string
                                    )}
                                  </Typography>
                                ) : (
                                  <Stack direction="row">
                                    <Typography
                                      color="warning"
                                      level="body-xs"
                                      startDecorator={
                                        <HistoryToggleOff
                                          fontSize="small"
                                          color="warning"
                                        />
                                      }
                                    >
                                      {splitTime(detailInfo.task.endAt)}
                                    </Typography>
                                    <Chip
                                      variant="outlined"
                                      color={
                                        detailInfo.task.allowSubmitIfDelay
                                          ? "success"
                                          : "danger"
                                      }
                                      size="sm"
                                      sx={{ ml: 1 }}
                                    >
                                      {detailInfo.task.allowSubmitIfDelay
                                        ? "允许晚交"
                                        : "不可晚交"}
                                    </Chip>
                                  </Stack>
                                )}
                              </div>
                              <Button
                                component="a"
                                variant="soft"
                                href={
                                  modalInfo.taskModules[detail.index].exerciseId
                                    ? `/exercise/${
                                        modalInfo.taskModules[detail.index]
                                          .exerciseId
                                      }?name=${
                                        detailInfo.title || modalInfo.title
                                      }`
                                    : `/task/${detailInfo.task.id}/paper/${detailInfo.paperId}`
                                }
                                target="_blank"
                                endDecorator={<ArrowForward />}
                                sx={{
                                  ml: "auto",
                                  alignSelf: "center",
                                  fontWeight: 600,
                                }}
                              >
                                进入任务
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                        {!!detailInfo.attachments && (
                          <AttachmentList
                            attachments={detailInfo.attachments}
                          />
                        )}
                        {!!detailInfo.content && (
                          <Box
                            className="KtContent"
                            width="100%"
                            p={1}
                            pb={6}
                            dangerouslySetInnerHTML={{
                              __html: detailInfo.content,
                            }}
                          ></Box>
                        )}
                        {!!detailInfo.videos && !!detailInfo.videos.length && (
                          <Grid
                            container
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 2, sm: 4, md: 8 }}
                            sx={{ flexGrow: 1, pb: 6 }}
                          >
                            {detailInfo.videos.map((v) => (
                              <Grid xs={2} sm={4} md={4} key={v.id}>
                                <Card
                                  sx={{
                                    height: "min-content",
                                    cursor: "pointer",
                                    "&:hover": {
                                      boxShadow: "md",
                                      borderColor:
                                        "neutral.outlinedHoverBorder",
                                    },
                                    bgcolor: "initial",
                                    p: 0,
                                  }}
                                  onClick={() => setVideoUrl(v.video)}
                                >
                                  <Box sx={{ position: "relative" }}>
                                    <AspectRatio ratio="3/2">
                                      <figure>
                                        <img
                                          src={v.cover}
                                          srcSet={v.cover}
                                          loading="lazy"
                                          alt={v.title}
                                        />
                                      </figure>
                                    </AspectRatio>
                                    <CardCover
                                      sx={{
                                        opacity: 1,
                                        transition: "0.1s ease-in",
                                        background:
                                          "linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)",
                                      }}
                                    >
                                      <div>
                                        <Box
                                          sx={{
                                            p: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <PlayArrowRounded
                                            sx={{
                                              color: "#fff",
                                              fontSize: "70px",
                                              bgcolor: "rgba(0 0 0 / 0.2)",
                                              borderRadius: "lg",
                                            }}
                                          />
                                        </Box>
                                      </div>
                                    </CardCover>
                                  </Box>
                                  <Typography
                                    level="body-lg"
                                    fontWeight="lg"
                                    sx={{
                                      p: 2,
                                      mt: -9,
                                      zIndex: 114514,
                                      color: "#fff",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {v.title}
                                  </Typography>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        )}
                        {!detailInfo.paperId &&
                          !modalInfo.taskModules[detail.index].finishAt &&
                          markFinishButtonShow && (
                            <Box
                              width="100%"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Button
                                onClick={handleMarkfinish}
                                loading={isMutating}
                                startDecorator={<DoneAllRounded />}
                                sx={{ boxShadow: "lg" }}
                              >
                                标记为完成
                              </Button>
                            </Box>
                          )}
                      </Box>
                    )}
                  </MySuspense>
                </>
              )}
            </MySuspense>
          </DialogContent>
          {!modalLoading &&
            modalInfo &&
            modalInfo.unfinishedStudents &&
            modalInfo.unfinishedStudents.length > 0 && <Divider />}
          <Box sx={{ width: "100%", position: "relative" }}>
            <Skeleton
              animation="wave"
              variant="overlay"
              sx={{ width: "100%", height: "5dvh", position: "relative" }}
              loading={modalLoading}
            >
              {!modalLoading &&
                modalInfo &&
                modalInfo.unfinishedStudents &&
                modalInfo.unfinishedStudents.length > 0 && (
                  <Accordion>
                    <AccordionSummary>
                      <Typography
                        component="h3"
                        noWrap={true}
                        startDecorator={<PeopleOutline />}
                        sx={{
                          "--Typography-gap": "0.5rem",
                          paddingTop: 1,
                          paddingBottom: 1,
                        }}
                        endDecorator={
                          <Chip variant="solid" color="danger" size="sm">
                            {modalInfo.unfinishedStudents.length}
                          </Chip>
                        }
                      >
                        未完成
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="soft"
                        color="primary"
                        fontSize="sm"
                        sx={{ "--Typography-gap": "0.5rem", p: 1 }}
                      >
                        {modalInfo.unfinishedStudents.join("，")}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )}
            </Skeleton>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default TaskDetailModal;
