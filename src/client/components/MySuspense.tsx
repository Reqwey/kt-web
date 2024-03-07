import { Sheet, Typography } from "@mui/joy";
import CircularProgress from "@mui/joy/CircularProgress";
import { ReactNode } from "react";

export default function MySuspense(props: {
  loading: boolean;
  children: ReactNode;
}) {
  const { loading, children } = props;
  return (
    <>
      {loading ? (
        <Sheet
          variant="plain"
          sx={{
            background: "transparent",
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography level="body-lg" fontWeight="lg" startDecorator={<CircularProgress />}>
            加载中...
          </Typography>
        </Sheet>
      ) : (
        children
      )}
    </>
  );
}
