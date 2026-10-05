"use client";

import { useEffect, useRef, useState } from "react";
import { tracks } from "@/data/tracks";
import MusicPlayer from "@/components/MusicPlayer";
import Waveform from "@/components/Waveform";
import ThemeSwitch from "@/components/ThemeSwitch";
import { PlayerProvider, usePlayer } from "@/components/PlayerProvider";
import { PlayIcon, PauseIcon } from "@/components/Icons";

const Eq = () => (
  <span className="eq" aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
  </span>
);

// Liquid glass refraction — Chromium only
const GlassFilter = () => (
  <svg
    width="0"
    height="0"
    style={{ position: "absolute" }}
    aria-hidden="true"
  >
    <filter
      id="liquid"
      x="0"
      y="0"
      width="100%"
      height="100%"
      colorInterpolationFilters="sRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.008 0.012"
        numOctaves="2"
        seed="3"
        result="n"
      />
      <feGaussianBlur in="n" stdDeviation="2" result="b" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="b"
        scale="28"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

const links = [
  { id: "top", label: "Home" },
  { id: "music", label: "Music" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const { isPlaying } = usePlayer();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [pill, setPill] = useState({ x: 0, w: 0 });

  const linksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Detect active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
      }
    );

    links.forEach((link) => {
      const element = document.getElementById(link.id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Desktop active pill
  useEffect(() => {
    const measure = () => {
      const element =
        linksRef.current?.querySelector<HTMLElement>(
          `[data-id="${active}"]`
        );

      if (element) {
        setPill({
          x: element.offsetLeft,
          w: element.offsetWidth,
        });
      }
    };

    measure();

    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  return (
    <header
      className={`topbar ${scrolled ? "scrolled" : ""} ${
        open ? "open" : ""
      }`}
    >
      <a
        href="#top"
        className="topbar-logo"
        onClick={() => setOpen(false)}
      >
        PROBHANGSHU
        <span className="logo-dot">.</span>
      </a>

      {/* Desktop navigation */}
      <nav className="topbar-links" ref={linksRef}>
        <span
          className="topbar-pill"
          style={{
            ["--x" as string]: `${pill.x}px`,
            ["--w" as string]: `${pill.w}px`,
            opacity: pill.w ? 1 : 0,
          }}
        />

        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            data-id={link.id}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="topbar-right">
        <div
          className={`topbar-status ${
            isPlaying ? "playing" : ""
          }`}
        >
          {isPlaying ? (
            <Eq />
          ) : (
            <span className="status-dot" />
          )}

          <em>
            {isPlaying
              ? "Now playing"
              : "Available for projects"}
          </em>
        </div>

        <ThemeSwitch />

        <button
          type="button"
          className="topbar-burger"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <i />
          <i />
        </button>
      </div>

      {/* Mobile navigation */}
      <div className="topbar-menu">
        {links.map((link, index) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            style={{
              ["--i" as string]: index,
            }}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}

        <a
          href="mailto:vishalprobhangshu@gmail.com"
          style={{
            ["--i" as string]: links.length,
          }}
          onClick={() => setOpen(false)}
        >
          Start a project ↗
        </a>
      </div>
    </header>
  );
}

function HomeContent() {
  const {
    track: current,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
  } = usePlayer();

  const featuredTrack = tracks[0];

  const featuredActive = current.id === featuredTrack.id;
  const playingFeatured = isPlaying && featuredActive;

  const progress =
    featuredActive && duration > 0
      ? Math.min(1, Math.max(0, currentTime / duration))
      : 0;

  // Chromium refraction
  useEffect(() => {
    if (/Chrome|Chromium|Edg/.test(navigator.userAgent)) {
      document.documentElement.classList.add("refract");
    }
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GlassFilter />

      <main className="site">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <Navbar />

        {/* HERO */}
        <section className="hero" id="top">
          <div className="hero-background">
            <img src="/bg.png" alt="" aria-hidden="true" />
            <div className="hero-background-overlay" />
          </div>

          <div className="hero-left">
            <p className="eyebrow">
              COMPOSER · PRODUCER · SOUND DESIGNER
            </p>

            <h1>
              Sound
              <br />
              <span>that stays.</span>
            </h1>

            <p className="hero-description">
              Original soundtracks crafted around atmosphere, emotion and the
              stories that deserve their own sound.
            </p>

            <a href="#music" className="hero-button">
              <span>Explore the music</span>
              <span className="arrow">↗</span>
            </a>
          </div>
        </section>

        {/* FEATURED */}
        <section className="featured" id="music">
          <div className="section-heading reveal">
            <div>
              <span className="section-number">01</span>
              <span className="section-label">FEATURED WORK</span>
            </div>
            <p>Selected composition</p>
          </div>

          <div
            className="featured-card reveal"
            style={{ ["--d" as string]: "0.1s" }}
          >
            <div className="featured-cover">
              <img
                src={featuredTrack.coverUrl}
                alt={featuredTrack.title}
              />
              <div className="cover-overlay">
                <span>ORIGINAL SOUNDTRACK</span>
              </div>
            </div>

            <div className="featured-content">
              <div>
                <p className="track-type">{featuredTrack.genre}</p>
                <h2>{featuredTrack.title}</h2>
                <p className="track-description">
                  {featuredTrack.description}
                </p>

                <div className="featured-wave">
                  <Waveform
                    seed={featuredTrack.id}
                    bars={56}
                    progress={progress}
                    onSeek={
                      featuredActive
                        ? (ratio) => seek(ratio * duration)
                        : undefined
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                className="big-play"
                onClick={() => {
                  window.dispatchEvent(
                    new Event("open-music-player")
                  );
                  toggle(featuredTrack);
                }}
              >
                <span>
                  {playingFeatured ? <PauseIcon /> : <PlayIcon />}
                </span>
                {playingFeatured ? "Pause" : "Listen now"}
              </button>
            </div>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section className="tracks-section">
          <div className="section-heading reveal">
            <div>
              <span className="section-number">02</span>
              <span className="section-label">SELECTED WORK</span>
            </div>

            <p>
              {Math.min(tracks.length, 3)
                .toString()
                .padStart(2, "0")}{" "}
              selected tracks
            </p>
          </div>

          <div className="track-list">
            {tracks.slice(0, 3).map((track, index) => {
              const active = current.id === track.id;
              const playing = active && isPlaying;

              return (
                <div
                  key={track.id}
                  className={`track-row reveal ${
                    active ? "active" : ""
                  }`}
                  style={{
                    ["--d" as string]: `${index * 0.07}s`,
                  }}
                >
                  <span className="track-number">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>

                  <img
                    src={track.coverUrl}
                    alt=""
                    className="track-thumb"
                  />

                  <button
                    type="button"
                    className="track-details"
                    onClick={() => toggle(track)}
                    aria-label={
                      playing
                        ? `Pause ${track.title}`
                        : `Play ${track.title}`
                    }
                  >
                    <strong>{track.title}</strong>
                    <small>{track.genre}</small>
                  </button>

                  <span className="track-year">{track.year}</span>

                  <div className="track-actions">
                    <a
                      className="track-download"
                      href={track.audioUrl}
                      download
                      aria-label={`Download ${track.title}`}
                    >
                      ↓
                    </a>

                    <button
                      type="button"
                      className={`track-play ${
                        active ? "active" : ""
                      }`}
                      onClick={() => toggle(track)}
                      aria-label={
                        playing
                          ? `Pause ${track.title}`
                          : `Play ${track.title}`
                      }
                    >
                      {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MORE TRACKS */}
          {tracks.length > 3 && (
            <div className="more-tracks reveal">
              <a href="/tracks">
                <span>MORE TRACKS</span>
                <span className="more-tracks-arrow">↗</span>
              </a>

              <span className="more-tracks-count">
                {tracks.length - 3} more{" "}
                {tracks.length - 3 === 1 ? "track" : "tracks"}
              </span>
            </div>
          )}
        </section>

        {/* ABOUT (FIXED STRUCTURE) */}
        <section className="about" id="about">
          <div className="section-heading reveal">
            <div>
              <span className="section-number">03</span>
              <span className="section-label">ABOUT</span>
            </div>
            <p>Behind the sound</p>
          </div>

          <div className="about-stage">
            {/* Background typography */}
            <div className="about-ghost-text" aria-hidden="true">
              SOUND
            </div>

            {/* Main Content & Image Wrapper */}
            <div className="about-grid">
              <div className="about-content reveal">
                <span className="about-mark">“</span>

                <h2>
                  Every story
                  <br />
                  <span>has a sound.</span>
                </h2>

                <div
                  className="about-copy"
                  style={{ ["--d" as string]: "0.15s" }}
                >
                  <p>
                    I create original music and sound for stories that deserve
                    something more than silence.
                  </p>

                  <p>
                    From intimate atmospheres to expansive cinematic compositions,
                    every piece is built around emotion, movement and atmosphere.
                  </p>

                  <div className="about-meta-list">
                    <div className="about-meta">
                      <span>01</span>
                      <span>COMPOSITION</span>
                    </div>
                    <div className="about-meta">
                      <span>02</span>
                      <span>PRODUCTION</span>
                    </div>
                    <div className="about-meta">
                      <span>03</span>
                      <span>SOUND DESIGN</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portrait cutout */}
              <div
                className="about-portrait reveal"
                style={{ ["--d" as string]: "0.2s" }}
              >
                <img src="/about.png" alt="PROBHANGSHU" />
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact">
          <p className="eyebrow reveal">HAVE A PROJECT?</p>

          <h2 className="reveal" style={{ ["--d" as string]: "0.1s" }}>
            Let's create
            <br />
            something <i>lasting.</i>
          </h2>

          <a
            className="reveal"
            style={{ ["--d" as string]: "0.2s" }}
            href="mailto:vishalprobhangshu@gmail.com"
          >
            Start a conversation ↗
          </a>
        </section>

        {/* FOOTER */}
        <footer>
          <span>© 2026 PROBHANGSHU SC</span>
          <span>Original music & sound</span>
        </footer>
      </main>

      <MusicPlayer />
    </>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <HomeContent />
    </PlayerProvider>
  );
}