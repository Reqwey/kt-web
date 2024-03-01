import { useEffect, useState } from "react";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import Typography from "@mui/joy/Typography";

import RenderProblem from "../components/RenderProblem";
import LoadingModal from "../components/LoadingModal";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
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
  Switch,
} from "@mui/joy";
import { PaperData, ProblemTree } from "../models/paper";
import { AttachmentList } from "../components/CourseModulesDrawer";
import { useNavigate, useParams } from "react-router-dom";
import { useGetData } from "../methods/fetch_data";

export function TaskPaper() {
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState<PaperData>({} as PaperData);
  const [flattenedQuestions, setFlattenedQuestions] = useState<ProblemTree[]>(
    []
  );
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { paperId } = useParams();
  const navigate = useNavigate();
  const getData = useGetData();

  useEffect(() => {
    (async () => {
      setDataLoading(true);
      if (paperId) {
        const { response, error } = await getData(`/api-paper/${paperId}`, {
          params: {
            username: localStorage.getItem("userName"),
            sn: localStorage.getItem("sn"),
          },
        });
        if (!error && response) {
          console.log(response);
          setData(response as PaperData);
          setFlattenedQuestions(
            (response as PaperData).questions
              .map((x) => {
                return x.children ? [x, ...x.children] : x;
              })
              .flat()
          );
        } else {
          console.log(error);
        }
      }
      setDataLoading(false);
    })();
  }, [paperId]);
  return (
    <>
      <LoadingModal loading={dataLoading} />
      <VideoPlayerModal
        open={videoOpen}
        setOpen={setVideoOpen}
        videoUrl={videoUrl}
      />
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
                  <Chip variant="soft" color="primary" size="sm" sx={{ mx: 1 }}>
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
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          overflow: "auto",
          bgcolor: "neutral.outlinedHoverBg",
        }}
      >
        <Box
          id="app-bar"
          sx={{
            p: 1,
            position: "sticky",
            zIndex: "2",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            top: 0,
            width: "100%",
            bgcolor: "transparent",
            backdropFilter: "blur(5px)",
            boxShadow: "lg",
          }}
        >
          <Button
            variant="plain"
            color="primary"
            startDecorator={<ArrowBackIosNewRoundedIcon />}
            onClick={() => navigate("/dashboard", { replace: true })}
          >
            返回
          </Button>
          <Typography
            id="task-paper-modal-title"
            noWrap={true}
            level="h4"
            endDecorator={
              <>
                <Chip size="md" variant="plain" color="primary">
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
              </>
            }
          >
            {data.name}
          </Typography>
          <Button
            variant="plain"
            color="primary"
            onClick={() => {
              setDrawerOpen(true);
            }}
            startDecorator={<ListAltRounded />}
          >
            大纲
          </Button>
        </Box>
        {data.attachments && data.attachments.length > 0 && (
          <AttachmentList attachments={data.attachments} />
        )}
        {data.questions && data.questions.length > 0 && (
          <RenderProblem
            showAnswer={showAnswer}
            questions={data.questions}
            setVideoOpen={setVideoOpen}
            setVideoUrl={setVideoUrl}
          />
        )}
      </Box>
    </>
  );
}
