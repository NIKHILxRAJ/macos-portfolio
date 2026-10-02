import { useRef, useState } from "react";

const MENU_BAR_HEIGHT = 32;

// A draggable macOS window with working traffic lights.
export default function Window({
  title, titleIcon, frame, z, focused, minimized, maximized,
  onFocus, onClose, onMinimize, onMaximize, onMove, children,
}) {
  const drag = useRef(null);
  const [dragging, setDragging] = useState(false);

  function startDrag(event) {
    if (maximized || event.button !== 0 || event.target.closest("button, input")) return;
    drag.current = { startX: event.clientX, startY: event.clientY, x: frame.x, y: frame.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function moveDrag(event) {
    if (!drag.current) return;
    const { startX, startY, x, y } = drag.current;
    onMove({
      x: Math.min(Math.max(x + event.clientX - startX, 80 - frame.w), window.innerWidth - 80),
      y: Math.min(Math.max(y + event.clientY - startY, MENU_BAR_HEIGHT), window.innerHeight - 60),
    });
  }

  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  const classes = [
    "window",
    focused && "is-focused",
    minimized && "is-minimized",
    maximized && "is-maximized",
    dragging && "is-dragging",
  ].filter(Boolean).join(" ");

  return (
    <section
      className={classes}
      style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h, zIndex: z }}
      onPointerDownCapture={onFocus}
      aria-label={title}
      aria-hidden={minimized || undefined}
    >
      <header
        className="window__titlebar"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(event) => !event.target.closest("button, input") && onMaximize()}
      >
        <div className="traffic-lights">
          <button className="light light--close" onClick={onClose} aria-label={`Close ${title}`}>
            <svg viewBox="0 0 10 10"><path d="M3 3l4 4M7 3l-4 4" /></svg>
          </button>
          <button className="light light--minimize" onClick={onMinimize} aria-label={`Minimize ${title}`}>
            <svg viewBox="0 0 10 10"><path d="M2.5 5h5" /></svg>
          </button>
          <button className="light light--maximize" onClick={onMaximize} aria-label={`Zoom ${title}`}>
            <svg viewBox="0 0 10 10"><path d="M3 6.8V3h3.8M7 3.2V7H3.2" /></svg>
          </button>
        </div>
        <div className="window__title">
          {titleIcon && <img className="window__title-icon" src={titleIcon} alt="" />}
          {title}
        </div>
      </header>
      <div className="window__body">{children}</div>
    </section>
  );
}
