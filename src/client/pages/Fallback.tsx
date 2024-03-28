import { CancelTwoTone, RefreshTwoTone } from "@mui/icons-material";
import { Button, Sheet, Typography } from "@mui/joy";
import { FallbackProps } from "react-error-boundary";

export default function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Sheet
      variant="soft"
      color="danger"
      sx={{
        m: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <CancelTwoTone color="error" sx={{ fontSize: "200px", my: 2 }} />
      <Typography level="h1" color="danger">
        我们遇到了一个错误
      </Typography>
      <Typography level="body-md" sx={{ my: 2 }}>
        {error.message}
      </Typography>
      <Button
        variant="outlined"
        onClick={() => resetErrorBoundary()}
        startDecorator={<RefreshTwoTone />}
      >
        刷新页面
      </Button>
    </Sheet>
  );
}
