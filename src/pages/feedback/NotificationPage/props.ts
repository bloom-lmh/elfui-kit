import { defineHtml, html } from "elfui";

const apiRows = [
  {
    name: "ElfNotification(options | string)",
    type: "Function",
    desc: "主调命令函数，触发默认通知"
  },
  {
    name: "ElfNotification.info(options | string)",
    type: "Function",
    desc: "触发信息样式通知"
  },
  {
    name: "ElfNotification.success(options | string)",
    type: "Function",
    desc: "触发成功样式通知"
  },
  {
    name: "ElfNotification.warning(options | string)",
    type: "Function",
    desc: "触发警告样式通知"
  },
  {
    name: "ElfNotification.error(options | string)",
    type: "Function",
    desc: "触发错误样式通知"
  },
  {
    name: "ElfNotification.closeAll()",
    type: "Function",
    desc: "手动一键关闭当前屏幕上的所有活跃通知"
  }
];

const optsRows = [
  { name: "title", type: "string", default: "''", desc: "通知标题" },
  { name: "message", type: "string", default: "必填", desc: "通知的主体内容" },
  {
    name: "type",
    type: "info | success | warning | error",
    default: "''",
    desc: "通知类型样式"
  },
  {
    name: "position",
    type: "top-right | top-left | bottom-right | bottom-left",
    default: "top-right",
    desc: "通知弹出的四个角落"
  },
  {
    name: "duration",
    type: "number",
    default: "4500",
    desc: "显示时间（毫秒），0 则不自动关闭"
  },
  { name: "closable", type: "boolean", default: "true", desc: "是否显示关闭按钮" },
  { name: "offset", type: "number", default: "16", desc: "距离屏幕顶部/底部的垂直初始距离" }
];

const PageNotificationProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="函数 API" :rows="apiRows"></elf-props-table
  ><elf-props-table title="NotificationOptions" :rows="optsRows"></elf-props-table>
`);

export { PageNotificationProps };
