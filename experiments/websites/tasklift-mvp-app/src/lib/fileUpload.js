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
