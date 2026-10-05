"use client";

import React, { useState } from "react";
import { usePlayer } from "./PlayerProvider";
import {
  PlayIcon,
  PauseIcon,
  PrevIcon,
  NextIcon,
} from "./Icons";

const fmt = (t: number) => {
  if (!Number.isFinite(t) || t < 0) return "0:00";

  const minutes = Math.floor(t / 60);

  const seconds = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export default function MusicPlayer() {
  const {
    track,
    isPlaying,
    currentTime,
    duration,
    toggle,
    next,
    prev,
    seek,
  } = usePlayer();

  const [expanded, setExpanded] = useState(false);

  const progress =
    duration > 0
      ? Math.min(1, Math.max(0, currentTime / duration))
      : 0;

  const handlePointerEnter = () => {
    setExpanded(true);
  };

  const handlePointerLeave = () => {
    setExpanded(false);
  };

  const handleMobileToggle = () => {
    setExpanded((value) => !value);
  };

  return (
    <div
      className={`mini-player ${
        isPlaying ? "is-playing" : ""
      } ${expanded ? "is-expanded" : ""}`}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      {/* ---------- MAIN ORB ---------- */}

      <button
        type="button"
        className="mini-player-orb"
        onClick={handleMobileToggle}
        aria-label={
          expanded
            ? "Hide music controls"
            : "Show music controls"
        }
      >
        <span className="mini-player-ring" />

        <img
          src={track.coverUrl}
          alt={track.title}
          className="mini-player-cover"
        />

        <span className="mini-player-icon">
          {isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </span>
      </button>

      {/* ---------- EXPANDED PLAYER ---------- */}

      <div className="mini-player-panel">
        <div className="mini-player-info">
          <strong>{track.title}</strong>
          <small>{track.artist}</small>
        </div>

        <div className="mini-player-controls">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous track"
          >
            <PrevIcon />
          </button>

          <button
            type="button"
            className="mini-player-main"
            onClick={() => toggle()}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next track"
          >
            <NextIcon />
          </button>
        </div>

        <div className="mini-player-progress">
          <span>{fmt(currentTime)}</span>

          <div
            className="mini-player-line"
            onClick={(event) => {
              if (!duration) return;

              const rect =
                event.currentTarget.getBoundingClientRect();

              const ratio =
                (event.clientX - rect.left) / rect.width;

              seek(
                Math.min(1, Math.max(0, ratio)) *
                  duration
              );
            }}
          >
            <span
              style={{
                width: `${progress * 100}%`,
              }}
            />
          </div>

          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}