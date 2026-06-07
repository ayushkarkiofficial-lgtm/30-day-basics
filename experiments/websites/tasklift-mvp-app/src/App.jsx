// App.jsx — the main screen composer.
// This file decides WHAT appears on the page and in WHAT ORDER.
//
// DAY 11 CHANGES:
// - Removed localStorage read/write (it was browser-only, per-device storage)
// - Added Supabase fetch on first load (real database, shared across devices)
// - Added Supabase insert on form submit (data saved to server permanently)
// - Added isLoading state so the UI shows a message while data is being fetched

// DAY 12 CHANGES:
// - Added handleStatusChange(id, newStatus) — updates a row's status in Supabase
// - Added handleDelete(id) — deletes a row from Supabase
// - Passed onStatusChange and onDelete as props to ReviewQueue

import { useEffect, useMemo, useState } from "react";

import DashboardSummary from "./components/DashboardSummary.jsx";
import HeroPanel from "./components/HeroPanel.jsx";
import IntakeForm from "./components/IntakeForm.jsx";
import CompletedAutomations from "./components/CompletedAutomations.jsx";
import ReviewQueue from "./components/ReviewQueue.jsx";
import Sidebar from "./components/Sidebar.jsx";
import StackSection from "./components/StackSection.jsx";
import FileUpload from "./components/FileUpload.jsx";
import { stackPieces } from "./data/demoData.js";
import { supabase } from "./lib/supabase.js";
import { computeMetrics } from "./lib/metrics.js";
import { uploadFile } from "./lib/fileUpload.js";

// TABLE NAME
// The Supabase table that stores review queue items.
// Defined as a constant so it is never mistyped in two places.
const TABLE = "First_app_data";

// MAKE WEBHOOK URL
// Paste your Make Custom Webhook URL here after creating the scenario.
// This is a public URL — it is safe to embed in frontend code.
// The URL itself is the secret: anyone who knows it can trigger the scenario.
// Rotate it in Make if it is ever leaked.
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/5p0oelowizzufyugez0xb1c73h2duu75";

// MAKE FILE WEBHOOK URL
// Separate Make scenario for file uploads (Task 0, step 5). Same fire-and-forget
// pattern as MAKE_WEBHOOK_URL. Paste the new scenario's webhook URL here.
const MAKE_FILE_WEBHOOK_URL = "PASTE_FILE_WEBHOOK_URL_HERE";

