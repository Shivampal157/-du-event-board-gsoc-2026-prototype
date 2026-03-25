import { useEffect, useMemo, useState } from "react";
import { DEMO_EVENTS } from "./data/events.js";
import EventMap from "./components/EventMap.jsx";
import OrgAvatar from "./components/OrgAvatar.jsx";
import PipelineStrip from "./components/PipelineStrip.jsx";

const TAGS = [...new Set(DEMO_EVENTS.flatMap((e) => e.tags || []))].sort();

function formatDateRange(e) {
  if (e.end_date && e.end_date !== e.date) {
    return `${e.date} → ${e.end_date}`;
  }
  return e.date;
}

function CalendarBlock({ events }) {
  const byMonth = useMemo(() => {
    const m = new Map();
    for (const e of events) {
      const key = e.date.slice(0, 7);
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(e);
    }
    return [...m.entries()].sort();
  }, [events]);

  if (byMonth.length === 0) {
    return (
      <div className="panel panel--empty">
        No events for these filters. Try clearing country or month.
      </div>
    );
  }

  return (
    <div className="calendar">
      {byMonth.map(([ym, evs]) => (
        <section key={ym} className="calendar__month">
          <h3 className="calendar__heading">{ym}</h3>
          <ul className="calendar__list">
            {evs.map((e) => (
              <li key={e.id} className="calendar__item">
                <span className="calendar__date">{formatDateRange(e)}</span>
                <span className="calendar__title">{e.title}</span>
                <span className="calendar__meta">
                  {e.event_type} · {e.cost}
                  {e.country ? ` · ${e.state || e.country}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function useCountryStateOptions() {
  return useMemo(() => {
    const countries = [
      ...new Set(DEMO_EVENTS.map((e) => e.country).filter(Boolean)),
    ].sort();
    const byCountry = new Map();
    for (const e of DEMO_EVENTS) {
      if (!e.country || !e.state) continue;
      if (!byCountry.has(e.country)) byCountry.set(e.country, new Set());
      byCountry.get(e.country).add(e.state);
    }
    for (const [c, set] of byCountry) {
      byCountry.set(c, [...set].sort());
    }
    return { countries, byCountry };
  }, []);
}

function useStartMonths() {
  return useMemo(() => {
    const set = new Set(DEMO_EVENTS.map((e) => e.date.slice(0, 7)));
    return [...set].sort();
  }, []);
}

export default function App() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [eventType, setEventType] = useState("");
  const [cost, setCost] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [view, setView] = useState("grid");
  const [featuredExpanded, setFeaturedExpanded] = useState(false);

  const { countries, byCountry } = useCountryStateOptions();
  const monthOptions = useStartMonths();
  const stateOptions = country ? byCountry.get(country) || [] : [];

  const allowedViews = useMemo(() => ["grid", "list", "calendar", "map"], []);

  // Initialize tag + view from URL for shareable links.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawView = params.get("view") || "";
    const rawTag = params.get("tag") || "";

    const normalizedView = allowedViews.includes(rawView)
      ? rawView
      : "grid";

    const normalizedTag = rawTag && TAGS.includes(rawTag) ? rawTag : "";

    setView(normalizedView);
    setTag(normalizedTag);

    // Clean up invalid params so the URL always matches UI state.
    const next = new URLSearchParams(window.location.search);
    if (normalizedView === "grid") next.delete("view");
    else next.set("view", normalizedView);
    if (!normalizedTag) next.delete("tag");
    else next.set("tag", normalizedTag);

    const qs = next.toString();
    const newUrl = `${window.location.pathname}${
      qs ? `?${qs}` : ""
    }${window.location.hash || ""}`;
    window.history.replaceState({}, "", newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL updated when tag or view changes.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (view === "grid") params.delete("view");
    else params.set("view", view);

    if (!tag) params.delete("tag");
    else params.set("tag", tag);

    const qs = params.toString();
    const newUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${
      window.location.hash || ""
    }`;
    window.history.replaceState({}, "", newUrl);
  }, [tag, view]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return DEMO_EVENTS.filter((e) => {
      const matchQ =
        !qq ||
        e.title.toLowerCase().includes(qq) ||
        e.description.toLowerCase().includes(qq);
      const matchTag = !tag || (e.tags && e.tags.includes(tag));
      const matchType = !eventType || e.event_type === eventType;
      const matchCost = !cost || e.cost === cost;
      const matchCountry = !country || e.country === country;
      const matchState = !state || e.state === state;
      const matchMonth =
        !startMonth || e.date.slice(0, 7) === startMonth;
      return (
        matchQ &&
        matchTag &&
        matchType &&
        matchCost &&
        matchCountry &&
        matchState &&
        matchMonth
      );
    });
  }, [q, tag, eventType, cost, country, state, startMonth]);

  const featured = DEMO_EVENTS.filter((e) => e.featured);
  const featuredShown = featuredExpanded ? featured : featured.slice(0, 3);

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="header__logo" aria-hidden>
            ◉
          </span>
          <div>
            <h1>DU event board (mock UI)</h1>
            <p className="header__sub">
              Scratch build for my GSoC write-up, roughly following the{" "}
              <a
                href="https://github.com/data-umbrella/du-event-board/wiki/Project-Idea"
                target="_blank"
                rel="noreferrer"
              >
                DU wiki write-up
              </a>
              . Fake data in <code>src/data/events.js</code>. Real site is
              separate.
            </p>
          </div>
        </div>
        <PipelineStrip />
      </header>

      <section className="featured" aria-labelledby="featured-title">
        <div className="featured__head">
          <h2 id="featured-title">Featured events</h2>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setFeaturedExpanded((v) => !v)}
          >
            {featuredExpanded ? "Only show 3" : "Show all featured"}
          </button>
        </div>
        <p className="featured__hint">
          Featured row ignores the filters below (same idea as in the project
          notes).
        </p>
        <div className="featured__grid">
          {featuredShown.map((e) => (
            <article key={e.id} className="card card--featured">
              <div className="card__top">
                <OrgAvatar
                  orgName={e.org_name}
                  orgLogo={e.org_logo}
                  size={56}
                />
                <div className="card__badge">Featured</div>
              </div>
              <h3>{e.title}</h3>
              <p className="card__org">{e.org_name}</p>
              <p className="card__desc">{e.description}</p>
              <div className="card__tags">
                {(e.tags || []).map((t) => (
                  <span key={t} className="tag">
                    #{t}
                  </span>
                ))}
              </div>
              <footer className="card__foot">
                <span className="card__dates">{formatDateRange(e)}</span>
                <span>
                  {e.event_type} · {e.cost}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="controls" aria-label="Filters and view">
        <div className="row">
          <label className="sr-only" htmlFor="search-q">
            Search
          </label>
          <input
            id="search-q"
            className="input input--grow"
            placeholder="Search title or description…"
            value={q}
            onChange={(ev) => setQ(ev.target.value)}
          />
        </div>
        <div className="row row--chips">
          <span className="label">Tags:</span>
          <button
            type="button"
            className={`chip ${!tag ? "chip--on" : ""}`}
            onClick={() => setTag("")}
          >
            All
          </button>
          {TAGS.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${tag === t ? "chip--on" : ""}`}
              onClick={() => setTag(t === tag ? "" : t)}
            >
              #{t}
            </button>
          ))}
        </div>
        <div className="row row--filters row--filters-all">
          <label>
            Event type
            <select
              className="select"
              value={eventType}
              onChange={(ev) => setEventType(ev.target.value)}
            >
              <option value="">Any</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
              <option value="in-person">In-person</option>
            </select>
          </label>
          <label>
            Cost
            <select
              className="select"
              value={cost}
              onChange={(ev) => setCost(ev.target.value)}
            >
              <option value="">Any</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <label>
            Country
            <select
              className="select"
              value={country}
              onChange={(ev) => {
                setCountry(ev.target.value);
                setState("");
              }}
            >
              <option value="">Any</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            State / province
            <select
              className="select"
              value={state}
              disabled={!country}
              onChange={(ev) => setState(ev.target.value)}
            >
              <option value="">
                {country ? "Any" : "Select country first"}
              </option>
              {stateOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Start month
            <select
              className="select"
              value={startMonth}
              onChange={(ev) => setStartMonth(ev.target.value)}
            >
              <option value="">Any</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="row row--views" role="group" aria-label="View mode">
          {[
            ["grid", "Grid"],
            ["list", "List"],
            ["calendar", "Calendar"],
            ["map", "Map"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`btn ${view === id ? "btn--primary" : ""}`}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <main className="main">
        <p className="results-count">
          <strong>{filtered.length}</strong> / {DEMO_EVENTS.length} after
          filters. (Featured above is still everything marked featured.)
        </p>

        {filtered.length === 0 ? (
          <div className="panel panel--empty panel--large">
            <h3 className="empty-title">Nothing left</h3>
            <p>
              You probably stacked too many filters. Drop one (usually country
              or tag) and it should come back. In the real app this same kind of
              logic would live in one <code>filteredEvents</code> memo.
            </p>
          </div>
        ) : null}

        {view === "calendar" && filtered.length > 0 ? (
          <CalendarBlock events={filtered} />
        ) : null}
        {view === "map" && filtered.length > 0 ? (
          <EventMap events={filtered} />
        ) : null}

        {view === "grid" && filtered.length > 0 ? (
          <div className="grid">
            {filtered.map((e) => (
              <article key={e.id} className="card">
                <div className="card__head">
                  <OrgAvatar
                    orgName={e.org_name}
                    orgLogo={e.org_logo}
                    size={44}
                  />
                  <div>
                    <h3>{e.title}</h3>
                    <p className="card__org card__org--inline">{e.org_name}</p>
                  </div>
                </div>
                <p className="card__desc">{e.description}</p>
                <div className="card__tags">
                  {(e.tags || []).map((t) => (
                    <span key={t} className="tag">
                      #{t}
                    </span>
                  ))}
                </div>
                <footer className="card__foot">
                  <span>{formatDateRange(e)}</span>
                  <span>
                    {e.location} · {e.event_type} · {e.cost}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        ) : null}

        {view === "list" && filtered.length > 0 ? (
          <ul className="list">
            {filtered.map((e) => (
              <li key={e.id} className="list__row">
                <OrgAvatar
                  orgName={e.org_name}
                  orgLogo={e.org_logo}
                  size={40}
                />
                <div className="list__main">
                  <div>
                    <strong>{e.title}</strong>
                    <span className="list__org"> · {e.org_name}</span>
                    <span className="list__sub">
                      {" "}
                      — {formatDateRange(e)} · {e.location}
                    </span>
                  </div>
                  <div className="list__meta">
                    {e.event_type} · {e.cost}
                    {e.country ? ` · ${e.state}, ${e.country}` : ""}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </main>

      <footer className="footer">
        <p>
          Just a UI mock. Actual work is in{" "}
          <a
            href="https://github.com/data-umbrella/du-event-board"
            target="_blank"
            rel="noreferrer"
          >
            data-umbrella/du-event-board
          </a>{" "}
          (YAML + generator + tests etc.).
        </p>
      </footer>
    </div>
  );
}
