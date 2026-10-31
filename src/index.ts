/* ──────────────────────────────────────────────────────────────────────
   Your implementation lives here. Read lessons/m1-createElement.md first.
   The tests in tests/ are the spec — don't edit them.
   ────────────────────────────────────────────────────────────────────── */
import { TEXT_ELEMENT, type MiniElement, type Child } from "./types";

export { TEXT_ELEMENT };
export type { MiniElement, Child };

/* ── M1 ─────────────────────────────────────────────────────────────── */

export function createElement(
  type: string,
  props: Record<string, unknown> | null,
  ...children: Child[]
): MiniElement {
  const normalizedProps = {
    ...(props ?? {}),
    children: noramlizedChildren(children),
  };
  return { type, props: normalizedProps };
}

function noramlizedChildren(children: Child[]): MiniElement[] {
  const result: MiniElement[] = [];

  function append(child: Child): void {
    if (Array.isArray(child)) {
      child.forEach(append);
      return;
    }

    // Drop null, undefined and booleans children but keep 0
    if (child === null || child === undefined || typeof child === "boolean") {
      return;
    }

    if (typeof child === "string" || typeof child === "number") {
      result.push({
        type: "TEXT_ELEMENT",
        props: { nodeValue: String(child), children: [] },
      });
      return;
    }

    result.push(child as MiniElement);
  }

  children.forEach(append);

  return result;
}

/* ── M2 ─────────────────────────────────────────────────────────────── */

export function render(element: MiniElement, container: Node): void {
  throw new Error("M2: render is not implemented yet");
}
