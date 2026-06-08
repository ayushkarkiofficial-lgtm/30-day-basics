// Pure helper: given a review-queue row, return the AI suggestion to display,
// or null. Only rows the AI has processed and left for a human (ai_status
// === "Pending") show a suggestion. Approved/Rejected/unprocessed rows return
// null. Keeping this pure makes the "what shows the Approve button" rule
// testable without React or Supabase.
export function getAiSuggestion(item) {
  if (!item || item.ai_status !== "Pending") {
    return null;
  }
  return {
    summary: item.ai_summary ?? "",
    category: item.ai_category ?? "",
    priority: item.ai_priority ?? "",
    needsReview: Boolean(item.ai_needs_review),
  };
}
