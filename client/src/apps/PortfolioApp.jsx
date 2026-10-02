import Avatar from "../components/Avatar.jsx";
import {
  BriefcaseGlyph, CodeGlyph, ExternalGlyph, FileGlyph, MailGlyph, SparkleIcon, TrophyGlyph, XGlyph,
} from "../components/icons.jsx";

export function profileLinks(contact = {}) {
  return [
    { label: "GitHub", url: contact.github, Icon: CodeGlyph },
    { label: "LinkedIn", url: contact.linkedin, Icon: BriefcaseGlyph },
    { label: "LeetCode", url: contact.leetcode, Icon: TrophyGlyph },
    { label: "X", url: contact.twitter, Icon: XGlyph },
    { label: "Email", url: contact.email && `mailto:${contact.email}`, Icon: MailGlyph },
  ].filter((link) => link.url);
}

export const external = (url) => (url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" });

// The main "Finder" window: profile, links, experience, projects.
export default function PortfolioApp({ resume, onOpenApp, embedded = false }) {
  if (!resume) return <div className="app-empty">Loading…</div>;
  const headline = [...(resume.skills?.Languages || []), ...(resume.skills?.["Frameworks & Libraries"] || [])];
  const chips = headline.length ? headline : Object.values(resume.skills || {}).flat().slice(0, 6);

  return (
    <div className={`portfolio ${embedded ? "is-embedded" : ""}`}>
      <div className="portfolio__scroll">
        <header className="portfolio__header">
          <Avatar name={resume.name} size={66} />
          <div>
            <h1>{resume.name}</h1>
            {resume.title && <p className="portfolio__title">{resume.title}</p>}
            {resume.location && <p className="portfolio__muted">{resume.location}</p>}
          </div>
        </header>

        {chips.length > 0 && (
          <div className="pchips">
            {chips.map((skill, i) => <span key={skill} className={`pchip ${i === 0 ? "is-accent" : ""}`}>{skill}</span>)}
          </div>
        )}

        {resume.summary && <p className="portfolio__summary">{resume.summary}</p>}

        <div className="portfolio__links">
          {profileLinks(resume.contact).map(({ label, url, Icon }) => (
            <a key={label} className="ghost-button" href={url} {...external(url)}><Icon size={16} />{label}</a>
          ))}
          <button className="ghost-button" onClick={() => onOpenApp?.("resume")}><FileGlyph size={16} />Resume</button>
        </div>

        {resume.experience?.length > 0 && (
          <section className="psection">
            <h2>Experience</h2>
            {resume.experience.map((job) => (
              <div key={`${job.company}-${job.role}`} className="pcard prow">
                <span className="prow__icon"><BriefcaseGlyph /></span>
                <div className="prow__body">
                  <h3>{job.company}</h3>
                  <p>{job.role}</p>
                  <small>{[job.start, job.end].filter(Boolean).join(" – ")}{job.location ? ` · ${job.location}` : ""}</small>
                </div>
              </div>
            ))}
          </section>
        )}

        {resume.projects?.length > 0 && (
          <section className="psection">
            <h2>Projects</h2>
            {resume.projects.map((project) => (
              <article key={project.name} className="pcard pproject">
                <div className="pproject__top">
                  <span className="pproject__logo" aria-hidden="true">{project.name[0]}</span>
                  <div className="prow__badges">
                    {project.live && (
                      <a className="badge is-green" href={project.live} {...external(project.live)}><span className="dot" />Live</a>
                    )}
                    {project.github && (
                      <a className="badge" href={project.github} {...external(project.github)}><CodeGlyph size={12} />GitHub</a>
                    )}
                  </div>
                </div>
                <h3>
                  {project.live || project.github ? (
                    <a href={project.live || project.github} {...external(project.live || project.github)}>
                      {project.name} <ExternalGlyph size={13} />
                    </a>
                  ) : project.name}
                </h3>
                {(project.description || project.highlights?.[0]) && (
                  <p className="pproject__desc">{project.description || project.highlights[0]}</p>
                )}
                <div className="pchips">{(project.tech || []).map((t) => <span key={t} className="pchip is-small">{t}</span>)}</div>
              </article>
            ))}
          </section>
        )}

        <div className="portfolio__spacer" />
      </div>

      <button className="ask-pill ask-pill--floating" onClick={() => onOpenApp?.("chat")}>
        <SparkleIcon size={18} />Ask Me
      </button>
    </div>
  );
}
