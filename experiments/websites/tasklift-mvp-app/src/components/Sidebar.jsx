function Sidebar() {
  return (
    <aside className="rounded-lg border border-line bg-white p-5 shadow-panel lg:min-h-[calc(100vh-3rem)]">
      <p className="text-sm font-extrabold uppercase text-accent">Tasklift</p>
      <h1 className="mt-3 text-2xl font-extrabold leading-tight">Workflow review MVP</h1>
      <nav className="mt-8 grid gap-2 text-sm font-bold text-muted" aria-label="App sections">
        <a
          className="rounded-md px-3 py-2 text-accent outline-offset-2 hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          href="#dashboard"
        >
          Dashboard
        </a>
        <a
          className="rounded-md px-3 py-2 outline-offset-2 hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          href="#intake"
        >
          Intake
        </a>
        <a
          className="rounded-md px-3 py-2 outline-offset-2 hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          href="#review"
        >
          Review queue
        </a>
        <a
          className="rounded-md px-3 py-2 outline-offset-2 hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          href="#stack"
        >
          Stack
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
