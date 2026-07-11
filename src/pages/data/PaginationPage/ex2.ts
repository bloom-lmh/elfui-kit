import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const compactPage = useRef(3);

const simplePage = useRef(1);

const readFirst = <T>(event: Event, fallback: T): T => {
  const detail = (event as CustomEvent).detail;
  return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};

const onCompactChange = (event: Event): void => {
  compactPage.set(Number(readFirst(event, compactPage.value)));
};

const onSimpleChange = (event: Event): void => {
  simplePage.set(Number(readFirst(event, simplePage.value)));
};

const code = `<elf-pagination background small layout="prev, pager, next" total="120" />

<elf-pagination layout="total, prev, pager, next" total="12" />`;

const PagePaginationEx2 = defineHtml(html`
  <h2>布局与尺寸</h2>
  <elf-playground title="可通过 layout 组合分页部件，也可以启用背景和小尺寸" :code="code">
    <div style="width: 100%; display: grid; gap: 18px">
      <elf-pagination
        background
        small
        layout="prev, pager, next"
        total="120"
        :currentPage.prop="compactPage"
        @current-change="onCompactChange"
      ></elf-pagination>

      <elf-pagination
        layout="total, prev, pager, next"
        total="12"
        hide-on-single-page
        :currentPage.prop="simplePage"
        @current-change="onSimpleChange"
      ></elf-pagination>

      <elf-pagination layout="total, prev, pager, next" total="0" disabled></elf-pagination>
    </div>
  </elf-playground>
`);

export { PagePaginationEx2 };
