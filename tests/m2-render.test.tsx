/** @jsxRuntime classic */
/** @jsx createElement */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createElement, render } from "../src/index";

/* M2 · render — turn the description into real DOM, synchronously.
   Each test gets a fresh, empty <div id="root">. */

let root: HTMLElement;
beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  root = document.getElementById("root")!;
});

describe("M2 · building the tree", () => {
  it("renders a single element", () => {
    render(<h1>hello</h1>, root);
    expect(root.innerHTML).toBe("<h1>hello</h1>");
  });

  it("renders a nested tree in order", () => {
    render(
      <ul>
        <li>a</li>
        <li>b</li>
        <li>c</li>
      </ul>,
      root,
    );
    expect(root.innerHTML).toBe("<ul><li>a</li><li>b</li><li>c</li></ul>");
  });

  it("text becomes a real Text node, not an element", () => {
    render(<p>plain</p>, root);
    const node = root.firstChild!.firstChild!;
    expect(node.nodeType).toBe(Node.TEXT_NODE);
    expect(node.nodeValue).toBe("plain");
  });

  it("renders 0, renders nothing for false", () => {
    render(<p>{0}{false}{null}</p>, root);
    expect(root.innerHTML).toBe("<p>0</p>");
  });
});

describe("M2 · props → DOM", () => {
  it("sets ordinary props as DOM properties", () => {
    render(<input id="q" title="search" />, root);
    const input = root.querySelector("input")!;
    expect(input.id).toBe("q");
    expect(input.title).toBe("search");
  });

  it("className ends up as the class attribute", () => {
    render(<div className="card big" />, root);
    expect(root.innerHTML).toBe('<div class="card big"></div>');
  });

  it("does not leak the `children` prop onto the DOM node", () => {
    render(<div>x</div>, root);
    const div = root.firstChild as HTMLElement & { children?: unknown };
    // the DOM's own `children` is an HTMLCollection; it must not have been
    // overwritten with your props.children array
    expect(div.children).toBeInstanceOf(HTMLCollection);
  });

  it("hyphenated props (aria-*, data-*) become attributes, not properties", () => {
    // `el["aria-label"] = "x"` silently creates a JS property nobody reads.
    // Screen readers read the ATTRIBUTE. Properties and attributes are
    // different things, and a11y bugs live in the gap between them.
    render(<button aria-label="close" data-testid="x-btn">×</button>, root);
    const btn = root.querySelector("button")!;
    expect(btn.getAttribute("aria-label")).toBe("close");
    expect(btn.getAttribute("data-testid")).toBe("x-btn");
  });
});

describe("M2 · events", () => {
  it("onClick becomes a real click listener", () => {
    const onClick = vi.fn();
    render(<button onClick={onClick}>go</button>, root);
    root.querySelector("button")!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("works for any onXxx, lowercased — onInput → 'input'", () => {
    const onInput = vi.fn();
    render(<input onInput={onInput} />, root);
    root.querySelector("input")!.dispatchEvent(new Event("input"));
    expect(onInput).toHaveBeenCalledTimes(1);
  });
});

describe("M2 · the problem M3 exists to solve", () => {
  it("DEMO: how long does one synchronous render hold the main thread?", () => {
    const rows = Array.from({ length: 10_000 }, (_, i) => (
      <li className="row" data-index={i}>row {i}</li>
    ));
    const t0 = performance.now();
    render(<ul>{rows}</ul>, root);
    const ms = performance.now() - t0;

    expect(root.querySelectorAll("li")).toHaveLength(10_000);

    const frames = (ms / 16.7).toFixed(0);
    console.log(
      `\n  10,000 rows rendered in ${ms.toFixed(0)} ms — one unbroken task.\n` +
      `  At 60fps a frame is 16.7 ms, so that's ~${frames} frames where the page\n` +
      `  could not respond to a click, a keypress, or a scroll.\n` +
      `  (jsdom is not a browser; the absolute number will differ. The shape won't:\n` +
      `  render() is recursive, so it cannot stop halfway. That is M3's whole job.)\n`,
    );
  });
});
