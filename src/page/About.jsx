import { useEffect, useRef, useState } from "react";
import PixelNav from "../components/PixelNav";
import PixelSky from "../components/PixelSky";
import { sfx } from "../sound/audio";
import typographyVid from "../media/web/typography.mp4";
import transitionVid from "../media/web/transitional-vid.mp4";
import feverVid from "../media/web/fever-dream.mp4";
import ugcVid from "../media/web/UGC-Sample.mp4";
import lyricVid from "../media/web/lyric-vid.mp4";
import facelessVid from "../media/web/faceless-channel-vid.mp4";
import oldVid from "../media/web/old-vid.mp4";
import "./PixelHome.css";
import "./About.css";

// order the reel plays in
const REEL = [typographyVid, transitionVid, feverVid, ugcVid, lyricVid, facelessVid, oldVid];

const CLIP_MS = 5200; // how long each clip holds before the cut
const CUT_MS = 260; // point inside the static where the source swaps
const STATIC_MS = 520; // total length of the static wipe
const pad = (n) => String(n).padStart(2, "0");

const STEPS = [
  { label: "GRADE 10", note: "Began the journey", color: "#fde68a" },
  { label: "GRADE 12", note: "Discovered the passion", color: "#5eead4" },
  { label: "PAST YEAR", note: "Real-world projects", color: "#fda4af" },
];

const STATS = [
  { value: 2, label: "YEARS EXPERIENCE" },
  { value: 7, label: "FULL-STACK PROJECTS BUILT" },
  { value: 2, label: "STATIC PROJECTS BUILT" },
];

// newest first
const EXPERIENCE = [
  {
    when: "SEP – OCT 2026",
    role: "FULL-STACK DEVELOPER",
    org: "Cloudwalk Inc. · Intern",
    note: "Deployed site builds through Git and picked up new technologies on the job.",
  },
  {
    when: "JUN – AUG 2026",
    role: "RECEPTIONIST",
    org: "Prince Jun Devt. Corp · Project-based",
    note: "Assisted clients at the front desk and coordinated with the team under pressure.",
  },
  {
    when: "OCT 2025 – JUN 2026",
    role: "VIDEO EDITOR",
    org: "Suno · Intern",
    note: "Cut transitional content in CapCut and used AI to generate music and story.",
  },
  {
    when: "MAR 2026",
    role: "ANIMATOR",
    org: "Freelance · Stick-figure animation",
    note: "Illustrated and animated stick-figure scenes that walk through historical events.",
  },
  {
    when: "MAR – NOV 2023",
    role: "CHAT SUPPORT",
    org: "Synagie · Intern",
    note: "Handled multiple customer inquiries across a rotating night and graveyard shift.",
  },
];

// [abbr, name, color], grouped so the inventory stays readable as the stack grows
const TECH = [
  {
    label: "DEVELOPMENT",
    items: [
      ["RE", "React", "#5eead4"],
      ["NJ", "Node.js", "#5eead4"],
      ["EX", "Express", "#ffffff"],
      ["JS", "JavaScript", "#fde68a"],
      ["HT", "HTML", "#e8793a"],
      ["CS", "CSS", "#93c5fd"],
      ["SQ", "MySQL", "#fde68a"],
      ["PG", "PostgreSQL", "#93c5fd"],
      ["PY", "Python", "#fde68a"],
      ["GT", "Git", "#fda4af"],
      ["DK", "Docker", "#93c5fd"],
      ["RN", "Render", "#c4b5fd"],
    ],
  },
  {
    label: "CREATIVE",
    items: [
      ["CC", "CapCut", "#fda4af"],
      ["CV", "Canva", "#5eead4"],
      ["IB", "ibisPaint", "#c4b5fd"],
    ],
  },
  {
    label: "AI TOOLS",
    items: [
      ["GM", "Gemini", "#93c5fd"],
      ["CL", "Claude", "#e8793a"],
      ["SN", "Suno", "#fde68a"],
      ["KR", "Kiro", "#c4b5fd"],
    ],
  },
];

function useReduced() {
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  return reduced;
}

// true once the element has scrolled into view, then stays true
function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let io = null;
    let timer = 0;

    const start = () => {
      if (io) return;
      if (!("IntersectionObserver" in window)) {
        setSeen(true);
        return;
      }
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      io.observe(el);
    };

    // hold until the boot overlay lifts, or the reveal plays behind it
    window.addEventListener("boot:done", start);
    timer = setTimeout(start, 2600);

    return () => {
      window.removeEventListener("boot:done", start);
      clearTimeout(timer);
      if (io) io.disconnect();
    };
  }, []);

  return [ref, seen];
}

