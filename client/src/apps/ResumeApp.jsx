// Preview-style window. Shows the real resume PDF (client/public/resume.pdf) when it exists;
// otherwise lays the resume data out as a document.
export default function ResumeApp({ resume, hasResumePdf }) {
  if (hasResumePdf) {
    return (
      <div className="preview">
        <div className="preview__toolbar">
          <span>Resume.pdf</span>
          <div className="preview__actions">
            <a className="pill-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Open in new tab</a>
            <a className="pill-button is-primary" href="/resume.pdf" download="Nikhil_Raj_Resume.pdf">Download PDF</a>
          </div>
        </div>
        <iframe className="preview__pdf" src="/resume.pdf#view=FitH" title="Resume PDF" />
      </div>
    );
  }
  if (!resume) return <div className="app-empty">Loading…</div>;
  const c = resume.contact || {};
  const contactBits = [c.email, c.phone, c.github, c.linkedin, c.leetcode, c.twitter, c.website].filter(Boolean);
  const range = (a, b) => [a, b].filter(Boolean).join(" – ");

  return (
    <div className="preview">
      <div className="preview__toolbar">
        <span>{resume.name} — Resume</span>
      </div>
      <div className="preview__canvas">
        <article className="paper">
          <header className="paper__header">
            <h1>{resume.name}</h1>
            {resume.title && <p className="paper__title">{resume.title}{resume.location ? ` · ${resume.location}` : ""}</p>}
            {contactBits.length > 0 && <p className="paper__contact">{contactBits.join("  |  ")}</p>}
          </header>

          {resume.summary && <section><h2>Summary</h2><p>{resume.summary}</p></section>}

          {resume.education?.length > 0 && (
            <section>
              <h2>Education</h2>
              {resume.education.map((e) => (
                <div key={`${e.degree}-${e.institution}`} className="paper__row">
                  <span><strong>{e.institution}</strong>, {e.degree}{e.location ? `, ${e.location}` : ""}{e.score ? ` (${e.score})` : ""}</span>
                  <span>{range(e.start, e.end)}</span>
                </div>
              ))}
            </section>
          )}

          {resume.experience?.length > 0 && (
            <section>
              <h2>Experience</h2>
              {resume.experience.map((job) => (
                <div key={`${job.company}-${job.role}`} className="paper__entry">
                  <div className="paper__row"><strong>{job.role}, {job.company}</strong><span>{range(job.start, job.end)}</span></div>
                  <ul>{(job.highlights || []).map((h) => <li key={h}>{h}</li>)}</ul>
                </div>
              ))}
            </section>
          )}

          {resume.projects?.length > 0 && (
            <section>
              <h2>Projects</h2>
              {resume.projects.map((p) => (
                <div key={p.name} className="paper__entry">
                  <div className="paper__row"><strong>{p.name}</strong><span>{(p.tech || []).join(", ")}</span></div>
                  {p.description && <p>{p.description}</p>}
                  <ul>{(p.highlights || []).map((h) => <li key={h}>{h}</li>)}</ul>
                </div>
              ))}
            </section>
          )}

          {Object.keys(resume.skills || {}).length > 0 && (
            <section>
              <h2>Skills</h2>
              {Object.entries(resume.skills).map(([group, items]) => (
                <p key={group}><strong>{group}:</strong> {items.join(", ")}</p>
              ))}
            </section>
          )}

          {(resume.certifications?.length > 0 || resume.achievements?.length > 0) && (
            <section>
              <h2>Certificates and Achievements</h2>
              <ul>{[...(resume.certifications || []), ...(resume.achievements || [])].map((a) => <li key={a}>{a}</li>)}</ul>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
