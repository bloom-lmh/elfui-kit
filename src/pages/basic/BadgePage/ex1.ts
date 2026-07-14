import { defineHtml, html } from "elfui";

const code1 = `<elf-badge value="12">
  <elf-button>消息</elf-button>
</elf-badge>
<elf-badge value="3">
  <elf-button>评论</elf-button>
</elf-badge>`;

const code2 = `<elf-badge value="200" max="99">
  <elf-button>评论</elf-button>
</elf-badge>
<elf-badge value="50" max="99">
  <elf-button>消息</elf-button>
</elf-badge>`;

const code3 = `<elf-badge value="新">
  <elf-button>标签</elf-button>
</elf-badge>
<elf-badge value="热">
  <elf-button>热门</elf-button>
</elf-badge>`;

const script = `// Badge is declarative; update value/max properties to drive it reactively.`;

const PageBadgeEx1 = defineHtml(html`
  <h2>基础</h2>
  <elf-playground title="数字徽章" :code=${code1} :script=${script}>
    <elf-badge value="12"><elf-button>消息</elf-button></elf-badge>
    <div style="width: 16px"></div>
    <elf-badge value="3"><elf-button>评论</elf-button></elf-badge>
  </elf-playground>

  <h2>最大值截断</h2>
  <elf-playground title="max=99，超出的显示 99+" :code=${code2} :script=${script}>
    <elf-badge value="200" max="99"><elf-button>评论</elf-button></elf-badge>
    <div style="width: 24px"></div>
    <elf-badge value="50" max="99"><elf-button>消息</elf-button></elf-badge>
  </elf-playground>

  <h2>文本徽章</h2>
  <elf-playground title="value 为字符串直接渲染" :code=${code3} :script=${script}>
    <elf-badge value="新"><elf-button>标签</elf-button></elf-badge>
    <div style="width: 16px"></div>
    <elf-badge value="热"><elf-button>热门</elf-button></elf-badge>
  </elf-playground>
`);

export { PageBadgeEx1 };
