import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import Typography from "@mui/joy/Typography";

import RenderProblem from "../components/RenderProblem";
import LoadingModal from "../components/LoadingModal";

import VideoPlayerModal from "../components/VideoPlayerModal";
import {
  LinkRounded,
  ListAltRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  DialogContent,
  DialogTitle,
  Drawer,
  Link,
  ListItem,
  ModalClose,
  Stack,
  Switch,
} from "@mui/joy";
import { PaperData, ProblemTree } from "../models/paper";
import { AttachmentList } from "../components/CourseModulesDrawer";
import { useNavigate, useParams } from "react-router-dom";
import { getData } from "../methods/fetch_data";
import useSWR from "swr";

export function TaskPaper() {
  const [flattenedQuestions, setFlattenedQuestions] = useState<ProblemTree[]>(
    []
  );
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { paperId } = useParams();

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
      setFlattenedQuestions(
        (data as PaperData).questions
          .map((x) => {
            return x.children ? [x, ...x.children] : x;
          })
          .flat()
      );
    }
  }, [data]);
  return (
    <>
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
            p: 3,
          }}
        >
          <Typography
            id="task-paper-title"
            noWrap={true}
            level="h1"
            sx={{ ml: 2 }}
            endDecorator={
              <Stack
                direction="row"
                height="100%"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Chip size="lg" variant="plain" color="primary">
                  {data.subjectName}
                </Chip>
                <Switch
                  size="lg"
                  color={showAnswer ? "success" : "neutral"}
                  slotProps={{
                    input: { "aria-label": "显示答案" },
                    thumb: {
                      children: showAnswer ? (
                        <VisibilityRounded />
                      ) : (
                        <VisibilityOffRounded />
                      ),
                    },
                  }}
                  checked={showAnswer}
                  onChange={(event) => setShowAnswer(event.target.checked)}
                />
              </Stack>
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
              showAnswer={showAnswer}
              questions={data.questions}
              setVideoOpen={setVideoOpen}
              setVideoUrl={setVideoUrl}
            />
          )}

          <Button
            variant="plain"
            color="primary"
            onClick={() => {
              setDrawerOpen(true);
            }}
            startDecorator={<ListAltRounded />}
            sx={{ position: "fixed", right: 40 }}
          >
            大纲
          </Button>
        </Box>
      )}
    </>
  );
}
