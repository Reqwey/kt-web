import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";
import VideoPlayerModal from "./VideoPlayerModal";

const VideoPlayerContext = createContext<any>(() => {});

export function VideoPlayerProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  return (
    <>
      {videoUrl && (
        <VideoPlayerModal videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
      )}
      <VideoPlayerContext.Provider value={setVideoUrl}>
        {children}
      </VideoPlayerContext.Provider>
    </>
  );
}

export function useVideoPlayer() {
  return useContext(VideoPlayerContext);
}
