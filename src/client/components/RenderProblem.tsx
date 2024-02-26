import React from "react";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import ListItemDecorator from "@mui/joy/ListItemDecorator";

import AddLocationAltTwoToneIcon from "@mui/icons-material/AddLocationAltTwoTone";
import { AspectRatio, Box, Card, CardCover, Link } from "@mui/joy";
import { LinkOutlined, PlayArrowRounded } from "@mui/icons-material";
import { ProblemTree } from "../models/paper";

interface RenderProblemProps {
  item: ProblemTree;
  setVideoUrl: (url: string) => void;
  setVideoOpen: (open: boolean) => void;
}

const RenderProblem = React.memo<RenderProblemProps>((props) => {
  const { item, setVideoOpen, setVideoUrl } = props;
  return (
    <ListItem
      key={
        item.no
          ? item.no
          : item.children[0].no +
            "~" +
            item.children[item.children.length - 1].no
      }
      sx={{
        borderTop: "1px solid var(--joy-palette-neutral-outlinedBorder)",
        width: "100%",
      }}
    >
      <Sheet variant="plain" sx={{ width: "100%" }}>
        <Typography
          id={item.id}
          mb={2}
          component="h4"
          endDecorator={
            <Link
              variant="outlined"
              aria-labelledby={item.id}
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
          <Chip variant="soft" color="primary" size="sm" sx={{ marginLeft: 1 }}>
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
          <Chip variant="soft" color="primary" size="sm">
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
        {item.model <= 1 ? (
          <List sx={{ width: "100%" }}>
            {(item.answers || []).map((choice) => (
              <ListItem
                key={`${item.no}-${choice.answer}`}
                variant={
                  (item.proper || ":").split(":").indexOf(choice.answer) !== -1
                    ? "soft"
                    : "plain"
                }
                color={
                  (item.proper || ":").split(":").indexOf(choice.answer) !== -1
                    ? "success"
                    : "neutral"
                }
                sx={{ borderRadius: "md" }}
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
              </ListItem>
            ))}
          </List>
        ) : item.model === 3 ? (
          <List>
            {(item.children || []).map((child: any) => (
              <RenderProblem
                item={child}
                setVideoOpen={setVideoOpen}
                setVideoUrl={setVideoUrl}
              />
            ))}
          </List>
        ) : (
          <Typography
            variant="soft"
            color="success"
            sx={{
              "--Typography-gap": "0.5rem",
              p: 1,
              m: 0.2,
              borderRadius: "md",
            }}
          >
            <Chip variant="solid" size="sm" color="success">
              答案
            </Chip>
            <div
              className="KtContent"
              style={{
                width: "100%",
                wordBreak: "break-all",
                overflowWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: item.noChoiceAnswer || "" }}
            ></div>
          </Typography>
        )}
        {item.analysis && (
          <Typography
            variant="soft"
            color="success"
            className="KtContent"
            sx={{
              "--Typography-gap": "0.5rem",
              p: 1,
              m: 0.2,
              borderRadius: "md",
            }}
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
          </Typography>
        )}
        {item.hasVideo && item.video && (
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
                zIndex: 114514,
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
});

export default RenderProblem;
