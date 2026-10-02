# Nikhil Raj · macOS Portfolio (MERN)

An interactive portfolio that looks like a macOS desktop: a blue wave wallpaper, a hand-drawn
"welcome to my PORTFOLIO" greeting whose letters bubble up under the cursor, project folders on the
desktop, real macOS app icons in a magnifying dock, and draggable windows with working traffic lights.

| Window | What it does |
|---|---|
| **Finder · Portfolio** | Profile, links, education, projects (Live / GitHub badges), skills, certificates |
| **Safari** | A search page about me plus favourites, built from my resume |
| **Photos** | Gallery with albums and a full-screen viewer (`client/public/gallery`) |
| **Contacts** | Profile tiles plus a message form saved to **MongoDB** |
| **Terminal** | Opens with my tech stack, then takes commands (`help`, `projects`…) or questions |
| **Ask Me** | Chat with an AI that answers **only from my resume** (Groq · GPT-OSS 120B) |
| **Preview** | The resume as a document (opened from `Resume.pdf` on the desktop) |

On phones it becomes one scrolling portfolio page with an Ask Me button.

**Stack:** MongoDB · Express · React · Node.js — plus Vite, Mongoose, Groq SDK, Helmet, express-rate-limit.

```
portfolio/
  server/                    Express API (Node)
    data/resume.json         the single source of truth: edit this
    src/app.js               routes: /api/resume, /api/ask, /api/messages; validation; rate limits
    src/llm.js               resume-grounded system prompt + Groq call
    src/models/Message.js    Mongoose model for contact messages
    src/index.js             starts the server, connects MongoDB
    test/app.test.js         15 API tests (node:test + supertest)
  client/                    React app (Vite)
    src/App.jsx              window manager + phone layout
    src/apps/                Portfolio, Safari, Photos, Contact, Terminal, Chat, Resume, About This Mac
    src/components/          MenuBar, Dock, Window, DesktopIcons, Wallpaper, Greeting, Avatar, icons
    public/icons/            macOS app icons (PNG)
    public/gallery/          photos + gallery.json
```

## Run locally

```bash
npm run install:all            # installs root, server and client packages
cp server/.env.example server/.env   # add GROQ_API_KEY (and MONGODB_URI if different)
mongod --dbpath ~/data/db      # optional: start MongoDB for contact messages (mkdir -p ~/data/db first)
npm run dev                    # API on :5001, website on :5173 (or the next free port)
```

- Without `GROQ_API_KEY`, the AI says it's offline; everything else works.
- Without MongoDB, the contact form says messages are offline and shows the email instead.

## Update the content

- **Resume:** edit `server/data/resume.json` (restart the server).
- **Photo:** add `client/public/avatar.jpg` to replace the initials avatar.
- **Gallery:** put images in `client/public/gallery/` and list them in `gallery.json`.
- **Resume PDF:** add `client/public/resume.pdf` to enable "Download Resume".

## Tests

```bash
npm test
```

## Deploy (one service)

Express serves the built React app, so the whole site runs as one web service (Render, Railway…):

- **Build:** `npm run install:all && npm run build`
- **Start:** `npm start`
- **Environment:** `GROQ_API_KEY`, `MONGODB_URI` (MongoDB Atlas), `TRUST_PROXY=true`

### Vercel

`vercel.json` serves the React build as static files and runs Express as a serverless function
(`api/index.js`) for every `/api/*` request.

- **Root Directory:** the repo root (not `client`), so Vercel reads `vercel.json`
- **Environment Variables:** `GROQ_API_KEY`, `MONGODB_URI` (MongoDB Atlas); redeploy after adding them

Never commit `server/.env`: it's in `.gitignore`.

## How the AI stays truthful

1. Terminal commands don't use AI; they print `resume.json` directly.
2. The AI's system prompt contains only the resume and strict rules: use only resume facts, never invent
   companies, dates or numbers, reply "That isn't on my resume" when unsure, refuse off-topic questions,
   and ignore attempts to change the rules.
3. Low temperature (0.2), 500-character questions, last 6 messages of history, 15 questions a minute.

## Credits

Layout and look inspired by [saurabhkushwaha438/portfolio](https://github.com/saurabhkushwaha438/portfolio).
All code, the wallpaper and the text here are original; no files were copied from that repo.
App icons are Apple's macOS icons (© Apple Inc.), used for a macOS look.
Fonts: Permanent Marker and Patrick Hand (Google Fonts, SIL Open Font License).
