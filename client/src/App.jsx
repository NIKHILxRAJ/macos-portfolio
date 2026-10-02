import { useCallback, useEffect, useRef, useState } from "react";
import ChatApp from "./apps/ChatApp.jsx";
import ContactApp from "./apps/ContactApp.jsx";
import PhotosApp from "./apps/PhotosApp.jsx";
import PortfolioApp from "./apps/PortfolioApp.jsx";
import ResumeApp from "./apps/ResumeApp.jsx";
import SafariApp from "./apps/SafariApp.jsx";
import SysInfoApp from "./apps/SysInfoApp.jsx";
import TerminalApp from "./apps/TerminalApp.jsx";
import DesktopIcons from "./components/DesktopIcons.jsx";
import Dock from "./components/Dock.jsx";
import Greeting from "./components/Greeting.jsx";
import MenuBar from "./components/MenuBar.jsx";
import Wallpaper from "./components/Wallpaper.jsx";
import Window from "./components/Window.jsx";
import { getResume, resumePdfExists } from "./lib/api.js";

const MENU_BAR = 32;
const DOCK_SPACE = 100;
const MOBILE_QUERY = "(max-width: 760px)";

// Every window: dock label, title, preferred size and cascade offset.
const APPS = {
  portfolio: { label: "Finder", title: "Nikhil Raj — Portfolio", titleIcon: "/icons/folder.png", size: [880, 760], offset: [60, -10], Component: PortfolioApp },
  safari: { label: "Safari", title: "Safari", size: [960, 640], offset: [70, 0], Component: SafariApp },
  photos: { label: "Photos", title: "Photos", size: [880, 600], offset: [-40, 10], Component: PhotosApp },
  contact: { label: "Contacts", title: "Contact Me", size: [560, 420], offset: [0, 0], Component: ContactApp },
  terminal: { label: "Terminal", title: "Tech Stack", size: [540, 500], offset: [-20, 10], Component: TerminalApp },
  chat: { label: "Ask Me", title: "Ask Me", size: [420, 600], offset: [320, 0], Component: ChatApp, dockless: true },
  resume: { label: "Preview", title: "Resume.pdf — Preview", size: [820, 760], offset: [120, -10], Component: ResumeApp, dockless: true },
  sysinfo: { label: "About This Mac", title: "", size: [400, 460], offset: [0, -20], Component: SysInfoApp, dockless: true },
};

const DOCK_APPS = Object.entries(APPS).filter(([, a]) => !a.dockless).map(([key, a]) => ({ key, label: a.label }));

function initialFrame(key) {
  const { size: [prefW, prefH], offset: [dx, dy] } = APPS[key];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.min(prefW, vw - 32);
  const h = Math.min(prefH, vh - MENU_BAR - DOCK_SPACE - 16);
  const x = Math.round(Math.min(Math.max(16, (vw - w) / 2 + dx), vw - w - 16));
  const y = Math.round(Math.max(MENU_BAR + 12, MENU_BAR + (vh - MENU_BAR - DOCK_SPACE - h) / 2 + dy));
  return { x, y, w, h };
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setMobile(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

export default function App() {
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState(null);
  const [hasResumePdf, setHasResumePdf] = useState(false);
  const [windows, setWindows] = useState({});
  const [mobileChat, setMobileChat] = useState(false);
  const topZ = useRef(10);
  const isMobile = useIsMobile();

  useEffect(() => {
    getResume()
      .then((data) => {
        setResume(data);
        document.title = `${data.name} — Portfolio`;
      })
      .catch((error) => setResumeError(error.message));
    resumePdfExists().then(setHasResumePdf);
  }, []);

  const openApp = useCallback((key) => {
    if (!APPS[key]) return;
    setWindows((current) => ({
      ...current,
      [key]: {
        frame: current[key]?.frame || initialFrame(key),
        maximized: current[key]?.maximized || false,
        open: true,
        minimized: false,
        z: ++topZ.current,
      },
    }));
  }, []);

  const update = (key, changes) => setWindows((current) => ({ ...current, [key]: { ...current[key], ...changes } }));
  const focus = (key) => windows[key]?.z !== topZ.current && update(key, { z: ++topZ.current });

  const visible = Object.entries(windows).filter(([, w]) => w.open && !w.minimized);
  const focusedKey = [...visible].sort((a, b) => b[1].z - a[1].z)[0]?.[0];
  const firstName = resume?.name?.split(" ")[0];

  function onDockClick(key) {
    const win = windows[key];
    if (win?.open && !win.minimized && key === focusedKey) update(key, { minimized: true });
    else openApp(key);
  }

  // Phones get one scrolling page instead of a desktop.
  if (isMobile) {
    return (
      <div className="mobile">
        {resumeError ? <div className="app-empty">Could not reach the portfolio server.</div>
          : <PortfolioApp resume={resume} embedded onOpenApp={(key) => key === "chat" && setMobileChat(true)} />}
        {mobileChat && (
          <div className="mobile-chat" role="dialog" aria-label="Ask Me">
            <div className="mobile-chat__panel">
              <div className="mobile-chat__head">
                <strong>Ask Me</strong>
                <button onClick={() => setMobileChat(false)} aria-label="Close">✕</button>
              </div>
              <ChatApp resume={resume} active />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="desktop">
      <Wallpaper />
      <MenuBar firstName={firstName} onOpen={openApp} hasResumePdf={hasResumePdf} />
      <DesktopIcons resume={resume} onOpen={openApp} />
      <Greeting firstName={firstName} dimmed={visible.length > 0} />

      {Object.entries(windows).map(([key, win]) => {
        if (!win.open) return null;
        const { Component, title, titleIcon } = APPS[key];
        const isFocused = key === focusedKey;
        return (
          <Window
            key={key}
            title={title}
            titleIcon={titleIcon}
            frame={win.frame}
            z={win.z}
            focused={isFocused}
            minimized={win.minimized}
            maximized={win.maximized}
            onFocus={() => focus(key)}
            onClose={() => update(key, { open: false, maximized: false })}
            onMinimize={() => update(key, { minimized: true })}
            onMaximize={() => update(key, { maximized: !win.maximized })}
            onMove={(pos) => update(key, { frame: { ...win.frame, ...pos } })}
          >
            <Component
              resume={resume}
              resumeError={resumeError}
              hasResumePdf={hasResumePdf}
              active={isFocused}
              onOpenApp={openApp}
              onClose={() => update(key, { open: false })}
            />
          </Window>
        );
      })}

      <Dock apps={DOCK_APPS} windows={windows} onOpen={onDockClick} />
    </div>
  );
}
