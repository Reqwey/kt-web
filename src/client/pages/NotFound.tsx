import { HomeTwoTone } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <Box
      width="100dvw"
      height="100dvh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Typography level="h1" sx={{ my: 5 }}>
        404 Not Found
      </Typography>
      <Button
        onClick={() => navigate("/", { replace: true })}
        startDecorator={<HomeTwoTone />}
      >
        回到首页
      </Button>
    </Box>
  );
}
