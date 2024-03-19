import React from "react";
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
import { Answer, PaperTree } from "../models/paper.js";
import useDebouncedCallback from "../methods/use_debounced_callback.js";

interface RenderProblemProps {
  questions: PaperTree[];
  showProper: boolean;
  handleAnswerChange: (
    id: number,
    answer: string,
    isMultiSelect: boolean
  ) => void;
  setVideoUrl: (url: string) => void;
  setVideoOpen: (open: boolean) => void;
}

const PaperProblem: React.FC<RenderProblemProps> = (props) => {
  const {
    questions,
    showProper,
    handleAnswerChange,
    setVideoOpen,
    setVideoUrl,
  } = props;

  const handleInputChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>, item: PaperTree) => {
      handleAnswerChange(item.id, event.target.value, false);
    },
    500,
    [handleAnswerChange, questions]
  );

  return (
    <List>
      {questions.map((item) => (
        <ListItem
          key={
            item.no
              ? item.no
              : item.children[0].no +
                "~" +
                item.children[item.children.length - 1].no
          }
          sx={{
            width: "100%",
          }}
        >
          <Sheet
            variant="plain"
            sx={{ width: "100%", boxShadow: "sm", borderRadius: "md", p: 2 }}
          >
            <Typography
              id={item.id.toString()}
              mb={2}
              component="h4"
              endDecorator={
                <Link
                  variant="outlined"
                  aria-labelledby={item.id.toString()}
                  href={"#" + item.id}
                  fontSize="md"
                  borderRadius="sm"
                >
                  <LinkOutlined />
                </Link>
              }
            >
              {(item.no
                ? item.no
                : item.children[0].no +
                  "~" +
                  item.children[item.children.length - 1].no) + "."}
              <Chip variant="soft" color="primary" size="sm" sx={{ ml: 1 }}>
                {item.score + " 分"}
              </Chip>
              {item.source ? (
                <Typography
                  sx={{ marginLeft: 1 }}
                  color="neutral"
                  startDecorator={<AddLocationAltTwoToneIcon color="primary" />}
                >
                  {item.source}
                </Typography>
              ) : (
                <></>
              )}
              <Chip variant="soft" color="primary" size="sm" sx={{ ml: 1 }}>
                {item.modelName}
              </Chip>
            </Typography>

            <div
              className="KtContent"
              style={{
                width: "100%",
                wordBreak: "break-all",
                overflowWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            ></div>
            {item.model <= 1 && item.answers && (
              <List
                sx={{
                  width: "100%",
                }}
              >
                {item.answers.map((choice) => (
                  <ListItem
                    key={`${item.no}-${choice.answer}`}
                    sx={{ py: 0.25 }}
                  >
                    <ListItemButton
                      selected={
                        showProper
                          ? (item.proper || ":")
                              .split(":")
                              .includes(choice.answer)
                          : !!item.userAnswer &&
                            item.userAnswer.split(":").includes(choice.answer)
                      }
                      color={
                        showProper
                          ? (item.proper || ":")
                              .split(":")
                              .includes(choice.answer)
                            ? "success"
                            : undefined
                          : !!item.userAnswer &&
                            item.userAnswer.split(":").includes(choice.answer)
                          ? "primary"
                          : undefined
                      }
                      onClick={() => {
                        if (!showProper)
                          handleAnswerChange(
                            item.id,
                            choice.answer,
                            item.model === 1
                          );
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
            {item.model === 3 && item.children && (
              <PaperProblem
                showProper={showProper}
                questions={item.children}
                handleAnswerChange={handleAnswerChange}
                setVideoOpen={setVideoOpen}
                setVideoUrl={setVideoUrl}
              />
            )}
            {item.model === 2 &&
              (item.subModel === 2 ? (
                <Input onChange={(event) => handleInputChange(event, item)} />
              ) : (
                <Alert>暂不支持提交。</Alert>
              ))}
            {showProper && item.model !== 3 && (
              <Card variant="outlined" sx={{ borderRadius: "md", my: 1 }}>
                <Chip variant="solid" size="sm" color="primary">
                  答案
                </Chip>
                <CardContent>
                  {item.model <= 1 && item.proper}
                  {item.noChoiceAnswer && (
                    <div
                      className="KtContent"
                      style={{
                        width: "100%",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: item.noChoiceAnswer || "",
                      }}
                    ></div>
                  )}
                </CardContent>
              </Card>
            )}
            {showProper && item.analysis && (
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
                  dangerouslySetInnerHTML={{ __html: item.analysis || "" }}
                ></div>
              </Card>
            )}
            {showProper && item.hasVideo && item.video && (
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
                onClick={() => {
                  item.video && setVideoUrl(item.video);
                  setVideoOpen(true);
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <AspectRatio ratio="3/2">
                    <figure>
                      <img
                        src={item.cover}
                        srcSet={item.cover}
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
      ))}
    </List>
  );
};

export default PaperProblem;
