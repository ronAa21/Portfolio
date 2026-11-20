import { useEffect, useRef, useState } from "react";
import { duckMusic, sfx } from "../sound/audio";
import PixelNav from "../components/PixelNav";
import petShot from "../../visuals/web/pet-ad-pixel.webp";
import notesShot from "../../visuals/web/notes-pixel.webp";
import decisionShot from "../../visuals/web/decision-pixel.webp";
import megacatShot from "../../visuals/web/megacat-pixel.webp";
import gutenverseShot from "../../visuals/web/gutenverse-pixel.webp";
import typographyVid from "../media/web/typography.mp4";
import transitionVid from "../media/web/transitional-vid.mp4";
import oldVid from "../media/web/old-vid.mp4";
import ugcVid from "../media/web/UGC-Sample.mp4";
import facelessVid from "../media/web/faceless-channel-vid.mp4";
import feverVid from "../media/web/fever-dream.mp4";
import lyricVid from "../media/web/lyric-vid.mp4";
import "./PixelHome.css";
import "./StageSelect.css";

/* =====================================================================
   CONTENT: two stage lists. Add / reorder entries here.
   `no` is the stage number, `tag` appends a label like "- BOSS".
   ===================================================================== */
const APPS = [
  {
    no: "00",
    name: "PROJECT S",
    tag: "BOSS",
    title: "Project S",
    screen: "Threads Web Application Video Demo",
    desc: "An order tracking platform with real-time status updates, a cash flow management system, and a real-time chat feature that enables seamless communication between customers and managers.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "MySQL", "Socket.io"],
    live: "https://project-s-nhsi.onrender.com/",
    code: "https://github.com/ronAa21/Project-CashFlow",
    video: "https://www.youtube.com/embed/7gD3Z_tc0Rw?autoplay=1&rel=0",
    embed: true,
    flavor: "PROJECT S used REAL-TIME CHAT! It’s super effective!",
  },
  {
    no: "01",
    name: "PET ADOPTION APP",
    title: "Pet Adoption App",
    screen: "Pet Adoption App — Live Preview",
    desc: "A pet adoption app with the format of a dating app: browse rescues, match with a pet, and start the adoption conversation.",
    tech: ["React", "Node.js", "Tailwind", "MySQL", "Axios"],
    live: "https://pet-adoption-web-t3i8.onrender.com",
    code: "https://github.com/ronAa21/Pet-Adoption/tree/main",
    image: petShot,
    flavor: "PET ADOPTION APP used SWIPE MATCHING! It’s super effective!",
  },
  {
    no: "02",
    name: "NOTES APP",
    title: "Notes App",
    screen: "Notes App — CRUD Demo",
    desc: "A simple notes app that highlights full CRUD: create, read, update and delete notes through a small Node + MySQL backend.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "MySQL"],
    live: "https://first-notes.onrender.com/index.html",
    code: "https://github.com/ronAa21/Notes-Website",
    image: notesShot,
    flavor: "NOTES APP used CRUD COMBO! It’s super effective!",
  },
  {
    no: "03",
    name: "DECISION-APP",
    title: "Decision-App",
    screen: "Decision-App — Weighted Scoring",
    desc: "A decision support tool focusing on weighted scoring logic, and also highlights the use of a scalable MVC backend architecture.",
    tech: ["ReactJs", "JavaScript", "Node.js", "MySQL"],
    live: "",
    code: "https://github.com/ronAa21/Decision-app/tree/main",
    image: decisionShot,
    flavor: "DECISION-APP used WEIGHTED SCORING! It’s super effective!",
  },
  {
    no: "04",
    name: "LIBRARY",
    title: "Library",
    screen: "Library — Masonry Gallery",
    desc: "A gallery site focusing on masonry layouts that also highlights the use of CRUD across the collection.",
    tech: ["HTML/CSS", "JavaScript", "Node.js", "MySQL", "Grid"],
    live: "",
    code: "https://github.com/ronAa21/mock-library",
    flavor: "LIBRARY used MASONRY GRID! It’s super effective!",
  },
  {
    no: "05",
    name: "MEGACAT ABOUT-ME SITE",
    title: "Megacat About-me",
    screen: "Megacat — About-Me Site",
    desc: "A commissioned about-me website for a client I worked with previously at Megacat.",
    tech: ["HTML/CSS", "JavaScript"],
    live: "https://about-me-website-five.vercel.app/",
    code: "https://github.com/ronAa21/About-me-website",
    image: megacatShot,
    flavor: "MEGACAT used COMMISSION MODE! It’s super effective!",
  },
  {
    no: "06",
    name: "GUTENVERSE (CLONE)",
    title: "Gutenverse Clone",
    screen: "Gutenverse — Static Clone",
    desc: "A static rebuild of the Gutenverse site, focused on matching the original layout with a clean CSS grid.",
    tech: ["HTML", "CSS", "Grid"],
    live: "https://gutenverse-clone-3q4z.vercel.app/",
    code: "https://github.com/ronAa21/Gutenverse-Clone-",
    image: gutenverseShot,
    flavor: "GUTENVERSE used GRID CLONE! It’s super effective!",
  },
];

