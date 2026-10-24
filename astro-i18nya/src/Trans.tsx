//? https://react.i18next.com/latest/trans-component
// do something similar to ↑

import { Children, Fragment, cloneElement, createElement, isValidElement } from "react";
import type { FunctionComponent, ReactElement, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  t: string;
};

/** `\<` (escaped bracket), or `<n>` / `</n>` / `<n/>` */
const TOKEN = /\\<|<(\/?)(\d+)\s*(\/?)>/g;

type Frame = { tag: number; children: ReactNode[] };

const append = (nodes: ReactNode[], node: ReactNode) => {
  if (node === "") return;
  const last = nodes.length - 1;
  if (typeof node === "string" && typeof nodes[last] === "string")
    nodes[last] += node;
  else nodes.push(node);
};

/**
 * A fake version of `<Trans>` in `react-i18next` with *very different* behaviour.
 *
 * You feed in a list of empty elements in `<Trans>`. The structure will follow the translation strings.
 * `<n>…</n>` wraps its contents in the n-th element (1-indexed), `<n/>` inserts the n-th element as-is,
 * and `\<` produces a literal `<`. Non-numeric tags such as `<b>` are kept as plain text.
 * If the translation is malformed (unbalanced tags, missing elements, …), the raw string is returned.
 *
 * IMPORTANT: It is **HIGHLY RECOMMENDED** to use `experimentalReactChildren: true` for `@astrojs/react` in your astro config,
 * otherwise this will not work correctly outside of `.tsx` files.
 *
 * @example ```tsx
 * <Trans t={t("test", { user: "John" })}>
 *   <b />
 *   <a href="https://example.com" />
 * </Trans>
 * ```
 * With `"test": "Hello <1>{{user}}</1>, welcome to <2><1>my site</1></2>."`, the above element will become:
 * ```tsx
 * Hello <b>John</b>, welcome to <a href="https://example.com"><b>my site</b></a>.
 * ```
 *
 * @param children the list of tags.
 * @param t return value of t()
 * @returns ReactNode
 */
const Trans: FunctionComponent<Props> = ({ children, t }) => {
  const inputs: ReactElement[] = Children.toArray(children).filter(isValidElement);
  const root: Frame = { tag: 0, children: [] };
  const stack: Frame[] = [root];
  const top = () => stack[stack.length - 1]!.children;
  // `Children.toArray` assigns keys, so reusing an element would duplicate them
  let key = 0;
  const clone = (elm: ReactElement, children: ReactNode[] = []) =>
    cloneElement(elm, { key: key++ }, ...children);

  let last = 0;
  for (const m of t.matchAll(TOKEN)) {
    append(top(), t.slice(last, m.index));
    last = m.index + m[0].length;

    if (m[0] === "\\<") {
      append(top(), "<");
      continue;
    }

    const [, closing, id, selfClosing] = m;
    const tag = Number(id);
    const elm = inputs[tag - 1];
    if (!elm || (closing && selfClosing)) return t; // syntax error

    if (selfClosing) {
      append(top(), clone(elm));
    } else if (!closing) {
      stack.push({ tag, children: [] });
    } else {
      const frame = stack.pop();
      if (frame === root || frame?.tag !== tag) return t; // unbalanced
      append(top(), clone(elm, frame.children));
    }
  }
  append(top(), t.slice(last));
  if (stack.length !== 1) return t; // unclosed tag

  return createElement(Fragment, null, ...root.children);
};

export default Trans;
