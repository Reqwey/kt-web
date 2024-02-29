import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Alert,
  Sheet,
  Button,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  Link,
  CircularProgress,
  Modal,
  Input,
  ModalDialog,
  ModalClose,
  Typography,
  Divider,
  Snackbar,
} from "@mui/joy";

import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
  Logout,
  Report,
  InfoOutlined,
  SearchRounded,
  DragIndicator,
  LightbulbOutlined,
  NotificationsOffTwoTone,
} from "@mui/icons-material";

import ColorSchemeToggle from "../components/ColorSchemeToggle";
import TaskList from "../components/TaskList";
import TaskDetailModal from "../components/TaskDetailModal";
import SubjectList from "../components/SubjectList";
import { RenderTasks } from "../components/TaskList";

import config from "../../../package.json";
import LoadingModal from "../components/LoadingModal";
import { TaskListData } from "../models/task_list";
import axios from "axios";
import { useGetData } from "../methods/fetch_data";

interface SearchModalProps {
  open: boolean;
  setOpen(value: boolean): void;
  setTaskId(value: number): void;
  setTaskDetailModalOpen(value: boolean): void;
}

const SearchModal: React.FC<SearchModalProps> = (props) => {
  const { open, setOpen, setTaskId, setTaskDetailModalOpen } = props;
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    results: [],
    next: "" as any | null,
  });
  const [pattern, setPattern] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [props]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (pattern) {
        const { data } = await axios.get("/api-task-list/search", {
          params: {
            username: localStorage.getItem("userName"),
            sn: localStorage.getItem("sn"),
            token: localStorage.getItem("token"),
            page,
            subjectId: -1,
            keyword: pattern,
          },
        });
        setData(data);
      } else {
        setData({
          results: [],
          next: null,
        });
      }
      setLoading(false);
    })();
  }, [pattern, page]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ width: "80vw" }} variant="soft">
        <Input
          placeholder="搜索所有任务…"
          variant="outlined"
          startDecorator={<SearchRounded />}
          endDecorator={loading ? <CircularProgress size="sm" /> : <></>}
          sx={{ marginBottom: 2 }}
          onChange={(event: any) => {
            setPattern(event.target.value);
          }}
        />
        <Divider />
        {data.results.length > 0 ? (
          <List sx={{ overflow: "auto", marginLeft: -2, marginRight: -2 }}>
            <RenderTasks
              key="searchModalTasksRenderer"
              data={data.results}
              setTaskId={setTaskId}
              setTaskDetailModalOpen={setTaskDetailModalOpen}
            />
          </List>
        ) : (
          <EmptyContent />
        )}
        <Divider />
        <Box
          sx={{
            marginTop: 2,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            disabled={page == 1}
            color={page == 1 ? "primary" : "primary"}
            variant="plain"
            size="sm"
            startDecorator={<ArrowBackIosNewRounded fontSize="small" />}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            上一页
          </Button>
          <Typography
            sx={{ fontWeight: "md", color: "text.secondary" }}
          >{`第 ${page} 页`}</Typography>
          <Button
            disabled={!data.next}
            size="sm"
            color={!data.next ? "primary" : "primary"}
            variant="plain"
            endDecorator={<ArrowForwardIosRounded fontSize="small" />}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            下一页
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

interface InfoModalProps {
  open: boolean;
  setOpen(value: boolean): void;
}

const InfoModal = React.memo<InfoModalProps>((props) => {
  const { open, setOpen } = props;
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ width: "80vw" }}>
        <Typography component="h2" startDecorator={<InfoOutlined />}>
          关于 Kunter {config.version}
        </Typography>
        <ModalClose />
        <List
          sx={{
            overflow: "auto",
            marginLeft: -2,
            marginRight: -2,
            marginTop: 1,
            marginBottom: -2,
          }}
        >
          <ListItem nested key="short-description">
            <ListSubheader sticky sx={{ backgroundColor: "transparent" }}>
              应用简介
            </ListSubheader>
            <List>
              <ListItem>
                <Alert variant="outlined" color="primary" sx={{ padding: 1 }}>
                  <Typography>
                    你说得对，但是
                    <Typography color="primary">《Kunter》</Typography>
                    是一款由{" "}
                    <Link
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                      href="https://reqwey.me"
                    >
                      Reqwey
                    </Link>{" "}
                    自主研发的一款在线开放第三方敏特客户端。
                    您可以查看、搜索任务、下载文件、查看题目解析、收看码课视频课程和完成内置丰富试卷。
                  </Typography>
                </Alert>
              </ListItem>
            </List>
          </ListItem>
          <ListItem nested key="notice">
            <ListSubheader sticky sx={{ backgroundColor: "transparent" }}>
              注意事项
            </ListSubheader>
            <List>
              <ListItem>
                <Alert variant="soft" color="danger" sx={{ padding: 1 }}>
                  <div>
                    <Typography color="danger" fontWeight="lg">
                      请勿向他人推荐此应用程序。
                    </Typography>
                    <Typography color="danger" level="body-md">
                      该软件使用了辅立码课官方的应用程序接口
                      (API)。如果此软件被滥用，将可能引起辅立码课官方的注意，最终可能导致无法使用本软件。
                    </Typography>
                  </div>
                </Alert>
              </ListItem>
              <ListItem>
                <Alert variant="soft" color="danger" sx={{ padding: 1 }}>
                  <div>
                    <Typography color="danger" fontWeight="lg">
                      请不要不经过思考就点开未完成的任务。
                    </Typography>
                    <Typography color="danger" level="body-md">
                      该软件可以查看任何任务的答案与解析（包括未完成的）。如果您这样做了，这可能是对自己的不负责任。
                    </Typography>
                  </div>
                </Alert>
              </ListItem>
            </List>
          </ListItem>
          <ListItem nested key="credits">
            <ListSubheader sticky sx={{ backgroundColor: "transparent" }}>
              鸣谢
            </ListSubheader>
            <List>
              <ListItem>
                <Typography fontWeight="lg">
                  本软件使用了以下优秀的开源库：
                </Typography>
              </ListItem>
              <ListItem>
                <Alert variant="soft" color="primary">
                  <Typography>
                    <Link
                      variant="solid"
                      color="primary"
                      href="https://electron-vite.github.io/"
                    >
                      Electron Vite
                    </Link>{" "}
                    这是本软件的基本框架，使用 Electron + Vite + React
                    搭建功能强大的 App。
                  </Typography>
                </Alert>
              </ListItem>
              <ListItem>
                <Alert variant="soft" color="primary">
                  <Typography>
                    <Link
                      variant="solid"
                      color="primary"
                      href="https://mui.com/"
                    >
                      MUI Core
                    </Link>{" "}
                    这是本软件的 UI 框架。其中，
                    <Link
                      variant="outlined"
                      color="primary"
                      href="https://https://mui.com/joy-ui/getting-started/overview/"
                      sx={{ fontSize: "sm" }}
                    >
                      Joy UI
                    </Link>{" "}
                    是一套精美的 React UI
                    库，含有高度自定义的配置方案和精美的组件，以及原生的黑暗模式。
                    <Link
                      variant="outlined"
                      color="primary"
                      href="https://mui.com/material-ui/material-icons/"
                      sx={{ fontSize: "sm" }}
                    >
                      Material Icons
                    </Link>{" "}
                    是一套有多种样式的矢量图标库。
                  </Typography>
                </Alert>
              </ListItem>
              <ListItem>
                <Alert variant="soft" color="primary">
                  <Typography>
                    <Link
                      variant="solid"
                      color="primary"
                      href="https://axios-http.com"
                    >
                      Axios
                    </Link>{" "}
                    可用于 Node.JS 和前端的 HTTP
                    连接组件。操作简单，功能强大，有很多自定义选项。在 Node.JS
                    上运行时可以很方便地抓取 Cookie 等登录信息并储存。
                  </Typography>
                </Alert>
              </ListItem>
            </List>
          </ListItem>
        </List>
      </ModalDialog>
    </Modal>
  );
});

