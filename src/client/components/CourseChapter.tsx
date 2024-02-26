import * as React from "react";

import { TreeItem, TreeItemProps, TreeView, treeItemClasses } from "@mui/x-tree-view";
import { ChevronRight, ExpandMore, MenuBook } from "@mui/icons-material";
import { styled } from "@mui/material";

interface CourseChapterProps {
  data: RenderTree[];
  handleClick: (chapter: any) => void;
}

interface RenderTree {
  key: string;
  title: string;
  isLeaf: boolean;
  children: RenderTree[];
}

const CustomTreeItem = React.forwardRef(
  (props: TreeItemProps, ref: React.Ref<HTMLLIElement>) => (
    <TreeItem {...props} ref={ref} />
  ),
);

const StyledTreeItem = styled(CustomTreeItem)(() => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.content}`]: {
    padding: 7.5,
    margin: 7.5,
    borderRadius: 'var(--joy-radius-md)'
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor: 'var(--variant-solidBg, var(--joy-palette-primary-solidBg, var(--joy-palette-primary-500, #0B6BCB))) !important',
    color: 'var(--variant-solidColor, var(--joy-palette-primary-solidColor, var(--joy-palette-common-white, #FFF))) !important'
  }
}));

const CourseChapter = React.memo<CourseChapterProps>(
  ({ data, handleClick }) => {
    const renderTree = (nodes: RenderTree[]) => {
      return nodes.map((node) => (
        <StyledTreeItem
          key={node.key}
          nodeId={node.key}
          label={node.title}
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
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
      >
        {renderTree(data)}
      </TreeView>
    );
  }
);

export default CourseChapter;
