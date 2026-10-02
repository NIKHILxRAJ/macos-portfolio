import { useMemo, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import { ChevronLeft, ChevronRight, LockGlyph, ReloadGlyph, SearchGlyph } from "../components/icons.jsx";
import { external } from "./PortfolioApp.jsx";

const TILE_COLORS = ["#2f7bff", "#6e5bff", "#f5a623", "#30b866", "#ff5f7a", "#14a3b8"];
const host = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

// Every link and fact the browser can show, built from the resume.
function buildResults(resume) {
  const c = resume.contact || {};
  const results = [];
  const profile = (label, url, text) => url && results.push({ kind: "Profile", title: `${resume.name} · ${label}`, url, text });
  profile("GitHub", c.github, "Repositories and code, including the projects on this portfolio.");
  profile("LinkedIn", c.linkedin, resume.title);
  profile("X (Twitter)", c.twitter, "Posts and updates.");
  profile("LeetCode", c.leetcode, (resume.achievements || []).find((a) => /leetcode/i.test(a)) || "Problem-solving profile.");
  for (const project of resume.projects || []) {
    const url = project.live || project.github;
    if (!url) continue;
    results.push({
      kind: "Project",
      title: project.name,
      url,
      text: project.description || project.highlights?.[0] || "",
      tags: project.tech,
      extra: project.live && project.github ? project.github : null,
    });
  }
  return results;
}

function favourites(resume) {
  const c = resume.contact || {};
  return [
    ["GitHub", c.github], ["LinkedIn", c.linkedin], ["LeetCode", c.leetcode], ["X", c.twitter],
    ...(resume.projects || []).map((p) => [p.name.split(/\s[–-]\s/)[0], p.live || p.github]),
    ["Email", c.email && `mailto:${c.email}`],
  ].filter(([, url]) => url);
}

// A browser window: a search page about the owner, and a favourites page.
export default function SafariApp({ resume }) {
  const [history, setHistory] = useState([{ page: "search", query: "" }]);
  const [index, setIndex] = useState(0);
  const [address, setAddress] = useState(null);
  const results = useMemo(() => (resume ? buildResults(resume) : []), [resume]);
  if (!resume) return <div className="app-empty">Loading…</div>;

  const current = history[index];
  const query = current.query || resume.name;
  const go = (entry) => {
    setHistory([...history.slice(0, index + 1), entry]);
    setIndex(index + 1);
    setAddress(null);
  };

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const aboutOwner = words.every((w) => resume.name.toLowerCase().includes(w));
  const shown = aboutOwner ? results : results.filter((r) =>
    words.some((w) => [r.title, r.text, ...(r.tags || [])].join(" ").toLowerCase().includes(w)));
  const shownAddress = address ?? (current.page === "favourites" ? "favourites" : `search?q=${query}`);

  function submitAddress(event) {
    event.preventDefault();
    const text = (address ?? "").trim();
    if (!text || /^favou?rites$/i.test(text)) go({ page: "favourites" });
    else go({ page: "search", query: text.replace(/^search\?q=/, "") });
  }

  return (
    <div className="safari">
      <div className="safari__toolbar">
        <div className="safari__nav">
          <button onClick={() => { setIndex(index - 1); setAddress(null); }} disabled={index === 0} aria-label="Back"><ChevronLeft size={16} /></button>
          <button onClick={() => { setIndex(index + 1); setAddress(null); }} disabled={index >= history.length - 1} aria-label="Forward"><ChevronRight size={16} /></button>
        </div>
        <form className="safari__address" onSubmit={submitAddress}>
          <LockGlyph size={13} />
          <input value={shownAddress} onChange={(e) => setAddress(e.target.value)} onFocus={(e) => e.target.select()}
            aria-label="Address or search" />
          <button type="button" onClick={() => setAddress(null)} aria-label="Reload"><ReloadGlyph size={13} /></button>
        </form>
      </div>
      <div className="safari__bookmarks">
        <button onClick={() => go({ page: "favourites" })}>Favourites</button>
        {favourites(resume).slice(0, 4).map(([label, url]) => (
          <a key={label} href={url} {...external(url)}>{label}</a>
        ))}
      </div>

      <div className="safari__page">
        {current.page === "favourites" ? (
          <div className="favs">
            <h2>Favourites</h2>
            <div className="favs__grid">
              {favourites(resume).map(([label, url], i) => (
                <a key={label} className="favs__tile" href={url} {...external(url)}>
                  <span style={{ background: TILE_COLORS[i % TILE_COLORS.length] }}>{label[0]}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="serp">
            <div className="serp__head">
              <span className="serp__logo">Search</span>
              <form className="serp__box" onSubmit={(e) => { e.preventDefault(); go({ page: "search", query: e.target.q.value.trim() }); }}>
                <SearchGlyph size={15} />
                <input name="q" defaultValue={query} key={query} aria-label="Search" />
              </form>
            </div>
            <p className="serp__count">About {shown.length} result{shown.length === 1 ? "" : "s"}</p>
            <div className="serp__body">
              <div className="serp__results">
                {shown.length === 0 && <p className="serp__none">No results for “{query}” on this portfolio.</p>}
                {shown.map((r) => (
                  <article key={r.url} className="serp__result">
                    <span className="serp__url">{r.kind} · {host(r.url)}</span>
                    <a href={r.url} {...external(r.url)}>{r.title}</a>
                    {r.text && <p>{r.text}</p>}
                    {r.extra && <a className="serp__sub" href={r.extra} {...external(r.extra)}>Source code · {host(r.extra)}</a>}
                  </article>
                ))}
              </div>
              {aboutOwner && (
                <aside className="serp__panel">
                  <Avatar name={resume.name} size={64} />
                  <h3>{resume.name}</h3>
                  <p>{resume.title}</p>
                  <dl>
                    {resume.location && <><dt>Location</dt><dd>{resume.location}</dd></>}
                    {resume.education?.[0] && <><dt>Education</dt><dd>{resume.education[0].institution}</dd></>}
                    {resume.skills?.Languages && <><dt>Languages</dt><dd>{resume.skills.Languages.join(", ")}</dd></>}
                  </dl>
                </aside>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
