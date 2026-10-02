// The Express app. Dependencies (AI, message store) are passed in so tests can use fakes.
import { existsSync } from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { BLOCKED_MESSAGE, isBlocked, stripInvisible } from "./guard.js";
import { buildMessages, HISTORY_TURNS } from "./llm.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALHOST_RE = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

const clean = (value) => (typeof value === "string" ? value.trim() : "");

// The chat shows plain text, so drop Markdown emphasis and headings the model sometimes adds.
export const toPlainText = (text) => text
  .replace(/\*\*(.+?)\*\*/g, "$1")
  .replace(/__(.+?)__/g, "$1")
  .replace(/^#{1,6}\s+/gm, "");

function limiter(limit, windowMs, message) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message },
  });
}

export function parseQuestion(body) {
  const question = stripInvisible(clean(body?.question)).trim();
  if (!question) return { error: "Question is empty" };
  if (question.length > 500) return { error: "Question is too long (500 characters max)" };
  if (isBlocked(question)) return { error: BLOCKED_MESSAGE };

  const rawHistory = Array.isArray(body?.history) ? body.history : [];
  if (rawHistory.length > 20) return { error: "History is too long" };
  const history = [];
  for (const turn of rawHistory) {
    if (!["user", "assistant"].includes(turn?.role) || typeof turn?.content !== "string" || turn.content.length > 2000) {
      return { error: "Invalid history" };
    }
    const content = stripInvisible(turn.content);
    // History comes from the browser, so a forged earlier turn is screened like a new question.
    // It is dropped rather than refused: one bad turn must not block every follow-up question.
    if (!isBlocked(content)) history.push({ role: turn.role, content });
  }
  return { question, history: history.slice(-HISTORY_TURNS) };
}

export function parseMessage(body) {
  const name = clean(body?.name);
  const email = clean(body?.email).toLowerCase();
  const message = clean(body?.message);
  if (!name || name.length > 80) return { error: "Please enter your name (80 characters max)" };
  if (!EMAIL_RE.test(email) || email.length > 254) return { error: "Please enter a valid email" };
  if (!message || message.length > 2000) return { error: "Please write a message (2000 characters max)" };
  return { name, email, message };
}

export function createApp({
  resume,
  askModel = null,
  messageStore = null,
  askLimit = 15,
  messageLimit = 5,
  clientDist = null,
  allowedOrigins = [],
  trustProxy = false,
}) {
  const app = express();
  if (trustProxy) app.set("trust proxy", 1);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "img-src": ["'self'", "data:"],
      },
    },
  }));
  app.use(cors({ origin: [LOCALHOST_RE, ...allowedOrigins] }));
  app.use(express.json({ limit: "20kb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", ai: Boolean(askModel), db: Boolean(messageStore?.available()) });
  });

  app.get("/api/resume", (req, res) => res.json(resume));

  app.post("/api/ask", limiter(askLimit, 60_000, "Too many questions. Please wait a minute."), async (req, res) => {
    if (!askModel) {
      return res.status(503).json({ message: "The AI is offline (no GROQ_API_KEY). Type `help` for commands." });
    }
    const parsed = parseQuestion(req.body);
    if (parsed.error) return res.status(400).json({ message: parsed.error });
    try {
      const answer = toPlainText(clean(await askModel(buildMessages(resume, parsed.question, parsed.history))));
      return res.json({ answer: answer || "I couldn't find an answer to that in my resume." });
    } catch (error) {
      console.error("Groq request failed:", error.message);
      return res.status(502).json({ message: "The AI is not responding right now. Try a command like `skills`." });
    }
  });

  app.post("/api/messages", limiter(messageLimit, 60 * 60_000, "Too many messages. Please try again later."), async (req, res) => {
    if (clean(req.body?.website)) return res.status(201).json({ ok: true }); // honeypot: bots fill hidden fields
    const parsed = parseMessage(req.body);
    if (parsed.error) return res.status(400).json({ message: parsed.error });
    if (!messageStore?.available()) {
      const email = resume.contact?.email;
      return res.status(503).json({ message: `Messages are offline right now.${email ? ` Please email ${email}.` : ""}` });
    }
    try {
      await messageStore.save(parsed);
      return res.status(201).json({ ok: true });
    } catch (error) {
      console.error("Saving message failed:", error.message);
      return res.status(500).json({ message: "Could not save your message. Please try again." });
    }
  });

  app.use("/api", (req, res) => res.status(404).json({ message: "Not found" }));

  // In production the built React app is served from here too (one server, one URL).
  if (clientDist && existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.use((req, res, next) => {
      if (req.method !== "GET") return next();
      return res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  // Malformed JSON bodies and other errors return the same {message} shape.
  app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON" });
    if (error.type === "entity.too.large") return res.status(413).json({ message: "Request is too large" });
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  });

  return app;
}
