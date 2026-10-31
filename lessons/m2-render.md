# M2 · render

About 3 hours. Run with `npm run m2`.

## The idea

Walk the tree. For each element: create the DOM node, copy its props onto it, render its children into it, then append it to the parent. Four steps, recursive.

Text elements become `document.createTextNode`. Everything else becomes `document.createElement(type)`.

## Props aren't all the same

Three kinds, and the tests check each:

- **Ordinary props** (`id`, `title`, `className`) are set as DOM *properties*: `node.id = "q"`. The browser mirrors most of them to attributes for you, which is why `className` shows up as `class="…"` in the HTML.
- **Hyphenated props** (`aria-label`, `data-testid`) have to go through `setAttribute`. `node["aria-label"] = "close"` doesn't throw. It quietly creates a JS property that nothing ever reads. Screen readers read the *attribute*. That gap between properties and attributes is where a lot of real accessibility bugs live.
- **`onXxx` props** are event listeners. `onClick` becomes `addEventListener("click", fn)`. Lowercase the bit after `on`.

And skip `children`. It's in props, but it's not a DOM property, and the DOM already has its own `children`.

## The demo at the bottom

The last test renders 10,000 rows and prints how long that took. In jsdom it's a few hundred milliseconds, which is around 28 frames at 60fps where the page can't respond to anything. A real browser's number will differ. The shape won't.

Here's why it can't be fixed by optimising `render`: **it's recursive, and recursion can't pause.** Where you are in the tree lives on the JavaScript call stack. You can't put that stack aside, let the browser handle a click, and come back to it later.

So to make rendering interruptible, the record of "where am I" has to move off the call stack and into an ordinary object you control. That object is a *fiber*. Every milestone from M3 to M6 is about building it.

You already know the cost of not doing this. It's the main-thread budget from the event loop lab, and the bucket from the streams walkthrough. Same problem, third time.

## The real one

Search the React repo for `setInitialProperties`. That's React DOM's version of your props loop, and it's much longer, because the real world has `style` objects, `dangerouslySetInnerHTML`, controlled inputs, and a lot of browser quirks. Skim it to see how much a production library has to handle beyond what you just wrote.

One more difference worth knowing: React doesn't call `addEventListener` on each element. It attaches one listener per event type at the root and works out the target itself (event delegation). Ten thousand buttons, one listener.

## What breaks next

M3: render the same 10,000 rows without blocking. You'll use `requestIdleCallback` to do a bit of work, yield to the browser, and carry on. That only works once the tree walk can stop and resume, and that's where fibers come in.
