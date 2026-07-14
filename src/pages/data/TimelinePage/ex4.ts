import { defineHtml, html } from "elfui";

const items = [
  {
    timestamp: "2024-06-01 09:00",
    title: "需求评审完成",
    content: `<div style="background:var(--elf-bg-overlay);padding:12px 16px;border-radius:8px;border-left:3px solid var(--elf-primary)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <elf-avatar size="sm" alt="李"></elf-avatar>
          <strong>李经理</strong> <elf-tag size="sm" color="primary">通过</elf-tag>
        </div>
        <p style="margin:0;font-size:13px;color:var(--elf-text-secondary)">PRD 无重大问题，可进入 UI 设计阶段</p>
      </div>`,
    color: "primary",
    icon: "✓"
  },
  {
    timestamp: "2024-06-15 14:30",
    title: "设计稿提交",
    content: `<div style="background:var(--elf-bg-overlay);padding:12px 16px;border-radius:8px;border-left:3px solid var(--elf-info)">
        <strong>Figma 链接</strong>
        <p style="margin:4px 0;font-size:13px;color:var(--elf-text-secondary)">移动端 24 页 + PC 端 18 页，含交互原型</p>
        <elf-button variant="text" size="sm">查看设计稿 →</elf-button>
      </div>`,
    color: "info",
    icon: "🎨"
  },
  {
    timestamp: "2024-07-01 10:00",
    title: "Sprint 1 开发完成",
    content: `<div style="background:var(--elf-bg-overlay);padding:12px 16px;border-radius:8px;border-left:3px solid var(--elf-success)">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>完成 <strong>12</strong> / 12 任务</span>
          <elf-tag size="sm" color="success">100%</elf-tag>
        </div>
        <div style="height:4px;background:var(--elf-border);border-radius:2px;margin-top:8px">
          <div style="width:100%;height:100%;background:var(--elf-success);border-radius:2px"></div>
        </div>
      </div>`,
    color: "success",
    icon: "💻"
  },
  {
    timestamp: "2024-07-15 16:00",
    title: "提测并部署 staging",
    content: `<div style="background:var(--elf-bg-overlay);padding:12px 16px;border-radius:8px;border-left:3px solid var(--elf-warning)">
        <p style="margin:0;font-size:13px;color:var(--elf-text-secondary)">已部署到 staging 环境，测试团队开始回归</p>
        <div style="margin-top:8px;display:flex;gap:8px">
          <elf-button size="sm" variant="outlined">查看构建日志</elf-button>
          <elf-button size="sm" color="primary">访问 Staging</elf-button>
        </div>
      </div>`,
    color: "warning",
    icon: "🚀"
  }
];

const code = `<elf-timeline :items.prop=\${items} mode="left" />
<!-- 每个 item.content 支持 HTML，可嵌入卡片、头像、按钮等组件 -->`;

const script = `const items = [
  {
    timestamp: "2024-06-01 09:00",
    title: "需求评审完成",
    content: '<div class="event-card">PRD 已通过，可进入 UI 设计阶段</div>',
    color: "primary",
    icon: "✓"
  }
];`;

const PageTimelineEx4 = defineHtml(html`
  <h2>自定义卡片内容（v-html）</h2>
  <elf-playground title="item.content 中嵌入 HTML，实现卡片风格" :code=${code} :script=${script}>
    <elf-timeline :items.prop=${items}></elf-timeline>
  </elf-playground>
`);

export { PageTimelineEx4 };
