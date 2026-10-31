# mini-react

React's core, rebuilt from scratch in TypeScript: JSX, rendering, fibers, interruptible work, reconciliation, function components and hooks. About 40 hours, one milestone at a time.

The goal isn't a usable library. It's understanding the tool I use every day well enough to predict what it will do before I run it.

## Setup

```bash
node -v        # needs 22.12+ or 24+
npm install
npm run m1     # start here
```

If `npm install` fails with **Unsupported engine**, your Node is too old. Update it (`brew upgrade node`, or `nvm install 24`) and run `npm install` again.

## How it works

Each milestone has a lesson in `lessons/` and a spec in `tests/`. Read the lesson, then make the tests pass by writing code in `src/index.ts`. Don't edit the tests.

```bash
npm run m1          # one milestone
npm test            # everything so far
npm run test:watch  # re-runs as you save
npm run typecheck
```

A failing test prints the expected and actual values. Read that diff before changing anything. It usually tells you exactly what's wrong.

## Milestones

| | Milestone | What it teaches | Hours |
|---|---|---|---|
| M1 | `createElement` | JSX is a function call; the "virtual DOM" is just objects | 2 |
| M2 | `render` | Turning descriptions into DOM, and why recursion can't pause | 3 |
| M3 | The work loop | Doing work in slices and yielding to the browser | 4 |
| M4 | Fibers | The call stack moved into the heap, so it can be paused | 6 |
| M5 | Render and commit | Why React never shows you a half-built tree | 4 |
| M6 | Reconciliation | Diffing old against new; updates, deletions, and `key` | 7 |
| M7 | Function components | Components are functions that return elements | 3 |
| M8 | `useState` | Where hook state actually lives, and why hook order matters | 5 |
| M9 | `useEffect` | Running side effects after commit, and cleaning them up | 4 |
| | **Stretch** | Priority lanes, error boundaries, `useRef` / `useMemo` / `useContext` | — |

M1 and M2 are ready. Each later spec gets written when I reach it.

## Credits

The test specs and lessons were written with Claude as a mentor. The implementation in `src/` is mine.
