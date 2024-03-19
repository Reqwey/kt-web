import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import PaperProblem from "../components/PaperProblem";
import LoadingModal from "../components/LoadingModal";
import VideoPlayerModal from "../components/VideoPlayerModal";
import {
  FormatListBulletedRounded,
  InfoRounded,
  LinkRounded,
  VisibilityOffRounded,
  VisibilityRounded,
  WarningRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ModalClose,
  Typography,
  Sheet,
  Stack,
  Switch,
  Button,
  Snackbar,
  DialogActions,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { AnswerMap, PaperData, PaperTree } from "../models/paper";
import { AttachmentList } from "../components/CourseModulesDrawer";
import { useLocation, useParams } from "react-router-dom";
import { getData, postData } from "../methods/fetch_data";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

interface ConfirmModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSubmit: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  setOpen,
  handleSubmit,
}) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{ borderRadius: "lg" }}
      >
        <DialogTitle>
          <WarningRounded />
          请注意
        </DialogTitle>
        <Divider />
        <DialogContent>您还有未完成的题目，确认提交吗？</DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              handleSubmit();
              setOpen(false);
            }}
          >
            确认
          </Button>
          <Button
            autoFocus
            variant="plain"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            点错了
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default function TaskResult() {
  const { exerciseId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const taskName = searchParams.get("name") || "无标题";

  const { data, isLoading, error } = useSWR(
    `/api-exercise/${exerciseId}`,
    (url) =>
      getData(url, {
        params: {
          username: localStorage.getItem("userName"),
          sn: localStorage.getItem("sn"),
          token: localStorage.getItem("token"),
        },
      })
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Helmet>
        <title>
          {`${isLoading || !data ? "Loading..." : taskName} | Kunter Online`}
        </title>
      </Helmet>
      <LoadingModal loading={isLoading} />
    </>
  );
}
