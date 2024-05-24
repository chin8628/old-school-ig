import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

let youtubePlayer: YouTubePlayer = null;

enum VideoState {
  "Unstarted" = "-1",
  "Ended" = "0",
  "Playing" = "1",
  "Paused" = "2",
  "Buffering" = "3",
  "VideoCued" = "5",
}

type SongPlayerProps = {
  youtubeId: string;
  startTime?: string;
  endTime?: string;
};

export const SongPlayer = (props: SongPlayerProps) => {
  const [videoState, setVideoState] = useState<VideoState>(VideoState.Unstarted);

  return (
    <>
      <YouTube
        videoId={props.youtubeId}
        opts={{
          height: "0",
          width: "0",
          playerVars: {
            controls: 0,
            autoplay: 1,
            start: props.startTime,
            end: props.endTime,
          },
        }}
        onPlay={(e) => setVideoState(VideoState.Playing)}
        onPause={(e) => setVideoState(VideoState.Paused)}
        onEnd={(e) => {
          e.target.seekTo(props.startTime);
          e.target.playVideo();
        }}
        onReady={(e) => {
          youtubePlayer = e.target;
        }}
      />

      <div className="absolute top-[13px] right-[13px] w-5 h-5">
        {videoState === VideoState.Playing && (
          <>
            <div
              className="bg-gray-400 opacity-100 rounded-full absolute w-full h-full cursor-pointer animate-ping z-0"
              onClick={() => {
                youtubePlayer?.pauseVideo();
              }}
            ></div>
            <div className="bg-gray-400 rounded-full p-1 cursor-pointer z-10">
              <SpeakerWaveIcon className="text-white" />
            </div>
          </>
        )}

        {videoState !== VideoState.Playing && (
          <div
            className="bg-gray-400 rounded-full p-1 cursor-pointer z-10"
            onClick={() => {
              youtubePlayer?.playVideo();
            }}
          >
            <SpeakerXMarkIcon className="text-white" />
          </div>
        )}
      </div>
    </>
  );
};
