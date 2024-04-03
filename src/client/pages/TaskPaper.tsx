import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import ProblemList from "../components/ProblemList";
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
import { PaperTree } from "../models/paper";
import AttachmentList from "../components/AttachmentList";
import { useNavigate, useParams } from "react-router-dom";
import { getData, postData } from "../methods/fetch_data";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import MySuspense from "../components/MySuspense";
import AnswerProvider, { useAnswerMap } from "../components/AnswerProvider";

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

function PreviewListItem({
  question,
  showProper,
}: {
  question: PaperTree;
  showProper: boolean;
}) {
  const answerMap = useAnswerMap();

  return (
    <ListItem key={question.id} sx={{ mx: 0, px: 0 }}>
      <ListItemButton
        component="a"
        variant="outlined"
        color="neutral"
        href={"#" + question.id}
        sx={{
          width: "100%",
          px: 1,
          py: 0.5,
          borderRadius: "md",
          m: 0,
          boxShadow: "sm",
          bgcolor: "background.body",
        }}
      >
        {!!question.no && <ListItemDecorator>{question.no}</ListItemDecorator>}
        <ListItemContent>
          <Stack
            direction="column"
            width="100%"
            justifyContent="center"
            spacing={1}
          >
            <Stack direction="row" width="100%" justifyContent="space-between">
              <Chip variant="soft" color="primary" size="sm">
                {`${question.subjectQuestionTypeName || question.modelName} ${
                  question.score
                }分`}
              </Chip>
              {!!answerMap[question.id] && (
                <Typography
                  variant="solid"
                  color="primary"
                  level="body-sm"
                  sx={{ borderRadius: "sm", px: 1 }}
                >
                  {answerMap[question.id].split(":").join("")}
                </Typography>
              )}
              {showProper && question.proper && (
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
              <List>
                {question.children.map((child) => (
                  <PreviewListItem question={child} showProper={showProper} />
                ))}
              </List>
            )}
          </Stack>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}

const PreviewList = memo(
  ({
    questions,
    showProper,
  }: {
    questions: PaperTree[];
    showProper: boolean;
  }) => {
    return (
      <List sx={{ mx: 0, px: 0 }}>
        {questions.map((question) => (
          <PreviewListItem
            key={question.id}
            question={question}
            showProper={showProper}
          />
        ))}
      </List>
    );
  }
);

export default function TaskPaper() {
  const { taskId, paperId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<PaperTree[]>([]);
  const [showProper, setShowProper] = useState(false);
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
  const [answerMap, setAnswerMap] = useState<any>(new Object());

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
    setAnswerMap((answerMap: any) => {
      const newAnswerMap = { ...answerMap };
      let newAnswer = answer;

      if (isMultiSelect) {
        const previousAnswer = answerMap[id];
        if (previousAnswer) {
          let answerArray = previousAnswer.toString().split(":");
          if (answerArray.includes(answer))
            answerArray = answerArray.filter((x: string) => x !== answer);
          else answerArray = [...answerArray, answer].sort();
          newAnswer = answerArray.join(":");
        }
      }

      if (newAnswer) newAnswerMap[id] = newAnswer;
      else newAnswerMap[id] = undefined;
      return newAnswerMap;
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
                answer: answerMap[y.id],
              };
            }),
          };
        } else {
          return {
            ...tmp,
            answer: answerMap[x.id],
          };
        }
      });

      const response = await trigger({
        taskId,
        paperId,
        answer: allAnswer,
        client_time: new Date().toISOString(),
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
  }, [answerMap, questions]);

  const handleCheck = () => {
    if (
      Object.keys(answerMap).length < data.summary.totalCount &&
      confirmModalOpen
    ) {
      setConfirmModalOpen(true);
    } else {
      handleSubmit();
    }
  };

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
          width: "100vw",
          height: "100vh",
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
                      <AnswerProvider
                        answerMap={answerMap}
                        changeAnswer={handleAnswerChange}
                      >
                        <ProblemList
                          showProper={showProper}
                          questions={questions}
                        />
                      </AnswerProvider>
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
                    <Typography level="title-md" color="primary">
                      {`${Object.keys(answerMap).length}/${
                        data.summary.totalCount
                      }`}
                    </Typography>

                    <Button
                      size="sm"
                      fullWidth
                      onClick={handleCheck}
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
                  <AnswerProvider
                    answerMap={answerMap}
                    changeAnswer={handleAnswerChange}
                  >
                    <PreviewList
                      questions={questions}
                      showProper={showProper}
                    />
                  </AnswerProvider>
                </Grid>
              </>
            )}
          </Grid>
        </MySuspense>
      </Box>
    </>
  );
}
