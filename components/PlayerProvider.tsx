"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { tracks } from "@/data/tracks";

type Track = (typeof tracks)[number];

type PlayerContextType = {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;

  play: (track?: Track) => void;
  toggle: (track?: Track) => void;

  next: () => void;
  prev: () => void;

  seek: (time: number) => void;
  setVolume: (volume: number) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used inside PlayerProvider"
    );
  }

  return context;
}

export function PlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | null>(null);
  const autoplayRef = useRef(false);

  const [track, setTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolumeState] = useState(0.8);

  const currentIndex = tracks.findIndex(
    (item) => item.id === track.id
  );

  /* --------------------------------------------------
     SMOOTH PLAYBACK CLOCK
  -------------------------------------------------- */

  const updatePlaybackTime = () => {
    const audio = audioRef.current;

    if (!audio) return;

    setCurrentTime(audio.currentTime);

    if (!audio.paused && !audio.ended) {
      animationRef.current =
        requestAnimationFrame(updatePlaybackTime);
    }
  };

  const startPlaybackClock = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current =
      requestAnimationFrame(updatePlaybackTime);
  };

  const stopPlaybackClock = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  /* --------------------------------------------------
     TRACK CHANGE
  -------------------------------------------------- */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    setCurrentTime(0);
    setDuration(0);

    if (autoplayRef.current) {
      autoplayRef.current = false;

      const playNewTrack = async () => {
        try {
          await audio.play();
        } catch {
          setIsPlaying(false);
        }
      };

      playNewTrack();
    }
  }, [track]);

  /* --------------------------------------------------
     VOLUME
  -------------------------------------------------- */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  /* --------------------------------------------------
     CLEANUP
  -------------------------------------------------- */

  useEffect(() => {
    return () => {
      stopPlaybackClock();
    };
  }, []);

  /* --------------------------------------------------
     PLAY
  -------------------------------------------------- */

  const play = (newTrack?: Track) => {
    const audio = audioRef.current;

    if (!audio) return;

    if (newTrack && newTrack.id !== track.id) {
      autoplayRef.current = true;

      setCurrentTime(0);
      setDuration(0);

      setTrack(newTrack);

      return;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        startPlaybackClock();
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  /* --------------------------------------------------
     TOGGLE
  -------------------------------------------------- */

  const toggle = (newTrack?: Track) => {
    const audio = audioRef.current;

    if (!audio) return;

    if (newTrack && newTrack.id !== track.id) {
      play(newTrack);
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          startPlaybackClock();
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      audio.pause();

      setIsPlaying(false);

      stopPlaybackClock();
    }
  };

  /* --------------------------------------------------
     NEXT TRACK
  -------------------------------------------------- */

  const next = () => {
    if (tracks.length === 0) return;

    const nextIndex =
      (currentIndex + 1) % tracks.length;

    play(tracks[nextIndex]);
  };

  /* --------------------------------------------------
     PREVIOUS TRACK
  -------------------------------------------------- */

  const prev = () => {
    const audio = audioRef.current;

    if (!audio) return;

    // Restart current track if we're more than 3 seconds in
    if (currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const previousIndex =
      (currentIndex - 1 + tracks.length) %
      tracks.length;

    play(tracks[previousIndex]);
  };

  /* --------------------------------------------------
     SEEK
  -------------------------------------------------- */

  const seek = (time: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    const safeTime = Math.min(
      Math.max(time, 0),
      Number.isFinite(audio.duration)
        ? audio.duration
        : time
    );

    audio.currentTime = safeTime;

    // Update immediately so the waveform responds instantly
    setCurrentTime(safeTime);
  };

  /* --------------------------------------------------
     VOLUME SETTER
  -------------------------------------------------- */

  const setVolume = (value: number) => {
    const safeVolume = Math.min(
      1,
      Math.max(0, value)
    );

    setVolumeState(safeVolume);
  };

  /* --------------------------------------------------
     AUDIO EVENT HANDLERS
  -------------------------------------------------- */

  const handlePlay = () => {
    setIsPlaying(true);
    startPlaybackClock();
  };

  const handlePause = () => {
    setIsPlaying(false);
    stopPlaybackClock();

    const audio = audioRef.current;

    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = (
    event: React.SyntheticEvent<HTMLAudioElement>
  ) => {
    const audio = event.currentTarget;

    if (Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  };

  const handleEnded = () => {
    stopPlaybackClock();

    setCurrentTime(0);
    setIsPlaying(false);

    next();
  };

  return (
    <PlayerContext.Provider
      value={{
        track,
        isPlaying,
        currentTime,
        duration,
        volume,

        play,
        toggle,

        next,
        prev,

        seek,
        setVolume,
      }}
    >
      {children}

      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
        onPlay={handlePlay}
        onPause={handlePause}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </PlayerContext.Provider>
  );
}

