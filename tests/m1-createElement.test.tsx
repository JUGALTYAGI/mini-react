/** @jsxRuntime classic */
/** @jsx createElement */
import { describe, it, expect } from "vitest";
import { createElement, TEXT_ELEMENT } from "../src/index";

/* M1 · createElement
   JSX is not HTML. It's a function call. Every <tag> in this file is
   compiled into createElement(tag, props, ...children) — the two pragma
   comments at the top tell the compiler to call YOUR function. */

const text = (v: string) => ({ type: TEXT_ELEMENT, props: { nodeValue: v, children: [] } });

describe("M1 · the shape of an element", () => {
  it("returns { type, props } with children inside props", () => {
    expect(createElement("div", { id: "a" })).toEqual({
      type: "div",
      props: { id: "a", children: [] },
    });
  });

  it("treats null props as no props", () => {
    expect(createElement("br", null)).toEqual({ type: "br", props: { children: [] } });
  });

  it("does not mutate the props object you passed in", () => {
    const props = { id: "a" };
    const el = createElement("div", props, "x");
    expect(props).toEqual({ id: "a" });          // no `children` added to the caller's object
    expect(el.props).not.toBe(props);            // a new object, not the same reference
  });

  it("passes element children through untouched", () => {
    const child = createElement("span", null);
    expect(createElement("div", null, child).props.children[0]).toBe(child);
  });
});

describe("M1 · text", () => {
  it("wraps a string child in a TEXT_ELEMENT", () => {
    expect(createElement("p", null, "hello").props.children).toEqual([text("hello")]);
  });

  it("wraps a number child, as a string", () => {
    expect(createElement("p", null, 42).props.children).toEqual([text("42")]);
  });

  it("a TEXT_ELEMENT has an empty children array, never undefined", () => {
    const [t] = createElement("p", null, "x").props.children;
    expect(t.props.children).toEqual([]);
  });
});

describe("M1 · the children React throws away — and the one it doesn't", () => {
  it("drops null, undefined, true and false", () => {
    const el = createElement("div", null, null, "a", undefined, true, "b", false);
    expect(el.props.children).toEqual([text("a"), text("b")]);
  });

  it("KEEPS 0 — this is the {count && <Badge/>} bug, on purpose", () => {
    // `false && x` is false (dropped). `0 && x` is 0 — and 0 renders.
    // Real React does exactly this; it's why people see a stray "0" on screen.
    const count = 0;
    const el = createElement("div", null, count && createElement("span", null));
    expect(el.props.children).toEqual([text("0")]);
  });
});

describe("M1 · arrays from .map()", () => {
  it("flattens one level of array children", () => {
    const items = ["a", "b"].map((s) => createElement("li", null, s));
    const el = createElement("ul", null, items);
    expect(el.props.children).toHaveLength(2);
    expect(el.props.children[0].type).toBe("li");
  });

  it("flattens nested arrays to any depth, preserving order", () => {
    const el = createElement("div", null, "a", ["b", ["c", ["d"]]], "e");
    expect(el.props.children.map((c) => c.props.nodeValue)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("drops falsy values that were inside arrays too", () => {
    const el = createElement("div", null, ["a", null, false, "b"]);
    expect(el.props.children).toEqual([text("a"), text("b")]);
  });
});

describe("M1 · JSX is just your function", () => {
  it("<div id='x'>hi</div> is exactly createElement('div', {id:'x'}, 'hi')", () => {
    expect(<div id="x">hi</div>).toEqual(createElement("div", { id: "x" }, "hi"));
  });

  it("a nested JSX tree builds the same tree as nested calls", () => {
    const viaJsx = (
      <ul className="list">
        <li>one</li>
        <li>two</li>
      </ul>
    );
    const viaCalls = createElement(
      "ul",
      { className: "list" },
      createElement("li", null, "one"),
      createElement("li", null, "two"),
    );
    expect(viaJsx).toEqual(viaCalls);
  });
});
