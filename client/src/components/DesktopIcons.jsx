import { useRef, useState } from "react";
import { DocumentIcon, FolderIcon } from "./icons.jsx";

const shortName = (name) => name.split(/\s[–-]\s/)[0];

// Left-side desktop icons: one folder per project plus the resume.
// Click to open; drag to move them around.
export default function DesktopIcons({ resume, onOpen }) {
  const items = [
    ...(resume?.projects || []).map((project) => ({
      key: project.name,
      label: shortName(project.name),
      Icon: FolderIcon,
      open: () => {
        const url = project.live || project.github;
        if (url) window.open(url, "_blank", "noopener,noreferrer");
        else onOpen("safari");
      },
    })),
    { key: "resume.pdf", label: "Resume.pdf", Icon: DocumentIcon, tag: "PDF", open: () => onOpen("resume") },
  ];

  return (
    <div className="desktop-icons">
      {items.map(({ key, ...item }) => <DesktopIcon key={key} {...item} />)}
    </div>
  );
}

function DesktopIcon({ label, Icon, tag, open }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

  function onPointerDown(event) {
    if (event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, start: offset, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    if (d.moved) setOffset({ x: d.start.x + dx, y: d.start.y + dy });
  }

  function onPointerUp() {
    const moved = drag.current?.moved;
    drag.current = null;
    if (moved === false) open(); // a click, not a drag
  }

  return (
    <button
      className="desktop-icon"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => e.key === "Enter" && open()}
    >
      <span className="desktop-icon__img"><Icon />{tag && <span className="desktop-icon__tag">{tag}</span>}</span>
      <span className="desktop-icon__label">{label}</span>
    </button>
  );
}
