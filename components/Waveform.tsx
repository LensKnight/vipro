"use client";

import { useMemo, useRef } from "react";

type Props = {
  seed: string | number;
  progress?: number;
  onSeek?: (ratio: number) => void;
  bars?: number;
};

export default function Waveform({
  seed,
  progress = 0,
  onSeek,
  bars = 64,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const safeProgress = Math.min(
    1,
    Math.max(0, progress)
  );

  const heights = useMemo(() => {
    let hash = 0;

    for (const char of String(seed)) {
      hash =
        (hash * 31 + char.charCodeAt(0)) % 997;
    }

    return Array.from(
      { length: bars },
      (_, index) => {
        const value = Math.abs(
          Math.sin(index * 0.9 + hash) *
            Math.cos(
              index * 0.37 + hash * 0.1
            )
        );

        return Math.round(
          (0.2 + 0.8 * value) * 100
        );
      }
    );
  }, [seed, bars]);

  const seekFrom = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!onSeek || !ref.current) return;

    const rect =
      ref.current.getBoundingClientRect();

    if (!rect.width) return;

    const ratio =
      (event.clientX - rect.left) /
      rect.width;

    onSeek(
      Math.min(
        1,
        Math.max(0, ratio)
      )
    );
  };

  return (
    <div
      ref={ref}
      className={`waveform ${
        onSeek ? "seekable" : ""
      }`}
      style={
        {
          "--progress": `${safeProgress * 100}%`,
        } as React.CSSProperties
      }
      onPointerDown={(event) => {
        if (!onSeek) return;

        event.currentTarget.setPointerCapture(
          event.pointerId
        );

        seekFrom(event);
      }}
      onPointerMove={(event) => {
        if (
          onSeek &&
          event.buttons === 1
        ) {
          seekFrom(event);
        }
      }}
    >
      {heights.map((height, index) => {
        /*
          0 → first bar
          1 → last bar

          Using bars - 1 makes the progress
          line map exactly across the waveform.
        */
        const barPosition =
          bars > 1
            ? index / (bars - 1)
            : 0;

        const isPlayed =
          barPosition <= safeProgress;

        return (
          <span
            key={index}
            className={
              isPlayed ? "on" : ""
            }
            style={{
              height: `${height}%`,
            }}
          />
        );
      })}
    </div>
  );
}