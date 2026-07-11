import { PageAnchorEx1 } from "./ex1";
import { PageAnchorEx2 } from "./ex2";
import { PageAnchorProps } from "./props";

import { defineHtml, html, useComponents } from "elfui";

useComponents({
  "page-anchor-ex1": PageAnchorEx1,
  "page-anchor-ex2": PageAnchorEx2,
  "page-anchor-props": PageAnchorProps
});

const PageAnchor = defineHtml(html`
  <elf-container>
    <h1>Anchor</h1>
    <p>
      Anchor keeps navigation in sync with a scroll container. It supports nested items, controlled
      active state, disabled entries and click/change events.
    </p>
    <page-anchor-ex1></page-anchor-ex1>
    <page-anchor-ex2></page-anchor-ex2>
    <page-anchor-props></page-anchor-props>
  </elf-container>
`);

export { PageAnchor };
