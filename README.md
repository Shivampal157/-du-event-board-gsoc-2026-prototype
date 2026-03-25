# Mock UI for my DU event board proposal

I needed something I could screen-record without waiting on review queues. This is a tiny Vite + React app with fake JSON in code, not the real `du-event-board` repo.

Run:

```bash
cd du-gsoc-proposal-demo
npm install
npm run dev
```

If you’re grading the proposal: the wiki idea is [here](https://github.com/data-umbrella/du-event-board/wiki/Project-Idea). Production code lives in [data-umbrella/du-event-board](https://github.com/data-umbrella/du-event-board).

### What lines up with the wiki (quick check)

| Wiki asks for | Where I mocked it |
| --- | --- |
| online / hybrid / in-person | type dropdown |
| free / paid | cost dropdown |
| dates + end date | card text + calendar |
| org logo | small image / fallback letters |
| hashtags | tag chips |
| country + state | dropdowns (state needs country first) |
| list vs grid | toggles |
| calendar + map | separate views |
| featured strip | top section, show 3 or all |
| YAML → JSON idea | grey “rough flow” box |

### Video (if I record one)

Show the flow bar, mess with filters, flip through grid/list/calendar/map, open one map popup, then mention the real repo handles YAML + CI.

### After 31 March

I’ll keep pushing stuff on the actual org repo; if I make a tiny log repo I’ll link it from the proposal too.
