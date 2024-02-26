import * as React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Chip from "@mui/joy/Chip";
import { SubjectListData } from "../models/subject_list";
import axios from "axios";

interface SubjectListProps {
  subjectId: number;
  setSubjectId(value: number): void;
}

const SubjectList: React.FC<SubjectListProps> = (props) => {
  const { subjectId, setSubjectId } = props;
  const [counts, setCounts] = React.useState<SubjectListData>();
  const [totalCount, setTotalCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      let data: SubjectListData =
        (await axios.get('/api-unfinished-counts')).data;
      if (data.success) {
        setCounts(data);
        setTotalCount(
          data.subjects.reduce((accumulator, subject) => {
            return accumulator + subject.unfinished;
          }, 0)
        );
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatCount = (count: number) => {
    return count > 99 ? "99+" : count;
  };

  return (
    <ListItem nested key="subjectList">
      <ListSubheader sticky>学科列表</ListSubheader>
      <List
        sx={{
          '& [role="button"]': {
            m: ".1px",
            borderRadius: "md",
          },
        }}
      >
        <ListItem key={-1}>
          <ListItemButton
            variant="plain"
            color={subjectId === -1 ? "primary" : "neutral"}
            onClick={() => {
              setSubjectId(-1);
            }}
            sx={{
              fontSize: "sm",
              fontWeight: "lg",
              boxShadow: subjectId === -1 ? "sm" : "unset",
              backgroundColor:
                subjectId === -1 ? "var(--joy-palette-background-surface)" : "",
              display: "flex",
              justifyContent: totalCount ? "space-between" : "",
            }}
          >
            {"全部学科"}
            {totalCount && (
              <Chip size="sm" variant="solid" color="danger">
                {formatCount(totalCount)}
              </Chip>
            )}
          </ListItemButton>
        </ListItem>
        {JSON.parse(localStorage.getItem("subjectList") as string).map(
          (item: any) => (
            <ListItem key={item.id}>
              <ListItemButton
                variant="plain"
                color={subjectId === item.id ? "primary" : "neutral"}
                onClick={() => {
                  setSubjectId(item.id);
                }}
                sx={{
                  fontSize: "sm",
                  fontWeight: "lg",
                  boxShadow: subjectId === item.id ? "sm" : "unset",
                  backgroundColor:
                    subjectId === item.id
                      ? "var(--joy-palette-background-surface)"
                      : "",
                  display: "flex",
                  justifyContent:
                    counts &&
                    counts.subjects.filter(
                      (subject) => subject.subjectId === item.id
                    ).length > 0
                      ? "space-between"
                      : "",
                }}
              >
                {item.name}
                {counts &&
                  counts.subjects.filter(
                    (subject) => subject.subjectId === item.id
                  ).length > 0 && (
                    <Chip size="sm" variant="solid" color="danger">
                      {formatCount(
                        counts.subjects.filter(
                          (subject) => subject.subjectId === item.id
                        )[0].unfinished
                      )}
                    </Chip>
                  )}
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </ListItem>
  );
};

export default SubjectList;
