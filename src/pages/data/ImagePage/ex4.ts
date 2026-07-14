import { defineHtml, html, useRef } from "elfui";

const fit = useRef("cover");

const previewImages = [
  "https://picsum.photos/1200/800?random=21",
  "https://picsum.photos/1200/800?random=22",
  "https://picsum.photos/1200/800?random=23"
];

const code4 = `<elf-image
  :src="previewImages[0]"
  :previewSrcList.prop="previewImages"
  :initialIndex="0"
  :width="320"
  :height="180"
  fit="cover"
/>`;

const PageImageEx4 = defineHtml(html`
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
`);

export { PageImageEx4 };
