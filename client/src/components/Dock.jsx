import { useRef, useState } from "react";
import { APP_ICONS, SparkleIcon } from "./icons.jsx";

const BASE = 52;
const MAX_EXTRA = 0.45; // how much icons grow under the cursor
const REACH = 120; // px around the cursor that magnify

export default function Dock({ apps, windows, onOpen }) {
  const itemRefs = useRef({});
  const [mouseX, setMouseX] = useState(null);

  function sizeFor(key) {
    const el = itemRefs.current[key];
    if (mouseX === null || !el) return BASE;
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(mouseX - (rect.left + rect.width / 2));
    return BASE * (1 + MAX_EXTRA * Math.max(0, 1 - distance / REACH));
  }

  const isOpen = (key) => windows[key]?.open;

  return (
    <nav className="dock-wrap" aria-label="Dock">
      <div
        className="dock"
        onPointerMove={(event) => event.pointerType === "mouse" && setMouseX(event.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {apps.map(({ key, label }) => {
          const Icon = APP_ICONS[key];
          const size = sizeFor(key);
          return (
            <div key={key} className="dock__slot">
              <button
                ref={(el) => { itemRefs.current[key] = el; }}
                className="dock__item"
                style={{ width: size, height: size }}
                onClick={() => onOpen(key)}
                aria-label={label}
              >
                <span className="dock__label">{label}</span>
                <Icon />
              </button>
              <span className={`dock__dot ${isOpen(key) ? "is-on" : ""}`} aria-hidden="true" />
            </div>
          );
        })}
        <div className="dock__slot">
          <button className="ask-pill" onClick={() => onOpen("chat")}>
            <SparkleIcon size={24} />Ask Me
          </button>
          <span className={`dock__dot ${isOpen("chat") ? "is-on" : ""}`} aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
}
