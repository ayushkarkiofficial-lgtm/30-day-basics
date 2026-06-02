function DashboardSummary({ metrics }) {
  return (
    <section id="dashboard" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map(([value, label, href]) => {
        const inner = (
          <>
            <p className="text-3xl font-extrabold text-accent">{value}</p>
            <h2 className="mt-2 text-sm font-extrabold uppercase text-muted">{label}</h2>
          </>
        );

        return href ? (
          <a
            key={label}
            href={href}
            className="block rounded-lg border border-line bg-white p-5 shadow-panel transition-colors hover:border-accent"
          >
            {inner}
          </a>
        ) : (
          <article
            key={label}
            className="rounded-lg border border-line bg-white p-5 shadow-panel"
          >
            {inner}
          </article>
        );
      })}
    </section>
  );
}

export default DashboardSummary;
