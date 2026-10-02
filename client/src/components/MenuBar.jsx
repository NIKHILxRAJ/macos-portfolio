import { useEffect, useRef, useState } from "react";
import { AppleLogo, InfoGlyph, SearchGlyph, WifiIcon } from "./icons.jsx";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export default function MenuBar({ firstName, onOpen, hasResumePdf }) {
  const now = useClock();
  const [appleOpen, setAppleOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!appleOpen) return undefined;
    const close = (event) => {
      if (!menuRef.current?.contains(event.target)) setAppleOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [appleOpen]);

  function choose(action) {
    setAppleOpen(false);
    action();
  }

  const stamp = now.toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

  return (
    <header className="menubar">
      <div className="menubar__left">
        <div className="menubar__apple" ref={menuRef}>
          <button className={`menubar__item ${appleOpen ? "is-open" : ""}`} onClick={() => setAppleOpen((o) => !o)}
            aria-label="Apple menu" aria-expanded={appleOpen}>
            <AppleLogo />
          </button>
          {appleOpen && (
            <div className="dropdown" role="menu">
              <button role="menuitem" onClick={() => choose(() => onOpen("sysinfo"))}>About This Mac</button>
              <hr />
              <button role="menuitem" onClick={() => choose(() => onOpen("portfolio"))}>Open Portfolio</button>
              <button role="menuitem" onClick={() => choose(() => onOpen("terminal"))}>Open Terminal</button>
              <button role="menuitem" onClick={() => choose(() => onOpen("chat"))}>Ask Me…</button>
              {hasResumePdf && (
                <a role="menuitem" href="/resume.pdf" download onClick={() => setAppleOpen(false)}>Download Resume (PDF)</a>
              )}
              <hr />
              <button role="menuitem" onClick={() => choose(() => window.location.reload())}>Restart…</button>
            </div>
          )}
        </div>
        <button className="menubar__item menubar__brand" onClick={() => onOpen("portfolio")}>
          {firstName ? `${firstName}'s Portfolio` : "Portfolio"}
        </button>
        <button className="menubar__item" onClick={() => onOpen("portfolio")}>Projects</button>
        <button className="menubar__item" onClick={() => onOpen("contact")}>Contact</button>
        <button className="menubar__item" onClick={() => onOpen("resume")}>Resume</button>
      </div>
      <div className="menubar__right">
        <span className="menubar__icon"><WifiIcon /></span>
        <button className="menubar__item menubar__iconbtn" onClick={() => onOpen("chat")} aria-label="Search (Ask Me)">
          <SearchGlyph size={16} />
        </button>
        <button className="menubar__item menubar__iconbtn" onClick={() => onOpen("sysinfo")} aria-label="About This Mac">
          <InfoGlyph size={16} />
        </button>
        <span className="menubar__clock">{stamp}</span>
      </div>
    </header>
  );
}
