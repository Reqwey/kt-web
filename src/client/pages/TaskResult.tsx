import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  AddLocationAltTwoTone,
  Done,
  PlayArrowRounded,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  List,
  ListItem,
  Typography,
  Sheet,
  Stack,
  Divider,
  Grid,
  Card,
  ListItemButton,
  ListItemDecorator,
  ListItemContent,
  AspectRatio,
  CardContent,
  CardCover,
} from "@mui/joy";
import { useLocation, useParams } from "react-router-dom";
import { getData } from "../methods/fetch_data";
import useSWR from "swr";
import MySuspense from "../components/MySuspense";
import { Exercise, Question, ResultData } from "../models/result";
import { splitTime } from "../models/task_list";
import { useVideoPlayer } from "../components/VideoPlayerProvider";

const getTaskResult = async (url: string) => {
  const res: ResultData = await getData(url, {
    params: {
      username: localStorage.getItem("userName"),
      sn: localStorage.getItem("sn"),
      token: localStorage.getItem("token"),
    },
  });
  return res;
};

export default function TaskResult() {
  const { exerciseId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const taskName = searchParams.get("name") || "无标题";

  const { data, isLoading, error } = useSWR(
    `/api-exercise/${exerciseId}`,
    getTaskResult,
    { revalidateOnFocus: false }
  );

  const [flattenedExercises, setFlattenedExercises] = useState<Exercise[]>();
  const [selectedId, setSelectedId] = useState<number>();
  const [exercise, setExercise] = useState<Exercise>();
  const [parent, setParent] = useState<Question>();

  const setVideoUrl = useVideoPlayer();

  useEffect(() => {
    if (data) {
      console.log(data);
      setFlattenedExercises(
        data.exercises
          .map((x) => (x.children && x.children.length ? [...x.children] : x))
          .flat()
      );
    }
  }, [data]);

  useEffect(() => {
    if (flattenedExercises && flattenedExercises.length) {
      setSelectedId(flattenedExercises[0].id);
    }
  }, [flattenedExercises]);

  useEffect(() => {
    if (selectedId && flattenedExercises) {
      setExercise(flattenedExercises.filter((x) => x.id === selectedId)[0]);
    }
  }, [selectedId, flattenedExercises]);

  useEffect(() => {
    if (data && exercise && exercise.question.parentId) {
      setParent(
        data.exercises.filter(
          (x) => x.question.id === exercise.question.parentId
        )[0].question
      );
    }
  }, [data, exercise]);

  return (
    <>
      <Helmet>
        <title>
          {`${isLoading || !data ? "Loading..." : taskName} | Kunter Online`}
        </title>
      </Helmet>
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
              backgroundColor: "background.level1",
            }}
          >
            <Grid xs={3} height="100%" sx={{ px: 2, overflow: "auto" }}>
              <Typography level="title-lg" sx={{ my: 1.5 }}>
                {taskName}
              </Typography>
              {data && data.markAt && (
                <Typography
                  sx={{ mb: 1.5 }}
                  level="body-xs"
                  startDecorator={<Done />}
                >
                  批改时间: {splitTime(data.markAt)}
                </Typography>
              )}
              {data && (
                <Stack
                  direction="row"
                  width="100%"
                  divider={<Divider orientation="vertical" />}
                  spacing={2}
                  justifyContent="center"
                >
                  <Box width="100%">
                    <Typography level="body-xs">得分</Typography>
                    <Typography
                      fontSize="xl4"
                      lineHeight={1}
                      endDecorator={
                        <Typography level="body-md">
                          / {data.summary.totalScore}
                        </Typography>
                      }
                    >
                      {data.score}
                    </Typography>
                    <Typography level="body-xs">
                      班级平均 {data.statis.avgScore}
                    </Typography>
                  </Box>
                  <Box width="100%">
                    <Typography level="body-xs">得分率</Typography>
                    <Typography fontSize="xl4" lineHeight={1}>
                      {data.correctPercent + "%"}
                    </Typography>
                    <Typography level="body-xs">
                      班级平均 {data.statis.avgCorrectPercent}%
                    </Typography>
                  </Box>
                </Stack>
              )}
              {flattenedExercises && (
                <List>
                  {flattenedExercises.map((item) => (
                    <ListItem key={item.id} sx={{ my: 0.5 }}>
                      <ListItemButton
                        variant="outlined"
                        color={
                          ["neutral", "success", "danger", "danger"][
                            item.result
                          ] as any
                        }
                        selected={selectedId === item.id}
                        onClick={() => setSelectedId(item.id)}
                        sx={{ borderRadius: "sm" }}
                      >
                        <ListItemDecorator>
                          {item.question.no}
                        </ListItemDecorator>
                        <ListItemContent>
                          <Stack
                            direction="row"
                            width="100%"
                            justifyContent="space-between"
                          >
                            <Box>
                              {item.question.subjectQuestionTypeName ||
                                item.question.modelName}
                            </Box>
                            <Box>
                              {item.answer
                                ? item.answer.split(":").join("")
                                : item.result === 0
                                ? "未阅"
                                : `${item.score}分`}
                            </Box>
                          </Stack>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
            <Grid xs height="100%">
              {data && exercise && (
                <Sheet
                  sx={{
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                  }}
                  variant="plain"
                >
                  {parent && (
                    <Box
                      className="KtContent"
                      sx={{
                        width: "100%",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: parent.content,
                      }}
                    />
                  )}
                  <Typography
                    id={exercise.question.id.toString()}
                    mb={2}
                    component="h4"
                  >
                    {exercise.question.no + "."}
                    <Chip
                      variant="soft"
                      color="primary"
                      size="sm"
                      sx={{ ml: 1 }}
                    >
                      {exercise.question.score + " 分"}
                    </Chip>
                    {exercise.question.source ? (
                      <Typography
                        sx={{ marginLeft: 1 }}
                        color="neutral"
                        startDecorator={
                          <AddLocationAltTwoTone color="primary" />
                        }
                      >
                        {exercise.question.source}
                      </Typography>
                    ) : (
                      <></>
                    )}
                    <Chip
                      variant="soft"
                      color="primary"
                      size="sm"
                      sx={{ ml: 1 }}
                    >
                      {exercise.question.subjectQuestionTypeName ||
                        exercise.question.modelName}
                    </Chip>
                  </Typography>

                  <Box
                    className="KtContent"
                    sx={{
                      width: "100%",
                      wordBreak: "break-all",
                      overflowWrap: "break-word",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: exercise.question.content,
                    }}
                  />
                  {exercise.question.model <= 1 &&
                    exercise.question.answers && (
                      <List
                        sx={{
                          width: "100%",
                        }}
                      >
                        {exercise.question.answers.map((choice) => (
                          <ListItem
                            key={`${exercise.question.no}-${choice.answer}`}
                            sx={{ py: 0.25 }}
                          >
                            <ListItemButton
                              selected={(
                                exercise.question.proper +
                                ":" +
                                exercise.answer
                              )
                                .split(":")
                                .includes(choice.answer)}
                              color={
                                (exercise.question.proper || ":")
                                  .split(":")
                                  .includes(choice.answer)
                                  ? "success"
                                  : (exercise.answer || ":")
                                      .split(":")
                                      .includes(choice.answer)
                                  ? "danger"
                                  : undefined
                              }
                              sx={{ py: 0, my: 0, borderRadius: "sm" }}
                            >
                              <ListItemDecorator>
                                {choice.answer}
                              </ListItemDecorator>
                              <ListItemContent>
                                <Box
                                  className="KtContent"
                                  sx={{
                                    width: "100%",
                                    wordBreak: "break-all",
                                    overflowWrap: "break-word",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: choice.content,
                                  }}
                                />
                              </ListItemContent>
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  <Stack direction="column" spacing={2}>
                    <Card
                      variant="outlined"
                      color="primary"
                      sx={{ boxShadow: "sm" }}
                    >
                      <Chip variant="outlined" size="sm" color="primary">
                        我的答案
                      </Chip>
                      <CardContent>
                        {exercise.answer.split(":").join("")}
                        {exercise.photos.map(
                          (src, index) =>
                            src !== "**" && <img key={index} src={src}></img>
                        )}
                      </CardContent>
                    </Card>
                    {exercise.question.model !== 3 && (
                      <Card variant="outlined" sx={{ boxShadow: "sm" }}>
                        <Chip variant="solid" size="sm" color="success">
                          答案
                        </Chip>
                        <CardContent>
                          {exercise.question.model <= 1 &&
                            exercise.question.proper.split(":").join("")}
                          {exercise.question.noChoiceAnswer && (
                            <Box
                              className="KtContent"
                              sx={{
                                width: "100%",
                                wordBreak: "break-all",
                                overflowWrap: "break-word",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: exercise.question.noChoiceAnswer || "",
                              }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    )}
                    {exercise.question.analysis && (
                      <Card variant="outlined" sx={{ boxShadow: "sm" }}>
                        <Chip variant="solid" size="sm" color="success">
                          解析
                        </Chip>
                        <Box
                          className="KtContent"
                          sx={{
                            width: "100%",
                            wordBreak: "break-all",
                            overflowWrap: "break-word",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: exercise.question.analysis || "",
                          }}
                        />
                      </Card>
                    )}
                    {parent && parent.analysis && (
                      <Card variant="outlined" sx={{ boxShadow: "sm" }}>
                        <Chip variant="solid" size="sm" color="success">
                          题干解析
                        </Chip>
                        <Box
                          className="KtContent"
                          sx={{
                            width: "100%",
                            wordBreak: "break-all",
                            overflowWrap: "break-word",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: parent.analysis || "",
                          }}
                        />
                      </Card>
                    )}
                    {exercise.question.hasVideo && exercise.question.video && (
                      <Card
                        sx={{
                          width: "min(300px, 100%)",
                          height: "min-content",
                          cursor: "pointer",
                          "&:hover": {
                            boxShadow: "md",
                            borderColor: "neutral.outlinedHoverBorder",
                          },
                          bgcolor: "initial",
                          p: 0,
                        }}
                        onClick={() => setVideoUrl(exercise.question.video)}
                      >
                        <Box sx={{ position: "relative" }}>
                          <AspectRatio ratio="3/2">
                            <figure>
                              <img
                                src={exercise.question.cover}
                                srcSet={exercise.question.cover}
                                loading="lazy"
                                alt="视频解析"
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
                            zIndex: 11,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          视频解析
                        </Typography>
                      </Card>
                    )}
                  </Stack>
                </Sheet>
              )}
            </Grid>
          </Grid>
        </MySuspense>
      </Box>
    </>
  );
}
