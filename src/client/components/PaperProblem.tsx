import React, { useState } from "react";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import ListItemDecorator from "@mui/joy/ListItemDecorator";

import AddLocationAltTwoToneIcon from "@mui/icons-material/AddLocationAltTwoTone";
import {
  Alert,
  AspectRatio,
  Box,
  Card,
  CardContent,
  CardCover,
  Input,
  Link,
  ListItemButton,
} from "@mui/joy";
import { LinkOutlined, PlayArrowRounded } from "@mui/icons-material";
import { PaperTree } from "../models/paper";
import useConsumerCallback from "../methods/use_consumer_callback";
import { useVideoPlayer } from "./VideoPlayerProvider";
import { useAnswerChange } from "../contexts/AnswerChangeContext";

interface RenderProblemProps {
  question: PaperTree;
  showProper: boolean;
}

const PaperProblem: React.FC<RenderProblemProps> = (props) => {
  const { question, showProper } = props;

  const setVideoUrl = useVideoPlayer();
  const answerChangeCallback = useAnswerChange();

  const handleAnswerChange = useConsumerCallback(
    (id: number, value: any, isMultiSelect: boolean) => {
      answerChangeCallback(id, value, isMultiSelect);
    },
    1000,
    [answerChangeCallback, question]
  );

  const [selectedChoice, setSelectedChoice] = useState(question.userAnswer || "");

  return (
    <ListItem
      sx={{
        width: "100%",
        px: 0,
      }}
    >
      <Sheet
        variant="plain"
        sx={{
          width: "100%",
          boxShadow: "sm",
          borderRadius: "md",
          p: 2,
        }}
      >
        <Typography
          id={question.id.toString()}
          mb={2}
          component="h4"
          endDecorator={
            <Link
              variant="outlined"
              aria-labelledby={question.id.toString()}
              href={"#" + question.id}
              fontSize="md"
              borderRadius="sm"
            >
              <LinkOutlined />
            </Link>
          }
        >
          {(question.no
            ? question.no
            : question.children[0].no +
              "~" +
              question.children[question.children.length - 1].no) + "."}
          <Chip variant="soft" color="primary" size="sm" sx={{ ml: 1 }}>
            {question.score + " 分"}
          </Chip>
          {question.source ? (
            <Typography
              sx={{ marginLeft: 1 }}
              color="neutral"
              startDecorator={<AddLocationAltTwoToneIcon color="primary" />}
            >
              {question.source}
            </Typography>
          ) : (
            <></>
          )}
          <Chip variant="soft" color="primary" size="sm" sx={{ ml: 1 }}>
            {question.modelName}
          </Chip>
        </Typography>

        <div
          className="KtContent"
          style={{
            width: "100%",
            wordBreak: "break-all",
            overflowWrap: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: question.content }}
        ></div>
        {question.model <= 1 && question.answers && (
          <List
            sx={{
              width: "100%",
            }}
          >
            {question.answers.map((choice) => (
              <ListItem
                key={`${question.no}-${choice.answer}`}
                sx={{ py: 0.25 }}
              >
                <ListItemButton
                  selected={
                    showProper
                      ? (question.proper || ":")
                          .split(":")
                          .includes(choice.answer)
                      : selectedChoice.split(":").includes(choice.answer)
                  }
                  color={
                    showProper
                      ? (question.proper || ":")
                          .split(":")
                          .includes(choice.answer)
                        ? "success"
                        : undefined
                      : selectedChoice.split(":").includes(choice.answer)
                      ? "primary"
                      : undefined
                  }
                  onClick={() => {
                    if (!showProper) {
                      setSelectedChoice((prevChoice) => {
                        let newChoice = choice.answer;

                        if (question.model === 1 && prevChoice) {
                          let answerArray = prevChoice.split(":");

                          if (answerArray.includes(choice.answer))
                            answerArray = answerArray.filter(
                              (x) => x !== choice.answer
                            );
                          else
                            answerArray = [
                              ...answerArray,
                              choice.answer,
                            ].sort();

                          newChoice = answerArray.join(":");
                        }

                        return newChoice;
                      });
                      handleAnswerChange(
                        question.id,
                        choice.answer,
                        question.model === 1
                      );
                    }
                  }}
                  sx={{ py: 0, my: 0, borderRadius: "sm" }}
                >
                  <ListItemDecorator>{choice.answer}</ListItemDecorator>
                  <ListItemContent>
                    <div
                      className="KtContent"
                      style={{
                        width: "100%",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                      dangerouslySetInnerHTML={{ __html: choice.content }}
                    ></div>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        {question.model === 3 &&
          !!question.children &&
          !!question.children.length && (
            <List>
              {question.children.map((item) => (
                <PaperProblem showProper={showProper} question={item} />
              ))}
            </List>
          )}
        {question.model === 2 &&
          (question.subModel === 2 ? (
            <Input
              onChange={(event) =>
                handleAnswerChange(question.id, event.target.value, false)
              }
            />
          ) : (
            <Alert>暂不支持提交。</Alert>
          ))}
        {showProper && question.model !== 3 && (
          <Card variant="outlined" sx={{ borderRadius: "md", my: 1 }}>
            <Chip variant="solid" size="sm" color="primary">
              答案
            </Chip>
            <CardContent>
              {question.model <= 1 && question.proper}
              {question.noChoiceAnswer && (
                <div
                  className="KtContent"
                  style={{
                    width: "100%",
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: question.noChoiceAnswer || "",
                  }}
                ></div>
              )}
            </CardContent>
          </Card>
        )}
        {showProper && question.analysis && (
          <Card
            variant="soft"
            className="KtContent"
            sx={{ borderRadius: "md" }}
          >
            <Chip variant="solid" size="sm" color="success">
              解析
            </Chip>
            <div
              style={{
                width: "100%",
                wordBreak: "break-all",
                overflowWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: question.analysis || "" }}
            ></div>
          </Card>
        )}
        {showProper && question.hasVideo && question.video && (
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
            onClick={() => setVideoUrl(question.video)}
          >
            <Box sx={{ position: "relative" }}>
              <AspectRatio ratio="3/2">
                <figure>
                  <img
                    src={question.cover}
                    srcSet={question.cover}
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
      </Sheet>
    </ListItem>
  );
};

export default PaperProblem;
