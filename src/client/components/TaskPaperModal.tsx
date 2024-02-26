import React, { useEffect, useCallback, useState } from "react";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";
import List from "@mui/joy/List";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";

import RenderProblem from "./RenderProblem";
import LoadingModal from "./LoadingModal";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VideoPlayerModal from "./VideoPlayerModal";
import { DragIndicator, LinkRounded, PrintTwoTone } from "@mui/icons-material";
import { Box, DialogContent, DialogTitle, Link, ListItem } from "@mui/joy";
import { PaperData, ProblemTree } from "../models/paper";
import { AttachmentList } from "./CourseModulesDrawer";
import {
  TreeItem,
  TreeItemProps,
  TreeView,
  treeItemClasses,
} from "@mui/x-tree-view";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { styled } from "@mui/material";
import axios from "axios";

interface PTreeViewProps {
  data: ProblemTree[];
}

const CustomTreeItem = React.forwardRef(
  (props: TreeItemProps, ref: React.Ref<HTMLLIElement>) => (
    <TreeItem {...props} ref={ref} />
  )
);

const StyledTreeItem = styled(CustomTreeItem)(() => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.content}`]: {
    padding: 7.5,
    margin: 7.5,
    borderRadius: "var(--joy-radius-md)",
    border: "var(--variant-borderWidth) solid",
    borderColor:
      "var(--variant-outlinedBorder, var(--joy-palette-neutral-outlinedBorder, var(--joy-palette-neutral-300, #CDD7E1)))",
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor:
      "var(--variant-softBg, var(--joy-palette-neutral-softBg)) !important",
    color:
      "var(--variant-softColor, var(--joy-palette-neutral-softColor)) !important",
  },
}));

const PTreeView = React.memo<PTreeViewProps>(({ data }) => {
  const renderTree = (nodes: ProblemTree[]) => {
    return nodes.map((node) =>
      node.children && node.children.length > 0 ? (
        <StyledTreeItem
          key={node.id}
          nodeId={node.id}
          label={
            <Typography
              endDecorator={
                <>
                  <Chip variant="soft" color="primary" size="sm" sx={{ mx: 1 }}>
                    {node.modelName}
                  </Chip>
                  <Chip variant="soft" color="primary" size="sm">
                    {node.score + " 分"}
                  </Chip>
                </>
              }
            >
              {node.children[0].no +
                "~" +
                node.children[node.children.length - 1].no +
                "."}
            </Typography>
          }
          onClick={() => {
            window.location.href = "#" + node.id;
          }}
        >
          {renderTree(node.children)}
        </StyledTreeItem>
      ) : (
        <Link
          key={node.id}
          variant="outlined"
          color="neutral"
          href={"#" + node.id}
          underline="none"
          startDecorator={<LinkRounded sx={{ fontSize: "18px" }} />}
          sx={{ width: "100%", p: 1, m: 1, borderRadius: "md" }}
        >
          {node.no + "."}
          <Chip variant="soft" color="primary" size="sm" sx={{ mx: 1 }}>
            {node.modelName}
          </Chip>
          <Chip variant="soft" color="primary" size="sm">
            {node.score + " 分"}
          </Chip>
        </Link>
      )
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      sx={{ width: "100%", height: "100%" }}
    >
      {renderTree(data)}
    </TreeView>
  );
});

interface TaskPaperModalOptions {
  open: boolean;
  setOpen(value: boolean): void;
  paperId: number;
}

const TaskPaperModal: React.FC<TaskPaperModalOptions> = (props) => {
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState<PaperData>({} as PaperData);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setDataLoading(true);
      setData(
        !props.open
          ? ({} as PaperData)
          : (await axios.get(`/api-paper/${props.paperId}`)).data
      );
      setDataLoading(false);
    })();
  }, [props]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const leftMinWidth = 200,
    rightMinWidth = 200;
  const [leftWidth, setLeftWidth] = useState(window.innerWidth - 300); // 初始左侧栏宽度
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      event.preventDefault();
    },
    []
  );

  const onDrag = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        // 计算新的宽度
        const newWidth = event.clientX;
        if (
          newWidth >= leftMinWidth &&
          newWidth <= window.innerWidth - rightMinWidth
        ) {
          setLeftWidth(newWidth);
        }
      }
    },
    [isDragging, leftMinWidth, rightMinWidth]
  );

  const stopDragging = useCallback(() => {
    // 使用 onMouseUp 事件结束拖动
    setIsDragging(false);
  }, []);

  useEffect(() => {
    // 监听 mousemove 和 mouseup 事件
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      // 移除监听
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [onDrag, stopDragging]);

  return (
    <>
      <LoadingModal loading={dataLoading} />
      <VideoPlayerModal
        open={videoOpen}
        setOpen={setVideoOpen}
        videoUrl={videoUrl}
      />
      <Modal open={!!props.open}>
        <ModalDialog
          aria-labelledby="task-paper-modal-title"
          layout="fullscreen"
          sx={{ padding: 0 }}
        >
          <DialogTitle
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "md",
              zIndex: 9999,
            }}
          >
            <Button
              variant="plain"
              color="neutral"
              startDecorator={<ArrowBackIosNewRoundedIcon />}
              onClick={() => {
                props.setOpen(false);
              }}
            >
              返回
            </Button>
            <Typography
              id="task-paper-modal-title"
              sx={{ marginTop: 1 }}
              noWrap={true}
              endDecorator={
                <Chip size="sm" variant="plain" color="neutral">
                  {data.subjectName}
                </Chip>
              }
            >
              {data.name}
            </Typography>
            <Tooltip title={data.apiSummary} size="lg">
              <IconButton variant="plain" color="primary">
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <DialogContent
            sx={{
              marginTop: -1.5,
              display: "flex",
              flexGrow: 1,
              flexDirection: "row",
              height: "100%",
              width: "100%",
              overflow: "hidden",
              columnGap: 0,
            }}
          >
            <Box
              sx={{
                width: leftWidth,
                marginRight: "-7.5px",
                height: "100%",
                p: 0,
              }}
            >
              <List
                sx={{
                  overflow: "auto",
                  width: "100%",
                  height: "100%",
                  m: 0,
                }}
              >
                {data.attachments && data.attachments.length > 0 && (
                  <ListItem key="attachments">
                    <AttachmentList attachments={data.attachments} />
                  </ListItem>
                )}
                {(data.questions || []).map(
                  (item: ProblemTree, index: number) => (
                    <RenderProblem
                      item={item}
                      key={index}
                      setVideoOpen={setVideoOpen}
                      setVideoUrl={setVideoUrl}
                    />
                  )
                )}
              </List>
            </Box>
            <Box
              onMouseDown={startDragging}
              color="primary"
              sx={{
                width: "15px",
                cursor: "ew-resize",
                color: "transparent",
                backgroundColor: "transparent",
                zIndex: 100, // 确保分隔条位于最上层
                ":hover": {
                  color: "neutral.500",
                  backdropFilter: "blur(20px)",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DragIndicator fontSize="small" />
            </Box>
            <Box
              sx={{
                flex: 1,
                marginLeft: "-7.5px",
                width: "100%",
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <PTreeView data={data.questions || []} />
            </Box>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default TaskPaperModal;
