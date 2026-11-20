import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setTrack, useSound } from "../sound/audio";
import "./SoundToggle.css";

const TRACK_BY_PATH = {
  "/": "home",
  "/about": "about",
  "/portfolio": "portfolio",
  "/achievements": "achievements",
  "/contact": "contact",
};

export default function SoundToggle() {
  const { on, toggle } = useSound();
  const { pathname } = useLocation();

  // Every tab gets its own loop; the scheduler swaps chords without a hard stop
  useEffect(() => {
    setTrack(TRACK_BY_PATH[pathname] || "home");
  }, [pathname]);

  return (
    <button
      type="button"
      data-snd
      className={`sound-toggle${on ? " on" : ""}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn music off" : "Turn music on"}
    >
      ♪ SOUND: {on ? "ON" : "OFF"}
    </button>
  );
}
