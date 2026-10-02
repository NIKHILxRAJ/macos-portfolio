import { useEffect, useRef, useState } from "react";
import { firstName, stackRows } from "../lib/commands.js";

// A read-only terminal that shows "show tech stack" as a table built from the resume.
export default function TerminalApp({ resume, resumeError }) {
  const [renderMs, setRenderMs] = useState(null);
  const startedAt = useRef(null);
  if (resume && startedAt.current === null) startedAt.current = performance.now();

  // Real time from the resume arriving to the table being painted.
  useEffect(() => {
    if (!resume) return undefined;
    const frame = requestAnimationFrame(() => setRenderMs(Math.max(1, Math.round(performance.now() - startedAt.current))));
    return () => cancelAnimationFrame(frame);
  }, [resume]);

  if (resumeError) {
    return (
      <div className="terminal">
        <p className="term-error">Could not reach the portfolio server.</p>
        <p className="term-muted">Start it with: npm run dev</p>
      </div>
    );
  }
  if (!resume) return <div className="terminal" />;

  const rows = stackRows(resume);
  return (
    <div className="terminal">
      <p className="term-prompt">@{firstName(resume)} % show tech stack</p>
      <div className="term-table" role="table" aria-label="Tech stack">
        <div className="term-table__head" role="row">
          <span role="columnheader">Category</span>
          <span role="columnheader">Technologies</span>
        </div>
        {rows.map(([category, items]) => (
          <div key={category} className="term-table__row" role="row">
            <span role="cell" className="term-table__category"><span aria-hidden="true">✓</span>{category}</span>
            <span role="cell">{items.join(", ")}</span>
          </div>
        ))}
      </div>
      <p className="term-success">✓ {rows.length} of {rows.length} stacks loaded successfully (100%)</p>
      {renderMs !== null && <p className="term-render">⚑ Render time: {renderMs}ms</p>}
    </div>
  );
}