// A panel that steps into view the first time it is scrolled to.
// `children` may be a function, which receives `seen`.
function Card({ className = "", label, children }) {
  const [ref, seen] = useReveal();
  return (
    <section ref={ref} aria-label={label} className={`ab-panel ${className} ab-rv${seen ? " in" : ""}`}>
      {typeof children === "function" ? children(seen) : children}
    </section>
  );
}

function Timeline({ seen }) {
  const reduced = useReduced();
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    if (!seen || reduced) return undefined;
    const timers = STEPS.map((_, i) => setTimeout(() => setLit(i), 180 + i * 380));
    return () => timers.forEach(clearTimeout);
  }, [seen, reduced]);

  return (
    <ol className="ab-tl">
      {STEPS.map((step, i) => (
        <li
          key={step.label}
          className={i <= (reduced && seen ? STEPS.length - 1 : lit) ? "on" : ""}
          style={{ "--c": step.color }}
        >
          <span className="ab-node" aria-hidden="true" />
          <b>{step.label}</b>
          <small>{step.note}</small>
        </li>
      ))}
    </ol>
  );
}

function Stat({ value, label, delay, seen }) {
  const reduced = useReduced();
  const filled = Math.min(12, value * 2);
  const [seg, setSeg] = useState(reduced ? filled : 0);
  const [count, setCount] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || !seen) return undefined;
    const timers = [];
    const segDur = 62;

    // segments fill one at a time, each with a blip
    for (let i = 0; i < filled; i++) {
      timers.push(
        setTimeout(() => {
          setSeg(i + 1);
          sfx.tick(i);
        }, delay + i * segDur)
      );
    }

    // the number counts up over the same window
    for (let i = 1; i <= value; i++) {
      timers.push(setTimeout(() => setCount(i), delay + (i / value) * filled * segDur));
    }

    return () => timers.forEach(clearTimeout);
  }, [seen, value, delay, reduced, filled]);

  return (
    <div className="ab-stat">
      <b>{count}</b>
      <span>{label}</span>
      <i className="ab-bar" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <em key={i} className={i < seg ? "f" : ""} />
        ))}
      </i>
    </div>
  );
}

/* TV static: low-res noise stretched up so every grain is a chunky pixel */
function StaticNoise({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const frame = ctx.createImageData(canvas.width, canvas.height);

    const paint = () => {
      const data = frame.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random();
        const level =
          v < 0.22 ? 0 : v < 0.45 ? 40 : v < 0.68 ? 95 : v < 0.86 ? 150 : v < 0.96 ? 205 : 255;
        data[i] = level * 0.75;
        data[i + 1] = level;
        data[i + 2] = level * 0.95;
        data[i + 3] = 255;
      }
      ctx.putImageData(frame, 0, 0);
    };

    paint();
    const interval = setInterval(paint, 55);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <canvas
      ref={ref}
      width={64}
      height={86}
      className={`ab-static${active ? " on" : ""}`}
      aria-hidden="true"
    />
  );
}

function Showreel() {
  const reduced = useReduced();
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [staticOn, setStaticOn] = useState(false);
  const [playing, setPlaying] = useState(!reduced);

  // hold each clip, then open the static window
  useEffect(() => {
    if (!playing) return undefined;
    const startStatic = setTimeout(() => setStaticOn(true), CLIP_MS);
    const swap = setTimeout(() => setIndex((i) => (i + 1) % REEL.length), CLIP_MS + CUT_MS);
    return () => {
      clearTimeout(startStatic);
      clearTimeout(swap);
    };
  }, [index, playing]);

  // the static closes on its own, a beat after the new source is mounted
  useEffect(() => {
    if (!staticOn) return undefined;
    const stop = setTimeout(() => setStaticOn(false), STATIC_MS);
    return () => clearTimeout(stop);
  }, [staticOn]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing, index]);

  const skip = () => setIndex((i) => (i + 1) % REEL.length);

  return (
    <div className="ab-reel">
      <video
        key={REEL[index]}
        ref={videoRef}
        className="ab-reel-vid"
        src={REEL[index]}
        muted
        playsInline
        preload="auto"
        onError={skip}
        aria-label={`Showreel clip ${index + 1} of ${REEL.length}`}
      />
      {/* warms the next clip so the cut lands on a decoded frame */}
      <video
        className="ab-preload"
        src={REEL[(index + 1) % REEL.length]}
        preload="auto"
        muted
        aria-hidden="true"
        tabIndex={-1}
      />

      <StaticNoise active={staticOn} />

      <div className="ab-reel-bar">
        <span>SHOWREEL / EDIT</span>
        <small>
          {pad(index + 1)} / {pad(REEL.length)}
        </small>
      </div>

      {!playing && (
        <button
          type="button"
          className="ab-reel-play"
          onClick={() => {
            sfx.start();
            setPlaying(true);
          }}
        >
          ▶ PLAY REEL
        </button>
      )}
    </div>
  );
}

