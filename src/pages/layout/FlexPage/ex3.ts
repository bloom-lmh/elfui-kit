import { defineHtml, html } from "elfui";

const asymmetricGap: [number, number] = [20, 8];
const uniformGap = 12;
const fillRatio = 45;

const code = `<elf-flex alignment="center" :size=\${uniformGap}>
  <elf-tag>12px</elf-tag><elf-tag>统一间距</elf-tag>
</elf-flex>
<elf-flex :size=\${asymmetricGap}>
  <elf-tag>水平 20px</elf-tag><elf-tag>垂直 8px</elf-tag>
</elf-flex>
<elf-flex fill :fill-ratio=\${fillRatio} gap="md">
  <article>45%</article><article>45%</article>
</elf-flex>`;

const script = `const uniformGap = 12;
const asymmetricGap = [20, 8];
const fillRatio = 45;`;

const PageFlexEx3 = defineHtml(html`
  <h2>Space 兼容属性</h2>
  <elf-playground title="alignment / size / fill-ratio" :code=${code} :script=${script}>
    <div style="display:grid;width:100%;gap:18px">
      <elf-flex alignment="center" :size=${uniformGap}>
        <elf-tag>12px</elf-tag><elf-tag>统一间距</elf-tag><elf-button size="sm">对齐中心</elf-button>
      </elf-flex>
      <elf-flex wrap :size=${asymmetricGap}>
        <elf-tag>水平 20px</elf-tag><elf-tag>垂直 8px</elf-tag><elf-tag>支持元组</elf-tag>
      </elf-flex>
      <elf-flex fill :fill-ratio=${fillRatio} gap="md" style="min-height:0">
        <article style="padding:16px;border:1px solid var(--elf-border);border-radius:12px;background:var(--elf-bg-paper)">45% 卡片 A</article>
        <article style="padding:16px;border:1px solid var(--elf-border);border-radius:12px;background:var(--elf-bg-paper)">45% 卡片 B</article>
      </elf-flex>
    </div>
  </elf-playground>
`);

export { PageFlexEx3 };
