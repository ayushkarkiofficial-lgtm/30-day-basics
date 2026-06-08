import { useState } from "react";

const initialForm = {
  processName: "",
  owner: "",
  risk: "Medium",
  currentWorkflow: "",
};

function IntakeForm({ onAddCandidate }) {
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
    setSuccessMessage("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!formValues.processName.trim()) {
      nextErrors.processName = "Add a process name.";
    }

    if (!formValues.owner.trim()) {
      nextErrors.owner = "Add the team owner.";
    }

    if (!formValues.currentWorkflow.trim()) {
      nextErrors.currentWorkflow = "Describe what happens today.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage("");
      return;
    }

    onAddCandidate({
      label: formValues.processName.trim(),
      owner: formValues.owner.trim(),
      status: "Ready to map",
      risk: formValues.risk,
      currentWorkflow: formValues.currentWorkflow.trim(),
    });

    setFormValues(initialForm);
    setSuccessMessage("Draft added to the review queue.");
  }

  return (
    <section id="intake" className="grid gap-5 rounded-lg border border-line bg-white p-6 shadow-panel">
      <div>
        <p className="text-sm font-extrabold uppercase text-accent">Intake</p>
        <h2 className="mt-2 text-2xl font-extrabold">Manual process request</h2>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-bold">
          Process name
          <input
            aria-describedby={errors.processName ? "process-name-error" : undefined}
            aria-invalid={Boolean(errors.processName)}
            className="rounded-md border border-line px-3 py-3 font-normal outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            name="processName"
            placeholder="Document intake"
            value={formValues.processName}
            onChange={handleFieldChange}
          />
          {errors.processName ? (
            <span className="text-sm font-bold text-red-700" id="process-name-error">
              {errors.processName}
            </span>
          ) : null}
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Team owner
          <input
            aria-describedby={errors.owner ? "owner-error" : undefined}
            aria-invalid={Boolean(errors.owner)}
            className="rounded-md border border-line px-3 py-3 font-normal outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            name="owner"
            placeholder="Support"
            value={formValues.owner}
            onChange={handleFieldChange}
          />
          {errors.owner ? (
            <span className="text-sm font-bold text-red-700" id="owner-error">
              {errors.owner}
            </span>
          ) : null}
        </label>
        <label className="grid gap-2 text-sm font-bold md:col-span-2">
          Risk level
          <select
            className="rounded-md border border-line px-3 py-3 font-normal outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            name="risk"
            value={formValues.risk}
            onChange={handleFieldChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold md:col-span-2">
          What happens today?
          <textarea
            aria-describedby={errors.currentWorkflow ? "workflow-error" : undefined}
            aria-invalid={Boolean(errors.currentWorkflow)}
            className="min-h-32 rounded-md border border-line px-3 py-3 font-normal outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            name="currentWorkflow"
            placeholder="Paste the repeated steps, handoffs, tools, and approval points."
            value={formValues.currentWorkflow}
            onChange={handleFieldChange}
          />
          {errors.currentWorkflow ? (
            <span className="text-sm font-bold text-red-700" id="workflow-error">
              {errors.currentWorkflow}
            </span>
          ) : null}
        </label>
        <button
          className="min-h-12 rounded-md bg-accent px-5 py-3 font-extrabold text-white outline-offset-2 hover:bg-[#164c40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:w-fit"
          type="submit"
        >
          Save draft
        </button>
        {successMessage ? (
          <p className="self-center text-sm font-bold text-accent" role="status">
            {successMessage}
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default IntakeForm;
