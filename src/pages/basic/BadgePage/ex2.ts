import { defineHtml, html } from "elfui";

const dotCode = `<elf-badge is-dot>
  <elf-button>通知</elf-button>
</elf-badge>
<elf-badge is-dot type="success">
  <span>在线</span>
</elf-badge>`;

const typeCode = `<elf-badge value="1" type="primary"><elf-button>消息</elf-button></elf-badge>
<elf-badge value="5" type="success"><elf-button>完成</elf-button></elf-badge>
<elf-badge value="8" type="warning"><elf-button>待处理</elf-button></elf-badge>
<elf-badge value="99" type="danger"><elf-button>错误</elf-button></elf-badge>
<elf-badge value="new" type="info"><elf-button>更新</elf-button></elf-badge>`;

const customCode = `<elf-badge value="1" color="#ff6f00">
  <elf-button>自定义</elf-button>
</elf-badge>`;

const offsetCode = `<elf-badge content="NEW" offset="8,4">
  <elf-button>Offset</elf-button>
</elf-badge>
<elf-badge value="1" :badge-style="{ borderRadius: '4px' }">
  <elf-button>Style</elf-button>
</elf-badge>
<elf-badge value="1">
  <strong slot="content">VIP</strong>
  <elf-button>Slot</elf-button>
</elf-badge>`;

const visibilityCode = `<elf-badge value="0" show-zero="false">
  <elf-button>零值隐藏</elf-button>
</elf-badge>
<elf-badge value="5" hidden>
  <elf-button>隐藏徽章但保留内容</elf-button>
</elf-badge>`;

const script = `const badgeStyle = { borderRadius: "4px" };`;

const PageBadgeEx2 = defineHtml(html`
  <h2>圆点模式</h2>
  <elf-playground title="is-dot" :code=${dotCode} :script=${script}>
    <elf-badge is-dot><elf-button>通知</elf-button></elf-badge>
    <elf-badge is-dot type="success"><span>在线</span></elf-badge>
    <elf-badge is-dot type="danger"><span>异常</span></elf-badge>
  </elf-playground>

  <h2>颜色类型</h2>
  <elf-playground title="type" :code=${typeCode} :script=${script}>
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">
      <elf-badge value="1" type="primary"><elf-button>消息</elf-button></elf-badge>
      <elf-badge value="5" type="success"><elf-button>完成</elf-button></elf-badge>
      <elf-badge value="8" type="warning"><elf-button>待处理</elf-button></elf-badge>
      <elf-badge value="99" type="danger"><elf-button>错误</elf-button></elf-badge>
      <elf-badge value="new" type="info"><elf-button>更新</elf-button></elf-badge>
    </div>
  </elf-playground>

  <h2>自定义</h2>
  <elf-playground title="color" :code=${customCode} :script=${script}>
    <elf-badge value="1" color="#ff6f00"><elf-button>自定义</elf-button></elf-badge>
  </elf-playground>
  <elf-playground title="offset / badge-style / content slot" :code=${offsetCode} :script=${script}>
    <elf-badge content="NEW" offset="8,4"><elf-button>Offset</elf-button></elf-badge>
    <elf-badge value="1" :badge-style=${{ borderRadius: "4px" }}><elf-button>Style</elf-button></elf-badge>
    <elf-badge value="1">
      <strong slot="content">VIP</strong>
      <elf-button>Slot</elf-button>
    </elf-badge>
  </elf-playground>
  <elf-playground title="hidden / show-zero" :code=${visibilityCode} :script=${script}>
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">
      <elf-badge value="0" show-zero="false"><elf-button>零值隐藏</elf-button></elf-badge>
      <elf-badge value="5" hidden><elf-button>隐藏徽章但保留内容</elf-button></elf-badge>
    </div>
  </elf-playground>
`);

export { PageBadgeEx2 };
