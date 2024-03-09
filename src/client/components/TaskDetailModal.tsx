import React, { useState, useEffect } from "react";
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
} from "@mui/icons-material";
import useSWR from "swr";
import { getData } from "../methods/fetch_data";
import MySuspense from "./MySuspense";
import { TaskDetail, TaskInfoData } from "../models/task_info";
import { AttachmentList } from "./CourseModulesDrawer";
import VideoPlayerModal from "./VideoPlayerModal";
import { splitTime } from "../models/task_list";

interface TaskDetailModalOptions {
  setOpen(value: boolean): void;
  taskId: number;
  userTaskId: number;
}

const _getData = (url: string) =>
  getData(url, {
    params: {
      username: localStorage.getItem("userName"),
      sn: localStorage.getItem("sn"),
      token: localStorage.getItem("token"),
    },
  });

const TaskDetailModal: React.FC<TaskDetailModalOptions> = (props) => {
  const { setOpen, taskId, userTaskId } = props;
  const [layout, setLayout] = useState("center" as "center" | "fullscreen");
  const [detailId, setDetailId] = useState(0);
  const {
    data: modalInfo,
    isLoading: modalLoading,
    error: modalError,
  } = useSWR(`/api-task-info/${taskId}?userTaskId=${userTaskId}`, _getData);

  const {
    data: detailInfo,
    isLoading: detailLoading,
    error: detailError,
  } = useSWR(
    detailId !== 0
      ? `/api-task-info/${taskId}?userTaskId=${userTaskId}&detailId=${detailId}`
      : null,
    _getData
  );

  useEffect(() => {
    if (modalInfo)
      setDetailId((modalInfo as TaskInfoData).taskModules[0].userTaskDetailId);
  }, [modalInfo]);

  if (detailInfo) console.log(detailInfo);

  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <>
      <VideoPlayerModal
        open={videoOpen}
        setOpen={setVideoOpen}
        videoUrl={videoUrl}
      />
      <Modal open>
        <ModalDialog
          aria-labelledby="task-detail-modal-title"
          layout={layout}
          sx={{
            borderRadius: layout === "center" ? "lg" : "unset",
            width: layout === "center" ? "60vw" : "100vw",
            height: layout === "center" ? "60vh" : "100vh",
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
                !modalLoading && (
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
                {modalLoading
                  ? "Lorem ipsum is placeholder text"
                  : modalInfo.title}
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
          <Box width="100%" height="100%" overflow="auto">
            <MySuspense loading={modalLoading}>
              {!!modalInfo && (
                <>
                  {(modalInfo as TaskInfoData).taskModules.length > 1 && (
                    <Tabs
                      orientation="horizontal"
                      sx={{ width: "100%" }}
                      value={detailId}
                      onChange={(_, value) => setDetailId(value as number)}
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
                        {(modalInfo as TaskInfoData).taskModules.map((module) => (
                          <Tab
                            disableIndicator
                            key={module.userTaskDetailId}
                            value={module.userTaskDetailId}
                          >
                            {module.title}
                          </Tab>
                        ))}
                      </TabList>
                    </Tabs>
                  )}
                  <MySuspense loading={detailLoading}>
                    {!!detailInfo && (
                      <>
                        {!!(detailInfo as TaskDetail).paperId && (
                          <Card color="primary" sx={{ mt: 1, boxShadow: "sm" }}>
                            <CardContent
                              orientation="horizontal"
                              sx={{ width: "100%" }}
                            >
                              <div>
                                <Typography fontSize="lg" fontWeight="lg">
                                  {(detailInfo as TaskDetail).title ||
                                    (modalInfo as TaskInfoData).title}
                                </Typography>
                                <Typography
                                  level="body-xs"
                                  startDecorator={
                                    <HistoryToggleOff fontSize="small" />
                                  }
                                >
                                  {splitTime(
                                    (detailInfo as TaskDetail).task.endAt
                                  )}
                                </Typography>
                              </div>
                              <Button
                                component="a"
                                variant="soft"
                                href={`/paper/${
                                  (detailInfo as TaskDetail).paperId
                                }`}
                                target="_blank"
                                rel="noreferrer"
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
                        {!!(detailInfo as TaskDetail).attachments && (
                          <AttachmentList
                            attachments={detailInfo.attachments}
                          />
                        )}
                        {!!(detailInfo as TaskDetail).content && (
                          <div
                            style={{ width: "100%" }}
                            dangerouslySetInnerHTML={{
                              __html: detailInfo.content,
                            }}
                          ></div>
                        )}
                        {!!(detailInfo as TaskDetail).videos && (
                          <Grid
                            container
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 2, sm: 4, md: 8 }}
                            sx={{ flexGrow: 1 }}
                          >
                            {(detailInfo as TaskDetail).videos.map((v) => (
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
                                  onClick={() => {
                                    setVideoUrl(v.video);
                                    setVideoOpen(true);
                                  }}
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
                      </>
                    )}
                  </MySuspense>
                </>
              )}
            </MySuspense>
          </Box>
          {!modalLoading &&
            modalInfo.unfinishedStudents &&
            modalInfo.unfinishedStudents.length > 0 && <Divider />}
          <Box sx={{ width: "100%", position: "relative" }}>
            <Skeleton
              animation="wave"
              variant="overlay"
              sx={{ width: "100%", height: "5vh", position: "relative" }}
              loading={modalLoading}
            >
              {!modalLoading &&
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
