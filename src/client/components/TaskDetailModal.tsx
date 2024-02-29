import * as React from "react";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Divider from "@mui/joy/Divider";

// import TaskPaperModal from './TaskPaperModal';

import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ArticleTwoToneIcon from "@mui/icons-material/ArticleTwoTone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Sheet,
  Skeleton,
} from "@mui/joy";
import { SchoolTwoTone } from "@mui/icons-material";

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
  const [layout, setLayout] = React.useState(
    "center" as "center" | "fullscreen"
  );
  const [data, setData] = React.useState({
    title: "",
    detail: [],
    unfinished_students: [],
    first_name: "",
  });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setData(
        !props.open
          ? { title: "", detail: [], unfinished_students: [] }
          : (
              await axios.get(`/api-task-info/${props.taskId}`, {
                params: {
                  username: localStorage.getItem("userName"),
                  sn: localStorage.getItem("sn"),
                  token: localStorage.getItem("token"),
                },
              })
            ).data
      );
      setLoading(false);
    })();
  }, [props]);

  return (
    <>
      <Modal open={!!props.open}>
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
              startDecorator={!loading && <InfoRoundedIcon />}
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
                {layout === "center" ? (
                  <FullscreenIcon />
                ) : (
                  <FullscreenExitIcon />
                )}
              </IconButton>
              <IconButton
                variant="plain"
                color="neutral"
                onClick={() => {
                  props.setOpen(false);
                }}
              >
                <CloseIcon />
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
                      <Chip size="sm" key="summary" color="primary" variant="solid">
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
                              startDecorator={<ArticleTwoToneIcon />}
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
                          endDecorator={<ArrowForwardIcon />}
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
                          endDecorator={<ArrowForwardIcon />}
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
                        startDecorator={<PeopleOutlineIcon />}
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