export default function Dashboard() {
  const navigate = useNavigate();
  const getData = useGetData();
  const [loading, setLoading] = useState(false);
  const [subjectId, setSubjectId] = useState(-1);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [category, setCategory] = useState<string>("unfinished");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TaskListData>();

  useEffect(() => {
    setPage(1);
  }, [subjectId, category]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { response, error } = await getData(`/api-task-list/${category}`, {
        params: {
          username: localStorage.getItem("userName"),
          sn: localStorage.getItem("sn"),
          token: localStorage.getItem("token"),
          page,
          subjectId,
          keyword: "",
        },
      });
      if (!error) {
        setData(response);
      } else {
        setSnackContent(error as string);
        setSnackOpen(true);
      }
      setLoading(false);
    })();
  }, [category, page, subjectId]);

  const leftMinWidth = 200,
    rightMinWidth = 200;
  const [leftWidth, setLeftWidth] = useState(300); // 初始左侧栏宽度
  const [isDragging, setIsDragging] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackContent, setSnackContent] = useState("");

  const startDragging = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      event.preventDefault();
    },
    []
  );

  const onDrag = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        // 计算新的宽度
        const newWidth = event.clientX;
        if (
          newWidth >= leftMinWidth &&
          newWidth <= window.innerWidth - rightMinWidth
        ) {
          setLeftWidth(newWidth);
        }
      }
    },
    [isDragging, leftMinWidth, rightMinWidth]
  );

  const stopDragging = useCallback(() => {
    // 使用 onMouseUp 事件结束拖动
    setIsDragging(false);
  }, []);

  const startTouchDrag = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      setIsDragging(true);
      event.preventDefault();
    },
    []
  );

  const onTouchDrag = useCallback(
    (event: TouchEvent) => {
      if (isDragging && event.touches.length > 0) {
        // 计算新的宽度
        const newWidth = event.touches[0].clientX;
        if (
          newWidth >= leftMinWidth &&
          newWidth <= window.innerWidth - rightMinWidth
        ) {
          setLeftWidth(newWidth);
        }
      }
    },
    [isDragging, leftMinWidth, rightMinWidth]
  );

  useEffect(() => {
    // 监听 mousemove 和 mouseup 事件
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", onTouchDrag, {
      passive: false,
    });
    window.addEventListener("touchend", stopDragging);

    return () => {
      // 移除监听
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", onTouchDrag);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [onDrag, stopDragging, onTouchDrag]);

  return (
    <>
      <Snackbar
        variant="soft"
        color="danger"
        autoHideDuration={5000}
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        startDecorator={<Report fontSize="large" />}
      >
        <div>
          <Typography level="title-lg">获取数据失败</Typography>
          <Typography sx={{ mt: 1, mb: 2 }}>{snackContent}</Typography>
        </div>
      </Snackbar>
      <LoadingModal loading={loading} />
      <SearchModal
        open={searchModalOpen}
        setOpen={setSearchModalOpen}
        setTaskId={setTaskId}
        setTaskDetailModalOpen={setTaskDetailModalOpen}
      />
      <InfoModal open={infoModalOpen} setOpen={setInfoModalOpen} />
      <TaskDetailModal
        taskId={taskId}
        open={taskDetailModalOpen}
        setOpen={setTaskDetailModalOpen}
      />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "row",
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: leftWidth, marginRight: "-7.5px" }}>
          <Sheet sx={{ height: "100vh", overflow: "auto" }} variant="soft">
            <Sheet
              sx={{
                display: "flex",
                gap: 1,
                p: 2.5,
              }}
              variant="plain"
            >
              <Avatar size="lg" color="primary" />
              <div>
                <Typography level="title-lg">
                  {localStorage.getItem("displayName")}
                </Typography>
                <Typography level="body-sm">
                  {localStorage.getItem("userName")}
                </Typography>
              </div>
            </Sheet>
            <Divider />
            <Box
              sx={{
                margin: "10px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton
                variant="plain"
                color="danger"
                onClick={() => {
                  navigate("/", { replace: true });
                }}
              >
                <Logout />
              </IconButton>
              <IconButton
                variant="plain"
                color="warning"
                onClick={() => {
                  navigate("/courses", { replace: false });
                }}
              >
                <LightbulbOutlined />
              </IconButton>
              <IconButton
                variant="plain"
                color="primary"
                onClick={() => {
                  setInfoModalOpen(true);
                }}
              >
                <InfoOutlined />
              </IconButton>
              <ColorSchemeToggle />
            </Box>
            <Box sx={{ width: "100%", padding: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: "20px",
                  width: "100%",
                  backgroundColor: "primary.outlinedHoverBg",
                  fontWeight: "normal",
                }}
                startDecorator={<SearchRounded />}
                onClick={() => setSearchModalOpen(true)}
              >
                搜索
              </Button>
            </Box>
            <List>
              <SubjectList subjectId={subjectId} setSubjectId={setSubjectId} />
            </List>
          </Sheet>
        </Box>
        <Box
          onMouseDown={startDragging}
          onTouchStart={startTouchDrag}
          color="primary"
          sx={{
            width: "5px",
            marginX: "5px",
            cursor: "ew-resize",
            backgroundColor: "transparent",
            zIndex: 100, // 确保分隔条位于最上层
            ":hover": {
              backgroundColor: "primary.plainColor",
              ">div": {
                display: "flex",
              },
              // backdropFilter: "blur(10px)",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "15px",
              marginX: "-5px",
              paddingY: "5px",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "primary.plainColor",
              borderRadius: "50%",
            }}
          >
            <DragIndicator
              fontSize="small"
              sx={{
                color: "primary.solidColor",
              }}
            />
          </Box>
        </Box>
        <Box sx={{ flex: 1, marginLeft: "-7.5px", width: "100%" }}>
          {data ? (
            <TaskList
              setTaskId={setTaskId}
              setTaskDetailModalOpen={setTaskDetailModalOpen}
              category={category}
              setCategory={setCategory}
              page={page}
              setPage={setPage}
              data={data}
            />
          ) : (
            <EmptyContent />
          )}
        </Box>
      </Box>
    </>
  );
}

function EmptyContent() {
  return (
    <Sheet
      sx={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
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
