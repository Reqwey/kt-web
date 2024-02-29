import {
  Grid,
  Box,
  Button,
  Avatar,
  Typography,
  AspectRatio,
  Sheet,
  List,
  ListItemButton,
  ListItem,
  Chip,
  DialogTitle,
  DialogContent,
  Drawer,
  ModalClose,
  Skeleton,
} from "@mui/joy";
import {
  BookTwoTone,
  ChevronLeftRounded,
  ListAltRounded,
} from "@mui/icons-material";
import logoSrc from "../assets/logo.png";
import { useEffect, useState } from "react";
import LoadingModal from "../components/LoadingModal";
import CourseChapter from "./CourseChapter";
import CourseModulesDrawer from "./CourseModulesDrawer";
import { CourseDetailData, Course } from "../models/course";
import axios from "axios";
import { useGetData } from "../methods/fetch_data";
import MySuspense from "./MySuspense";

interface CourseDetailProps {
  id: string;
  title: string;
  cover: string | undefined | null;
  setCourseId: (id: string) => void;
  setCourseTitle: (title: string) => void;
  setCourseCover: (cover: string | undefined | null) => void;
}

export default function CourseDetail(props: CourseDetailProps) {
  const { id, title, cover, setCourseId, setCourseTitle, setCourseCover } =
    props;
  const [data, setData] = useState<CourseDetailData>();
  const [pageLoading, setPageLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(-1);
  const [selectedCourseRanges, setSelectedCourseRanges] = useState<Course[]>(
    []
  );
  const [selectedCourseId, setSelectedCourseId] = useState(-1);
  const [courseData, setCourseData] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any>({});
  const [modulesData, setModulesData] = useState<any[]>([]);
  const [modulesDrawerOpen, setModulesDrawerOpen] = useState(false);
  const getData = useGetData();

  useEffect(() => {
    (async () => {
      setPageLoading(true);
      const { response, error } = await getData(`/api-course-detail/${id}`, {
        params: {
          username: localStorage.getItem("userName"),
          sn: localStorage.getItem("sn"),
          token: localStorage.getItem("token"),
        },
      });
      if (!error) {
        setData(response);
        setSelectedResultId(response.results[0].id);
        setSelectedCourseRanges(response.results[0].courses);
        setSelectedCourseId(response.results[0].courses[0].id);
      }
      setPageLoading(false);
    })();
  }, [
    setPageLoading,
    setData,
    setSelectedResultId,
    setSelectedCourseRanges,
    setSelectedCourseId,
  ]);

  useEffect(() => {
    (async () => {
      if (selectedCourseId !== -1) {
        setTreeLoading(true);
        const { response, error } = await getData(
          `/api-course-detail-chapters/${selectedCourseId}`,
          {
            params: {
              username: localStorage.getItem("userName"),
              sn: localStorage.getItem("sn"),
              token: localStorage.getItem("token"),
            },
          }
        );
        if (!error) {
          setCourseData(response);
        }
        setTreeLoading(false);
      }
    })();
  }, [selectedCourseId, setTreeLoading, setCourseData]);

  useEffect(() => {
    (async () => {
      if (selectedCourseId !== -1 && selectedChapter && selectedChapter.id) {
        setModulesDrawerOpen(true);
        setDrawerLoading(true);
        const { response, error } = await getData(
          `/api-course-detail-modules/${selectedCourseId}/${selectedChapter.id}`,
          {
            params: {
              username: localStorage.getItem("userName"),
              sn: localStorage.getItem("sn"),
              token: localStorage.getItem("token"),
            },
          }
        );
        if (!error) {
          setModulesData(response);
        }
        setDrawerLoading(false);
      }
    })();
  }, [
    selectedCourseId,
    selectedChapter,
    setDrawerLoading,
    setModulesData,
    setModulesDrawerOpen,
  ]);

  return (
    <Box
      sx={{
        "--Grid-borderWidth": "1px",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
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
            setCourseId("");
            setCourseTitle("");
            setCourseCover(null);
          }}
          startDecorator={<ChevronLeftRounded />}
        >
          返回课程中心
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
          {title}
        </Typography>
        <Button
          variant="plain"
          onClick={() => {
            setDrawerOpen(true);
          }}
          startDecorator={<ListAltRounded />}
        >
          选择版本
        </Button>
      </Box>
      <LoadingModal loading={pageLoading} />
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
        <DialogTitle>选择版本</DialogTitle>
        <DialogContent>
          <List
            sx={{
              '& [role="button"]': {
                margin: ".1px",
                borderRadius: "md",
              },
            }}
          >
            {selectedCourseRanges.map((item) => (
              <ListItem key={item.id}>
                <ListItemButton
                  color={selectedCourseId === item.id ? "primary" : "neutral"}
                  variant={selectedCourseId === item.id ? "soft" : "plain"}
                  onClick={() => {
                    setSelectedCourseId(item.id);
                    setDrawerOpen(false);
                  }}
                >
                  {item.name}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Drawer>
      <CourseModulesDrawer
        loading={drawerLoading}
        moduleName={selectedChapter.title}
        data={modulesData}
        open={modulesDrawerOpen}
        setOpen={setModulesDrawerOpen}
      />
      <Grid
        container
        spacing={0}
        sx={{
          "--Grid-borderWidth": "1px",
          overflow: "hidden",
          height: "100%",
          width: "100%",
          flexGrow: 1,
          backgroundColor: "background.level2",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
          },
        }}
      >
        <Grid xs={3} height="100%">
          <Sheet
            sx={{
              height: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
            variant="soft"
          >
            <AspectRatio
              color="primary"
              variant="soft"
              ratio="2/1"
              sx={{
                flexShrink: 0,
                m: 2,
                borderRadius: "md",
              }}
            >
              {cover ? (
                <figure>
                  <img
                    src={cover}
                    srcSet={cover}
                    loading="lazy"
                    alt="课程封面"
                  />
                </figure>
              ) : (
                <BookTwoTone sx={{ fontSize: "30px" }} />
              )}
            </AspectRatio>
            <List
              sx={{
                '& [role="button"]': {
                  margin: ".1px",
                  borderRadius: "md",
                },
              }}
            >
              {data?.results.map((item, index) => (
                <ListItem key={index}>
                  <ListItemButton
                    variant={selectedResultId === item.id ? "solid" : "plain"}
                    color={selectedResultId === item.id ? "primary" : "neutral"}
                    sx={{
                      fontSize: "sm",
                      fontWeight: "lg",
                      boxShadow:
                        selectedResultId === item.id
                          ? "var(--joy-palette-primary-outlinedBorder) 0px 3px 10px"
                          : "unset",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    onClick={() => {
                      setSelectedResultId(item.id);
                      setSelectedCourseRanges(item.courses);
                      setSelectedCourseId(item.courses[0].id);
                      setSelectedChapter({});
                    }}
                  >
                    {item.name}
                    <Chip variant="solid" color="primary">
                      {item.knowledgeCount + " 课时"}
                    </Chip>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Sheet>
        </Grid>
        <Grid xs height="100%">
          <Sheet
            sx={{
              height: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
            variant="soft"
          >
            <MySuspense loading={treeLoading}>
              <CourseChapter
                data={courseData}
                handleClick={setSelectedChapter}
              />
            </MySuspense>
          </Sheet>
        </Grid>
      </Grid>
    </Box>
  );
}
