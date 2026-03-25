export default function PipelineStrip() {
  const steps = [
    { k: "Data", v: "events.yaml" },
    { k: "Check", v: "generate_events_json.py" },
    { k: "Out", v: "events.json" },
    { k: "Front", v: "React app" },
  ];
  return (
    <div className="pipeline" aria-label="Rough data flow">
      <span className="pipeline__title">Rough flow</span>
      <ol className="pipeline__steps">
        {steps.map((s, i) => (
          <li key={s.k} className="pipeline__step">
            <span className="pipeline__key">{s.k}</span>
            <code className="pipeline__val">{s.v}</code>
            {i < steps.length - 1 ? (
              <span className="pipeline__arrow" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="pipeline__note">
        No database in the real project either; PRs edit YAML and CI shouts if
        something is wrong.
      </p>
    </div>
  );
}
