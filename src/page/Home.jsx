import { useCallback, useEffect, useRef, useState } from "react";
import { sfx } from "../sound/audio";
import PixelNav from "../components/PixelNav";
import PixelSky from "../components/PixelSky";
import threadsShot from "../../visuals/web/threads-pixel.webp";
import petShot from "../../visuals/web/pet-ad-pixel.webp";
import decisionShot from "../../visuals/web/decision-pixel.webp";
import typographyVid from "../media/web/typography.mp4";
import transitionVid from "../media/web/transitional-vid.mp4";
import oldVid from "../media/web/old-vid.mp4";
import "./PixelHome.css";

/* =====================================================================
   CONTENT: edit these to change the text on the page
   ===================================================================== */
const MSGS = [
  "A wild FULL-STACK DEVELOPER appeared!",
  "AARON used CLEAN CODE! It’s super effective!",
  "Passionate about clean, efficient web apps and cutting great videos.",
  "Press START to see the quest log...",
];

const STATS = [
  ["FRONT", 9],
  ["BACK", 8],
  ["UI/UX", 8],
  ["VIDEO", 9],
  ["COFFEE", 10],
];

const OPTIONS = [
  ["web", "BUILDING WEB APPS"],
  ["vid", "EDITING VIDEOS"],
];

const QUESTS = {
  web: {
    name: "WEB APPS",
    title: "QUEST 1: BUILDING WEB APPS",
    icon: "</>",
    tone: "",
    items: [
      {
        title: "THREADS",
        text: "An order tracking platform with real-time status updates, cash-flow management and live chat between customers and managers.",
        tags: "JS / NODE / MYSQL / SOCKET.IO",
        img: threadsShot,
      },
      {
        title: "PET ADOPTION",
        text: "A pet adoption app built like a dating app: browse rescues, match with a pet and start the conversation.",
        tags: "REACT / NODE / TAILWIND",
        img: petShot,
      },
      {
        title: "DECISION APP",
        text: "A decision support tool built on weighted scoring logic, with a scalable MVC backend architecture.",
        tags: "REACT / NODE / MYSQL",
        img: decisionShot,
      },
    ],
  },
  vid: {
    name: "VIDEO EDITS",
    title: "QUEST 2: EDITING VIDEOS",
    icon: "PLAY",
    tone: "vid",
    items: [
      {
        title: "TYPOGRAPHY",
        text: "A kinetic type piece built around rhythm, timing and clean letter animation.",
        tags: "TYPE / MOTION",
        video: typographyVid,
      },
      {
        title: "TRANSITIONS",
        text: "Match cuts, whip pans and speed ramps stitched into one continuous flow.",
        tags: "TRANSITION / SFX",
        video: transitionVid,
      },
      {
        title: "OLD VIDEO",
        text: "One of my earlier edits, kept here as a marker of how far the cuts have come.",
        tags: "EDIT / COLOR",
        video: oldVid,
      },
    ],
  },
};

/* =====================================================================
   PORTRAIT: 16x16 sprite (edit ART / PAL to redraw it)
   ===================================================================== */
const ART = [
  "................",
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHSSSSSSHH...",
  "...HSSSSSSSSH...",
  "...SSESSSSESS...",
  "...SSSSSSSSSS...",
  "....SSSMMSSS....",
  ".....sSSSSs.....",
  "..GGGGsSSsGGGG..",
  ".GGGGGGGGGGGGGG.",
  "GGGGGGGGGGGGGGGG",
  "GGTTTTTTTTTTTTGG",
  "GGTTTTTTTTTTTTGG",
  "GGGGGGGGGGGGGGGG",
];
const PAL = { H: "#1a1210", S: "#d9a373", s: "#b5804f", E: "#000", M: "#7a3b2e", G: "#0f1f1e", T: "#14b8a6" };

