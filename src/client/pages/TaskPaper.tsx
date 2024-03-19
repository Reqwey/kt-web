import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import PaperProblem from "../components/PaperProblem";
import LoadingModal from "../components/LoadingModal";
import VideoPlayerModal from "../components/VideoPlayerModal";
import {
  FormatListBulletedRounded,
  InfoRounded,
  LinkRounded,
  VisibilityOffRounded,
  VisibilityRounded,
  WarningRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ModalClose,
  Typography,
  Sheet,
  Stack,
  Switch,
  Button,
  Snackbar,
  DialogActions,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { AnswerMap, PaperData, PaperTree } from "../models/paper";
import { AttachmentList } from "../components/CourseModulesDrawer";
import { useNavigate, useParams } from "react-router-dom";
import { getData, postData } from "../methods/fetch_data";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

interface ConfirmModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSubmit: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  setOpen,
  handleSubmit,
}) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{ borderRadius: "lg" }}
      >
        <DialogTitle>
          <WarningRounded />
          请注意
        </DialogTitle>
        <Divider />
        <DialogContent>您还有未完成的题目，确认提交吗？</DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              handleSubmit();
              setOpen(false);
            }}
          >
            确认
          </Button>
          <Button
            autoFocus
            variant="plain"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            点错了
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default function TaskPaper() {
  const { taskId, paperId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<PaperTree[]>([]);
  const [flattenedQuestions, setFlattenedQuestions] = useState<PaperTree[]>([]);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProper, setShowProper] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  // const [answerData, setAnswerData] = useState<AnswerData>({
  //   client_time: new Date().toISOString(),
  //   duration: 0,
  //   answer: [],

  // });
  const [snackbarColor, setSnackbarColor] = useState<"danger" | "success">(
    "danger"
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const timeRef = useRef<Date>(new Date());
  const answerMap = useRef<AnswerMap>(new Map<number, string>());

  const { data, error, isLoading } = useSWR(`/api-paper/${paperId}`, (url) =>
    getData(url, {
      params: {
        username: localStorage.getItem("userName"),
        sn: localStorage.getItem("sn"),
      },
    }),
    {revalidateOnFocus: false}
  );

  useEffect(() => {
    if (data) {
      setQuestions(data.questions);
      setFlattenedQuestions(
        (data as PaperData).questions
          .map((x) => {
            return x.children ? [x, ...x.children] : x;
          })
          .flat()
      );
    }
  }, [data]);

  const { trigger, isMutating } = useSWRMutation("/api-check-paper", postData);

  const handleAnswerChange = (
    id: number,
    answer: string,
    isMultiSelect: boolean
  ) => {
    setQuestions((prevQuestions) => {
      let newAnswer = answer,
        newQuestions = [...prevQuestions];

      if (isMultiSelect) {
        const previousAnswer = answerMap.current.get(id);
        if (previousAnswer) {
          let answerArray = previousAnswer.split(":");
          if (answerArray.includes(answer))
            answerArray = answerArray.filter((x) => x !== answer);
          else answerArray = [...answerArray, answer].sort();
          newAnswer = answerArray.join(":");
        }
        console.log(newAnswer);
      }

      if (newAnswer) answerMap.current.set(id, newAnswer);
      else answerMap.current.delete(id);
      setAnswerCount(answerMap.current.size);

      loop: for (let q of newQuestions) {
        if (q.id === id) {
          q.userAnswer = newAnswer;
          break loop;
        } else if (q.children && q.children.length) {
          for (let c of q.children) {
            if (c.id === id) {
              c.userAnswer = newAnswer;
              break loop;
            }
          }
        }
      }

      return newQuestions;
    });
  };

  const handleSubmit = useCallback(async () => {
    try {
      if (!questions || !taskId || !paperId)
        throw new Error("请等待题面加载完毕");

      let allAnswer = questions.map((x) => {
        const tmp = { id: x.id, no: x.no || "--" };
        if (x.children && x.children.length) {
          return {
            ...tmp,
            children: x.children.map((y) => {
              return {
                id: y.id,
                no: y.no,
                answer: y.userAnswer,
              };
            }),
          };
        } else {
          return {
            ...tmp,
            answer: x.userAnswer,
          };
        }
      });

      const response = await trigger({
        taskId,
        paperId,
        answer: allAnswer,
        client_time: timeRef.current?.toISOString(),
        duration: (
          (new Date().getTime() - timeRef.current?.getTime()) /
          1000
        ).toFixed(3),
        photo: null,
        vocabularySchedule: null,
        username: localStorage.getItem("userName"),
        sn: localStorage.getItem("sn"),
        token: localStorage.getItem("token"),
      });
      if (response.success) {
        setSnackbarColor("success");
        setSnackbarMessage("提交成功！正在跳转");
        navigate(`/exercise/${response.id}?name=${data.name}`);
        setSnackbarOpen(true);
      } else {
        setSnackbarColor("danger");
        setSnackbarMessage(response.reason as string);
        setSnackbarOpen(true);
      }
    } catch (err: any) {
      console.log(err);
      setSnackbarColor("danger");
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  }, [questions]);

  return (
    <>
      <Helmet>
        <title>
          {`${isLoading || !data ? "Loading..." : data.name} | Kunter Online`}
        </title>
      </Helmet>
      <LoadingModal loading={isLoading} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        color={snackbarColor}
        variant="soft"
        startDecorator={
          snackbarColor === "success" ? <InfoRounded /> : <WarningRounded />
        }
      >
        {snackbarMessage}
      </Snackbar>
      <ConfirmModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        handleSubmit={handleSubmit}
      />
      <VideoPlayerModal
        open={videoOpen}
        setOpen={setVideoOpen}
        videoUrl={videoUrl}
      />
      {!isLoading && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <ModalClose onClick={() => setDrawerOpen(false)} />
          <DialogTitle>题目大纲</DialogTitle>
          <DialogContent sx={{ p: 1 }}>
            <Alert variant="soft" color="primary" sx={{ p: 1 }}>
              {!!data && data.apiSummary}
            </Alert>
            <List>
              {flattenedQuestions.map((question) => (
                <ListItem key={question.id}>
                  <Link
                    key={question.id}
                    variant="outlined"
                    color="neutral"
                    href={"#" + question.id}
                    underline="none"
                    startDecorator={<LinkRounded sx={{ fontSize: "18px" }} />}
                    sx={{ width: "100%", p: 1, borderRadius: "md" }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {question.no
                      ? question.no
                      : question.children[0].no +
                        "~" +
                        question.children[question.children.length - 1].no}
                    .
                    <Chip
                      variant="soft"
                      color="primary"
                      size="sm"
                      sx={{ mx: 1 }}
                    >
                      {question.modelName}
                    </Chip>
                    <Chip variant="soft" color="primary" size="sm">
                      {question.score + " 分"}
                    </Chip>
                  </Link>
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Drawer>
      )}
      {!isLoading && data && (
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            width: "100%",
            minHeight: "100dvh",
            overflow: "auto",
            bgcolor: "neutral.outlinedHoverBg",
            p: 1,
          }}
        >
          <Typography
            id="task-paper-title"
            noWrap={true}
            level="h1"
            sx={{ ml: 2, my: 2 }}
            endDecorator={
              <Chip size="lg" variant="plain" color="primary">
                {data.subjectName}
              </Chip>
            }
          >
            {data.name}
          </Typography>
          {data.attachments && data.attachments.length > 0 && (
            <Box px={2}>
              <AttachmentList attachments={data.attachments} />
            </Box>
          )}
          {questions && questions.length > 0 && (
            <PaperProblem
              showProper={showProper}
              questions={questions}
              handleAnswerChange={handleAnswerChange}
              setVideoOpen={setVideoOpen}
              setVideoUrl={setVideoUrl}
            />
          )}
          <Sheet
            variant="outlined"
            sx={{
              boxShadow: "lg",
              borderRadius: "lg",
              position: "fixed",
              right: 20,
              backgroundColor: "transparent",
              backdropFilter: "blur(10px)",
              p: 1,
              zIndex: 1000,
            }}
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={3}
            >
              {data.questions && (
                <Typography
                  level="h3"
                  color="primary"
                  fontSize="lg"
                  sx={{ pl: 1 }}
                >
                  {`${answerCount} / ${
                    flattenedQuestions.filter((x) => x.model !== 3).length
                  }`}
                </Typography>
              )}
              <Switch
                size="lg"
                color={showProper ? "success" : "neutral"}
                slotProps={{
                  input: { "aria-label": "显示答案" },
                  thumb: {
                    children: showProper ? (
                      <VisibilityRounded />
                    ) : (
                      <VisibilityOffRounded />
                    ),
                  },
                }}
                checked={showProper}
                onChange={(event) => setShowProper(event.target.checked)}
              />
              <IconButton
                size="lg"
                onClick={() => {
                  setDrawerOpen(true);
                }}
              >
                <FormatListBulletedRounded />
              </IconButton>
            </Stack>
            <Button
              fullWidth
              size="lg"
              onClick={() => {
                if (
                  answerCount ===
                  flattenedQuestions.filter((x) => x.model !== 3).length
                )
                  handleSubmit();
                else setConfirmModalOpen(true);
              }}
              loading={isMutating}
            >
              提交任务
            </Button>
          </Sheet>
        </Box>
      )}
    </>
  );
}
