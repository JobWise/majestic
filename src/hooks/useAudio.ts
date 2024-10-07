import { useEffect, useRef, useCallback } from "react";

interface UseAudioOptions {
  loop?: boolean;
  volume?: number;
}

const useAudio = (src: string, options?: UseAudioOptions) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      if (options?.loop !== undefined) audioRef.current.loop = options.loop;
      if (options?.volume !== undefined)
        audioRef.current.volume = options.volume;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const play = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error(`Failed to play audio: ${error}`);
      });
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, pause, reset, audioRef };
};

export default useAudio;
