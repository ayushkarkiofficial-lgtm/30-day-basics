function StackSection({ pieces }) {
  return (
    <section id="stack" className="rounded-lg border border-line bg-white p-6 shadow-panel">
      <p className="text-sm font-extrabold uppercase text-accent">Chosen stack</p>
      <h2 className="mt-2 text-2xl font-extrabold">Use one setup until the MVP is real.</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {pieces.map(([name, purpose]) => (
          <article className="rounded-md border border-line bg-canvas p-4" key={name}>
            <h3 className="font-extrabold">{name}</h3>
            <p className="mt-2 text-sm text-muted">{purpose}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StackSection;
