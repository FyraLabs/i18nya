//? https://react.i18next.com/latest/trans-component
// do something similar to ↑

import { Children, cloneElement, isValidElement } from "react";
import type { FunctionComponent, ReactNode } from "react";

type Props = {
  children: ReactNode;
  t: string;
};

/**
 * A fake version of `<Trans>` in `react-i18next` with *very different* behaviour.
 *
 * You feed in a list of empty elements in `<Trans>`. The structure will follow the translation strings.
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
 * <b>Hello John</b>, welcome to <a href="https://example.com"><b>my site</b></a>.
 * ```
 *
 * @param children the list of tags.
 * @param t return value of t()
 * @returns ReactNode
 */
export default (({ children, t }: Props) => {
  // find /<\/(\d+)>/g, where group 1 parse to int is largest
  const maxTagId = Math.max(
    ...t.match(/<\/(\d+)>/g).map((i) => parseInt(i.slice(2, -1))),
  );
  const inputs = Children.toArray(children).filter((c) => isValidElement(c));
  if ((maxTagId ?? 0) > inputs.length) {
    return t; // syntax error
  }

  const elms: ReactNode[] = []; // resulting list of elements
  const tagStack = [];
  for (let ch_idx = 0; ch_idx < t.length; ) {
    if (t.substring(ch_idx, ch_idx + 2) == "\\<") {
      elms.push("<");
      ch_idx += 2;
      continue;
    }
    if (t.substring(ch_idx, ch_idx + 2) == "</") {
      let j = 0;
      while (t[++j + ch_idx] != ">" && j + ch_idx < t.length);
      const tag = Number.parseInt(t.substring(++ch_idx + 1, (ch_idx += j)));
      if (Number.isNaN(tag)) {
        elms.push(t.substring(ch_idx - j - 1, ch_idx));
        continue;
      }
      let { p, l } = tagStack.pop();
      if (tag != p) {
        return t; // syntax error
      }
      elms.push(
        cloneElement(inputs[p - 1], {}, ...elms.splice(l, elms.length - l)),
      );
      continue;
    }
    if (t[ch_idx] == "<") {
      let j = 0;
      while (t[++j + ch_idx] != ">" && j + ch_idx < t.length);
      const tag = Number.parseInt(t.substring(++ch_idx, (ch_idx += j)));
      if (Number.isNaN(tag)) {
        elms.push(t.substring(ch_idx - j - 1, ch_idx));
        continue;
      }
      tagStack.push({ p: tag, l: elms.length });
      elms.push(""); // in order to splice later, contents inside a new tag element must start fresh
      continue;
    }
    if (typeof elms[elms.length - 1] === "string") {
      elms[elms.length - 1] += t[ch_idx++];
    } else {
      elms.push(t[ch_idx++]);
    }
  }
  return <>{elms}</>;
}) satisfies FunctionComponent<Props>;
