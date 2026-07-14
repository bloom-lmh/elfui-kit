import { defineHtml, html, useRef } from "elfui";


const volume = useRef(42);

const onVolume = (event: CustomEvent): void => {
  volume.set(Number(event.detail));
};

const code = `<elf-slider
  vertical
  height="240"
  :modelValue.prop=\${volume.value}
  @update:modelValue=\${onVolume}
></elf-slider>`;

const script = `const volume = useRef(42);

const onVolume = (event: CustomEvent<number>): void => {
  volume.set(Number(event.detail));
};`;

const PageSliderEx4 = defineHtml(html`
  <h2>纵向滑块</h2>
  <elf-playground title="垂直滑块" :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;justify-items:center;min-height:280px;width:120px">
      <elf-slider vertical height="240" :modelValue.prop=${volume.value} @update:modelValue=${onVolume}></elf-slider>
      <span slot="status" class="demo-state">音量 {{ volume }}</span>
    </div>
  </elf-playground>
`);

export { PageSliderEx4 };
