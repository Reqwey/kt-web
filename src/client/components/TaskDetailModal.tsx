import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemContent,
  Link,
  Typography,
  Modal,
  ModalDialog,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Sheet,
  Skeleton,
} from "@mui/joy";
import {
  InfoRounded,
  PeopleOutline,
  Close,
  Fullscreen,
  FullscreenExit,
  ArticleTwoTone,
  ArrowForward,
  SchoolTwoTone,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetData } from "../methods/fetch_data";

interface TaskDetailModalOptions {
  open: boolean;
  setOpen(value: boolean): void;
  taskId: number;
}

interface TaskDetailProps {
  title: string;
  attachments: any[];
  content: string;
}

const TaskDetailModal: React.FC<TaskDetailModalOptions> = (props) => {
  const { open, setOpen, taskId } = props;
  const [layout, setLayout] = useState("center" as "center" | "fullscreen");
  const [data, setData] = useState({
    title: "",
    detail: [],
    unfinished_students: [],
    first_name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getData = useGetData();

  useEffect(() => {
    (async () => {
      if (taskId) {
        setLoading(true);
        const { response, error } = await getData(`/api-task-info/${taskId}`, {
          params: {
            username: localStorage.getItem("userName"),
            sn: localStorage.getItem("sn"),
            token: localStorage.getItem("token"),
          },
        });
        if (!error && response) {
          setData(response);
          console.log(response);
        }
        setLoading(false);
      }
    })();
  }, [taskId]);

  return (
    <>
      <Modal open={!!open}>
        <ModalDialog aria-labelledby="task-detail-modal-title" layout={layout}>
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
              startDecorator={!loading && <InfoRounded />}
              endDecorator={
                !loading && (
                  <Chip
                    variant="soft"
                    color="primary"
                    size="md"
                    startDecorator={<SchoolTwoTone />}
                  >
                    {data.first_name}
                  </Chip>
                )
              }
            >
              <Skeleton animation="wave" loading={loading}>
                {loading ? "Lorem ipsum is placeholder text" : data.title}
              </Skeleton>
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                marginTop: -2,
                marginRight: -1,
              }}
            >
              <IconButton
                variant="plain"
                color="neutral"
                onClick={() => {
                  setLayout(layout === "center" ? "fullscreen" : "center");
                }}
              >
                {layout === "center" ? <Fullscreen /> : <FullscreenExit />}
              </IconButton>
              <IconButton
                variant="plain"
                color="neutral"
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
            <Skeleton
              animation="wave"
              loading={loading}
              sx={{ position: "relative", width: "100%", height: "20vh" }}
            >
              {!loading &&
              data.detail.length === 1 &&
              !(data.detail[0] as TaskDetailProps).title ? (
                <>
                  {(data.detail[0] as TaskDetailProps).attachments.length ? (
                    <Sheet
                      variant="soft"
                      color="neutral"
                      sx={{ width: "100%", p: 1, borderRadius: "md" }}
                    >
                      <Chip
                        size="sm"
                        key="summary"
                        color="primary"
                        variant="solid"
                      >
                        {(data.detail[0] as TaskDetailProps).attachments
                          .length + " 个附件"}
                      </Chip>
                      <br />
                      {(data.detail[0] as TaskDetailProps).attachments.map(
                        (file: any, index) => (
                          <>
                            <Link
                              key={index}
                              href={file.source_file}
                              target="_blank"
                              rel="noreferrer"
                              color="primary"
                              startDecorator={<ArticleTwoTone />}
                            >
                              {file.name}
                            </Link>
                            <br />
                          </>
                        )
                      )}
                    </Sheet>
                  ) : (
                    <></>
                  )}
                  <Box width="100%" position="relative">
                    <div
                      className="KtContent"
                      style={{ width: "100%" }}
                      dangerouslySetInnerHTML={{
                        __html: (data.detail[0] as TaskDetailProps).content,
                      }}
                    ></div>
                  </Box>
                </>
              ) : (
                <List
                  variant="outlined"
                  color="neutral"
                  sx={{
                    width: "100%",
                    overflowY: "auto",
                    borderRadius: "sm",
                  }}
                >
                  {data.detail.map((task: any) =>
                    task.paper_id ? (
                      <ListItem key={"paper" + task.paper_id}>
                        <ListItemContent>
                          <Typography
                            component="h4"
                            fontWeight="bd"
                            endDecorator={
                              <Chip
                                size="sm"
                                variant="soft"
                                color={task.is_finished ? "success" : "danger"}
                              >
                                {task.is_finished ? "已完成" : "未完成"}
                              </Chip>
                            }
                          >
                            {task.title}
                          </Typography>
                        </ListItemContent>
                        <Button
                          variant="soft"
                          endDecorator={<ArrowForward />}
                          onClick={() =>
                            navigate(`/paper/${task.paper_id}`, {
                              replace: true,
                            })
                          }
                        >
                          进入任务
                        </Button>
                      </ListItem>
                    ) : task.exercise_id ? (
                      <ListItem key={"exercise" + task.exercise_id}>
                        <ListItemContent>
                          <Typography
                            component="h4"
                            fontWeight="bd"
                            endDecorator={
                              <Chip
                                size="sm"
                                variant="soft"
                                color={task.is_finished ? "success" : "danger"}
                              >
                                {task.is_finished ? "已完成" : "未完成"}
                              </Chip>
                            }
                          >
                            {task.title}
                          </Typography>
                        </ListItemContent>
                        <Button variant="soft" disabled onClick={() => {}}>
                          暂不支持查看
                        </Button>
                      </ListItem>
                    ) : task.chapter_id ? (
                      <ListItem key={"chapter" + task.chapter_id}>
                        <ListItemContent>
                          <Typography
                            component="h4"
                            fontWeight="bd"
                            endDecorator={
                              <Chip
                                size="sm"
                                variant="soft"
                                color={task.is_finished ? "success" : "danger"}
                              >
                                {task.is_finished ? "已完成" : "未完成"}
                              </Chip>
                            }
                          >
                            {task.title}
                          </Typography>
                        </ListItemContent>
                        <Button
                          variant="soft"
                          endDecorator={<ArrowForward />}
                          onClick={() => {}}
                        >
                          查看内容
                        </Button>
                      </ListItem>
                    ) : (
                      <></>
                    )
                  )}
                </List>
              )}
            </Skeleton>
          </Box>
          <Divider />
          <Box sx={{ width: "100%", position: "relative" }}>
            <Skeleton
              animation="wave"
              variant="overlay"
              sx={{ width: "100%", height: "5vh", position: "relative" }}
              loading={loading}
            >
              {!loading &&
                data.unfinished_students &&
                data.unfinished_students.length > 0 && (
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
                            {data.unfinished_students.length}
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
                        {data.unfinished_students.join("，")}
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
