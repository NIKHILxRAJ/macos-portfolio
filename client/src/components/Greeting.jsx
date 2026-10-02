import { useState } from "react";

// Letters swell under the cursor, and the neighbours swell a little too.
function BubbleLine({ text, className }) {
  const [hovered, setHovered] = useState(null);
  return (
    <span className={`bubble ${className}`} onMouseLeave={() => setHovered(null)} aria-label={text}>
      {[...text].map((char, index) => {
        const distance = hovered === null ? null : Math.abs(index - hovered);
        const level = distance === 0 ? "is-hot" : distance === 1 ? "is-warm" : "";
        return (
          <span key={index} className={`bubble__char ${level}`} onMouseEnter={() => setHovered(index)} aria-hidden="true">
            {char === " " ? " " : char}
          </span>
        );
      })}
    </span>
  );
}

export default function Greeting({ firstName, dimmed }) {
  return (
    <div className={`greeting ${dimmed ? "is-dimmed" : ""}`}>
      <BubbleLine className="greeting__small" text={`Hey, I'm ${firstName || "there"}! welcome to my`} />
      <BubbleLine className="greeting__large" text="portfolio" />
    </div>
  );
}
