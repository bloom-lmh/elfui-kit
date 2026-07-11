import { defineHtml, html, useRef } from "elfui";

const fit = useRef("cover");

const imageSrc = "https://picsum.photos/640/360?random=21";

const code1 = `<elf-segmented
  :options.prop=\${["fill", "contain", "cover", "none", "scale-down"]}
  :modelValue=\${fit}
  @update:modelValue=\${onFitUpdate}
/>
<elf-image
  :src=\${imageSrc}
  alt="示例图片"
  :width=\${320}
  :height=\${180}
  :fit=\${fit}
/>`;

const script1 = `const fit = useRef("cover");

const imageSrc = "https://picsum.photos/640/360?random=21";

const onFitUpdate = (event) => {
  fit.set(event.detail);
};`;

const code2 = `<elf-image
  src="/not-found-image.png"
  alt="加载失败"
  :width=\${320}
  :height=\${180}
>
  <div slot="error">图片加载失败</div>
</elf-image>`;

const code3 = `<elf-image
  :src=\${imageSrc}
  alt="懒加载图片"
  :width=\${320}
  :height=\${180}
  lazy
/>`;

const onFitUpdate = (event: CustomEvent): void => {
  fit.set(String(event.detail || "cover"));
};

const PageImage = defineHtml(html`
  <elf-container>
    <h1>Image 图片</h1>
    <p>用于展示图片资源，支持尺寸、填充方式、懒加载和错误占位。</p>

    <elf-playground title="fit / width / height" :code=${code1} :script=${script1}>
      <div style="display:grid;gap:12px;max-width:360px">
        <elf-segmented
          :options.prop=${["fill", "contain", "cover", "none", "scale-down"]}
          :modelValue=${fit}
          @update:modelValue=${onFitUpdate}
        ></elf-segmented>
        <elf-image
          :src=${imageSrc}
          alt="示例图片"
          :width=${320}
          :height=${180}
          :fit=${fit}
        ></elf-image>
      </div>
    </elf-playground>

    <elf-playground title="error slot" :code=${code2}>
      <elf-image src="/not-found-image.png" alt="加载失败" :width=${320} :height=${180}>
        <div
          slot="error"
          style="display:grid;place-items:center;height:100%;color:var(--elf-text-secondary)"
        >
          图片加载失败
        </div>
      </elf-image>
    </elf-playground>

    <elf-playground title="lazy" :code=${code3}>
      <elf-image :src=${imageSrc} alt="懒加载图片" :width=${320} :height=${180} lazy></elf-image>
    </elf-playground>
  </elf-container>
`);

export { PageImage };
