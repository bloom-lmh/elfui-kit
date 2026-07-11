import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const volume = useRef(42);

const onVolume = (event: CustomEvent): void => {
  volume.set(Number(event.detail));
};

const code = `<elf-slider vertical :modelValue.prop="volume" @update:modelValue="onVolume"></elf-slider>`;

const PageSliderEx4 = defineHtml(html`
  <h2>纵向滑块</h2>
  <elf-playground title="vertical" :code="code">
    <div style="display:grid;gap:12px;justify-items:center;min-height:280px;width:120px">
      <elf-slider vertical :modelValue.prop="volume" @update:modelValue="onVolume"></elf-slider>
      <span class="demo-state">音量 {{ volume }}</span>
    </div>
  </elf-playground>
`);

export { PageSliderEx4 };
