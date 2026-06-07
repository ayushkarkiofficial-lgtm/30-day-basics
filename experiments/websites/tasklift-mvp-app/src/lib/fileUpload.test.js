import { describe, it, expect } from "vitest";
import { validateFile, MAX_FILE_BYTES, ALLOWED_TYPES } from "./fileUpload.js";

describe("validateFile", () => {
  it("accepts a valid PDF under the limit", () => {
    const file = { type: "application/pdf", size: 1000 };
    expect(validateFile(file)).toEqual({ valid: true, error: "" });
  });

  it("accepts a valid PNG", () => {
    const file = { type: "image/png", size: 1000 };
    expect(validateFile(file).valid).toBe(true);
  });

  it("accepts a valid JPEG", () => {
    const file = { type: "image/jpeg", size: 1000 };
    expect(validateFile(file).valid).toBe(true);
  });

  it("rejects a disallowed type", () => {
    const file = { type: "text/plain", size: 1000 };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/PDF, PNG, or JPG/);
  });

  it("rejects a file over 10 MB", () => {
    const file = { type: "application/pdf", size: MAX_FILE_BYTES + 1 };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/10 MB/);
  });

  it("accepts a file exactly at the 10 MB boundary", () => {
    const file = { type: "application/pdf", size: MAX_FILE_BYTES };
    expect(validateFile(file).valid).toBe(true);
  });

  it("rejects when no file is given", () => {
    expect(validateFile(null).valid).toBe(false);
  });

  it("exposes the three allowed MIME types", () => {
    expect(ALLOWED_TYPES).toEqual([
      "application/pdf",
      "image/png",
      "image/jpeg",
    ]);
  });
});
