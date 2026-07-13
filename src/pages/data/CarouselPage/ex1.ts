import { defineHtml, html } from "elfui";

const code1 = `<elf-carousel>
  <img src="https://picsum.photos/800/320?random=1" />
  <img src="https://picsum.photos/800/320?random=2" />
  <img src="https://picsum.photos/800/320?random=3" />
  <img src="https://picsum.photos/800/320?random=4" />
</elf-carousel>`;

const code2 = `<elf-carousel effect="fade" show-arrow="ghost" indicator-type="line" height="360px">
  <img src="https://picsum.photos/800/360?random=5" />
  <img src="https://picsum.photos/800/360?random=6" />
  <img src="https://picsum.photos/800/360?random=7" />
</elf-carousel>`;

const code3 = `<elf-carousel effect="fade" show-arrow="ghost" indicator-type="line" height="360px" :autoplay=\${false} duration="0.3s">
  <div style="background:linear-gradient(135deg,#667eea,#764ba2);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600">第一屏</div>
  <div style="background:linear-gradient(135deg,#f093fb,#f5576c);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600">第二屏</div>
  <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600">第三屏</div>
</elf-carousel>`;

const code4 = `<elf-carousel
  direction="vertical"
  initial-index="1"
  trigger="click"
  arrow="always"
  show-arrow="ghost"
  indicator-type="line"
  height="220px"
  :autoplay=\${false}
>
  <div style="height:100%;display:grid;place-items:center;background:#2563eb;color:white">第一屏</div>
  <div style="height:100%;display:grid;place-items:center;background:#7c3aed;color:white">第二屏</div>
  <div style="height:100%;display:grid;place-items:center;background:#db2777;color:white">第三屏</div>
</elf-carousel>`;

const code5 = `<elf-carousel type="card" :autoplay=\${false} height="260px">
  <elf-carousel-item name="design" label="Design">
    <div style="height:100%;display:grid;place-items:center;background:#0f766e;color:#fff;font-size:28px">Design</div>
  </elf-carousel-item>
  <elf-carousel-item name="build" label="Build">
    <div style="height:100%;display:grid;place-items:center;background:#7c3aed;color:#fff;font-size:28px">Build</div>
  </elf-carousel-item>
  <elf-carousel-item name="ship" label="Ship">
    <div style="height:100%;display:grid;place-items:center;background:#db2777;color:#fff;font-size:28px">Ship</div>
  </elf-carousel-item>
</elf-carousel>`;

const PageCarouselEx1 = defineHtml(html`
  <h2>基础滑动</h2>
  <elf-playground title="4 张图片、自动轮播与圆形箭头" :code=${code1}>
    <elf-carousel style="max-width:800px">
      <img src="https://picsum.photos/800/320?random=1" />
      <img src="https://picsum.photos/800/320?random=2" />
      <img src="https://picsum.photos/800/320?random=3" />
      <img src="https://picsum.photos/800/320?random=4" />
    </elf-carousel>
  </elf-playground>

  <h2>渐隐、幽灵箭头与线形指示器</h2>
  <elf-playground title="统一的渐隐轮播外观" :code=${code2}>
    <elf-carousel
      effect="fade"
      show-arrow="ghost"
      indicator-type="line"
      height="360px"
      style="max-width:800px"
    >
      <img src="https://picsum.photos/800/360?random=5" />
      <img src="https://picsum.photos/800/360?random=6" />
      <img src="https://picsum.photos/800/360?random=7" />
    </elf-carousel>
  </elf-playground>

  <h2>统一的渐隐轮播</h2>
  <elf-playground title="渐隐、幽灵箭头与线形指示器" :code=${code3}>
    <elf-carousel
      effect="fade"
      show-arrow="ghost"
      indicator-type="line"
      height="360px"
      :autoplay=${false}
      duration="0.3s"
      style="max-width:800px"
    >
      <div
        style="background:linear-gradient(135deg,#667eea,#764ba2);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600"
      >
        第一屏
      </div>
      <div
        style="background:linear-gradient(135deg,#f093fb,#f5576c);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600"
      >
        第二屏
      </div>
      <div
        style="background:linear-gradient(135deg,#4facfe,#00f2fe);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600"
      >
        第三屏
      </div>
    </elf-carousel>
  </elf-playground>

  <h2>垂直轮播与键盘操作</h2>
  <elf-playground title="聚焦后可使用上下方向键、行首键或行尾键" :code=${code4}>
    <elf-carousel
      direction="vertical"
      initial-index="1"
      trigger="click"
      arrow="always"
      show-arrow="ghost"
      indicator-type="line"
      height="220px"
      :autoplay=${false}
      style="width:100%;max-width:800px"
    >
      <div style="height:100%;display:grid;place-items:center;background:#2563eb;color:white">第一屏</div>
      <div style="height:100%;display:grid;place-items:center;background:#7c3aed;color:white">第二屏</div>
      <div style="height:100%;display:grid;place-items:center;background:#db2777;color:white">第三屏</div>
    </elf-carousel>
  </elf-playground>

  <h2>带标签的卡片轮播</h2>
  <elf-playground title="卡片模式使用 elf-carousel-item 子组件" :code=${code5}>
    <elf-carousel type="card" height="260px" :autoplay=${false} style="max-width:800px">
      <elf-carousel-item name="design" label="设计">
        <div style="height:100%;display:grid;place-items:center;background:#0f766e;color:#fff;font-size:28px">设计</div>
      </elf-carousel-item>
      <elf-carousel-item name="build" label="构建">
        <div style="height:100%;display:grid;place-items:center;background:#7c3aed;color:#fff;font-size:28px">构建</div>
      </elf-carousel-item>
      <elf-carousel-item name="ship" label="发布">
        <div style="height:100%;display:grid;place-items:center;background:#db2777;color:#fff;font-size:28px">发布</div>
      </elf-carousel-item>
    </elf-carousel>
  </elf-playground>
`);

export { PageCarouselEx1 };
