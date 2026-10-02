// What the Tech Stack terminal shows. It reads straight from the resume, so it is always exact.

// Resume skill groups -> short terminal categories. Frameworks are split into front end and back end.
const RENAME = { Languages: "Language", Databases: "Database" };
const FRONTEND = /^(react|next|vue|angular|svelte|redux|tailwind|bootstrap|html|css)/i;

function categories(skills = {}) {
  const groups = [];
  for (const [group, items] of Object.entries(skills)) {
    if (group === "Frameworks & Libraries") {
      groups.push(["Frontend", items.filter((s) => FRONTEND.test(s))], ["Backend", items.filter((s) => !FRONTEND.test(s))]);
    } else {
      groups.push([RENAME[group] || group, items]);
    }
  }
  // Frontend and backend read best right after the languages.
  const order = ["Language", "Frontend", "Backend", "Database"];
  const rank = (name) => (order.includes(name) ? order.indexOf(name) : order.length);
  return groups.filter(([, items]) => items.length).sort((a, b) => rank(a[0]) - rank(b[0]));
}

// "show tech stack": [category, technologies] rows built from the resume.
export const stackRows = (resume) => categories(resume?.skills);

// The prompt name, e.g. "Nikhil" for "@Nikhil %".
export function firstName(resume) {
  return (resume?.name || "guest").split(/\s+/)[0];
}
