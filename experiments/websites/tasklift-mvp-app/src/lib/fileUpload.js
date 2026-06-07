// fileUpload.js — pure validation + the upload sequence helper.
//
// validateFile() is pure (no React, no network) so it can be unit-tested
// in isolation, exactly like lib/metrics.js / computeMetrics.
//
// SECURITY NOTE: this client-side check is UX only and is trivially
// bypassable. The REAL enforcement is the Supabase bucket's MIME-type
// and size limits + RLS. See notes/day-19-file-upload.md.

export const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateFile(file) {
  if (!file) {
    return { valid: false, error: "Choose a file first." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Only PDF, PNG, or JPG up to 10 MB." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { valid: false, error: "Only PDF, PNG, or JPG up to 10 MB." };
  }
  return { valid: true, error: "" };
}

export const BUCKET = "uploads";
export const FILES_TABLE = "uploaded_files";

// uploadFile — runs the byte-then-metadata sequence from the spec:
//   1. upload bytes to Storage under a collision-proof path
//   2. insert a metadata row pointing at that path
// Returns { row, error }. On any failure, row is null and error is a
// human-readable string. Bytes are uploaded BEFORE the row so we never
// create a row that points at a missing file.
export async function uploadFile(supabase, file) {
  const path = `${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file);

  if (uploadError) {
    console.error("Storage upload error:", uploadError.message);
    return { row: null, error: "Upload failed — try again." };
  }

  const { data, error: insertError } = await supabase
    .from(FILES_TABLE)
    .insert({
      file_name: file.name,
      file_path: path,
      file_type: file.type,
      file_size: file.size,
      status: "Processing",
    })
    .select()
    .single();

  if (insertError) {
    // Orphaned-byte edge case: bytes uploaded but metadata failed.
    // Not cleaned up here — that is Day 21 territory (logged in risks doc).
    console.error("Metadata insert error:", insertError.message);
    return { row: null, error: "Couldn't save file details." };
  }

  return { row: data, error: "" };
}
