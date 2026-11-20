import { useEffect, useRef, useState } from "react";
import { sfx } from "../sound/audio";
import "./ClickFX.css";

/* Every press anywhere throws a small pixel burst at the cursor and plays a
   short click. The burst removes itself after the animation. */
const LIFE = 420;

export default function ClickFX() {
  const [bursts, setBursts] = useState([]);
  const next = useRef(0);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const timers = new Set();

    const onDown = (event) => {
      if (event.button !== 0) return;
      sfx.tap();
      if (reduced) return;

      const id = ++next.current;
      setBursts((list) => [...list, { id, x: event.clientX, y: event.clientY }]);
      const timer = setTimeout(() => {
        setBursts((list) => list.filter((burst) => burst.id !== id));
        timers.delete(timer);
      }, LIFE);
      timers.add(timer);
    };

    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  return (
    <>
      {bursts.map((burst) => (
        <span key={burst.id} className="cfx" style={{ left: burst.x, top: burst.y }} aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
      ))}
    </>
  );
}
