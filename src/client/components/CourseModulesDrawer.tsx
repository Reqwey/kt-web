import { ArrowForward, PlayArrowRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardCover,
  Chip,
  DialogContent,
  DialogTitle,
  Drawer,
  Grid,
  List,
  ListItem,
  ModalClose,
  Typography,
} from "@mui/joy";
import { CourseModule } from "../models/course";
import MySuspense from "./MySuspense";
import { useVideoPlayer } from "./VideoPlayerProvider";
import AttachmentList from "./AttachmentList";

interface CourseModulesDrawerProps {
  loading: boolean;
  moduleName: string | undefined;
  data: CourseModule[];
  setOpen(value: boolean): void;
}

export default function CourseModulesDrawer(props: CourseModulesDrawerProps) {
  const { loading, moduleName, data, setOpen } = props;
  const setVideoUrl = useVideoPlayer();

  return (
    <Drawer size="lg" open onClose={() => setOpen(false)}>
      <ModalClose />
      <DialogTitle>{moduleName}</DialogTitle>
      <DialogContent>
        <MySuspense loading={loading}>
          {!loading && (
            <List>
              {data.map((item) => (
                <ListItem key={item.id}>
                  <Card sx={{ width: "100%", boxShadow: "md" }}>
                    {item.type === 1 ? (
                      <Accordion>
                        <AccordionSummary>
                          <Typography
                            level="title-lg"
                            endDecorator={
                              <Chip
                                variant="outlined"
                                color={
                                  item.evolve.finished ? "success" : "danger"
                                }
                              >
                                {item.evolve.finished
                                  ? item.evolve.correctPercent
                                    ? item.evolve.correctPercent + "%"
                                    : "已完成"
                                  : "未完成"}
                              </Chip>
                            }
                          >
                            {item.title}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{ width: "100%", overflow: "auto" }}
                        >
                          {item.attachments.length > 0 && (
                            <AttachmentList attachments={item.attachments} />
                          )}
                          <div
                            style={{ width: "100%" }}
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          ></div>
                          {item.videos.length > 0 && (
                            <Grid
                              container
                              spacing={{ xs: 2, md: 3 }}
                              columns={{ xs: 2, sm: 4, md: 8 }}
                              sx={{ flexGrow: 1 }}
                            >
                              {item.videos.map((v) => (
                                <Grid xs={2} sm={4} md={4} key={v.id}>
                                  <Card
                                    sx={{
                                      height: "min-content",
                                      cursor: "pointer",
                                      "&:hover": {
                                        boxShadow: "md",
                                        borderColor:
                                          "neutral.outlinedHoverBorder",
                                      },
                                      bgcolor: "initial",
                                      p: 0,
                                    }}
                                    onClick={() => setVideoUrl(v.video)}
                                  >
                                    <Box sx={{ position: "relative" }}>
                                      <AspectRatio ratio="3/2">
                                        <figure>
                                          <img
                                            src={v.cover}
                                            srcSet={v.cover}
                                            loading="lazy"
                                            alt={v.title}
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
                                      {v.title}
                                    </Typography>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ) : (
                      <>
                        <Typography
                          level="title-lg"
                          endDecorator={
                            <Chip
                              variant="outlined"
                              color={
                                item.evolve.finished ? "success" : "danger"
                              }
                            >
                              {item.evolve.finished
                                ? item.evolve.correctPercent
                                  ? item.evolve.correctPercent + "%"
                                  : "已完成"
                                : "未完成"}
                            </Chip>
                          }
                        >
                          {item.title}
                        </Typography>
                        {item.paper && (
                          <CardContent
                            orientation="horizontal"
                            sx={{ width: "100%" }}
                          >
                            <div>
                              <Typography level="body-xs">总分:</Typography>
                              <Typography fontSize="lg" fontWeight="lg">
                                {item.paper.totalScore}
                              </Typography>
                            </div>
                            <Button
                              component="a"
                              variant="soft"
                              href={`/paper/${item.paper.id}`}
                              target="_blank"
                              endDecorator={<ArrowForward />}
                              sx={{
                                ml: "auto",
                                alignSelf: "center",
                                fontWeight: 600,
                              }}
                            >
                              进入任务
                            </Button>
                          </CardContent>
                        )}
                      </>
                    )}
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </MySuspense>
      </DialogContent>
    </Drawer>
  );
}
