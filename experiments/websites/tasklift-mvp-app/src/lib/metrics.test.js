import { describe, it, expect } from "vitest";
import { computeMetrics } from "./metrics.js";

describe("computeMetrics", () => {
  it("returns all zeros for an empty list", () => {
    const result = computeMetrics([]);
    expect(result).toEqual({ total: 0, highRiskCount: 0, liveCount: 0, completedCount: 0 });
  });

  it("counts total items correctly", () => {
    const items = [
      { status: "Ready to map", risk: "Low" },
      { status: "Live", risk: "Medium" },
      { status: "Completed", risk: "High" },
    ];
    expect(computeMetrics(items).total).toBe(3);
  });

  it("counts only High risk items", () => {
    const items = [
      { status: "Ready to map", risk: "High" },
      { status: "Live", risk: "Low" },
      { status: "Needs examples", risk: "High" },
    ];
    expect(computeMetrics(items).highRiskCount).toBe(2);
  });

  it("counts only Live status items", () => {
    const items = [
      { status: "Live", risk: "Low" },
      { status: "Live", risk: "High" },
      { status: "Completed", risk: "Low" },
    ];
    expect(computeMetrics(items).liveCount).toBe(2);
  });

  it("counts only Completed status items", () => {
    const items = [
      { status: "Completed", risk: "Low" },
      { status: "Live", risk: "Low" },
      { status: "Ready to map", risk: "Medium" },
    ];
    expect(computeMetrics(items).completedCount).toBe(1);
  });
});
