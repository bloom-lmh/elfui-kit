import { defineHtml, html, useRef } from "elfui";

const fit = useRef("cover");

const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="360" viewBox="0 0 220 360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>
  <rect width="220" height="360" rx="18" fill="url(#g)"/>
  <circle cx="110" cy="105" r="58" fill="#fff" fill-opacity=".92"/>
  <path d="M35 292 90 218l38 45 26-31 31 60Z" fill="#fff" fill-opacity=".82"/>
  <text x="110" y="188" text-anchor="middle" fill="#fff" font-size="24" font-family="sans-serif">220 × 360</text>
</svg>`;

const imageSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSvg)}`;

const code1 = `<elf-segmented
  :options.prop="['fill', 'contain', 'cover', 'none', 'scale-down']"
  :modelValue="fit"
  @update:modelValue="onFitUpdate"
/>
<elf-image :src="imageSrc" :width="420" :height="220" :fit="fit" />`;

const script1 = `const fit = useRef("cover");

const onFitUpdate = (event) => {
  fit.set(event.detail);
};`;

const onFitUpdate = (event: CustomEvent): void => {
  const detail = Array.isArray(event.detail) ? event.detail[0] : event.detail;
  fit.set(String(detail || "cover"));
};

const fitDescription = (): string => {
  const descriptions: Record<string, string> = {
    fill: "拉伸填满容器，图片比例可能改变",
    contain: "完整显示图片，并保留空白区域",
    cover: "保持比例填满容器，超出部分会裁切",
    none: "保持图片原始尺寸，不进行缩放",
    "scale-down": "在 none 与 contain 中选择较小的尺寸"
  };
  return descriptions[fit.value] || "";
};

const PageImageEx1 = defineHtml(html`
<elf-playground title="填充方式与固定尺寸" :code=${code1} :script=${script1}>
      <div style="display:grid;gap:12px;width:100%;max-width:520px">
        <elf-segmented
          :options.prop=${["fill", "contain", "cover", "none", "scale-down"]}
          :modelValue=${fit.value}
          @update:modelValue=${onFitUpdate}
        ></elf-segmented>
        <div style="padding:12px;border-radius:12px;background:repeating-conic-gradient(var(--elf-bg-overlay) 0 25%,var(--elf-bg-paper) 0 50%) 50%/20px 20px">
          <elf-image
            :src=${imageSrc}
            alt="对象填充方式示例"
            :width=${420}
            :height=${220}
            :fit=${fit.value}
          ></elf-image>
        </div>
        <p slot="status" class="demo-state">当前：{{ fit.value }} — {{ fitDescription() }}</p>
      </div>
    </elf-playground>
`);

export { PageImageEx1 };
