import { defineHtml, html, useRef } from "elfui";


const value = useRef(3);

const half = useRef(3.5);

const halfCode = `<elf-rate v-model="half" allow-half show-score score-template="{value} 分"></elf-rate>`;

const onHalf = (event: CustomEvent): void => {
  half.set(Number(event.detail));
};

const PageRateEx2 = defineHtml(html`
<elf-playground title="半星与分数" :code="halfCode">
      <div style="display:grid;gap:12px">
        <elf-rate
          :modelValue.prop="half"
          allow-half
          show-score
          score-template="{value} 分"
          @update:modelValue="onHalf"
        ></elf-rate>
        <span slot="status" class="demo-state">半星评分：{{ half }}</span>
      </div>
    </elf-playground>
`);

export { PageRateEx2 };
