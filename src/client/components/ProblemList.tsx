import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
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
  Card,
  CardContent,
  Input,
  Link,
  ListItemButton,
} from "@mui/joy";
import { LinkOutlined } from "@mui/icons-material";
import { Choice, PaperTree } from "../models/paper";
import { useAnswerChange, useAnswerMap } from "./AnswerProvider";
import VideoCard from "./VideoCard";

const Choices = memo(
  (props: {
    questionId: number;
    choices: Choice[];
    showProper: boolean;
    proper: string | undefined;
    updatedChoice: string;
    isMultiSelect: boolean;
    handleAnswerChange: (
      id: number,
      value: any,
      isMultiSelect: boolean
    ) => void;
  }) => {
    const {
      questionId,
      choices,
      showProper,
      updatedChoice,
      proper,
      isMultiSelect,
      handleAnswerChange,
    } = props;
    const [selectedChoice, setSelectedChoice] = useState(updatedChoice);

    return (
      <List
        sx={{
          width: "100%",
        }}
      >
        {choices.map((choice) => (
          <ListItem key={`${choice.answer}`} sx={{ py: 0.25 }}>
            <ListItemButton
              selected={
                showProper
                  ? (proper || ":").split(":").includes(choice.answer)
                  : selectedChoice.split(":").includes(choice.answer)
              }
              color={
                showProper
                  ? (proper || ":").split(":").includes(choice.answer)
                    ? "success"
                    : undefined
                  : selectedChoice.split(":").includes(choice.answer)
                  ? "primary"
                  : undefined
              }
              onClick={() => {
                if (!showProper) {
                  setSelectedChoice((prevChoice: string) => {
                    let newChoice = choice.answer;

                    if (isMultiSelect && prevChoice) {
                      let answerArray = prevChoice.split(":");

                      if (answerArray.includes(choice.answer))
                        answerArray = answerArray.filter(
                          (x: string) => x !== choice.answer
                        );
                      else answerArray = [...answerArray, choice.answer].sort();

                      newChoice = answerArray.join(":");
                    }

                    return newChoice;
                  });
                  handleAnswerChange(questionId, choice.answer, isMultiSelect);
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
    );
  }
);

const ProblemInput = memo(
  (props: {
    questionId: number;
    handleAnswerChange: (
      id: number,
      value: any,
      isMultiSelect: boolean
    ) => void;
  }) => {
    const { questionId, handleAnswerChange } = props;
    const [inputValue, setInputValue] = useState("");

    return (
      <Input
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          handleAnswerChange(questionId, event.target.value, false);
        }}
      />
    );
  }
);

interface ProblemProps {
  question: PaperTree;
  showProper: boolean;
}

const ProblemListItem = memo((props: ProblemProps) => {
  const { question, showProper } = props;

  const answerMap = useAnswerMap();
  const answerChangeCallback = useAnswerChange();
  const defferedChoice = useDeferredValue(answerMap[question.id] || "");

  const handleAnswerChange = useCallback(
    (id: number, value: any, isMultiSelect: boolean) => {
      answerChangeCallback(id, value, isMultiSelect);
    },
    [answerChangeCallback]
  );

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
            {question.subjectQuestionTypeName || question.modelName}
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
          <Choices
            questionId={question.id}
            isMultiSelect={question.model === 1}
            choices={question.answers}
            showProper={showProper}
            proper={question.proper}
            updatedChoice={defferedChoice}
            handleAnswerChange={handleAnswerChange}
          />
        )}
        {question.model === 3 &&
          !!question.children &&
          !!question.children.length && (
            <ProblemList
              showProper={showProper}
              questions={question.children}
            />
          )}
        {question.model === 2 &&
          (question.subModel === 2 ? (
            <ProblemInput
              questionId={question.id}
              handleAnswerChange={handleAnswerChange}
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
              {question.model <= 1 && question.proper?.split(":").join("")}
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
          <VideoCard
            url={question.video}
            title="视频解析"
            coverImg={question.cover}
          />
        )}
      </Sheet>
    </ListItem>
  );
});

interface ProblemListProps {
  questions: PaperTree[];
  showProper: boolean;
}

const ProblemList = memo((props: ProblemListProps) => {
  const { questions, showProper } = props;
  return (
    <List>
      {questions.map((item) => (
        <ProblemListItem
          key={item.id}
          question={item}
          showProper={showProper}
        />
      ))}
    </List>
  );
});

export default ProblemList;
