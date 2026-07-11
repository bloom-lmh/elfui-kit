import { defineHtml, html, useComponents } from "elfui";
import { useRef } from "elfui";
import { PageLocaleProviderPreview } from "./preview";
const localeMode = useRef("zh");
const zhMessages = {
  common: { confirm: "确认", cancel: "取消" },
  provider: { title: "本地化提供器预览" }
};
const enMessages = {
  common: { confirm: "Confirm", cancel: "Cancel" },
  provider: { title: "Locale provider preview" }
};
const arMessages = {
  common: { confirm: "تأكيد", cancel: "إلغاء" },
  provider: { title: "معاينة موفر اللغة" }
};
const code = `<elf-locale-provider name="en-US" :messages.prop="messages">
  <my-child></my-child>
</elf-locale-provider>`;
const propsRows = [
  { name: "name", type: "string", default: "zh-CN", desc: "语言名称，同时反射为 lang" },
  { name: "dir", type: "ltr | rtl", default: "ltr", desc: "文本方向" },
  { name: "rtl", type: "boolean", default: "false", desc: "快捷切换为 rtl" },
  { name: "messages", type: "object", default: "{}", desc: "本地化文案，会与默认文案合并" }
];
const currentLocaleName = (): string =>
  localeMode.value === "zh" ? "zh-CN" : localeMode.value === "ar" ? "ar" : "en-US";
const currentMessages = () =>
  localeMode.value === "zh" ? zhMessages : localeMode.value === "ar" ? arMessages : enMessages;
const isRtl = (): boolean => localeMode.value === "ar";
const setLocale = (value: string): void => {
  localeMode.set(value);
};
useComponents({ "page-locale-provider-preview": PageLocaleProviderPreview });

const PageLocaleProvider = defineHtml(html`
  <elf-container>
    <h1>LocaleProvider 本地化提供器</h1>
    <p>通过 provide/inject 为子树提供语言名称、方向和翻译函数，适合组件库级文案统一。</p>

    <elf-playground title="切换语言与 RTL" :code="code">
      <div style="display:grid;gap:12px;width:100%;max-width:680px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <elf-button
            size="sm"
            :variant="localeMode === 'zh' ? 'contained' : 'outlined'"
            @click="setLocale('zh')"
            >中文</elf-button
          >
          <elf-button
            size="sm"
            :variant="localeMode === 'en' ? 'contained' : 'outlined'"
            @click="setLocale('en')"
            >English</elf-button
          >
          <elf-button
            size="sm"
            :variant="localeMode === 'ar' ? 'contained' : 'outlined'"
            @click="setLocale('ar')"
            >RTL</elf-button
          >
        </div>
        <div style="direction:ltr">
          <elf-locale-provider
            :name="currentLocaleName()"
            :rtl="isRtl()"
            :messages.prop="currentMessages()"
          >
            <page-locale-provider-preview></page-locale-provider-preview>
          </elf-locale-provider>
        </div>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="LocaleProvider Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageLocaleProvider };
