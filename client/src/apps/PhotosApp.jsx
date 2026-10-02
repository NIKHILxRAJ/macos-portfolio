import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, GridGlyph, PhotoGlyph, StarGlyph } from "../components/icons.jsx";
import { getGallery } from "../lib/api.js";

// Photos: albums and a viewer. Photos come from client/public/gallery/gallery.json.
export default function PhotosApp() {
  const [photos, setPhotos] = useState(null);
  const [album, setAlbum] = useState("Library");
  const [viewing, setViewing] = useState(null); // index in the visible list

  useEffect(() => {
    getGallery().then(({ photos: list }) => setPhotos(list));
  }, []);

  const albums = useMemo(() => [...new Set((photos || []).map((p) => p.album).filter(Boolean))], [photos]);
  const visible = useMemo(() => {
    const list = photos || [];
    if (album === "Library") return list;
    if (album === "Favourites") return list.filter((p) => p.favourite);
    return list.filter((p) => p.album === album);
  }, [photos, album]);

  useEffect(() => {
    if (viewing === null) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setViewing(null);
      if (event.key === "ArrowRight") setViewing((i) => (i + 1) % visible.length);
      if (event.key === "ArrowLeft") setViewing((i) => (i - 1 + visible.length) % visible.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing, visible.length]);

  if (photos === null) return <div className="app-empty">Loading…</div>;
  const nav = [
    { key: "Library", Icon: GridGlyph },
    ...(photos.some((p) => p.favourite) ? [{ key: "Favourites", Icon: StarGlyph }] : []),
    ...albums.map((key) => ({ key, Icon: PhotoGlyph })),
  ];
  const shown = viewing !== null ? visible[viewing] : null;

  return (
    <div className="photos">
      <aside className="photos__sidebar">
        <div className="photos__group">Photos</div>
        {nav.map(({ key, Icon }) => (
          <button key={key} className={`photos__nav ${album === key ? "is-active" : ""}`} onClick={() => { setAlbum(key); setViewing(null); }}>
            <Icon size={16} />{key}
          </button>
        ))}
      </aside>

      <div className="photos__main">
        <header className="photos__head">
          <h2>{album}</h2>
          <span>{visible.length} item{visible.length === 1 ? "" : "s"}</span>
        </header>
        {visible.length === 0 ? (
          <div className="photos__empty">
            <PhotoGlyph size={40} />
            <strong>No photos yet</strong>
            <span>Add images to <code>client/public/gallery/</code> and list them in <code>gallery.json</code>.</span>
          </div>
        ) : (
          <div className="photos__grid">
            {visible.map((photo, i) => (
              <button key={photo.src} className="photos__thumb" onClick={() => setViewing(i)} aria-label={photo.caption || "Open photo"}>
                <img src={photo.src} alt={photo.caption || ""} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {shown && (
        <div className="photos__viewer" role="dialog" aria-label={shown.caption || "Photo"} onClick={() => setViewing(null)}>
          <img src={shown.src} alt={shown.caption || ""} onClick={(e) => e.stopPropagation()} />
          {shown.caption && <p onClick={(e) => e.stopPropagation()}>{shown.caption}</p>}
          {visible.length > 1 && (
            <>
              <button className="photos__arrow is-left" aria-label="Previous"
                onClick={(e) => { e.stopPropagation(); setViewing((viewing - 1 + visible.length) % visible.length); }}><ChevronLeft size={22} /></button>
              <button className="photos__arrow is-right" aria-label="Next"
                onClick={(e) => { e.stopPropagation(); setViewing((viewing + 1) % visible.length); }}><ChevronRight size={22} /></button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
