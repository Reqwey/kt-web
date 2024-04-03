import {
  ArrowForward,
  Close,
  CloseFullscreenRounded,
  OpenInFullRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  DialogContent,
  Grid,
  IconButton,
  List,
  ListItem,
  Modal,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { CourseModule } from "../models/course";
import MySuspense from "./MySuspense";
import AttachmentList from "./AttachmentList";
import { useState } from "react";
import VideoCard from "./VideoCard";

interface CourseModulesModalProps {
  loading: boolean;
  moduleName: string | undefined;
  data: CourseModule[];
  setOpen(value: boolean): void;
}

export default function CourseModulesModal(props: CourseModulesModalProps) {
  const { loading, moduleName, data, setOpen } = props;
  const [layout, setLayout] = useState("center" as "center" | "fullscreen");

  return (
    <Modal open onClose={() => setOpen(false)}>
      <ModalDialog
        aria-labelledby="course-module-modal-title"
        layout={layout}
        variant="soft"
        sx={{
          borderRadius: layout === "center" ? "lg" : "unset",
          width: layout === "center" ? "60vw" : "100vw",
          height: layout === "center" ? "60vh" : "100vh",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            component="h2"
            noWrap={true}
            id="course-module-modal-title"
          >
            {moduleName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              marginTop: -1,
              marginRight: -1,
            }}
          >
            <IconButton
              variant="solid"
              color="primary"
              size="sm"
              sx={{ borderRadius: "50%" }}
              onClick={() => {
                setLayout(layout === "center" ? "fullscreen" : "center");
              }}
            >
              {layout === "center" ? (
                <OpenInFullRounded />
              ) : (
                <CloseFullscreenRounded />
              )}
            </IconButton>
            <IconButton
              variant="solid"
              color="danger"
              size="sm"
              sx={{ borderRadius: "50%" }}
              onClick={() => {
                setOpen(false);
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
        <DialogContent sx={{ mx: -2 }}>
          <MySuspense loading={loading}>
            {!loading && (
              <List variant="soft">
                {data.map((item) => (
                  <ListItem key={item.id}>
                    <Card
                      variant="plain"
                      sx={{ width: "100%", boxShadow: "md" }}
                    >
                      {item.type === 1 ? (
                        <Accordion sx={{ p: 0 }}>
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
                                    <VideoCard
                                      title={v.title}
                                      coverImg={v.cover}
                                      url={v.video}
                                    />
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
                                  ? item.evolve.correctPercent !== null
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
                                href={
                                  item.exercise
                                    ? `/exercise/${item.exercise.exerciseId}?name=${item.title}`
                                    : `/paper/${item.paper.id}`
                                }
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
      </ModalDialog>
    </Modal>
  );
}
