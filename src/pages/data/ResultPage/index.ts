import { defineHtml, html, useComponents } from "elfui";
import { PageResultProps } from "./props";

useComponents({
  "page-result-props": PageResultProps
});

const statusCode = `<elf-result icon="success" title="提交成功" sub-title="配置已保存" />
<elf-result icon="warning" title="需要确认" sub-title="请检查风险项" />
<elf-result icon="error" title="提交失败" sub-title="请稍后重试" />
<elf-result icon="info" title="处理中" sub-title="系统正在执行任务" />`;

const extraCode = `<elf-result icon="success" title="发布成功" sub-title="页面已经上线">
  <div slot="extra" style="display:flex;gap:8px;justify-content:center">
    <elf-button variant="outlined">查看页面</elf-button>
    <elf-button>继续编辑</elf-button>
  </div>
</elf-result>`;

const slotCode = `<elf-result title="自定义图标" sub-title="icon slot 可替换默认状态图形">
  <span slot="icon">★</span>
</elf-result>`;

const PageResult = defineHtml(html`
  <elf-container>
    <h1>Result 结果</h1>
    <p>用于流程结束页或局部操作结果，支持 success、warning、error 与 info 状态。</p>

    <elf-playground title="四种状态" :code=${statusCode}>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;width:100%">
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="success" title="提交成功" sub-title="配置已保存"></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="warning" title="需要确认" sub-title="请检查风险项"></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="error" title="提交失败" sub-title="请稍后重试"></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="info" title="处理中" sub-title="系统正在执行任务"></elf-result>
      </div>
    </elf-playground>

    <elf-playground title="扩展操作区" :code=${extraCode}>
      <elf-result icon="success" title="发布成功" sub-title="页面已经上线">
        <div slot="extra" style="display:flex;gap:8px;justify-content:center">
          <elf-button variant="outlined">查看页面</elf-button>
          <elf-button>继续编辑</elf-button>
        </div>
      </elf-result>
    </elf-playground>

    <elf-playground title="自定义图标" :code=${slotCode}>
      <elf-result title="自定义图标" sub-title="icon slot 可替换默认状态图形">
        <span slot="icon">★</span>
      </elf-result>
    </elf-playground>

    <page-result-props></page-result-props>
  </elf-container>
`);

export { PageResult };
