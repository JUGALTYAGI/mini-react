# M1 · createElement

About 2 hours. Run with `npm run m1`.

## The idea

JSX isn't HTML. It's a function call with angle brackets. This:

```jsx
<ul className="list">
  <li>one</li>
</ul>
```

compiles to this, before your code ever runs:

```js
createElement("ul", { className: "list" },
  createElement("li", null, "one"))
```

The two comments at the top of every test file (`@jsxRuntime classic`, `@jsx createElement`) tell the compiler to call *your* function instead of React's.

`createElement` returns a plain object that describes the UI:

```js
{ type: "ul", props: { className: "list", children: [ …one li… ] } }
```

That's all a "virtual DOM" is: nested objects that are cheap to make and cheap to throw away. Nothing gets drawn here. Drawing is M2.

## Why text gets wrapped

Every string or number child becomes `{ type: "TEXT_ELEMENT", props: { nodeValue: "one", children: [] } }`.

It looks fussy, but it means every node in the tree has the same shape: a type, props, and a children array. Every later milestone (render, fibers, diffing) walks this tree, and none of them will ever need an "is this a string?" branch.

## What the tests check that you might not expect

- **`0` renders.** `{count && <Badge/>}` with `count = 0` evaluates to `0`, not `false`, and React prints it. That's the stray "0" you've probably seen in a real app. `null`, `undefined`, `true` and `false` are all dropped.
- **Arrays get flattened.** `{items.map(...)}` hands you an array as one child. Nested arrays flatten to any depth.
- **Don't mutate the caller's props.** Build a new object. Adding `children` to an object someone passed you is a bug that only shows up later and far from here.

## The real one

Find React's own `createElement`. Go to github.com/facebook/react, press `t` to open file search, or search the repo for `export function createElement`. It's about 80 lines. Read it after yours passes, not before.

You'll notice it pulls `key`, `ref`, `__self` and `__source` *out* of props. The last two are dev-only metadata the compiler adds so DevTools can show which file a component came from (this project's config turns them off). `key` comes back in M6, where it decides whether a list item gets reused or rebuilt.

## What breaks next

Nothing yet. You have a tree of descriptions. M2 turns it into real DOM.
