/* Given. You don't need to change this file. */

/** The marker type for a text node. Every string and number in the tree
 *  becomes one of these, so the rest of the code never special-cases text. */
export const TEXT_ELEMENT = "TEXT_ELEMENT";

/** What createElement returns: a plain description of UI, not UI itself. */
export interface MiniElement {
  type: string;
  props: {
    [key: string]: unknown;
    children: MiniElement[];
  };
}

/** Anything JSX can put in a children position. */
export type Child =
  | MiniElement
  | string
  | number
  | boolean
  | null
  | undefined
  | Child[];
