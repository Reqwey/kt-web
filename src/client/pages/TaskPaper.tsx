import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import RenderProblem from "../components/RenderProblem";
import LoadingModal from "../components/LoadingModal";
import VideoPlayerModal from "../components/VideoPlayerModal";
import {
  FormatListBulletedRounded,
  LinkRounded,
  VisibilityOffRounded,
  VisibilityRounded,
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
} from "@mui/joy";
import { Answer, AnswerData, PaperData, ProblemTree } from "../models/paper";
import { AttachmentList } from "../components/CourseModulesDrawer";
import { useParams } from "react-router-dom";
import { getData, postData } from "../methods/fetch_data";
import useSWR, { SWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export function TaskPaper() {
  const { taskId, paperId } = useParams();

  const [flattenedQuestions, setFlattenedQuestions] = useState<ProblemTree[]>(
    []
  );
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProper, setShowProper] = useState(false);
  const [answerData, setAnswerData] = useState<AnswerData>({
    client_time: new Date().toISOString(),
    duration: 0,
    answer: [],
    photo: null,
    vocabularySchedule: null,
  });

  const timeRef = useRef(0);

  const { data, error, isLoading } = useSWR(`/api-paper/${paperId}`, (url) =>
    getData(url, {
      params: {
        username: localStorage.getItem("userName"),
        sn: localStorage.getItem("sn"),
      },
    })
  );

  useEffect(() => {
    if (data) {
      timeRef.current = new Date().getTime() / 1000;
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

  const handleAnswerChange = useCallback(
    (id: number, no: string, answer: string, isMultiSelect: boolean) => {
      let newAnswer: Answer = { id, no, answer };
      if (isMultiSelect) {
        const previousAnswer = answerData.answer.filter((x) => x.id === id)[0];
        if (previousAnswer) {
          let answerArray = previousAnswer.answer.split(":");
          if (answerArray.includes(answer))
            answerArray = answerArray.filter((x) => x !== answer);
          else answerArray = [...answerArray, answer].sort();
          newAnswer.answer = answerArray.join(":");
        }
      }
      setAnswerData({
        ...answerData,
        answer: newAnswer.answer
          ? [...answerData.answer.filter((x) => x.id !== id), newAnswer]
          : answerData.answer.filter((x) => x.id !== id),
      });
    },
    [answerData]
  );

  const handleSubmit = useCallback(async () => {
    try {
      let allAnswer = flattenedQuestions
        .filter((x) => x.model !== 3)
        .map((x) => {
          return {
            id: x.id,
            no: x.no,
            answer: answerData.answer
              .filter((y) => y.id === x.id)
              .map((z) => z.answer)[0],
          };
        });
      console.log(allAnswer);
      await trigger({
        taskId,
        paperId,
        ...answerData,
        answer: allAnswer,
        duration: new Date().getTime() / 1000 - timeRef.current,
        username: localStorage.getItem("userName"),
        sn: localStorage.getItem("sn"),
        token: localStorage.getItem("token"),
      });
      console.log("Submitted successfully");
    } catch (err) {
      console.log(err);
    }
  }, [answerData, flattenedQuestions]);

  return (
    <SWRConfig value={{ refreshInterval: 0 }}>
      <Helmet>
        <title>
          {`${
            isLoading || !data.name ? "Loading..." : data.name
          } | Kunter Online`}
        </title>
      </Helmet>
      <LoadingModal loading={isLoading} />
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
              {data.apiSummary}
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
      {!isLoading && (
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            width: "100%",
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
          {data.questions && data.questions.length > 0 && (
            <RenderProblem
              showProper={showProper}
              questions={data.questions}
              answers={answerData.answer}
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
              spacing={2}
            >
              {data.questions && (
                <Typography
                  level="h3"
                  color="primary"
                  fontSize="lg"
                  sx={{ pl: 1 }}
                >
                  {answerData.answer.length} / {data.questions.length}
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
            <Button fullWidth onClick={handleSubmit} loading={isMutating}>
              提交
            </Button>
          </Sheet>
        </Box>
      )}
    </SWRConfig>
  );
}
