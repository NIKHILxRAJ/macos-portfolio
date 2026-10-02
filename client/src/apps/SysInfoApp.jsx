// "About This Mac", with every value taken from the resume.
export default function SysInfoApp({ resume, onOpenApp }) {
  if (!resume) return <div className="app-empty">Loading…</div>;
  const rows = [
    ["Role", resume.title],
    ["Location", resume.location],
    ["Chip", (resume.skills?.Languages || []).join(" · ")],
    ["Projects", resume.projects?.length ? `${resume.projects.length}` : ""],
    ["Education", resume.education?.[0]?.degree],
    ["Certificates", resume.certifications?.length ? `${resume.certifications.length}` : ""],
  ].filter(([, value]) => value);

  return (
    <div className="sysinfo">
      <svg className="sysinfo__laptop" viewBox="0 0 120 80" aria-hidden="true">
        <defs>
          <linearGradient id="sysinfo-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b1fd6" />
            <stop offset="0.55" stopColor="#2337d8" />
            <stop offset="1" stopColor="#5b7bff" />
          </linearGradient>
        </defs>
        <rect x="18" y="6" width="84" height="54" rx="5" fill="#2b2b2f" />
        <rect x="22" y="10" width="76" height="46" rx="2" fill="url(#sysinfo-screen)" />
        <path d="M8 62h104l-6 8H14z" fill="#c9ccd1" />
      </svg>
      <h1>{resume.name}</h1>
      <p className="sysinfo__sub">Portfolio · {new Date().getFullYear()}</p>
      <dl className="sysinfo__rows">
        {rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <button className="pill-button" onClick={() => onOpenApp("portfolio")}>More Info…</button>
    </div>
  );
}
