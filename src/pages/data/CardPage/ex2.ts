import { defineHtml, html } from "elfui";

const code1 = `<elf-card
  image="https://picsum.photos/360/180"
  image-height="180px"
  title="西湖美景"
  subtitle="浙江省杭州市"
  overlay="热门推荐"
>
  <p style="color:var(--elf-text-secondary)">西湖，中国大陆首批国家重点风景名胜区，中国十大风景名胜之一。</p>
  <template #footer>
    <elf-button variant="text" size="sm">分享</elf-button>
    <elf-button variant="text" color="primary" size="sm">了解更多</elf-button>
  </template>
</elf-card>`;

const code2 = `<elf-card
  image="https://picsum.photos/240/320"
  image-placement="left"
  image-width="35%"
  image-height="200px"
  variant="outlined"
  clickable
  title="水平布局"
  subtitle="图片在左，内容在右"
>
  <p style="color:var(--elf-text-secondary)">设置 image-placement="left" 即可切换为水平布局。</p>
  <template #footer>
    <elf-button variant="text" color="primary" size="sm">查看</elf-button>
  </template>
</elf-card>`;

const code3 = `<elf-card
  variant="tonal"
  avatar="https://i.pravatar.cc/40?img=3"
  title="张三"
  subtitle="产品设计师"
>
  <template #extra><elf-tag color="primary" size="sm">PRO</elf-tag></template>
  <p style="color:var(--elf-text-secondary)">负责产品视觉设计与交互规范制定。</p>
  <template #footer>
    <elf-button variant="text" size="sm">私信</elf-button>
    <elf-button variant="text" color="primary" size="sm">关注</elf-button>
  </template>
</elf-card>`;

const staticScript = `// 纯展示案例，无需额外状态。`;

const PageCardEx2 = defineHtml(html`
  <h2>图片封面 + 叠加文字</h2>
  <elf-playground title="image + overlay 属性" :code=${code1} :script=${staticScript}>
    <elf-card
      image="https://picsum.photos/360/180"
      image-height="180px"
      title="西湖美景"
      subtitle="浙江省杭州市"
      overlay="热门推荐"
      style="max-width:360px"
    >
      <p style="color:var(--elf-text-secondary)">
        西湖，中国大陆首批国家重点风景名胜区，中国十大风景名胜之一。
      </p>
      <template #footer>
        <elf-button variant="text" size="sm">分享</elf-button>
        <elf-button variant="text" color="primary" size="sm">了解更多</elf-button>
      </template>
    </elf-card>
  </elf-playground>

  <h2>水平布局</h2>
  <elf-playground title="image-placement='left'" :code=${code2} :script=${staticScript}>
    <elf-card
      image="https://picsum.photos/240/320"
      image-placement="left"
      image-width="35%"
      image-height="200px"
      variant="outlined"
      clickable
      title="水平布局"
      subtitle="图片在左，内容在右"
      style="max-width:560px"
    >
      <p style="color:var(--elf-text-secondary)">
        设置 image-placement="left" 即可切换为水平布局。
      </p>
      <template #footer>
        <elf-button variant="text" color="primary" size="sm">查看</elf-button>
      </template>
    </elf-card>
  </elf-playground>

  <h2>用户卡片（头像 + extra）</h2>
  <elf-playground title="avatar + extra + tonal" :code=${code3} :script=${staticScript}>
    <elf-card
      variant="tonal"
      avatar="https://i.pravatar.cc/40?img=3"
      title="张三"
      subtitle="产品设计师"
      style="max-width:400px"
    >
      <template #extra><elf-tag color="primary" size="sm">PRO</elf-tag></template>
      <p style="color:var(--elf-text-secondary)">负责产品视觉设计与交互规范制定。</p>
      <template #footer>
        <elf-button variant="text" size="sm">私信</elf-button>
        <elf-button variant="text" color="primary" size="sm">关注</elf-button>
      </template>
    </elf-card>
  </elf-playground>
`);

export { PageCardEx2 };
