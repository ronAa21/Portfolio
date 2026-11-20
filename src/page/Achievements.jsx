import { useCallback, useEffect, useRef, useState } from "react";
import { sfx } from "../sound/audio";
import PixelNav from "../components/PixelNav";
import PixelSky from "../components/PixelSky";
import vrCert from "../../visuals/web/cert-virtual-reality.webp";
import cyberCert from "../../visuals/web/intro-cybersec.webp";
import pythonCert from "../../visuals/web/python-cert.webp";
import ncCert from "../../visuals/web/ncII-ss.webp";
import "./PixelHome.css";
import "./Achievements.css";

const CERTS = [
  {
    name: "VIRTUAL VS. REALITY",
    issuer: "QCU · League of Excellent Students in IT",
    year: "2025",
    note: "Certificate of Participation for the short film “Virtual vs. Reality”, Show IT to the World — Nyx Project 2025.",
    img: vrCert,
    color: "#c4b5fd",
  },
  {
    name: "INTRO TO CYBERSECURITY",
    issuer: "Cisco Networking Academy",
    year: "2026",
    note: "Completed the Introduction to Cybersecurity course.",
    img: cyberCert,
    color: "#93c5fd",
  },
  {
    name: "PYTHON FUNDAMENTALS",
    issuer: "Data Analytics Philippines",
    year: "2025",
    note: "Fundamentals of Python Programming — 3 training hours, 4 skills.",
    img: pythonCert,
    color: "#fde68a",
  },
  {
    name: "NC II · COMPUTER SYSTEMS SERVICING",
    issuer: "TESDA",
    year: "2025",
    note: "National Certificate II, valid until August 05, 2030.",
    img: ncCert,
    color: "#5eead4",
  },
];

const TROPHY = ["YYYYYYYY", "YYWYYYYY", ".YYYYYY.", "..YYYY..", "...YY...", "...YY...", "..YYYY..", ".YYYYYY."];
const pad = (n) => String(n).padStart(2, "0");

function Trophy({ color }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    TROPHY.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (ch === ".") return;
        ctx.fillStyle = ch === "W" ? "#fff" : color;
        ctx.fillRect(x, y, 1, 1);
      })
    );
  }, [color]);

  return <canvas ref={ref} width={8} height={8} aria-hidden="true" />;
}

export default function Achievements() {
  const [cert, setCert] = useState(null);
  const open = cert !== null;

  const dismiss = useCallback(() => {
    sfx.close();
    setCert(null);
  }, []);

  const step = useCallback((dir) => {
    sfx.select();
    setCert((i) => (i === null ? i : (i + dir + CERTS.length) % CERTS.length));
  }, []);

  // Viewer: freeze the page behind it, walk the list with the arrow keys
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") dismiss();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss, step]);

  const pick = (index) => {
    sfx.coin();
    setCert(index);
  };

  return (
    <div className="ph ach">
      <PixelSky variant="trophies" />
      <PixelNav />

      <main className="ach-wrap">
        <header className="ach-head">
          <div>
            <div className="ph-lbl">★ TROPHY ROOM</div>
            <h1 className="ach-title">
              ACHIEVE<span>MENTS</span>
            </h1>
            <p className="ach-sub">
              Certificates and awards collected along the way. Select a trophy to inspect it.
            </p>
          </div>

          <div className="ach-tally">
            <Trophy color="#fde68a" />
            <b>{pad(CERTS.length)}</b>
            <span>
              TROPHIES
              <br />
              UNLOCKED
            </span>
          </div>
        </header>

        <div className="ach-grid">
          {CERTS.map((item, i) => (
            <button
              key={item.name}
              type="button"
              className="ach-card"
              style={{ "--c": item.color }}
              onClick={() => pick(i)}
              aria-label={`View the ${item.name} certificate`}
            >
              <span className="ach-top">
                <span className="ach-no">NO. {pad(i + 1)}</span>
                <span className="ach-year">★ {item.year}</span>
              </span>

              <span className="ach-frame">
                <img className="ach-shot" src={item.img} alt="" loading="lazy" decoding="async" />
                <span className="ach-sweep" aria-hidden="true" />
              </span>

              <span className="ach-body">
                <b className="ach-name">{item.name}</b>
                <span className="ach-issuer">
                  <i>ISSUED BY</i>
                  {item.issuer}
                </span>
              </span>

              <span className="ach-cta">
                <span aria-hidden="true">▸</span> VIEW CERTIFICATE
              </span>
            </button>
          ))}
        </div>
      </main>

      {open && (
        <div
          className="ph-vm"
          role="dialog"
          aria-modal="true"
          aria-label={CERTS[cert].name}
          onClick={dismiss}
        >
          <div className="ph-vm-box ach-modal" onClick={(event) => event.stopPropagation()}>
            <div className="ph-vm-bar">
              <span>
                ★ CERTIFICATE {pad(cert + 1)} / {pad(CERTS.length)}
              </span>
              <button type="button" className="ph-vm-x" onClick={dismiss} autoFocus>
                CLOSE ✕
              </button>
            </div>

            <div className="ach-viewer">
              <div className="ach-stage">
                <img
                  key={CERTS[cert].img}
                  className="ach-full"
                  src={CERTS[cert].img}
                  alt={`${CERTS[cert].name} certificate`}
                />
              </div>

              <aside className="ach-info" style={{ "--c": CERTS[cert].color }}>
                <span className="ach-info-no">TROPHY {pad(cert + 1)}</span>
                <h2 className="ach-info-name">{CERTS[cert].name}</h2>

                <dl className="ach-rows">
                  <div>
                    <dt>ISSUED BY</dt>
                    <dd>{CERTS[cert].issuer}</dd>
                  </div>
                  <div>
                    <dt>YEAR</dt>
                    <dd>{CERTS[cert].year}</dd>
                  </div>
                  <div>
                    <dt>STATUS</dt>
                    <dd className="ach-ok">✔ UNLOCKED</dd>
                  </div>
                </dl>

                <p className="ach-note">{CERTS[cert].note}</p>

                <div className="ach-nav">
                  <button type="button" onClick={() => step(-1)} aria-label="Previous certificate">
                    ◀ PREV
                  </button>
                  <span>
                    {pad(cert + 1)} / {pad(CERTS.length)}
                  </span>
                  <button type="button" onClick={() => step(1)} aria-label="Next certificate">
                    NEXT ▶
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
