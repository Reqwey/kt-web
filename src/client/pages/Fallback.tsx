import { CancelTwoTone, RefreshTwoTone } from "@mui/icons-material";
import { Box, Button, Sheet, Typography } from "@mui/joy";
import { FallbackProps } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";

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
      <Typography
        level="h1"
        color="danger"
        startDecorator={
          <CancelTwoTone color="error" sx={{ fontSize: "80px" }} />
        }
        sx={{ fontSize: "50px" }}
      >
        Kunter 遇到了一个错误
      </Typography>
      <Box m={2}>
        <code>
          {(error.stack as string).split("\n").map((line) => (
            <div>{line}</div>
          ))}
        </code>
      </Box>
      <Button
        variant="outlined"
        onClick={() => window.location.reload()}
        startDecorator={<RefreshTwoTone />}
      >
        刷新页面
      </Button>
    </Sheet>
  );
}
