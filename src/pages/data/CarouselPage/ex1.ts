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
`);

export { PageCarouselEx1 };
