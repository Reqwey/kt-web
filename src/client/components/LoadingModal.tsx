import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Typography } from "@mui/joy";
import CircularProgress from "@mui/joy/CircularProgress";

export default function LoadingModal(props: { loading: boolean }) {
  return (
    <Modal key="loadingModal" open={props.loading}>
      <ModalDialog
        size="sm"
        variant="plain"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "unset",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
        <Typography sx={{ marginTop: 1 }} level="body-lg" fontWeight="lg">
          加载中...
        </Typography>
      </ModalDialog>
    </Modal>
  );
}
