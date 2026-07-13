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

const code3 = `<elf-carousel show-arrow="ghost" indicator-type="line" height="240px" :autoplay=\${false} duration="0.3s">
  <div style="background:linear-gradient(135deg,#667eea,#764ba2);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600">第一屏</div>
  <div style="background:linear-gradient(135deg,#f093fb,#f5576c);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600">第二屏</div>
  <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:600">第三屏</div>
</elf-carousel>`;

const code4 = `<elf-carousel
  direction="vertical"
  initial-index="1"
  trigger="click"
  arrow="always"
  height="220px"
  :autoplay=\${false}
>
  <div style="height:100%;display:grid;place-items:center;background:#2563eb;color:white">First</div>
  <div style="height:100%;display:grid;place-items:center;background:#7c3aed;color:white">Second</div>
  <div style="height:100%;display:grid;place-items:center;background:#db2777;color:white">Third</div>
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
  <elf-playground title="4 张图片，自动轮播，circle 箭头" :code=${code1}>
    <elf-carousel style="max-width:800px">
      <img src="https://picsum.photos/800/320?random=1" />
      <img src="https://picsum.photos/800/320?random=2" />
      <img src="https://picsum.photos/800/320?random=3" />
      <img src="https://picsum.photos/800/320?random=4" />
    </elf-carousel>
  </elf-playground>

  <h2>渐隐 + ghost 箭头 + 线形指示器</h2>
  <elf-playground title="fade + ghost + line" :code=${code2}>
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

  <h2>ghost 箭头 + 线形指示器</h2>
  <elf-playground title="手动切换，线形页签" :code=${code3}>
    <elf-carousel
      show-arrow="ghost"
      indicator-type="line"
      height="240px"
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

  <h2>Vertical, keyboard, and click indicators</h2>
  <elf-playground title="Use Arrow Up/Down, Home, or End while focused" :code=${code4}>
    <elf-carousel
      direction="vertical"
      initial-index="1"
      trigger="click"
      arrow="always"
      height="220px"
      :autoplay=${false}
      style="max-width:520px"
    >
      <div style="height:100%;display:grid;place-items:center;background:#2563eb;color:white">First</div>
      <div style="height:100%;display:grid;place-items:center;background:#7c3aed;color:white">Second</div>
      <div style="height:100%;display:grid;place-items:center;background:#db2777;color:white">Third</div>
    </elf-carousel>
  </elf-playground>

  <h2>Card items with labels</h2>
  <elf-playground title="Card mode requires elf-carousel-item children" :code=${code5}>
    <elf-carousel type="card" height="260px" :autoplay=${false} style="max-width:800px">
      <elf-carousel-item name="design" label="Design">
        <div style="height:100%;display:grid;place-items:center;background:#0f766e;color:#fff;font-size:28px">Design</div>
      </elf-carousel-item>
      <elf-carousel-item name="build" label="Build">
        <div style="height:100%;display:grid;place-items:center;background:#7c3aed;color:#fff;font-size:28px">Build</div>
      </elf-carousel-item>
      <elf-carousel-item name="ship" label="Ship">
        <div style="height:100%;display:grid;place-items:center;background:#db2777;color:#fff;font-size:28px">Ship</div>
      </elf-carousel-item>
    </elf-carousel>
  </elf-playground>
`);

export { PageCarouselEx1 };
