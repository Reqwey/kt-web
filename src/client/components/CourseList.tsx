import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  Avatar,
  Typography,
  AspectRatio,
  Card,
  CardCover,
  DialogContent,
  DialogTitle,
  Drawer,
  ModalClose,
} from "@mui/joy";
import { BookTwoTone, ChevronLeftRounded, Timeline } from "@mui/icons-material";
import logoSrc from "../assets/logo.png";
import { useEffect, useState } from "react";
import LoadingModal from "../components/LoadingModal";
import { MyCoursesData } from "../models/course";
import axios from "axios";
import { Helmet } from "react-helmet";

interface CourseListProps {
  setCourseId: (id: string) => void;
  setCourseTitle: (title: string) => void;
  setCourseCover: (cover: string | undefined | null) => void;
}

export default function CourseList(props: CourseListProps) {
  const { setCourseId, setCourseTitle, setCourseCover } = props;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [studiedCoursesData, setStudiedCoursesData] = useState<MyCoursesData>();
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setData(
        (
          await axios.get(`/api-courses/categories`, {
            params: {
              username: localStorage.getItem("userName"),
              sn: localStorage.getItem("sn"),
              token: localStorage.getItem("token"),
            },
          })
        ).data
      );
      setLoading(false);
    })();
  }, [setLoading, setData]);

  useEffect(() => {
    (async () => {
      if (drawerOpen) {
        setLoading(true);
        setStudiedCoursesData(
          (
            await axios.get(`/api-courses/mine`, {
              params: {
                username: localStorage.getItem("userName"),
                sn: localStorage.getItem("sn"),
                token: localStorage.getItem("token"),
              },
            })
          ).data
        );
        setLoading(false);
      }
    })();
  }, [setLoading, drawerOpen]);

  return (
    <>
      <Helmet>
        <title>码课课程中心 | Kunter Online</title>
      </Helmet>
      <Box
        sx={{
          "--Grid-borderWidth": "1px",
          overflow: "hidden",
          width: "100dvw",
          height: "100dvh",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
          },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          id="app-bar"
          sx={{
            p: 2,
            bgcolor: "background.surface",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            top: 0,
            zIndex: 1100,
            width: "100%",
          }}
        >
          <Button
            variant="plain"
            onClick={() => {
              navigate("/dashboard", { replace: true });
            }}
            startDecorator={<ChevronLeftRounded />}
          >
            返回任务列表
          </Button>
          <Typography
            fontWeight="lg"
            level="h4"
            startDecorator={
              <Avatar
                alt="Kunter Logo"
                src={logoSrc}
                sx={{ borderRadius: "10px" }}
              />
            }
          >
            码课课程中心
          </Typography>
          <Button
            variant="plain"
            onClick={() => {
              setDrawerOpen(true);
            }}
            startDecorator={<Timeline />}
          >
            学习记录
          </Button>
        </Box>
        <LoadingModal loading={loading} />
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <ModalClose
            onClick={() => {
              setDrawerOpen(false);
            }}
          />
          <DialogTitle>学习记录</DialogTitle>
          <DialogContent>{"To be continued..."}</DialogContent>
        </Drawer>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 10 }}
          sx={{
            width: "100%",
            height: "100%",
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: "background.level2",
            p: 2,
            margin: 0,
          }}
        >
          {data.map((course: any, _) => (
            <Grid xs={2} sm={2} md={2} key={course.id}>
              <Card
                variant="soft"
                sx={{
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                  boxShadow: "sm",
                  "&:hover": {
                    boxShadow: "md",
                    borderColor: "neutral.outlinedHoverBorder",
                  },
                  bgcolor: "background.body",
                  p: 0,
                }}
                onClick={() => {
                  setCourseId(course.id);
                  setCourseTitle(course.title);
                  setCourseCover(course.cover);
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <AspectRatio
                    color="primary"
                    variant="soft"
                    ratio="2/1"
                    sx={{
                      textShadow: "rgba(28, 32, 37, 0.3) 0px 1px 1px",
                      flexShrink: 0,
                    }}
                  >
                    {course.cover ? (
                      <figure>
                        <img
                          src={course.cover}
                          srcSet={course.cover}
                          loading="lazy"
                          alt="课程封面"
                        />
                      </figure>
                    ) : (
                      <BookTwoTone sx={{ fontSize: "30px" }} />
                    )}
                  </AspectRatio>
                  <CardCover>
                    <div>
                      <Box
                        sx={{
                          p: 2,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      ></Box>
                    </div>
                  </CardCover>
                  <Typography level="body-lg" fontWeight="lg" sx={{ p: 2 }}>
                    {course.title}
                  </Typography>
                  <Typography level="body-sm" sx={{ p: 2, width: "100%" }}>
                    {course.tags}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
