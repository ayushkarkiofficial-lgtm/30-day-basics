import { Fragment } from "react";

import { getAiSuggestion } from "../lib/aiSuggestion.js";

// ReviewQueue.jsx
// This component receives `items` from App.jsx through "props" (the function argument).
// It does NOT own or manage the data — App.jsx does. This separation means:
//   - ReviewQueue stays simple: given a list, render a table.
//   - App.jsx stays in control: it decides what data to pass down.

// RISK BADGE LOGIC
// Instead of showing "Low / Medium / High" as plain text, we map each risk
// level to a color class. This is a common React pattern: compute presentation
// data from raw values rather than hardcoding it in JSX.
const riskStyle = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-red-50 text-red-700 border-red-200",
};

// STATUS BADGE LOGIC
// Same idea — map a status string to a color style.
// "Ready to map" = neutral/blue, "Needs examples" = amber, "Human review required" = red
// "Live" = green (used in demo data for the "live automations" counter)
const statusStyle = {
  "Ready to map": "bg-blue-50 text-blue-700 border-blue-200",
  "Needs examples": "bg-amber-50 text-amber-700 border-amber-200",
  "Human review required": "bg-red-50 text-red-700 border-red-200",
  Live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

// All valid status values for the review queue.
// ActionCell uses this to render one button per status that is NOT the current one.
const STATUS_OPTIONS = [
  "Ready to map",
  "Needs examples",
  "Human review required",
  "Live",
  "Completed",
];

// Badge is a small reusable component.
// It takes a `label` (the text) and a `styleClass` (the Tailwind color classes).
// Making it a separate component avoids repeating the same <span> structure twice
// (once for risk, once for status).
function Badge({ label, styleClass }) {
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${styleClass}`}
    >
      {label}
    </span>
  );
}

// ActionCell renders the action buttons for one row.
// Props:
//   item         — the full row object (needs item.id and item.status)
//   onStatusChange(id, newStatus) — called when a status button is clicked
//   onDelete(id)                  — called when the Delete button is clicked
//
// STATUS_OPTIONS filtered to exclude the current status means we only show
// buttons for states the item can actually move TO.
function ActionCell({ item, onStatusChange, onDelete }) {
  return (
    <td className="py-4">
      <div className="flex flex-wrap gap-1">
        {/* One button for each status that is NOT the current status */}
        {STATUS_OPTIONS.filter((s) => s !== item.status).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(item.id, s)}
            className="rounded border border-line px-2 py-0.5 text-xs font-medium text-muted hover:border-ink hover:text-ink transition-colors"
          >
            {s}
          </button>
        ))}

        {/* Delete button — red text, no fill, clearly destructive */}
        <button
          onClick={() => onDelete(item.id)}
          className="rounded border border-red-200 px-2 py-0.5 text-xs font-medium text-red-600 hover:border-red-400 hover:text-red-800 transition-colors"
        >
          Delete
        </button>
      </div>
    </td>
  );
}

// SuggestionRow renders, beneath a queue row, the AI's pending suggestion and
// the human Approve/Reject controls. It renders nothing unless the row is in
// the "Pending" AI state (getAiSuggestion returns null otherwise). Once a human
// approves/rejects, the row's ai_status changes and this returns null again —
// replaced by a small chip shown inline (see below).
function SuggestionRow({ item, onApprove, onReject }) {
  const suggestion = getAiSuggestion(item);

  // Already decided by a human — show a status chip, no buttons.
  if (item.ai_status === "Approved" || item.ai_status === "Rejected") {
    const chipStyle =
      item.ai_status === "Approved"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-red-50 text-red-700 border-red-200";
    return (
      <tr className="border-b border-line last:border-0">
        <td className="pb-4 pl-4 text-xs text-muted" colSpan={5}>
          <span className={`inline-block rounded-md border px-2 py-0.5 font-bold ${chipStyle}`}>
            AI suggestion {item.ai_status.toLowerCase()}
          </span>
        </td>
      </tr>
    );
  }

  // Not processed by the AI yet, or no suggestion to show.
  if (!suggestion) {
    return null;
  }

  return (
    <tr className="border-b border-line last:border-0">
      <td className="pb-4 pl-4" colSpan={5}>
        <div className="rounded-md border border-dashed border-accent/40 bg-accent/5 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-accent">
              AI suggestion
            </span>
            {suggestion.category ? (
              <Badge
                label={suggestion.category}
                styleClass="bg-indigo-50 text-indigo-700 border-indigo-200"
              />
            ) : null}
            {suggestion.priority ? (
              <Badge
                label={`Priority: ${suggestion.priority}`}
                styleClass={
                  riskStyle[suggestion.priority] ??
                  "bg-gray-50 text-gray-700 border-gray-200"
                }
              />
            ) : null}
            {suggestion.needsReview ? (
              <Badge
                label="Needs review"
                styleClass="bg-amber-50 text-amber-700 border-amber-200"
              />
            ) : null}
          </div>

          <p className="mt-2 text-sm text-ink">{suggestion.summary}</p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onApprove(item.id)}
              className="rounded border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-700 hover:border-emerald-500 hover:text-emerald-900 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(item.id)}
              className="rounded border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:border-red-400 hover:text-red-800 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

function ReviewQueue({ items, onStatusChange, onDelete, onApprove, onReject }) {
  // If the queue is empty (no items), show a friendly empty state.
  // This handles the case where a user deletes all items or starts with a fresh slate.
  if (items.length === 0) {
    return (
      <section
        id="review"
        className="rounded-lg border border-line bg-white p-6 shadow-panel"
      >
        <p className="text-sm font-extrabold uppercase text-accent">
          Review queue
        </p>
        <h2 className="mt-2 text-2xl font-extrabold">Automation candidates</h2>
        <p className="mt-5 text-sm text-muted">
          No candidates yet. Submit a process using the intake form above.
        </p>
      </section>
    );
  }

  return (
    <section
      id="review"
      className="rounded-lg border border-line bg-white p-6 shadow-panel"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold uppercase text-accent">
            Review queue
          </p>
          <h2 className="mt-2 text-2xl font-extrabold">
            Automation candidates
          </h2>
        </div>
        {/* Show how many items are in the queue */}
        <span className="rounded-md border border-line px-3 py-2 text-sm font-bold text-muted">
          {items.length} {items.length === 1 ? "process" : "processes"}
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        {/*
          min-w-[620px] prevents the table from collapsing on narrow screens.
          The outer div has overflow-x-auto, so it scrolls horizontally on mobile
          instead of squishing columns together.
        */}
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="py-3 pr-4 font-bold">Process</th>
              <th className="py-3 pr-4 font-bold">Owner</th>
              <th className="py-3 pr-4 font-bold">Status</th>
              <th className="py-3 pr-4 font-bold">Risk</th>
              <th className="py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              // key={item.id} tells React which row is which when the list updates.
              // Without a key, React might re-render the wrong rows when you add/remove items.
              <Fragment key={item.id}>
                <tr className="border-b border-line last:border-0">
                  <td className="py-4 pr-4 font-bold">{item.label}</td>
                  <td className="py-4 pr-4 text-muted">{item.owner}</td>
                  <td className="py-4 pr-4">
                    <Badge
                      label={item.status}
                      styleClass={
                        statusStyle[item.status] ??
                        "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <Badge
                      label={item.risk}
                      styleClass={
                        riskStyle[item.risk] ??
                        "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    />
                  </td>
                  <ActionCell
                    item={item}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                </tr>
                <SuggestionRow item={item} onApprove={onApprove} onReject={onReject} />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReviewQueue;
