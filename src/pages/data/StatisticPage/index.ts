import { defineHtml, html, useComponents } from "elfui";
import { PageStatisticProps } from "./props";

useComponents({ "page-statistic-props": PageStatisticProps });

const code1 = `<elf-statistic title="活跃用户" :value="128430" suffix="人" />
<elf-statistic title="转化率" :value="0.8732" :precision="2" suffix="%" />`;
const code2 = `<elf-statistic title="本月收入" :value="932845.6" prefix="¥" suffix="CNY" :precision="2" />
<elf-statistic :value="1234567.89" group-separator=" " decimal-separator="," :precision="2" />`;
const formatter = (value: number): string => `${Math.round(value / 1000)}k`;
const formatCode = `<elf-statistic :value="128430" :formatter.prop="formatter" :value-style.prop="{ color: 'var(--elf-primary)' }" />`;
const formatScript = "const formatter = (value: number): string => `${Math.round(value / 1000)}k`;";
const deadline = Date.now() + 86_461_000;
const countdownCode = `<elf-countdown
  title="发布倒计时"
  :value.prop="deadline"
  format="DD [days] HH:mm:ss"
  @finish="onFinish"
/>`;
const countdownScript = `const deadline = Date.now() + 86_461_000;
const onFinish = () => console.log("Countdown finished");`;

const PageStatistic = defineHtml(html`
  <elf-container>
    <h1>Statistic 统计数值</h1>
    <p>突出展示关键数字，并提供独立倒计时组件处理目标时间、格式化和结束通知。</p>
    <elf-playground title="基础数值" :code=${code1}>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:24px">
        <elf-statistic title="活跃用户" :value=${128430} suffix="人"></elf-statistic>
        <elf-statistic title="转化率" :value=${0.8732} :precision=${2} suffix="%"></elf-statistic>
      </div>
    </elf-playground>
    <elf-playground title="prefix / precision / separator" :code=${code2}>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:24px">
        <elf-statistic title="本月收入" :value=${932845.6} prefix="¥" suffix="CNY" :precision=${2}></elf-statistic>
        <elf-statistic :value=${1234567.89} group-separator=" " decimal-separator="," :precision=${2}></elf-statistic>
      </div>
    </elf-playground>
    <elf-playground title="formatter / value-style" :code=${formatCode} :script=${formatScript}>
      <elf-statistic :value=${128430} :formatter=${formatter} :value-style=${{ color: "var(--elf-primary)" }}></elf-statistic>
    </elf-playground>
    <elf-playground title="Countdown 倒计时" :code=${countdownCode} :script=${countdownScript}>
      <elf-countdown title="发布倒计时" :value=${deadline} format="DD [days] HH:mm:ss"></elf-countdown>
    </elf-playground>
    <page-statistic-props></page-statistic-props>
  </elf-container>
`);

export { PageStatistic };
