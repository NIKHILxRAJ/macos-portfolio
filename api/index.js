// Vercel serverless function: every /api/* request is rewritten here (see vercel.json).
// A function instance can outlive a failed MongoDB connection, so retry it before each request.
import { app, connectDb } from "../server/src/server.js";

export default async function handler(req, res) {
  await connectDb();
  return app(req, res);
}
