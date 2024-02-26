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
  const [loading, setLoading] = useState(0);
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

  useEffect(() => {
    (async () => {
      setLoading(loading + 1);
      const data: CourseDetailData =
        (await axios.get(`/api-course-detail/${id}`)).data;
      setData(data);
      setSelectedResultId(data.results[0].id);
      setSelectedCourseRanges(data.results[0].courses);
      setSelectedCourseId(data.results[0].courses[0].id);
      setLoading(loading - 1);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedCourseId !== -1) {
        setLoading(loading + 1);
        setCourseData(
          (await axios.get(`/api-course-detail-chapter/${selectedCourseId}`)).data
        );
        setLoading(loading - 1);
      }
    })();
  }, [selectedCourseId]);

  useEffect(() => {
    (async () => {
      if (selectedCourseId !== -1 && selectedChapter && selectedChapter.id) {
        setLoading(loading + 1);
        setModulesData(
          (await axios.get(`/api-course-detail-modules/${selectedCourseId}/${selectedChapter.id}`)).data
        );
        setModulesDrawerOpen(true);
        setLoading(loading - 1);
      }
    })();
  }, [selectedCourseId, selectedChapter]);

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
      <LoadingModal loading={loading > 0} />
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
            <CourseChapter data={courseData} handleClick={setSelectedChapter} />
          </Sheet>
        </Grid>
      </Grid>
    </Box>
  );
}
