import { defineHtml, defineStyle, html, useTemplateRef } from "elfui";
import type { ScrollbarExpose } from "../../../components/Layout/Scrollbar/types";
import styles from "./style.scss?inline";
const mail = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    avatar: "https://i.pravatar.cc/80?img=" + (index + 20),
    title: index % 2 ? "Meeting notes" : "Follow up",
    from: index % 2 ? "Scott" : "Jennifer",
    text: "A compact list item keeps the scrollbar demo close to real product usage.",
}));

const sbRef = useTemplateRef<HTMLElement & ScrollbarExpose>("sbCmd");
const toTop = (): void => sbRef.value?.setScrollTop(0);
const toBottom = (): void => sbRef.value?.setScrollTop(99999);

const code =
    '<elf-scrollbar ref="sbCmd" :height=${220 + "px"} always>\n' +
    '  <ul class="mail-list">\n' +
    '    <li v-for="item in mail" :key="item.id" class="mail-item">\n' +
    '      <img class="mail-avatar" :src="item.avatar" alt="" />\n' +
    '      <span class="mail-body">\n' +
    "        <strong>{{ item.title }}</strong>\n" +
    "        <span><em>{{ item.from }}</em> — {{ item.text }}</span>\n" +
    "      </span>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</elf-scrollbar>\n" +
    '<elf-button size="sm" @click="toTop">回到顶部</elf-button>\n' +
    '<elf-button size="sm" @click="toBottom">滚到底部</elf-button>';

const script =
    'const sbRef = useTemplateRef("sbCmd");\n' +
    "const toTop = () => sbRef.value?.setScrollTop(0);\n" +
    "const toBottom = () => sbRef.value?.setScrollTop(99999);";

const PageScrollbarEx3 = defineHtml(html`
    <h2>命令控制</h2>
    <elf-playground title="setScrollTop" :code=${code} :script=${script}>
        <elf-scrollbar ref="sbCmd" :height=${220 + "px"} always>
            <ul class="mail-list">
                <li v-for="item in mail" :key="item.id" class="mail-item">
                    <img class="mail-avatar" :src="item.avatar" alt="" />
                    <span class="mail-body">
                        <strong>{{ item.title }}</strong>
                        <span><em>{{ item.from }}</em> — {{ item.text }}</span>
                    </span>
                </li>
            </ul>
        </elf-scrollbar>
        <span class="cmd-row">
            <elf-button size="sm" variant="outlined" @click=${toTop}>回到顶部</elf-button>
            <elf-button size="sm" variant="outlined" @click=${toBottom}>滚到底部</elf-button>
        </span>
    </elf-playground>
`);
defineStyle(styles);
export { PageScrollbarEx3 };
