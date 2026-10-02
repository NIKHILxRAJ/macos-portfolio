// Starts the server: loads the resume, connects MongoDB (optional), wires the AI (optional).
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { createGroqAsker } from "./llm.js";
import { createMongoMessageStore } from "./models/Message.js";
import { loadResume } from "./resume.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

const resume = loadResume();
const port = Number(process.env.PORT) || 5001;

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.warn(`MongoDB not connected (${error.message}); contact messages are disabled.`));
} else {
  console.warn("MONGODB_URI not set; contact messages are disabled.");
}

const app = createApp({
  resume,
  askModel: process.env.GROQ_API_KEY
    ? createGroqAsker({ apiKey: process.env.GROQ_API_KEY, model: process.env.GROQ_MODEL })
    : null,
  messageStore: createMongoMessageStore(),
  askLimit: Number(process.env.RATE_LIMIT_PER_MINUTE) || 15,
  clientDist: fileURLToPath(new URL("../../client/dist", import.meta.url)),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean),
  trustProxy: process.env.TRUST_PROXY === "true",
});

app.listen(port, () => {
  console.log(`Portfolio API on http://localhost:${port} (AI ${process.env.GROQ_API_KEY ? "on" : "off"})`);
});
