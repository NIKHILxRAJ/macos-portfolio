import { useState } from "react";

export function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

// Shows client/public/avatar.jpg if you add one, otherwise your initials.
export default function Avatar({ name, size = 64 }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {failed ? <span aria-hidden="true">{initials(name)}</span>
        : <img src="/avatar.jpg" alt={name} onError={() => setFailed(true)} />}
    </div>
  );
}
