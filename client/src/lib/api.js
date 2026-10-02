async function request(path, options) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export const getResume = () => request("/api/resume");

export const askQuestion = (question, history) =>
  request("/api/ask", { method: "POST", body: JSON.stringify({ question, history }) });

// Optional files in client/public: the gallery manifest and the resume PDF.
export async function getGallery() {
  try {
    const response = await fetch("/gallery/gallery.json");
    if (!response.ok) return { photos: [] };
    const data = await response.json();
    return { photos: Array.isArray(data.photos) ? data.photos : [] };
  } catch {
    return { photos: [] };
  }
}

export async function resumePdfExists() {
  try {
    const response = await fetch("/resume.pdf", { method: "HEAD" });
    return response.ok && (response.headers.get("content-type") || "").includes("pdf");
  } catch {
    return false;
  }
}
