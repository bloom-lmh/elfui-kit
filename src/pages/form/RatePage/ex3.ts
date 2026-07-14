import { defineHtml, html, useRef } from "elfui";


const value = useRef(3);

const mood = useRef(4);

const customCode = `<elf-rate character="♥" color="#d81b60" void-color="#f8bbd0"></elf-rate>`;

const onMood = (event: CustomEvent): void => {
  mood.set(Number(event.detail));
};

const PageRateEx3 = defineHtml(html`
<elf-playground title="自定义符号与只读" :code="customCode">
      <div style="display:grid;gap:12px">
        <elf-rate
          :modelValue.prop="mood"
          character="♥"
          void-character="♡"
          color="#d81b60"
          void-color="#f8bbd0"
          @update:modelValue="onMood"
        ></elf-rate>
        <elf-rate model-value="4" readonly show-score score-template="{value} / 5"></elf-rate>
      </div>
    </elf-playground>
`);

export { PageRateEx3 };
