// Builds the configured app from the environment. Used by index.js (local/Render) and api/index.js (Vercel).
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { createGroqAsker } from "./llm.js";
import { createMongoMessageStore } from "./models/Message.js";
import { loadResume } from "./resume.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

// Connects to MongoDB if it isn't connected or connecting. Safe to call on every request.
export async function connectDb() {
  if (!process.env.MONGODB_URI || mongoose.connection.readyState === 1) return;
  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise().catch(() => {});
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.warn(`MongoDB not connected (${error.message}); contact messages are disabled.`);
  }
}

if (process.env.MONGODB_URI) connectDb();
else console.warn("MONGODB_URI not set; contact messages are disabled.");

export const app = createApp({
  resume: loadResume(),
  askModel: process.env.GROQ_API_KEY
    ? createGroqAsker({ apiKey: process.env.GROQ_API_KEY, model: process.env.GROQ_MODEL })
    : null,
  messageStore: createMongoMessageStore(),
  askLimit: Number(process.env.RATE_LIMIT_PER_MINUTE) || 15,
  clientDist: fileURLToPath(new URL("../../client/dist", import.meta.url)),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean),
  // Vercel sits behind a proxy, so the rate limiter needs the real visitor IP from X-Forwarded-For.
  trustProxy: process.env.TRUST_PROXY === "true" || Boolean(process.env.VERCEL),
});
