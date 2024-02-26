// dplayer.d.ts
declare module 'dplayer' {
  interface DPlayerOptions {
    container: HTMLElement;
    autoplay?: boolean;
    theme?: string;
    loop?: boolean;
    lang?: string;
    screenshot?: boolean;
    hotkey?: boolean;
    preload?: string;
    logo?: string;
    volume?: number;
    mutex?: boolean;
    video: {
      url: string;
      pic?: string;
      thumbnails?: string;
      type?: string;
      customType?: {
        [type: string]: (video: HTMLVideoElement, player: DPlayer) => void;
      };
    };
    subtitle?: {
      url: string;
      type?: string;
      fontSize?: string;
      bottom?: string;
      color?: string;
    };
    // more options...
  }

  interface DPlayerEvents {
    play?: () => void;
    pause?: () => void;
    canplay?: () => void;
    playing?: () => void;
    ended?: () => void;
    error?: () => void;
    // more events...
  }

  class DPlayer {
    constructor(options: DPlayerOptions);
    play(): void;
    pause(): void;
    seek(time: number): void;
    volume(percentage: number): void;
    switchVideo(video: { url: string; type?: string; }, thumbnail?: string): void;
    on(event: string, handler: () => void): void;
    off(event: string, handler: () => void): void;
		destroy(): void;
    // more methods...
  }

  export default DPlayer;
}
