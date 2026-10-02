import Avatar from "../components/Avatar.jsx";
import { external, profileLinks } from "./PortfolioApp.jsx";

const TILE_COLORS = { GitHub: "#6e5bff", LinkedIn: "#2f80ff", LeetCode: "#f5a623", X: "#000000" };

// "Let's connect": a colourful tile per profile.
export default function ContactApp({ resume }) {
  if (!resume) return <div className="app-empty">Loading…</div>;

  return (
    <div className="contact-card">
      <Avatar name={resume.name} size={68} />
      <h1>Let's connect</h1>
      <p>Have a role, a project or a question for me? Pick a way to reach out.</p>
      <div className="contact-tiles">
        {profileLinks(resume.contact).filter(({ label }) => label !== "Email").map(({ label, url, Icon }) => (
          <a key={label} className={`contact-tile ${label === "X" ? "is-x" : ""}`} style={{ background: TILE_COLORS[label] }} href={url} {...external(url)}>
            <Icon size={22} />
            <span>{label === "X" ? "Twitter / X" : label}</span>
          </a>
        ))}
      </div>
      {resume.contact?.email && <p className="contact-card__email">{resume.contact.email}</p>}
    </div>
  );
}
