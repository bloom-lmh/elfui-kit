import { defineHtml, html, useComponents } from "elfui";
import { PagePaginationEx1 } from "./ex1";
import { PagePaginationEx2 } from "./ex2";
import { PagePaginationProps } from "./props";

useComponents({
  "page-pagination-ex1": PagePaginationEx1,
  "page-pagination-ex2": PagePaginationEx2,
  "page-pagination-props": PagePaginationProps
});

const PagePagination = defineHtml(html`
  <elf-container>
    <h1>Pagination 分页</h1>
    <p>用于大数据列表的分页导航，支持页码、每页条数、跳转和布局组合。</p>
    <page-pagination-ex1></page-pagination-ex1>
    <page-pagination-ex2></page-pagination-ex2>
    <page-pagination-props></page-pagination-props>
  </elf-container>
`);

export { PagePagination };
