import { defineHtml, defineStyle, html } from "elfui";
import styles from "./style.scss?inline";

defineStyle(styles);

const PageHome = defineHtml(html`
  <div>
    <h1>ElfUI 组件库</h1>
    <p>
      Material Design 风格、对标 Element Plus 的组件库，构建在自研 Web Components 框架 ElfUI 之上。
    </p>
    <p>每个组件采用链式 builder + Shadow DOM + 主题 CSS 变量；支持深浅主题切换。</p>
    <div class="stats">
      <div class="stat">
        <div class="num">14.43 KB</div>
        <div class="lbl">elfui gzip</div>
      </div>
      <div class="stat">
        <div class="num">17.32 KB</div>
        <div class="lbl">+ @elfui/router</div>
      </div>
      <div class="stat">
        <div class="num">401</div>
        <div class="lbl">单元测试</div>
      </div>
      <div class="stat">
        <div class="num">~34 KB</div>
        <div class="lbl">Vue 3 全量（参考）</div>
      </div>
    </div>
  </div>
`);

export { PageHome };
