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
const previewImages = [
  "https://picsum.photos/1200/800?random=21",
  "https://picsum.photos/1200/800?random=22",
  "https://picsum.photos/1200/800?random=23"
];

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

const code2 = `<elf-image src="/not-found-image.png" alt="加载失败" :width="320" :height="180">
  <div slot="error">图片加载失败</div>
</elf-image>`;

const code3 = `<elf-image :src="imageSrc" alt="懒加载图片" :width="320" :height="180" lazy />`;

const code4 = `<elf-image
  :src="previewImages[0]"
  :previewSrcList.prop="previewImages"
  :initialIndex="0"
  :width="320"
  :height="180"
  fit="cover"
/>`;

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

const PageImage = defineHtml(html`
  <elf-container>
    <h1>Image 图片</h1>
    <p>展示图片资源，支持尺寸、填充方式、懒加载、错误占位与预览。</p>

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
        <p class="demo-state">当前：{{ fit.value }} — {{ fitDescription() }}</p>
      </div>
    </elf-playground>

    <elf-playground title="加载失败占位" :code=${code2}>
      <elf-image src="/not-found-image.png" alt="加载失败" :width=${320} :height=${180}>
        <div slot="error" style="display:grid;place-items:center;height:100%;color:var(--elf-text-secondary)">
          图片加载失败
        </div>
      </elf-image>
    </elf-playground>

    <elf-playground title="图片懒加载" :code=${code3}>
      <elf-image :src=${imageSrc} alt="懒加载图片" :width=${320} :height=${180} lazy></elf-image>
    </elf-playground>

    <elf-playground title="预览、缩放与切换" :code=${code4}>
      <elf-image
        :src=${previewImages[0]}
        :previewSrcList.prop=${previewImages}
        :initialIndex=${0}
        :width=${320}
        :height=${180}
        fit="cover"
        alt="点击预览图片"
      ></elf-image>
    </elf-playground>
  </elf-container>
`);

export { PageImage };