function Portrait() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    const paint = (blink) => {
      for (let y = 0; y < 16; y++) {
        ctx.fillStyle = y % 4 < 2 ? "#0a4a43" : "#08403a";
        ctx.fillRect(0, y, 16, 1);
      }
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = "#14b8a644";
        ctx.fillRect((i * 7 + 3) % 16, (i * 5) % 7, 1, 1);
      }
      ART.forEach((row, y) =>
        [...row].forEach((ch, x) => {
          if (ch === ".") return;
          ctx.fillStyle = ch === "E" && blink ? PAL.S : PAL[ch];
          ctx.fillRect(x, y, 1, 1);
        })
      );
    };

    paint(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let timeout;
    const interval = setInterval(() => {
      paint(true);
      timeout = setTimeout(() => paint(false), 160);
    }, 3200);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return <canvas ref={ref} width={16} height={16} className="ph-portrait" role="img" aria-label="Pixel portrait of Aaron" />;
}

/* =====================================================================
   SMALL PARTS
   ===================================================================== */
function StatBar({ label, value }) {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const timers = Array.from({ length: value }, (_, i) => setTimeout(() => setFilled(i + 1), 500 + i * 110));
    return () => timers.forEach(clearTimeout);
  }, [value]);

  return (
    <>
      <span>{label}</span>
      <div className="ph-bar">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} className={i < filled ? "f" : ""} />
        ))}
      </div>
    </>
  );
}

/* =====================================================================
   SCROLL: a chunky ease-out, like a game camera settling on a screen
   ===================================================================== */
let scrollFrame = 0;

function cancelScroll() {
  if (scrollFrame) cancelAnimationFrame(scrollFrame);
  scrollFrame = 0;
}

function scrollToY(targetY, onDone) {
  cancelScroll();
  const startY = window.scrollY;
  const distance = targetY - startY;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || Math.abs(distance) < 2) {
    window.scrollTo({ top: targetY, behavior: "auto" });
    onDone?.();
    return;
  }

  const duration = Math.min(900, 420 + Math.abs(distance) * 0.3);
  const started = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const y = startY + distance * eased;
    window.scrollTo({ top: Math.round(y / 2) * 2, behavior: "auto" });
    if (t < 1) {
      scrollFrame = requestAnimationFrame(tick);
    } else {
      scrollFrame = 0;
      onDone?.();
    }
  };

  scrollFrame = requestAnimationFrame(tick);
}

/* =====================================================================
   PAGE
   ===================================================================== */
