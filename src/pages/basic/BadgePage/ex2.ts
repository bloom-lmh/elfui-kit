import { defineHtml, html } from "elfui";

const code1 = `<elf-badge is-dot>
  <elf-button>通知</elf-button>
</elf-badge>
<elf-badge is-dot type="success">
  <span>在线</span>
</elf-badge>
<elf-badge is-dot type="danger">
  <span>异常</span>
</elf-badge>`;

const code2 = `<elf-badge value="1" type="primary">
  <elf-button>消息</elf-button>
</elf-badge>
<elf-badge value="5" type="success">
  <elf-button>完成</elf-button>
</elf-badge>
<elf-badge value="8" type="warning">
  <elf-button>待处理</elf-button>
</elf-badge>
<elf-badge value="99" type="danger">
  <elf-button>错误</elf-button>
</elf-badge>
<elf-badge value="new" type="info">
  <elf-button>更新</elf-button>
</elf-badge>`;

const code3 = `<elf-badge value="1" color="#ff6f00">
  <elf-button>自定义</elf-button>
</elf-badge>
<elf-badge value="5" color="#00c853">
  <elf-button>成功</elf-button>
</elf-badge>`;

const PageBadgeEx2 = defineHtml(html`
  <h2>圆点模式</h2>
  <elf-playground title="is-dot，只显示圆点不显示文字" :code="code1">
    <elf-badge is-dot><elf-button>通知</elf-button></elf-badge>
    <div style="width: 20px"></div>
    <elf-badge is-dot type="success"><span>在线</span></elf-badge>
    <div style="width: 20px"></div>
    <elf-badge is-dot type="danger"><span>异常</span></elf-badge>
  </elf-playground>

  <h2>颜色类型</h2>
  <elf-playground title="5 种语义颜色" :code="code2">
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">
      <elf-badge value="1" type="primary"><elf-button>消息</elf-button></elf-badge>
      <elf-badge value="5" type="success"><elf-button>完成</elf-button></elf-badge>
      <elf-badge value="8" type="warning"><elf-button>待处理</elf-button></elf-badge>
      <elf-badge value="99" type="danger"><elf-button>错误</elf-button></elf-badge>
      <elf-badge value="new" type="info"><elf-button>更新</elf-button></elf-badge>
    </div>
  </elf-playground>

  <h2>自定义颜色</h2>
  <elf-playground title="color 属性直接赋值 #HEX" :code="code3">
    <elf-badge value="1" color="#ff6f00"><elf-button>自定义</elf-button></elf-badge>
    <div style="width: 20px"></div>
    <elf-badge value="5" color="#00c853"><elf-button>成功</elf-button></elf-badge>
  </elf-playground>
`);

export { PageBadgeEx2 };
