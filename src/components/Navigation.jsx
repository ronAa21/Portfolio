import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { label: "HOME", to: "/" },
  { label: "ABOUT", to: "/about" },
  { label: "PORTFOLIO", to: "/portfolio" },
  { label: "ACHIEVEMENTS", to: "/achievements" },
  { label: "CONTACT", to: "/contact" },
];

const linkClasses = ({ isActive }) =>
  isActive
    ? "text-teal-500 font-semibold transition duration-300"
    : "text-gray-300 hover:text-teal-500 transition duration-300";

function Navigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-10 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wider">
          <span className="text-teal-500">A</span>ARON
        </h1>

        <div className="hidden sm:flex justify-center gap-10 text-sm tracking-widest">
          {LINKS.map((item) => (
            <NavLink key={item.label} to={item.to} className={linkClasses}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="sm:hidden border-2 border-teal-500 px-3 py-2 text-[10px] tracking-widest text-teal-400"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="nav-menu"
        >
          {open ? "CLOSE" : "MENU"}
        </button>

        <div className="hidden sm:block w-10"></div>
      </div>

      {open && (
        <div
          id="nav-menu"
          className="sm:hidden flex flex-col gap-4 border-t border-zinc-800 px-5 pb-5 pt-4 text-xs tracking-widest"
        >
          {LINKS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={linkClasses}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navigation;
