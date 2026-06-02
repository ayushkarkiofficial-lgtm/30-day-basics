// Pure function — takes an array of queue items, returns counts.
// Lives here (not in App.jsx) so it can be unit tested without React.
export function computeMetrics(items) {
  return {
    total: items.length,
    highRiskCount: items.filter((item) => item.risk === "High").length,
    liveCount: items.filter((item) => item.status === "Live").length,
    completedCount: items.filter((item) => item.status === "Completed").length,
  };
}