function App() {
  // queueItems — the list of rows fetched from Supabase.
  // Starts as an empty array. Supabase fills it after the first fetch.
  const [queueItems, setQueueItems] = useState([]);

  // uploadedFiles — the list of rows from the uploaded_files table.
  // Same ownership pattern as queueItems: App owns the data + Supabase calls,
  // FileUpload just renders what it's given.
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const activeItems = queueItems.filter((item) => item.status !== "Completed");
  const completedItems = queueItems.filter((item) => item.status === "Completed");

  // isLoading — true while the first fetch is in progress.
  // Prevents the "No candidates yet" empty state from flashing
  // before the data arrives from the server.
  const [isLoading, setIsLoading] = useState(true);

  // FETCH FROM SUPABASE ON FIRST LOAD
  //
  // useEffect with an empty dependency array [] runs exactly once —
  // after the component mounts (appears on screen for the first time).
  //
  // WHY useEffect instead of just calling supabase directly?
  // Fetching data is a "side effect" — it reaches outside of React
  // to talk to a server. React requires side effects to live in useEffect
  // so they run at the right time (after render, not during it).
  //
  // WHY async inside useEffect?
  // useEffect's callback cannot itself be async. The pattern is to define
  // an async function inside it and call it immediately.
  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      // .select("*")  — fetch all columns
      // .order(...)   — newest items first (matches what the form does when adding)

      if (error) {
        console.error("Supabase fetch error:", error.message);
        setIsLoading(false);
        return;
      }

      setQueueItems(data);
      setIsLoading(false);
    }

    fetchItems();
  }, []);
  // [] means: run this effect once, when the component first mounts.
  // No dependencies = never re-run automatically.

  // FETCH UPLOADED FILES ON FIRST LOAD
  // A second, independent effect — newest files first — so the list
  // survives a page refresh (manual test 7).
  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase
        .from("uploaded_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase file fetch error:", error.message);
        return;
      }
      setUploadedFiles(data);
    }

    fetchFiles();
  }, []);

  // SUMMARY METRICS
  // Same as before — computed from queueItems.
  // Updates automatically whenever queueItems changes (after fetch or insert).
  const summaryMetrics = useMemo(() => {
    const { total, highRiskCount, liveCount, completedCount } = computeMetrics(queueItems);
    return [
      [total.toString(), "Processes in review"],
      [highRiskCount.toString(), "High-risk handoff"],
      [liveCount.toString(), "Live automations"],
      [completedCount.toString(), "Automations completed", "#completed-automations"],
    ];
  }, [queueItems]);

  // INSERT TO SUPABASE ON FORM SUBMIT
  //
  // This replaces the old local state-only update.
  // Now when a user submits the form:
  //   1. The new row is sent to Supabase
  //   2. Supabase saves it to the database and returns the saved row
  //      (including the auto-generated id and created_at)
  //   3. We prepend that returned row to the local state
  //
  // WHY use the returned row instead of the candidate object directly?
  // Supabase generates the real id (a UUID) and created_at timestamp.
  // Using the returned row keeps local state in sync with the database.
  //
  // WHY async?
  // Talking to Supabase takes time (network request). async/await lets
  // us wait for the result before updating the UI.
  async function handleAddCandidate(candidate) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        label: candidate.label,
        owner: candidate.owner,
        status: candidate.status,
        risk: candidate.risk,
      })
      // We do NOT send candidate.id — Supabase generates a UUID automatically.
      .select()   // ask Supabase to return the saved row
      .single();  // we inserted one row, so expect one row back

    if (error) {
      console.error("Supabase insert error:", error.message);
      return;
    }

    // Prepend the saved row (with real UUID + created_at) to the list
    setQueueItems((current) => [data, ...current]);

    // NOTIFY MAKE — fire-and-forget webhook call
    //
    // WHY fire-and-forget (no await, no error blocking the UI)?
    // The form submission already succeeded — the row is in Supabase.
    // A failed notification should not undo the user's action or show
    // an error. We log failures quietly and handle retries on Day 21.
    //
    // WHY only call if MAKE_WEBHOOK_URL is set?
    // Keeps local dev working without a real Make URL. Remove this guard
    // once the URL is pasted in above.
    if (MAKE_WEBHOOK_URL) {
      fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          label: data.label,
          owner: data.owner,
          risk: data.risk,
          status: data.status,
          created_at: data.created_at,
        }),
      }).catch((err) => console.warn("Make webhook failed:", err.message));
    }
  }

  // HANDLE A FILE UPLOAD
  //
  // Called by FileUpload after client validation passes. Runs the
  // Storage+metadata sequence (uploadFile), prepends the saved row,
  // then fires the Make webhook fire-and-forget (Day 16 pattern).
  // Returns { ok, error } so the panel can show an inline message.
  async function handleFileUploaded(file) {
    const { row, error } = await uploadFile(supabase, file);

    if (error) {
      return { ok: false, error };
    }

    setUploadedFiles((current) => [row, ...current]);

    if (MAKE_FILE_WEBHOOK_URL && MAKE_FILE_WEBHOOK_URL !== "PASTE_FILE_WEBHOOK_URL_HERE") {
      fetch(MAKE_FILE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          file_name: row.file_name,
          file_type: row.file_type,
          file_size: row.file_size,
          file_path: row.file_path,
          created_at: row.created_at,
        }),
      }).catch((err) => console.warn("Make file webhook failed:", err.message));
    }

    return { ok: true, error: "" };
  }

  // MARK A FILE DONE
  // The human-review point from the Day 15 automation mental model.
  // Same UPDATE-then-replace shape as handleStatusChange.
  async function handleMarkDone(id) {
    const { data, error } = await supabase
      .from("uploaded_files")
      .update({ status: "Done" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase file update error:", error.message);
      return;
    }

    setUploadedFiles((current) =>
      current.map((file) => (file.id === id ? data : file))
    );
  }

  // VIEW A FILE
  // The bucket is private, so we mint a short-lived (60s) signed URL and
  // open it in a new tab. Short expiry is the concrete "files are risky"
  // lesson — the link is dead a minute later.
  async function handleViewFile(filePath) {
    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error("Signed URL error:", error.message);
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener");
  }

  // UPDATE STATUS IN SUPABASE
  //
  // Called when the user clicks a status button in the Actions column.
  // Steps:
  //   1. Send an UPDATE to Supabase for the row matching this id
  //   2. Ask Supabase to return the updated row (.select().single())
  //      — same pattern as Day 11's insert, keeps local state in sync
  //   3. Replace the old row in queueItems with the returned row
  //
  // WHY replace with the returned row instead of building it locally?
  // The server is the source of truth. Using the returned row means
  // local state always matches what is actually stored in the database.
  async function handleStatusChange(id, newStatus) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ status: newStatus })
      .eq("id", id)       // only update the row with this exact id
      .select()           // ask Supabase to return the updated row
      .single();          // we updated one row, so expect one row back
                        // if the row no longer exists, Supabase returns an error,
                        // which is caught by the error check below

    if (error) {
      console.error("Supabase update error:", error.message);
      return;
    }

    // Replace the matching row in local state with the server-returned row
    setQueueItems((current) =>
      current.map((item) => (item.id === id ? data : item))
    );
  }

  // DELETE A ROW FROM SUPABASE
  //
  // Called when the user clicks the Delete button in the Actions column.
  // Steps:
  //   1. Send a DELETE to Supabase for the row matching this id
  //   2. On success: filter that row out of local queueItems state
  //
  // WHY no .select() here?
  // DELETE does not return a row — it just confirms the row was removed.
  // We already know which id to remove from local state, so no need
  // to ask Supabase for data back.
  async function handleDelete(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);  // only delete the row with this exact id

    if (error) {
      console.error("Supabase delete error:", error.message);
      return;
    }

    // Remove the deleted row from local state
    setQueueItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-6 md:px-8 lg:grid-cols-[260px_1fr]">
        <Sidebar />

        <div className="grid gap-6">
          <HeroPanel />
          <DashboardSummary metrics={summaryMetrics} />
          <IntakeForm onAddCandidate={handleAddCandidate} />

          <FileUpload
            files={uploadedFiles}
            onUpload={handleFileUploaded}
            onMarkDone={handleMarkDone}
            onView={handleViewFile}
          />

          {/* Show a loading message while the first fetch is in progress.
              Once isLoading is false, render the actual queue. */}
          {isLoading ? (
            <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
              <p className="text-sm text-muted">Loading queue from database…</p>
            </section>
          ) : (
            <>
              <ReviewQueue
                items={activeItems}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
              <CompletedAutomations items={completedItems} />
            </>
          )}

          <StackSection pieces={stackPieces} />
        </div>
      </section>
    </main>
  );
}

export default App;
