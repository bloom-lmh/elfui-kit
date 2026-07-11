import { defineHtml, html } from "elfui";

const statusCode = `<elf-result icon="success" title="提交成功" sub-title="配置已保存" />
<elf-result icon="warning" title="需要确认" sub-title="请检查风险项" />
<elf-result icon="error" title="提交失败" sub-title="稍后重试" />
<elf-result icon="info" title="处理中" sub-title="系统正在执行任务" />`;

const extraCode = `<elf-result icon="success" title="发布成功" sub-title="页面已经上线">
  <div slot="extra" style="display:flex;gap:8px;justify-content:center">
    <elf-button variant="outlined">查看页面</elf-button>
    <elf-button>继续编辑</elf-button>
  </div>
</elf-result>`;

const slotCode = `<elf-result title="自定义图标" sub-title="icon slot 可以替换默认状态符号">
  <span slot="icon">★</span>
</elf-result>`;

const PageResult = defineHtml(html`
  <elf-container>
    <h1>Result 结果</h1>
    <p>用于流程结束页或局部操作结果，支持 success / warning / error / info 状态。</p>

    <elf-playground title="四种状态" :code=${statusCode}>
      <elf-result icon="success" title="提交成功" sub-title="配置已保存"></elf-result>
      <elf-result icon="warning" title="需要确认" sub-title="请检查风险项"></elf-result>
      <elf-result icon="error" title="提交失败" sub-title="稍后重试"></elf-result>
      <elf-result icon="info" title="处理中" sub-title="系统正在执行任务"></elf-result>
    </elf-playground>

    <elf-playground title="extra 操作区" :code=${extraCode}>
      <elf-result icon="success" title="发布成功" sub-title="页面已经上线">
        <div slot="extra" style="display:flex;gap:8px;justify-content:center">
          <elf-button variant="outlined">查看页面</elf-button>
          <elf-button>继续编辑</elf-button>
        </div>
      </elf-result>
    </elf-playground>

    <elf-playground title="自定义 icon slot" :code=${slotCode}>
      <elf-result title="自定义图标" sub-title="icon slot 可以替换默认状态符号">
        <span slot="icon">★</span>
      </elf-result>
    </elf-playground>
  </elf-container>
`);

export { PageResult };
