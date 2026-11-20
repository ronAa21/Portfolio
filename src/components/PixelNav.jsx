import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV = [
  { label: "HOME", to: "/" },
  { label: "ABOUT", to: "/about" },
  { label: "PORTFOLIO", to: "/portfolio" },
  { label: "ACHIEVEMENTS", to: "/achievements" },
  { label: "CONTACT", to: "/contact" },
];

export default function PixelNav() {
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <nav className="ph-nav">
      <Link to="/" className="ph-logo" onClick={() => setMenu(false)}>
        <b>A</b>ARON
      </Link>

      <ul id="pixel-menu" className={`ph-links${menu ? " open" : ""}`}>
        {NAV.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              className={pathname === item.to ? "on" : ""}
              aria-current={pathname === item.to ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="ph-menu-btn"
        onClick={() => setMenu((value) => !value)}
        aria-label="Menu"
        aria-expanded={menu}
        aria-controls="pixel-menu"
      >
        MENU
      </button>
    </nav>
  );
}
