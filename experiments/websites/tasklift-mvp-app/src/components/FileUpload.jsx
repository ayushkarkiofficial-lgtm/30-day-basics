import { useState } from "react";
import { validateFile } from "../lib/fileUpload.js";

// Status badge colors — reuse the same look as ReviewQueue's badges.
const statusStyle = {
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// Human-readable size, e.g. "2.4 MB". Pure display helper.
function formatSize(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function FileUpload({ files, onUpload, onMarkDone, onView }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] ?? null);
    setMessage({ type: "", text: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Client-side validation = instant UX feedback only (bucket enforces for real).
    const check = validateFile(selectedFile);
    if (!check.valid) {
      setMessage({ type: "error", text: check.error });
      return;
    }

    setIsUploading(true);
    const result = await onUpload(selectedFile);
    setIsUploading(false);

    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return;
    }

    setSelectedFile(null);
    event.target.reset(); // clear the native file input
    setMessage({ type: "success", text: "File uploaded — processing." });
  }

  return (
    <section
      id="upload"
      className="grid gap-5 rounded-lg border border-line bg-white p-6 shadow-panel"
    >
      <div>
        <p className="text-sm font-extrabold uppercase text-accent">Upload</p>
        <h2 className="mt-2 text-2xl font-extrabold">Upload a file</h2>
        <p className="mt-1 text-sm text-muted">
          PDF, PNG, or JPG up to 10 MB. Files start processing on upload.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={handleFileChange}
          className="rounded-md border border-line px-3 py-3 text-sm file:mr-4 file:rounded file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-white"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="min-h-12 rounded-md bg-accent px-5 py-3 font-extrabold text-white outline-offset-2 hover:bg-[#164c40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60 md:w-fit"
        >
          {isUploading ? "Uploading…" : "Upload"}
        </button>

        {message.text ? (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`text-sm font-bold ${
              message.type === "error" ? "text-red-700" : "text-accent"
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </form>

      {files.length === 0 ? (
        <p className="text-sm text-muted">No files uploaded yet.</p>
      ) : (
        <ul className="grid gap-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-bold">{file.file_name}</p>
                <p className="text-xs text-muted">
                  {file.file_type} · {formatSize(file.file_size)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${
                    statusStyle[file.status] ??
                    "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {file.status}
                </span>
                <button
                  type="button"
                  onClick={() => onView(file.file_path)}
                  className="rounded border border-line px-2 py-0.5 text-xs font-medium text-muted hover:border-ink hover:text-ink transition-colors"
                >
                  View
                </button>
                {file.status !== "Done" ? (
                  <button
                    type="button"
                    onClick={() => onMarkDone(file.id)}
                    className="rounded border border-line px-2 py-0.5 text-xs font-medium text-muted hover:border-ink hover:text-ink transition-colors"
                  >
                    Mark done
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FileUpload;
