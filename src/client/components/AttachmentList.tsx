import { Stack, Card, CardOverflow, CardContent, Typography } from "@mui/joy";
import { CourseAttachment } from "../models/course";

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function AttachmentList(props: {
  attachments: CourseAttachment[];
}) {
  return (
    <Stack>
      {props.attachments.map((a) => (
        <Card
          component="a"
          color="primary"
          variant="outlined"
          sx={{
            textDecoration: "none",
            my: 1,
            boxShadow: "sm",
            ":hover": {
              boxShadow: "md",
            },
          }}
          key={a.id}
          orientation="horizontal"
          href={a.sourceFile}
          target="_blank"
          rel="noreferrer"
        >
          <CardOverflow
            variant="soft"
            color="primary"
            sx={{
              px: 0.2,
              writingMode: "vertical-rl",
              textAlign: "center",
              fontSize: "xs",
              fontWeight: "xl",
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderLeft: "1px solid",
              borderColor: "divider",
            }}
          >
            {a.fileType}
          </CardOverflow>
          <CardContent
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography level="title-md" noWrap>
              {a.name}
            </Typography>
            <Typography level="body-xs">{formatBytes(a.size)}</Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
