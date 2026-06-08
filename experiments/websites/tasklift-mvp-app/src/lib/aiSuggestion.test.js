import { describe, it, expect } from "vitest";
import { getAiSuggestion } from "./aiSuggestion.js";

describe("getAiSuggestion", () => {
  it("returns null when ai_status is not Pending", () => {
    expect(getAiSuggestion({ ai_status: null })).toBeNull();
    expect(getAiSuggestion({ ai_status: "Approved" })).toBeNull();
    expect(getAiSuggestion({ ai_status: "Rejected" })).toBeNull();
  });

  it("returns the suggestion fields when ai_status is Pending", () => {
    const item = {
      ai_status: "Pending",
      ai_summary: "Daily invoice transfer.",
      ai_category: "Finance",
      ai_priority: "Medium",
      ai_needs_review: true,
    };
    expect(getAiSuggestion(item)).toEqual({
      summary: "Daily invoice transfer.",
      category: "Finance",
      priority: "Medium",
      needsReview: true,
    });
  });

  it("defaults missing fields safely", () => {
    expect(getAiSuggestion({ ai_status: "Pending" })).toEqual({
      summary: "",
      category: "",
      priority: "",
      needsReview: false,
    });
  });
});
