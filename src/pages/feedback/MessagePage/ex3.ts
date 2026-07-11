import { defineHtml, html } from "elfui";
import { ElfMessage } from "../../../components/Feedback";

const showStack = (): void => {
  ElfMessage.info("第 1 条");
  setTimeout(() => ElfMessage.success("第 2 条"), 200);
  setTimeout(() => ElfMessage.warning("第 3 条"), 400);
};

const code3 = `ElfMessage.info("第 1 条")
setTimeout(() => ElfMessage.success("第 2 条"), 200)
setTimeout(() => ElfMessage.warning("第 3 条"), 400)`;

const PageMessageEx3 = defineHtml(html`
  <h2>堆叠</h2>
  <elf-playground title="多条堆叠" :code="code3">
    <elf-button @click="showStack">连续触发 3 条</elf-button>
  </elf-playground>
`);

export { PageMessageEx3 };
