"use client";

import { tracks } from "@/data/tracks";
import Waveform from "@/components/Waveform";
import MusicPlayer from "@/components/MusicPlayer";
import {
  PlayerProvider,
  usePlayer,
} from "@/components/PlayerProvider";
import {
  PlayIcon,
  PauseIcon,
} from "@/components/Icons";

import "./music.css";
function MusicLibrary() {
  const {
    track: current,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
  } = usePlayer();

  return (
    <main className="music-library">
      {/* ================= HERO ================= */}

      <section className="music-hero">
        <div className="music-hero-top">
          <div className="music-hero-index">
            <span>01</span>
            <span>MUSIC LIBRARY</span>
          </div>

          <span className="music-hero-count">
            {tracks.length
              .toString()
              .padStart(2, "0")}{" "}
            TRACKS
          </span>
        </div>

        <div className="music-hero-content">
          <p className="music-eyebrow">
            ORIGINAL MUSIC
          </p>

          <h1>
            Music for
            <br />
            <span>your story.</span>
          </h1>

          <p className="music-intro-text">
            Original compositions made for
            Instagram Reels, YouTube videos,
            short films, edits, podcasts and
            creative projects of all kinds.
          </p>
        </div>

        <div className="music-hero-bottom">
          <span>
            SOCIAL · VIDEO · FILM · CREATIVE
          </span>

          <span className="music-scroll">
            SCROLL TO EXPLORE
            <i>↓</i>
          </span>
        </div>
      </section>

      {/* ================= TRACKS ================= */}

      <section className="music-library-list">
        <div className="music-list-top">
          <div>
            <span className="music-section-number">
              02
            </span>

            <span className="music-section-label">
              SELECTED MUSIC
            </span>
          </div>

          <p>
            {tracks.length
              .toString()
              .padStart(2, "0")}{" "}
            ORIGINAL TRACKS
          </p>
        </div>

        <div className="music-list-heading">
          <span>TRACK</span>
          <span>TYPE</span>
          <span>YEAR</span>
          <span />
        </div>

        {tracks.map((item, index) => {
          const active =
            current.id === item.id;

          const playing =
            active && isPlaying;

          const progress =
            active && duration > 0
              ? Math.min(
                  1,
                  Math.max(
                    0,
                    currentTime / duration
                  )
                )
              : 0;

          return (
            <article
              key={item.id}
              className={`music-library-track ${
                active ? "active" : ""
              }`}
            >
              {/* Number */}

              <span className="music-track-number">
                {(index + 1)
                  .toString()
                  .padStart(2, "0")}
              </span>

              {/* Cover */}

              <div className="music-track-cover">
                <img
                  src={item.coverUrl}
                  alt=""
                />

                <button
                  type="button"
                  onClick={() => toggle(item)}
                  aria-label={
                    playing
                      ? `Pause ${item.title}`
                      : `Play ${item.title}`
                  }
                >
                  {playing ? (
                    <PauseIcon />
                  ) : (
                    <PlayIcon />
                  )}
                </button>
              </div>

              {/* Track information */}

              <div className="music-track-main">
                <button
                  type="button"
                  className="music-track-title"
                  onClick={() => toggle(item)}
                >
                  {item.title}
                </button>

                <div className="music-track-details">
                  <span>{item.genre}</span>

                  {item.artist && (
                    <span>{item.artist}</span>
                  )}
                </div>

                <div className="music-track-wave">
                  <Waveform
                    seed={item.id}
                    bars={72}
                    progress={progress}
                    onSeek={
                      active
                        ? (ratio) => {
                            if (duration > 0) {
                              seek(
                                ratio * duration
                              );
                            }
                          }
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* Year */}

              <span className="music-track-year">
                {item.year}
              </span>

              {/* Actions */}

              <div className="music-track-action">
                <a
                  href={item.audioUrl}
                  download
                  className="music-download"
                  aria-label={`Download ${item.title}`}
                >
                  ↓
                </a>

                <button
                  type="button"
                  className={`music-play ${
                    playing ? "active" : ""
                  }`}
                  onClick={() => toggle(item)}
                  aria-label={
                    playing
                      ? `Pause ${item.title}`
                      : `Play ${item.title}`
                  }
                >
                  {playing ? (
                    <PauseIcon />
                  ) : (
                    <PlayIcon />
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* ================= USAGE ================= */}

      <section className="music-usage">
        <div className="music-usage-heading">
          <p className="music-eyebrow">
            USE THE MUSIC
          </p>

          <h2>
            Made to live
            <br />
            <span>outside the studio.</span>
          </h2>
        </div>

        <div className="music-usage-copy">
          <p>
            These tracks are created to work
            alongside visuals — from a
            15-second reel to a full-length
            YouTube video.
          </p>

          <div className="music-usage-tags">
            <span>INSTAGRAM REELS</span>
            <span>YOUTUBE</span>
            <span>SHORT FILMS</span>
            <span>EDITING</span>
            <span>PODCASTS</span>
            <span>CREATIVE PROJECTS</span>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="music-footer">
        <span>© 2026 PROBHANGSHU SC</span>

        <a href="/">
          Back to portfolio ↗
        </a>
      </footer>

      <MusicPlayer />
    </main>
  );
}

export default function MusicPage() {
  return (
    <PlayerProvider>
      <MusicLibrary />
    </PlayerProvider>
  );
}