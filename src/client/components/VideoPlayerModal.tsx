import React, { useEffect, useRef } from "react";
import DPlayer from "dplayer";
import Hls from "hls.js";
import { DialogContent, Modal, ModalDialog } from "@mui/joy";

interface PlayerProps {
  videoUrl: string;
}

const Player: React.FC<PlayerProps> = ({ videoUrl }) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dp: DPlayer | null = null;

    if (playerContainerRef.current) {
      dp = new DPlayer({
        container: playerContainerRef.current,
        video: {
          url: videoUrl,
          type: "customHls",
          customType: {
            customHls: function (video: any, _: any) {
              const hls = new Hls();
              hls.loadSource(video.src);
              hls.attachMedia(video);
            },
          },
        },
      });
    }

    return () => {
      // 组件卸载时销毁播放器实例
      if (dp) {
        dp.destroy();
      }
    };
  }, [videoUrl]);

  return <div ref={playerContainerRef}></div>;
};

interface VideoPlayerModalProps {
  videoUrl: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = (props) => {
  const { open, setOpen, videoUrl } = props;
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <ModalDialog layout="center" size="lg">
        <DialogContent>
          <Player videoUrl={videoUrl} />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default VideoPlayerModal;
