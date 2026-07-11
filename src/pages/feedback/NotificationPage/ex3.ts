import { defineHtml, html } from "elfui";
import { ElfNotification } from "../../../components/Feedback";

const showLong = () => {
  ElfNotification({
    title: "长展示通知",
    message: "这条通知将保留在界面上 10 秒才会自动关闭。",
    duration: 10000
  });
};

const showPermanent = () => {
  ElfNotification({
    title: "永久保留通知",
    message: "此通知被设置为 duration: 0，它绝不会自动关闭，除非你手动点击右上角的关闭按钮。",
    duration: 0
  });
};

const handleCloseAll = () => {
  ElfNotification.closeAll();
};

const code3 = `ElfNotification({ title: "...", message: "...", duration: 10000 })
ElfNotification({ title: "...", message: "...", duration: 0 })
ElfNotification.closeAll()`;

const PageNotificationEx3 = defineHtml(html`
  <h2>时长控制与清除</h2>
  <elf-playground title="duration / closeAll" :code="code3">
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <elf-button @click="showLong">展示 10 秒</elf-button>
      <elf-button @click="showPermanent">永久保留</elf-button>
      <elf-button color="danger" @click="handleCloseAll">一键清除所有通知</elf-button>
    </div>
  </elf-playground>
`);

export { PageNotificationEx3 };
