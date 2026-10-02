// Loads data/resume.json: the single source of truth for the website and the AI.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const DEFAULT_RESUME_PATH = fileURLToPath(new URL("../data/resume.json", import.meta.url));

const ARRAY_FIELDS = ["experience", "projects", "education", "achievements", "certifications"];

export function loadResume(path = process.env.RESUME_PATH || DEFAULT_RESUME_PATH) {
  const resume = JSON.parse(readFileSync(path, "utf8"));
  if (typeof resume.name !== "string" || !resume.name.trim()) {
    throw new Error(`${path}: "name" is required`);
  }
  for (const field of ARRAY_FIELDS) {
    resume[field] ??= [];
    if (!Array.isArray(resume[field])) throw new Error(`${path}: "${field}" must be a list`);
  }
  resume.contact ??= {};
  resume.skills ??= {};
  return Object.freeze(resume);
}