const VIDEOS = [
  {
    no: "00",
    name: "TYPOGRAPHY",
    title: "Typography",
    screen: "Typography — Kinetic Type",
    desc: "A kinetic type piece built around rhythm, timing and clean letter animation.",
    tech: ["Type", "Motion", "Timing"],
    video: typographyVid,
    flavor: "TYPOGRAPHY used KINETIC TYPE! It’s super effective!",
  },
  {
    no: "01",
    name: "TRANSITIONS",
    title: "Transitions",
    screen: "Transitions — Match Cuts",
    desc: "Match cuts, whip pans and speed ramps stitched into one continuous flow.",
    tech: ["Transitions", "SFX", "Pacing"],
    video: transitionVid,
    flavor: "TRANSITIONS used WHIP PAN! It’s super effective!",
  },
  {
    no: "02",
    name: "OLD VIDEO",
    title: "Old Video",
    screen: "Old Video — Early Cut",
    desc: "One of my earlier edits, kept here as a marker of how far the cuts have come.",
    tech: ["Edit", "Color"],
    video: oldVid,
    flavor: "OLD VIDEO used NOSTALGIA! It’s super effective!",
  },
  {
    no: "03",
    name: "UGC SAMPLE",
    title: "UGC Sample",
    screen: "UGC Sample — Short Form",
    desc: "A UGC-style sample: a short, hook-first cut built for social feeds.",
    tech: ["UGC", "Hooks", "Captions"],
    video: ugcVid,
    flavor: "UGC SAMPLE used HOOK FIRST! It’s super effective!",
  },
  {
    no: "04",
    name: "FACELESS CHANNEL",
    title: "Faceless Channel",
    screen: "Faceless Channel — Voiceover Edit",
    desc: "A faceless channel edit: voiceover-driven pacing with b-roll and on-screen text.",
    tech: ["Voiceover", "B-roll", "Text"],
    video: facelessVid,
    flavor: "FACELESS CHANNEL used B-ROLL! It’s super effective!",
  },
  {
    no: "05",
    name: "SUNO SHORTS",
    title: "Suno Shorts",
    screen: "Suno Shorts — Music Reels",
    desc: "Short-form reels cut to Suno tracks for their promotion videos.",
    tech: ["Suno", "Reels", "Music"],
    video: feverVid,
    flavor: "SUNO SHORTS used BEAT SYNC! It’s super effective!",
  },
  {
    no: "06",
    name: "LYRICAL VID",
    title: "Lyrical Vid",
    screen: "Lyrical Vid — Lyrics On Beat",
    desc: "A lyric video: type timed to the beat, one line at a time.",
    tech: ["Lyrics", "Type", "Beat"],
    video: lyricVid,
    flavor: "LYRICAL VID used LYRICS ON BEAT! It’s super effective!",
  },
];

const CATEGORIES = [
  { key: "apps", label: "APPLICATIONS", items: APPS },
  { key: "videos", label: "VIDEOS", items: VIDEOS },
];

