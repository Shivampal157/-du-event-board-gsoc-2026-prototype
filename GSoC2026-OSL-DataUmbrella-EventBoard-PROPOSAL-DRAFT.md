# Google Summer of Code 2026 — Proposal (draft)

**Organization:** Open Science Labs — Data Umbrella  
**Project:** [Data Umbrella Event Board — map, search, community submission workflow](https://github.com/data-umbrella/du-event-board/wiki/Project-Idea)  
**Applicant:** Shivam Pal  

*Instructions: Replace anything in [brackets]. Delete this note block before PDF export.*

---

## 1. Candidate information

| Field | Value |
|--------|--------|
| Name | Shivam Pal |
| Email | shivam10palpal@gmail.com |
| GitHub | https://github.com/Shivampal157 |
| LinkedIn | https://linkedin.com/in/shivam-pal-677777301 |
| University | Indian Institute of Information Technology Agartala |
| Degree / year | B.Tech Computer Science & Engineering (2024–2028), 2nd year |
| CGPA | 8.17 |
| Time zone | IST (UTC+5:30); usually online ~9:00–23:00 IST |
| Phone | +91-8081414473 |
| Chat | Discord @shivampal157 (Data Umbrella server); Slack @shivampal157 where applicable |

### Bio (2 short paragraphs)

I am a second-year CSE undergraduate at IIIT Agartala. I started contributing to open source in 2024 and tend to pick tickets that mix a visible UI change with a small backend or CI story, because that is where I learn the fastest.

I care about keeping patches easy to review: one concern per PR, tests when the repo already uses them, and CI that fails with a message a newcomer can act on. That matches how the event board grows (YAML in git, validation in Python, static front end).

---

## 2. Project overview

| Field | Value |
|--------|--------|
| Official write-up | https://github.com/data-umbrella/du-event-board/wiki/Project-Idea |
| Repository | https://github.com/data-umbrella/du-event-board |
| Live site | https://data-umbrella.github.io/du-event-board |
| Size | 350 hours (Large) |
| Mentors | Reshama Shaikh, Ivan Ogasawara |

### Abstract (≈150–200 words)

The Data Umbrella Event Board helps people find community and technical events from a single static site. Today the stack is already workable—React, YAML source data, and automation in GitHub Actions—but discovery is still weaker than it could be. Users need clearer metadata (format, cost, dates, location), better filters, and more than one way to browse (list, calendar, map). Maintainers need validation and docs so event PRs do not stall on vague errors.

Over the GSoC period I would extend the shared event model (for example event type, cost, start/end dates, optional org logo and coordinates, featured flag, country/region fields where agreed), harden `generate_events_json.py` with tests and readable errors, and ship the matching UI: filter bar, tag browsing, list/calendar/map views, featured section, and submission docs plus a practical GitHub Actions path (including a serious look at label/issue-driven updates). The site stays static: no accounts, no custom backend, maps via Leaflet and OpenStreetMap.

### Why this project fits me

I already ship small pieces upstream: list/tag work, URL state for filters, and generator-side checks (including coordinates). A GSoC term lets me turn those spikes into one coherent maintainer-grade pass instead of scattered PRs.

---

## 3. Mentors and communication

- **Primary discussion:** Issues and PRs on `data-umbrella/du-event-board`, plus Discord / mentor preference.
- **Cadence:** Public updates at least weekly (progress in issue or draft PR). I will not DM for decisions that should be public.
- **Reviews:** I expect to answer review comments within 24 hours on weekdays, 48 hours if exams overlap (I will say so in advance).

---

## 4. Technical plan (what I will actually change)

### 4.1 Data model (YAML → JSON)

Add or formalize fields in line with the project idea wiki, with **backward compatibility** for old events:

- `event_type`: `online` | `in-person` | `hybrid` (exact strings fixed with mentors).
- `cost`: `free` | `paid` (or wiki wording).
- `end_date` optional; must not be before start `date` when both exist.
- `org_logo` optional URL; invalid URL fails validation with a clear line number.
- Optional `lat` / `lng` (already started upstream—pairing and ranges validated in generator).
- `featured` boolean for the spotlight block.
- `country` / `state` (or equivalent names mentors prefer) for geography filters.

Defaults: if a field is omitted, the generator assigns a safe default or leaves it empty in JSON—**no silent coercion** that hides mistakes.

### 4.2 Generator and CI (`scripts/generate_events_json.py`)

- Keep validation **one place**: the script fails the workflow with **event id or index + field + what was expected**.
- Unit tests beside the script (pattern already in repo) for new rules.
- Pre-commit / Actions stay green; I will run the same hooks locally before pushing.

### 4.3 Front end (React)

- **Filters:** search text, hashtags, date window (reuse or extend existing date UX), country/state, type, cost—**composed in one `useMemo` path** so combinations do not drift.
- **Views:** grid (existing card layout), compact list, month-grouped calendar, map with pins only for valid coordinates; empty states that explain why (for example “no lat/lng after filters”).
- **Featured:** top section, default three cards, “more” expands; **not** narrowed by the same filters unless mentors want that (wiki says spotlight—independence is my default).
- **A11y:** focus order, `aria-pressed` on toggles, labels on selects—match what the repo already started.

### 4.4 Docs and contributor path

- Extend `CONTRIBUTING.md` with one full YAML example and a “common CI errors” table.
- Optional: PR template with a checklist for new events.
- Short note on how to pick map coordinates honestly (manual lat/lng vs geocoding policy).

### 4.5 Automation stretch

- Feasibility pass on **label- or issue-based** Actions (open issue → bot or workflow suggests YAML patch is out of scope for week 1; I will document what is realistic after talking to mentors).

---

## 5. Architecture sketch (for the PDF)

You can paste this as text or redraw in draw.io.

```
Contributor edits src/ or data/events.yaml on a branch
        │
        ▼
GitHub Actions: Python generator validates + writes events.json
        │ fail → annotate job log with event + field
        ▼
npm build + tests (Vitest, eslint, etc.)
        │
        ▼
Merge to main → Pages deploy
        │
        ▼
Browser: React reads events.json, filters → grid | list | calendar | map
```

---

## 6. Prototype and video (optional but strong)

I am planning to include a **working UI prototype** (real code + real interactions) to make it easy for mentors to see the product UX before the upstream implementation is fully shipped.

This prototype is aligned with the Data Umbrella Event Board roadmap (featured section, hashtag chips, multi-dimensional filters, and grid/list/calendar/map views). It uses a small demo dataset for speed, but the UI logic and component structure are implemented as a real React app (so I can record a smooth and accurate video walkthrough).

### Prototype (code) + video
- **Prototype repo (public):** https://github.com/Shivampal157/-du-event-board-gsoc-2026-prototype
- **UI walkthrough video (public):** **[PASTE_VIDEO_URL]**

In the video, I will show:
- Featured events: default 3, then “show all”
- Filters: search + tags, Type (online/in-person/hybrid), Cost (free/paid), Country → State, Start month
- View switching: Grid → List → Calendar → Map
- Map behavior: only events with valid coordinates show pins; popup shows event metadata including dates, type, cost, and org info

### Research for the prototype (where I looked)
I used the official project idea/wiki and the current live site behavior as the UI spec, and Leaflet + OpenStreetMap docs for the map stack:
- Project idea/wiki: https://github.com/data-umbrella/du-event-board/wiki/Project-Idea
- Live platform: https://data-umbrella.github.io/du-event-board/
- Leaflet: https://leafletjs.com/
- OpenStreetMap attribution: https://www.openstreetmap.org/copyright

---

## 7. Prior work (keep this honest and up to date)

Replace titles/status with whatever GitHub shows **on the day you export the PDF**.

**Data Umbrella — du-event-board**

| Item | Link | Status |
|------|------|--------|
| List view + tag chips | https://github.com/data-umbrella/du-event-board/pull/[NUMBER] | [merged / open] |
| URL sync for tag + view | https://github.com/data-umbrella/du-event-board/pull/[NUMBER] | [merged / open] |
| Coordinates validation + map behaviour | https://github.com/data-umbrella/du-event-board/pull/[NUMBER] | [merged / open] |

**Open Science Labs — website**

| Item | Link |
|------|------|
| Example | https://github.com/OpenScienceLabs/opensciencelabs.github.io/pull/263 |

**Other** (short): list 2–4 merged PRs you are proud of; dropdead links if they distract.

---

## 8. Deliverables table (examiner-friendly)

| # | Deliverable | How we know it is done |
|---|-------------|-------------------------|
| 1 | Extended schema + validation | Generator tests; sample YAML in docs |
| 2 | Filter bar + hashtag UX | Manual test matrix; Vitest where it fits |
| 3 | List + calendar + map views | Screenshots; keyboard smoke test |
| 4 | Featured block | Behaviour matches wiki; responsive check |
| 5 | CONTRIBUTING + error guide | New contributor can fix a deliberate YAML mistake |
| 6 | Automation note | Short md: what works, what is future work |

---

## 9. Timeline (12 coding weeks + bonding)

**Community bonding (before May 26)**  
Read full repo; agree field names with mentors; open a design issue if needed; publish one short intro post (blog or DU channel—whatever org prefers).

| Week | Dates (approx.) | Focus |
|------|------------------|--------|
| 1 | late May | Schema PR + validation skeleton + tests for new fields |
| 2 | | Finish generator errors; CI message samples in CONTRIBUTING |
| 3 | | Filter UI: type, cost, country/state, wire to URL if mentors want |
| 4 | | List view polish + combination tests |
| 5 | | Map: bounds, popups, empty states |
| 6 | | Calendar grouping; mid-term demo to mentors |
| 7 | | Featured section + `featured` in YAML |
| 8 | | Grid/list/map/calendar toggle UX pass; performance sanity on N≈100 events |
| 9 | | Docs pass 1: submission flow screenshots |
| 10 | | PR template + “common errors”; automation spike |
| 11 | | Regression pass; fix review backlog |
| 12 | | Buffer, final blog, handoff notes in repo wiki or md |

**Blog:** at least one post every two weeks from coding start (org guideline: follow whatever OSL publishes for GSoC bloggers).

---

## 10. Risks and what I will do about them

| Risk | Mitigation |
|------|------------|
| Schema bikeshedding | Lock v1 with mentors in bonding week; file follow-up issues for v2 |
| Map without coords | Document expectation; map only filters to valid points; list/calendar still work |
| Scope creep (accounts, backend) | Explicitly out of scope; redirect to new issue |
| Exam week | Tell mentors a week ahead; front-load weeks before heavy coursework |

---

## 11. Availability

Summer break lines up with the coding period. I can budget **30–35 hours/week** for GSoC. If I fall behind, I will cut scope with mentors (never silently drop tests).

---

## 12. Post-GSoC

I intend to stay on the event board for reviews and small fixes, and to help newcomers reproduce CI failures locally. Anything larger (clustering on the map, richer calendar) becomes a gap-year issue list, not a silent promise.

---

## 13. References (short)

- Project idea/wiki (scope + deliverables): https://github.com/data-umbrella/du-event-board/wiki/Project-Idea  
- Current live UI behavior (what exists today): https://data-umbrella.github.io/du-event-board/  
- Map integration docs (Leaflet): https://leafletjs.com/  
- Map tiles / attribution (OpenStreetMap): https://www.openstreetmap.org/copyright  
- If geocoding is used later: Nominatim policy (rate limits + attribution): https://operations.osmfoundation.org/policies/nominatim/  
- Static workflow justification: YAML → generator validation → JSON → React (the generator remains the single validation checkpoint)

---

## 14. After submission (optional note for mentors)

After March 31, I will keep contributing to the upstream repo (`data-umbrella/du-event-board`). I will also maintain a **public progress log link** where I list the PR/issue links I opened and keep the context for each change, so mentors can quickly inspect what shipped after the deadline.

- **Post-deadline progress log link:** https://github.com/Shivampal157/du-event-board-gsoc-2026-log

That log will include dated entries with:
- issue/PR links,
- a 1–2 line summary of what changed,
- status (open/merged),
- (when useful) screenshots or a short clip from the UI.

---

## Checklist before you hit “Submit”

- [ ] All links open in a private window  
- [ ] PR table matches real merge state  
- [ ] Video and demo repo links filled or section removed  
- [ ] Mentor names spelled as org listing  
- [ ] PDF exports with readable fonts; diagrams not blurry  
- [ ] Secondary org applications: if you wrote preference elsewhere, keep it consistent  

---

*End of draft — Shivam Pal*
