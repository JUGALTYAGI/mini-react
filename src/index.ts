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
    children: normalizeChildren(children),
  };
  return { type, props: normalizedProps };
}

function normalizeChildren(children: Child[]): MiniElement[] {
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
        type: TEXT_ELEMENT,
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
  const dom = createDomNode(element);
  container.appendChild(dom);
}

function createDomNode(element: MiniElement): Node {
  if (element.type === TEXT_ELEMENT) {
    return document.createTextNode((element.props.nodeValue as string) ?? "");
  }

  // creating a real dom node from the virtual element
  const dom = document.createElement(element.type);

  // setting the props on the dom node
  for (const [name, value] of Object.entries(element.props)) {
    if (
      name === "children" ||
      value === null ||
      value === undefined ||
      name === "nodeValue"
    ) {
      continue;
    }
    if (name.startsWith("on") && typeof value === "function") {
      const eventType = name.slice(2).toLowerCase();
      dom.addEventListener(eventType, value as EventListener);
      continue;
    }
    if (name === "className") {
      dom.setAttribute("class", String(value));
      continue;
    }
    if (name.startsWith("aria-") || name.startsWith("data-")) {
      dom.setAttribute(name, String(value));
      continue;
    }
    if (value === null || typeof value === "boolean") {
      continue;
    }

    // Ordinary props become DOM properties

    (dom as unknown as Record<string, unknown>)[name] = value;
  }

  // render the children in order
  const children = (element.props.children as MiniElement[]) ?? [];

  for (const child of children) {
    // false/null/undefined render nothing, but 0 must be preserved

    if (child === null || child === undefined || typeof child === "boolean") {
      continue;
    }

    const childDom = createDomNode(child);
    dom.appendChild(childDom);
  }

  return dom;
}