export default function Portfolio() {
  const [cat, setCat] = useState("apps");
  const [dd, setDd] = useState(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const activeRef = useRef(0);
  const catRef = useRef("apps");
  const ddRef = useRef(null);

  const current = CATEGORIES.find((item) => item.key === cat) || CATEGORIES[0];
  const project = current.items[active];

  // switching stage or leaving the tab tears the player down without a pause
  // event, so release the music here too
  useEffect(() => {
    if (!playing) duckMusic(false);
  }, [playing]);
  useEffect(() => () => duckMusic(false), []);

  const choose = (index) => {
    if (index === activeRef.current) return;
    activeRef.current = index;
    sfx.select();
    setActive(index);
    setPlaying(false);
  };

  const pickCategory = (key) => {
    setDd(false);
    if (key === catRef.current) return;
    catRef.current = key;
    activeRef.current = 0;
    sfx.coin();
    setCat(key);
    setActive(0);
    setPlaying(false);
  };

  // Up / Down walk the stage list, like a console menu
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const total = catRef.current === "apps" ? APPS.length : VIDEOS.length;
      const next = (activeRef.current + (event.key === "ArrowDown" ? 1 : total - 1)) % total;
      if (next === activeRef.current) return;
      activeRef.current = next;
      sfx.select();
      setActive(next);
      setPlaying(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Dropdown: close on outside click or Escape
  useEffect(() => {
    if (!dd) return undefined;
    const onDown = (event) => {
      if (!ddRef.current?.contains(event.target)) setDd(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setDd(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [dd]);

  const startVideo = () => {
    sfx.start();
    setPlaying(true);
  };

  return (
    <div className="ps">
      <div className="ps-bg" aria-hidden="true" />

      <PixelNav />

      <main className="ps-wrap">
        <header className="ps-head">
          <div className="ps-save">* SAVE FILE 01</div>
          <h1 className="ps-title">
            STAGE <span>SELECT</span>
          </h1>
        </header>

        <div className="ps-body">
          <div className="ps-side">
            <div className="ps-dd" ref={ddRef}>
              <button
                type="button"
                className="ps-dd-btn"
                onClick={() => setDd((value) => !value)}
                aria-expanded={dd}
                aria-haspopup="listbox"
              >
                <span className="ps-dd-k">STAGES</span>
                <span className="ps-dd-v">
                  {current.label}
                  <i aria-hidden="true">▼</i>
                </span>
              </button>

              {dd && (
                <ul className="ps-dd-list" role="listbox" aria-label="Stage category">
                  {CATEGORIES.map((item) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={item.key === cat}
                        className={item.key === cat ? "on" : ""}
                        onClick={() => pickCategory(item.key)}
                      >
                        {item.label}
                        <small>{item.items.length}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <ul className="ps-list" aria-label="Stage select">
              {current.items.map((item, index) => (
                <li key={item.no}>
                  <button
                    type="button"
                    className={`ps-row${index === active ? " on" : ""}`}
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => choose(index)}
                  >
                    <span className="ps-no">{item.no}</span>
                    <span className="ps-row-name">
                      {item.name}
                      {item.tag && <em> - {item.tag}</em>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="ps-hint">CLICK OR UP / DOWN: SELECT STAGE</div>
          </div>

          <div className="ps-main">
            <section className="ps-screen" aria-label={`${project.title} preview`}>
              {!playing && <div className="ps-screen-label">{project.screen}</div>}

              {project.video && project.embed ? (
                playing ? (
                  <div className="ps-frame">
                    <iframe
                      src={project.video}
                      title={`${project.title} demo`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="ps-poster"
                    aria-label={`Play the ${project.title} demo`}
                    onClick={startVideo}
                  >
                    <span className="ps-tri" aria-hidden="true" />
                    <span className="ps-watch">WATCH ON YOUTUBE</span>
                  </button>
                )
              ) : project.video ? (
                playing ? (
                  <div className="ps-frame">
                    <video
                      className="ps-video"
                      src={project.video}
                      controls
                      autoPlay
                      playsInline
                      onPlay={() => duckMusic(true)}
                      onPause={() => duckMusic(false)}
                      onEnded={() => duckMusic(false)}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="ps-poster"
                    aria-label={`Play ${project.title}`}
                    onClick={startVideo}
                  >
                    <video
                      className="ps-poster-vid"
                      src={`${project.video}#t=0.1`}
                      preload="metadata"
                      muted
                      playsInline
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <span className="ps-tri" aria-hidden="true" />
                    <span className="ps-watch">PLAY</span>
                  </button>
                )
              ) : project.image ? (
                <div className="ps-shot">
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    decoding="async"
                  />
                  {project.live && (
                    <a className="ps-watch" href={project.live} target="_blank" rel="noreferrer">
                      OPEN LIVE SITE ↗
                    </a>
                  )}
                </div>
              ) : (
                <div className="ps-poster ps-poster-off">
                  <span className="ps-off-mark" aria-hidden="true">
                    ×
                  </span>
                  <span className="ps-off-txt">NO DEMO RECORDED</span>
                  {project.live && (
                    <a className="ps-watch" href={project.live} target="_blank" rel="noreferrer">
                      OPEN LIVE SITE ↗
                    </a>
                  )}
                </div>
              )}
            </section>

            <section className="ps-info" key={`${cat}-${project.no}`}>
              <div className="ps-kicker">NEW SELECTED — FEATURED</div>
              <h2 className="ps-name">{project.title}</h2>
              <p className="ps-desc">{project.desc}</p>

              <div className="ps-tech">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <div className="ps-actions">
                {project.video ? (
                  <button type="button" className="ps-btn ps-btn-live" onClick={startVideo}>
                    ▶ PLAY
                  </button>
                ) : project.live ? (
                  <a className="ps-btn ps-btn-live" href={project.live} target="_blank" rel="noreferrer">
                    LIVE DEMO
                  </a>
                ) : (
                  <span className="ps-btn ps-btn-off">LIVE SOON</span>
                )}

                {project.code && (
                  <a className="ps-btn ps-btn-code" href={project.code} target="_blank" rel="noreferrer">
                    CODE
                  </a>
                )}
              </div>
            </section>

            <div className="ps-flavor">{project.flavor}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
