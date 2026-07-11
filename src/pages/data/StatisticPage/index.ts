import { defineHtml, html } from "elfui";

const code1 = `<elf-statistic title="活跃用户" :value=\${128430} suffix="人" />
<elf-statistic title="转化率" :value=\${0.8732} :precision=\${2} suffix="%" />`;

const code2 = `<elf-statistic
  title="本月收入"
  :value=\${932845.6}
  prefix="￥"
  suffix="CNY"
  :precision=\${2}
/>
<elf-statistic title="自定义分隔符" :value=\${1234567.89} group-separator=" " decimal-separator="," :precision=\${2} />`;

const slotCode = `<elf-statistic :value=\${86.5} :precision=\${1}>
  <span slot="title">CPU 使用率</span>
  <span slot="suffix">%</span>
</elf-statistic>`;

const PageStatistic = defineHtml(html`
  <elf-container>
    <h1>Statistic 统计数值</h1>
    <p>突出展示关键数字，支持标题、前后缀、精度、千分位和插槽。</p>

    <elf-playground title="基础数值" :code=${code1}>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:24px">
        <elf-statistic title="活跃用户" :value=${128430} suffix="人"></elf-statistic>
        <elf-statistic title="转化率" :value=${0.8732} :precision=${2} suffix="%"></elf-statistic>
      </div>
    </elf-playground>

    <elf-playground title="prefix / precision / separator" :code=${code2}>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:24px">
        <elf-statistic
          title="本月收入"
          :value=${932845.6}
          prefix="￥"
          suffix="CNY"
          :precision=${2}
        ></elf-statistic>
        <elf-statistic
          title="自定义分隔符"
          :value=${1234567.89}
          group-separator=" "
          decimal-separator=","
          :precision=${2}
        ></elf-statistic>
      </div>
    </elf-playground>

    <elf-playground title="slots" :code=${slotCode}>
      <elf-statistic :value=${86.5} :precision=${1}>
        <span slot="title">CPU 使用率</span>
        <span slot="suffix">%</span>
      </elf-statistic>
    </elf-playground>
  </elf-container>
`);

export { PageStatistic };