export default function PixelHome() {
  const [pick, setPick] = useState("web");
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(() => MSGS);
  const [mi, setMi] = useState(0);
  const [typed, setTyped] = useState("");
  const [video, setVideo] = useState(null);
  const questRef = useRef(null);
  const progressRef = useRef(null);

  // every way out of the viewer (button, backdrop, Escape) shares one sound
  const dismissVideo = useCallback(() => {
    sfx.close();
    setVideo(null);
  }, []);

  // dialog typewriter
  useEffect(() => {
    const message = msgs[mi];
    let i = 0;
    let timeout;
    setTyped("");
    const interval = setInterval(() => {
      i++;
      setTyped(message.slice(0, i));
      if (i % 3 === 0) sfx.type();
      if (i >= message.length) {
        clearInterval(interval);
        timeout = setTimeout(() => setMi((x) => (x + 1) % msgs.length), 2600);
      }
    }, 38);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [mi, msgs]);

  const choose = useCallback((key) => {
    sfx.select();
    setPick(key);
    const last = MSGS.length - 1;
    setMsgs((list) => list.map((message, i) => (i === last ? `${QUESTS[key].name} selected! Press START.` : message)));
    setMi(last);
  }, []);

  // ArrowUp / ArrowDown switch the selection while the quest log is closed
  useEffect(() => {
    const onKey = (event) => {
      if (!open && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        choose(pick === "web" ? "vid" : "web");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pick, choose]);

  // Let the user take over at any moment mid-scroll
  useEffect(() => {
    const stop = () => cancelScroll();
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      cancelScroll();
    };
  }, []);

  // Video modal: freeze the page behind it, close on Escape
  useEffect(() => {
    if (!video) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") dismissVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [video, dismissVideo]);

  // Pixel rail: keeps scroll position readable while scrollbars are hidden
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) progressRef.current.style.top = `${progress * 82}%`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [open, pick]);

  const reveal = useCallback((ref) => {
    setOpen(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const node = ref.current;
        if (!node) return;
        scrollToY(node.getBoundingClientRect().top + window.scrollY - 24);
      })
    );
  }, []);

  const start = () => {
    sfx.start();
    reveal(questRef);
  };

  const back = () => {
    sfx.back();
    // scroll first, then collapse the quest so the page does not jump
    if (open) scrollToY(0, () => setOpen(false));
    else scrollToY(0);
  };

  const play = (item) => {
    sfx.start();
    setVideo(item);
  };

  const quest = QUESTS[pick];

  return (
    <div className="ph">
      <PixelSky />
      <PixelNav />

      <main className="ph-hero">
        <div>
          <div className="ph-lbl">★ PLAYER 1 · 1UP</div>
          <h1 className="ph-title">
            I’M
            <br />
            <span>
              AARON
              <br />
              PAGENTE
            </span>
          </h1>

          <div className="ph-menu" role="group" aria-label="Choose your quest">
            {OPTIONS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`ph-opt${pick === key ? " on" : ""}`}
                aria-pressed={pick === key}
                onClick={() => choose(key)}
              >
                <span className="ph-ar" aria-hidden="true">
                  ▶
                </span>
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="ph-px ph-dlg"
            onClick={() => setMi((i) => (i + 1) % msgs.length)}
            aria-live="polite"
          >
            <span>{typed}</span>
            <i aria-hidden="true">▼</i>
          </button>

          <div className="ph-btns">
            <button type="button" className="ph-btn ph-blink" onClick={start}>
              PRESS START
            </button>
          </div>
        </div>

        <div className="ph-card ph-px">
          <div className="ph-tag">LV.99 FULL-STACK</div>
          <Portrait />
          <div className="ph-name">
            AARON<span>HP ♥♥♥♥♥</span>
          </div>
          <div className="ph-stats">
            {STATS.map(([label, value]) => (
              <StatBar key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      </main>

      {open && (
        <section className="ph-quest" ref={questRef} aria-label="Quest log">
          <div className="ph-qh">
            <div className="ph-qt">{quest.title}</div>
            <button type="button" className="ph-btn ph-btn-s" onClick={back}>
              BACK
            </button>
          </div>

          <div className="ph-qgrid" key={pick}>
            {quest.items.map((item, i) => (
              <div
                key={item.title}
                className={`ph-px ph-qc ${quest.tone}${item.video ? " playable" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
                onClick={item.video ? () => play(item) : undefined}
              >
                <div className="ph-th">
                  {item.video ? (
                    <>
                      <video
                        className="ph-thumb"
                        src={`${item.video}#t=0.1`}
                        preload="metadata"
                        muted
                        playsInline
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                      <span className="ph-play" aria-hidden="true">
                        ▶
                      </span>
                    </>
                  ) : item.img ? (
                    <img src={item.img} alt={`${item.title} screenshot`} loading="lazy" decoding="async" />
                  ) : (
                    quest.icon
                  )}
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <small>{item.tags}</small>
                {item.video && (
                  <button
                    type="button"
                    className="ph-watch"
                    onClick={(event) => {
                      event.stopPropagation();
                      play(item);
                    }}
                  >
                    ▶ PLAY
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {video && (
        <div
          className="ph-vm"
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          onClick={dismissVideo}
        >
          <div className="ph-vm-box" onClick={(event) => event.stopPropagation()}>
            <div className="ph-vm-bar">
              <span>{video.title}</span>
              <button type="button" className="ph-vm-x" onClick={dismissVideo} autoFocus>
                CLOSE ✕
              </button>
            </div>
            <video className="ph-vm-vid" src={video.video} controls autoPlay playsInline />
            <div className="ph-vm-foot">{video.tags}</div>
          </div>
        </div>
      )}

      <div className={`ph-prog${open ? " on" : ""}`} aria-hidden="true">
        <i ref={progressRef} />
      </div>
    </div>
  );
}
