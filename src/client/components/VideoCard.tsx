import { PlayArrowRounded } from "@mui/icons-material";
import { Card, Box, AspectRatio, CardCover, Typography } from "@mui/joy";
import { useVideoPlayer } from "./VideoPlayerProvider";
import { memo } from "react";

interface VideoCardProps {
  title: string;
  url: string;
  coverImg?: string;
}

export default memo(function VideoCard(props: VideoCardProps) {
  const { title, url, coverImg } = props;
  const setVideoUrl = useVideoPlayer();
  return (
    <Card
      sx={{
        width: "min(300px, 100%)",
        height: "min-content",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder",
        },
        bgcolor: "initial",
        p: 0,
      }}
      onClick={() => setVideoUrl(url)}
    >
      <Box sx={{ position: "relative" }}>
        <AspectRatio ratio="3/2">
          <figure>
            {coverImg && (
              <img
                src={coverImg}
                srcSet={coverImg}
                loading="lazy"
                alt={title}
              />
            )}
          </figure>
        </AspectRatio>
        <CardCover
          sx={{
            opacity: 1,
            transition: "0.1s ease-in",
            background:
              "linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)",
          }}
        >
          <div>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayArrowRounded
                sx={{
                  color: "#fff",
                  fontSize: "70px",
                  bgcolor: "rgba(0 0 0 / 0.2)",
                  borderRadius: "lg",
                }}
              />
            </Box>
          </div>
        </CardCover>
      </Box>
      <Typography
        level="body-lg"
        fontWeight="lg"
        sx={{
          p: 2,
          mt: -9,
          zIndex: 11,
          color: "#fff",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </Typography>
    </Card>
  );
});
