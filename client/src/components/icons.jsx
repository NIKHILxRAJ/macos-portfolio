import { useState } from "react";

// Real macOS icons live in client/public/icons/*.png (extracted from macOS).
// If an image is missing, a simple rounded tile with the app's initial is shown instead.
function systemIcon(src, label, color) {
  return function SystemIcon() {
    const [failed, setFailed] = useState(false);
    if (failed) {
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="4" y="4" width="56" height="56" rx="13" fill={color} />
          <text x="32" y="41" textAnchor="middle" fontSize="24" fontWeight="700" fill="#fff"
            fontFamily="-apple-system, Helvetica, Arial, sans-serif">{label[0]}</text>
        </svg>
      );
    }
    return <img className="system-icon" src={src} alt="" draggable={false} onError={() => setFailed(true)} />;
  };
}

export const APP_ICONS = {
  portfolio: systemIcon("/icons/finder.png", "Finder", "#1d6ff2"),
  safari: systemIcon("/icons/safari.png", "Safari", "#1366e8"),
  photos: systemIcon("/icons/photos.png", "Photos", "#f5a623"),
  contact: systemIcon("/icons/contacts.png", "Contacts", "#a8693a"),
  terminal: systemIcon("/icons/terminal.png", "Terminal", "#2a2a2e"),
};

export const FolderIcon = systemIcon("/icons/folder.png", "Folder", "#4aa8f0");
export const DocumentIcon = systemIcon("/icons/document.png", "Document", "#8d96a1");

export function AppleLogo() {
  return (
    <svg viewBox="0 0 14 17" width="14" height="17" aria-hidden="true" fill="currentColor">
      <path d="M11.62 9.03c-.02-1.83 1.5-2.71 1.57-2.75-.86-1.25-2.19-1.42-2.66-1.44-1.13-.11-2.21.67-2.78.67-.58 0-1.46-.65-2.4-.63-1.23.02-2.37.72-3.01 1.82-1.29 2.23-.33 5.52.92 7.33.61.88 1.34 1.88 2.29 1.84.92-.04 1.27-.59 2.38-.59 1.11 0 1.43.59 2.4.57.99-.02 1.62-.9 2.22-1.79.7-1.02.99-2.01 1-2.06-.02-.01-1.92-.74-1.93-2.97zM9.8 3.66c.5-.61.84-1.46.75-2.31-.72.03-1.6.48-2.12 1.09-.46.54-.87 1.41-.76 2.24.81.06 1.63-.41 2.13-1.02z" />
    </svg>
  );
}

export function SparkleIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8z" fill="#2f7bff" />
      <path d="M18 2l.8 2.2L21 5l-2.2.8L18 8l-.8-2.2L15 5l2.2-.8z" fill="#2f7bff" />
      <path d="M18 15l.6 1.4 1.4.6-1.4.6L18 19l-.6-1.4L16 17l1.4-.6z" fill="#2f7bff" />
    </svg>
  );
}

export function WifiIcon() {
  return (
    <svg viewBox="0 0 20 14" width="18" height="13" aria-hidden="true">
      <path d="M10 12.5l1.8-2.2a2.8 2.8 0 0 0-3.6 0z M5.2 7.6l1.3 1.5a5.4 5.4 0 0 1 7 0l1.3-1.5a7.4 7.4 0 0 0-9.6 0z M2.1 4.3l1.3 1.6a10 10 0 0 1 13.2 0l1.3-1.6a12 12 0 0 0-15.8 0z" fill="currentColor" />
    </svg>
  );
}

// Small line glyphs used on buttons, tiles and sidebars.
const glyph = (paths) => function Glyph({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths}
    </svg>
  );
};
export const CodeGlyph = glyph(<><path d="M8 7l-5 5 5 5" /><path d="M16 7l5 5-5 5" /><path d="M14 4l-4 16" /></>);
export const BriefcaseGlyph = glyph(<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></>);
export const TrophyGlyph = glyph(<><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M16 5h3v2a3 3 0 0 1-3 3M8 5H5v2a3 3 0 0 0 3 3" /><path d="M12 13v4M8 21h8M9 17h6" /></>);
export const XGlyph = glyph(<><path d="M4 4l16 16" /><path d="M20 4L4 20" /></>);
export const MailGlyph = glyph(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>);
export const FileGlyph = glyph(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>);
export const CapGlyph = glyph(<><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></>);
export const ExternalGlyph = glyph(<><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>);
export const SearchGlyph = glyph(<><circle cx="11" cy="11" r="6.5" /><path d="M16 16l5 5" /></>);
export const InfoGlyph = glyph(<><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>);
export const SendGlyph = glyph(<><path d="M4 12l16-8-6 16-2-7z" /></>);
export const PhotoGlyph = glyph(<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-8 8" /></>);
export const StarGlyph = glyph(<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />);
export const GridGlyph = glyph(<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>);
export const ChevronLeft = glyph(<path d="M15 5l-7 7 7 7" />);
export const ChevronRight = glyph(<path d="M9 5l7 7-7 7" />);
export const ReloadGlyph = glyph(<><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></>);
export const LockGlyph = glyph(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
