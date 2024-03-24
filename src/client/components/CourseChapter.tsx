import * as React from "react";

import {
  TreeItem,
  TreeItemProps,
  TreeView,
  treeItemClasses,
} from "@mui/x-tree-view";
import {
  ChevronRight,
  DoneAllRounded,
  ExpandMore,
  GradeRounded,
  LibraryBooksTwoTone,
  MenuBook,
} from "@mui/icons-material";
import { styled } from "@mui/material";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { Chip, Stack, Typography } from "@mui/joy";

const materialTheme = materialExtendTheme();

interface CourseChapterProps {
  data: RenderTree[];
  handleClick: (chapter: any) => void;
}

interface RenderTree {
  key: number;
  title: string;
  isLeaf: boolean;
  evolve?: {
    finished: boolean;
    avgCorrectPercent: null | number;
  };
  questionCount: number;
  studiedCount: number;
  children: RenderTree[];
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
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor:
      "var(--variant-solidBg, var(--joy-palette-primary-solidBg, var(--joy-palette-primary-500, #0B6BCB))) !important",
    color:
      "var(--variant-solidColor, var(--joy-palette-primary-solidColor, var(--joy-palette-common-white, #FFF))) !important",
  },
}));

const CourseChapter = React.memo<CourseChapterProps>(
  ({ data, handleClick }) => {
    console.log(data);

    const renderTree = (nodes: RenderTree[]) => {
      return nodes.map((node) => (
        <StyledTreeItem
          key={node.key}
          nodeId={node.key.toString()}
          label={
            <Typography
              textColor="inherit"
              endDecorator={
                <Stack direction="row" spacing={1}>
                  {!!node.questionCount && <Chip
                    variant="outlined"
                    color="primary"
                    size="sm"
                    startDecorator={<LibraryBooksTwoTone fontSize="small" />}
                  >
                    {node.questionCount} 课时
                  </Chip>}
                  {!!node.studiedCount && <Chip
                    variant="outlined"
                    color="warning"
                    size="sm"
                    startDecorator={<GradeRounded fontSize="small" />}
                  >
                    已学 {node.studiedCount} 课
                  </Chip>}
                  {node.evolve && !!node.evolve.avgCorrectPercent && (
                    <Chip size="sm" color="success">
                      平均得分 {node.evolve.avgCorrectPercent.toFixed(1)}
                    </Chip>
                  )}
                  {node.evolve && node.evolve.finished && (
                    <DoneAllRounded color="success" fontSize="small" />
                  )}
                </Stack>
              }
            >
              {node.title}
            </Typography>
          }
          onClick={() => {
            node.isLeaf ? handleClick(node) : null;
          }}
          icon={node.isLeaf ? <MenuBook /> : null}
        >
          {!node.isLeaf && renderTree(node.children)}
        </StyledTreeItem>
      ));
    };

    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <TreeView
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
        >
          {renderTree(data)}
        </TreeView>
      </MaterialCssVarsProvider>
    );
  }
);

export default CourseChapter;
