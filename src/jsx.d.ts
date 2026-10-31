/* Given. Tells TypeScript what JSX means in this project, so your editor
   stops underlining every tag. Any lowercase tag is allowed, with any props;
   the result of a JSX expression is a MiniElement. */
import type { MiniElement } from "./types";

declare global {
  namespace JSX {
    type Element = MiniElement;
    interface IntrinsicElements {
      [tag: string]: Record<string, unknown>;
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
