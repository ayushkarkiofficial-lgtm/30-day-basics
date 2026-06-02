// CompletedAutomations.jsx
// Renders completed items as a card grid, separate from the review queue.
// Receives only completed items — filtering happens in App.jsx.
function CompletedAutomations({ items }) {
  return (
    <section
      id="completed-automations"
      className="rounded-lg border border-line bg-white p-6 shadow-panel"
    >
      <p className="text-sm font-extrabold uppercase text-accent">Showcase</p>
      <h2 className="mt-2 text-2xl font-extrabold">Completed automations</h2>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-muted">No completed automations yet.</p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-indigo-100 bg-indigo-50 p-4"
            >
              <p className="font-extrabold text-ink">{item.label}</p>
              <p className="mt-1 text-sm text-muted">{item.owner}</p>
              <span className="mt-3 inline-block rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                Completed
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CompletedAutomations;
