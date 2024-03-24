import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import PaperProblem from "../components/PaperProblem";
import {
  InfoRounded,
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
  List,
  ListItem,
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
  Grid,
  ListItemButton,
  ListItemDecorator,
  ListItemContent,
} from "@mui/joy";
import { AnswerMap, PaperTree } from "../models/paper";
import AttachmentList from "../components/AttachmentList";
import { useNavigate, useParams } from "react-router-dom";
import { getData, postData } from "../methods/fetch_data";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import MySuspense from "../components/MySuspense";
import { AnswerChangeContext } from "../contexts/AnswerChangeContext";

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

function PreviewList(props: { questions: PaperTree[], showProper: boolean }) {
  return (
    <List>
      {props.questions.map((question) => (
        <ListItem key={question.id} sx={{ mx: 0, px: 0 }}>
          <ListItemButton
            component="a"
            variant="outlined"
            color="neutral"
            href={"#" + question.id}
            sx={{ width: "100%", px: 1, py: 0.5, borderRadius: "md", m: 0, boxShadow: "sm", bgcolor: "background.body" }}
          >
            {!!question.no && (
              <ListItemDecorator>{question.no}</ListItemDecorator>
            )}
            <ListItemContent>
              <Stack
                direction="column"
                width="100%"
                justifyContent="center"
                spacing={1}
              >
                <Stack
                  direction="row"
                  width="100%"
                  justifyContent="space-between"
                >
                  <Chip variant="soft" color="primary" size="sm">
                    {`${question.modelName} ${question.score}分`}
                  </Chip>
                  {question.userAnswer && (
                    <Typography
                      variant="solid"
                      color="primary"
                      level="body-sm"
                      sx={{ borderRadius: "sm", px: 1 }}
                    >
                      {question.userAnswer.split(":").join("")}
                    </Typography>
                  )}
                  {props.showProper && question.proper && (
                    <Typography
                    variant="solid"
                    color="success"
                    level="body-sm"
                    sx={{ borderRadius: "sm", px: 1 }}
                  >
                    {question.proper.split(":").join("")}
                  </Typography>
                  )}
                </Stack>
                {!!question.children && !!question.children.length && (
                  <PreviewList questions={question.children} showProper={props.showProper} />
                )}
              </Stack>
            </ListItemContent>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default function TaskPaper() {
  const { taskId, paperId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<PaperTree[]>([]);
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

  const { data, error, isLoading } = useSWR(
    `/api-paper/${paperId}`,
    (url) =>
      getData(url, {
        params: {
          username: localStorage.getItem("userName"),
          sn: localStorage.getItem("sn"),
        },
      }),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (data) {
      setQuestions(data.questions);
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
      if (!questions || !paperId) throw new Error("请等待题面加载完毕");

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
          (1000 * 60)
        ).toFixed(3),
        photo: null,
        vocabularySchedule: null,
        username: localStorage.getItem("userName"),
        sn: localStorage.getItem("sn"),
        token: localStorage.getItem("token"),
      });
      if (response.success) {
        console.log(response);
        setSnackbarColor("success");
        if (response.id) {
          setSnackbarMessage("提交成功！正在跳转");
          navigate(`/exercise/${response.id}?name=${data.name}`);
        } else {
          setSnackbarMessage("提交成功！请在任务列表查看");
        }
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
      <Box
        sx={{
          overflow: "hidden",
          width: "100dvw",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MySuspense loading={isLoading}>
          <Grid
            container
            spacing={0}
            sx={{
              overflow: "hidden",
              height: "100%",
              width: "100%",
              flexGrow: 1,
            }}
          >
            {!!data && (
              <>
                <Grid xs height="100%">
                  <Sheet
                    sx={{
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                      display: "flex",
                      flexDirection: "column",
                      p: 2,
                    }}
                    variant="soft"
                  >
                    <Typography
                      level="h1"
                      endDecorator={
                        <Chip size="lg" variant="plain" color="primary">
                          {data.subjectName}
                        </Chip>
                      }
                    >
                      {data.name}
                    </Typography>
                    {!!data.attachments && data.attachments.length > 0 && (
                      <Box px={2}>
                        <AttachmentList attachments={data.attachments} />
                      </Box>
                    )}
                    {!!questions && questions.length > 0 && (
                      <AnswerChangeContext.Provider value={handleAnswerChange}>
                        <List>
                          {questions.map((item) => (
                            <PaperProblem
                              key={item.id}
                              showProper={showProper}
                              question={item}
                            />
                          ))}
                        </List>
                      </AnswerChangeContext.Provider>
                    )}
                  </Sheet>
                </Grid>
                <Grid
                  sm={4}
                  md={3}
                  height="100%"
                  sx={{ px: 2, overflow: "auto" }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={3}
                    py={1}
                    mx={-2}
                    mb={1}
                    px={2}
                    position="sticky"
                    top={0}
                    zIndex={1000}
                    bgcolor="background.body"
                    boxShadow="md"
                  >
                    {data.questions && (
                      <Typography level="title-md" color="primary">
                        {`${answerCount}/${data.summary.totalCount}`}
                      </Typography>
                    )}

                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => {
                        if (answerCount === data.summary.totalCount)
                          handleSubmit();
                        else setConfirmModalOpen(true);
                      }}
                      loading={isMutating}
                    >
                      提交
                    </Button>

                    <Switch
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
                  </Stack>
                  <Alert variant="soft" color="primary">
                    {data.apiSummary}
                  </Alert>
                  <PreviewList questions={questions} showProper={showProper} />
                </Grid>
              </>
            )}
          </Grid>
        </MySuspense>
      </Box>
    </>
  );
}
