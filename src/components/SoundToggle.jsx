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
  const { on, started, toggle, unlockNow } = useSound();
  const { pathname } = useLocation();

  // Every tab gets its own loop; the scheduler swaps chords without a hard stop
  useEffect(() => {
    setTrack(TRACK_BY_PATH[pathname] || "home");
  }, [pathname]);

  // While the browser is still holding audio back, the first tap should unlock
  // playback rather than switch the music off.
  const waiting = on && !started;
  const label = !on ? "SOUND: OFF" : started ? "SOUND: ON" : "TAP FOR SOUND";

  return (
    <button
      type="button"
      data-snd
      className={`sound-toggle${on ? " on" : ""}${waiting ? " waiting" : ""}`}
      onClick={waiting ? unlockNow : toggle}
      aria-pressed={on}
      aria-label={waiting ? "Start music playback" : on ? "Turn music off" : "Turn music on"}
    >
      ♪ {label}
    </button>
  );
}
