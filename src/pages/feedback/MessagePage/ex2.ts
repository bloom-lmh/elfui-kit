import { defineHtml, html } from "elfui";
import { ElfMessage } from "../../../components/Feedback";

const showClosable = (): void => {
    ElfMessage({ message: "可手动关闭", closable: true, duration: 0 });
};

const code2 = `ElfMessage({ message: "可手动关闭", closable: true, duration: 0 })`;

const PageMessageEx2 = defineHtml(html`
    <h2>可关闭</h2>
    <elf-playground title="常驻且可关闭" :code="code2">
        <elf-button @click="showClosable">手动关闭</elf-button>
    </elf-playground>
`);

export { PageMessageEx2 };
