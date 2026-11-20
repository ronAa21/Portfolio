import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./LoadingScreen.css";

const BOOT_MS = 1500;
const PAGE_MS = 700;
const REDUCED_BOOT_MS = 500;
const REDUCED_PAGE_MS = 250;

const PAGES = {
  "/": { tag: "WORLD 1-1", name: "HOME", icon: "★", accent: "#5eead4", hint: "ENTERING WORLD 1-1" },
  "/about": { tag: "PLAYER DATA", name: "ABOUT", icon: "P1", accent: "#c4b5fd", hint: "LOADING PLAYER DATA" },
  "/portfolio": { tag: "STAGE SELECT", name: "PORTFOLIO", icon: "</>", accent: "#fde68a", hint: "LOADING STAGE SELECT" },
  "/achievements": { tag: "TROPHY ROOM", name: "ACHIEVEMENTS", icon: "★", accent: "#fbbf24", hint: "OPENING TROPHY ROOM" },
  "/contact": { tag: "MAILBOX", name: "CONTACT", icon: "@", accent: "#5eead4", hint: "OPENING MAILBOX" },
};

export default function LoadingScreen() {
  const { pathname } = useLocation();
  const [overlay, setOverlay] = useState({ visible: true, boot: true });
  const lastPath = useRef(pathname);
  const timer = useRef(0);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // Boot screen: once per full page load
  useEffect(() => {
    timer.current = setTimeout(
      () => setOverlay((current) => ({ ...current, visible: false })),
      reduced ? REDUCED_BOOT_MS : BOOT_MS
    );
    return () => clearTimeout(timer.current);
  }, [reduced]);

  // A different loader for every route, shown before the new page paints
  useLayoutEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.scrollTo({ top: 0, behavior: "auto" });
    clearTimeout(timer.current);
    // Showing the overlay in response to a route change is the point of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOverlay({ visible: true, boot: false });
    timer.current = setTimeout(
      () => setOverlay((current) => ({ ...current, visible: false })),
      reduced ? REDUCED_PAGE_MS : PAGE_MS
    );
  }, [pathname, reduced]);

  // Freeze the page behind the overlay
  useEffect(() => {
    if (!overlay.visible) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlay.visible]);

  const skip = useCallback(() => {
    clearTimeout(timer.current);
    setOverlay((current) => ({ ...current, visible: false }));
  }, []);

  useEffect(() => {
    if (!overlay.visible) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay.visible, skip]);

  if (!overlay.visible) return null;

  const meta = PAGES[pathname] || PAGES["/"];
  const accent = overlay.boot ? "#5eead4" : meta.accent;
  const duration = overlay.boot
    ? reduced
      ? REDUCED_BOOT_MS
      : BOOT_MS
    : reduced
      ? REDUCED_PAGE_MS
      : PAGE_MS;

  return (
    <div
      className="load"
      style={{ "--acc": accent, "--load-dur": `${duration}ms` }}
      onClick={skip}
      role="presentation"
    >
      <div className="load-grid" aria-hidden="true" />

      {overlay.boot ? (
        <div className="load-box" key="boot" role="status" aria-live="polite">
          <div className="load-logo">
            <b>A</b>ARON<span>.EXE</span>
            <i className="load-caret" aria-hidden="true">
              █
            </i>
          </div>
          <div className="load-sub">BOOTING SYSTEM...</div>
          <div className="load-bar">
            <i />
          </div>
          <div className="load-hint">CLICK OR PRESS ENTER TO SKIP</div>
        </div>
      ) : (
        <div className="load-box" key={pathname} role="status" aria-live="polite">
          <div className="load-tag">{meta.tag}</div>
          <div className="load-icon" aria-hidden="true">
            {meta.icon}
          </div>
          <div className="load-title">{meta.hint}</div>
          <div className="load-name">{meta.name}</div>
          <div className="load-bar">
            <i />
          </div>
          <div className="load-hint">CLICK OR PRESS ENTER TO SKIP</div>
        </div>
      )}

      <div className="load-foot">© 2026 AARON PAGENTE · v1.0</div>
    </div>
  );
}
