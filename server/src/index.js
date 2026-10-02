// Starts the server locally (or on Render/Railway). On Vercel, api/index.js uses the app instead.
import { app } from "./server.js";

const port = Number(process.env.PORT) || 5001;

app.listen(port, () => {
  console.log(`Portfolio API on http://localhost:${port} (AI ${process.env.GROQ_API_KEY ? "on" : "off"})`);
});
