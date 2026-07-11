import { defineHtml, html, useComponents } from "elfui";
import { PageTransferEx1 } from "./ex1";
import { PageTransferEx2 } from "./ex2";
import { PageTransferProps } from "./props";

useComponents({
  "page-transfer-ex1": PageTransferEx1,
  "page-transfer-ex2": PageTransferEx2,
  "page-transfer-props": PageTransferProps
});

const PageTransfer = defineHtml(html`
  <elf-container
    ><h1>Transfer 穿梭框</h1>
    <p>双栏穿梭选择框，支持搜索过滤、全选、自定义字段名。</p>
    <page-transfer-ex1 /><page-transfer-ex2 /><page-transfer-props
  /></elf-container>
`);

export { PageTransfer };