export default function About() {
  return (
    <div className="ph ab">
      <PixelSky variant="data" />
      <PixelNav />

      <main className="ab-wrap">
        <header className="ab-head">
          <div className="ph-lbl">★ CHARACTER SHEET · ABOUT ME</div>
          <h1 className="ab-title">
            MORE THAN JUST <span>CODE.</span>
          </h1>
        </header>

        <div className="ab-grid">
          <div className="ab-row ab-row1">
            <Card className="ab-journey">
              {(seen) => (
                <>
                  <div className="ab-kicker">QUEST LOG</div>
                  <h2 className="ab-h">MY JOURNEY</h2>

                  <Timeline seen={seen} />

                  <p>
                    I began my software development journey in Grade 10, but it was in Grade 12 that I truly
                    discovered my passion for building software. Although I have two years of formal
                    experience, I’ve been exposed to coding much earlier and started developing websites
                    during my first year in school. Over the past year, I’ve focused on deepening my skills and
                    building real-world projects.
                  </p>
                  <p>
                    I enjoy building ideas as soon as they come to mind and turning them into real, working
                    projects. While my tech stack may not be extensive, it’s one I’m confident using and
                    continually improving.
                  </p>
                  <p className="ab-quote">
                    these 7 full-stack projects displayed were created by me, this does not include the
                    websites I created along with my school group members.
                  </p>
                </>
              )}
            </Card>

            <Card className="ab-stats" label="Stats">
              {(seen) =>
                STATS.map((stat, i) => (
                  <Stat
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    delay={i * 200}
                    seen={seen}
                  />
                ))
              }
            </Card>
          </div>

          <div className="ab-row ab-row2">
            <Card className="ab-tech-panel">
              <div className="ab-kicker">INVENTORY</div>
              <h2 className="ab-h">THE TECH</h2>

              <div className="ab-tech">
                {TECH.map((group, gi) => {
                  // running tile position, so the stagger runs across the groups
                  const base = TECH.slice(0, gi).reduce((n, g) => n + g.items.length, 0);
                  return (
                    <div key={group.label} className="ab-tech-group">
                      <div className="ab-tech-lbl">{group.label}</div>
                      <div className="ab-tech-grid">
                        {group.items.map(([abbr, name, color], i) => (
                          <div key={name} className="ab-tile" style={{ "--c": color, "--i": base + i }}>
                            <b>{abbr}</b>
                            <small>{name}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="ab-creative">
              <div className="ab-kicker">SIDE QUEST</div>
              <h2 className="ab-h">THE CREATIVE SIDE</h2>

              <div className="ab-creative-body">
                <div>
                  <p>
                    Aside from coding, I also have a hobby of editing, as I work part time on Suno for their
                    promotion videos where I make short reel videos using their music.
                  </p>
                  <div className="ab-tags">
                    <span>● VIDEO EDITING</span>
                    <span>● ANIMATING</span>
                  </div>
                </div>

                <Showreel />
              </div>
            </Card>
          </div>

          <Card className="ab-exp">
            <div className="ab-kicker">BATTLE LOG</div>
            <h2 className="ab-h">THE EXPERIENCE</h2>

            <ol className="ab-exp-list">
              {EXPERIENCE.map((job, i) => (
                <li key={job.role} className="ab-exp-item" style={{ "--i": i }}>
                  <span className="ab-exp-when">{job.when}</span>
                  <div className="ab-exp-who">
                    <b>{job.role}</b>
                    <small>{job.org}</small>
                  </div>
                  <p>{job.note}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </main>
    </div>
  );
}
