import { defineHtml, html, useComponents } from "elfui";
import { PageAvatarEx1 } from "./ex1";
import { PageAvatarEx2 } from "./ex2";
import { PageAvatarEx3 } from "./ex3";
import { PageAvatarProps } from "./props";

useComponents({
  "page-avatar-ex1": PageAvatarEx1,
  "page-avatar-ex2": PageAvatarEx2,
  "page-avatar-ex3": PageAvatarEx3,
  "page-avatar-props": PageAvatarProps
});

const PageAvatar = defineHtml(html`
  <elf-container
    ><h1>Avatar 头像</h1>
    <p>Material Design 风格头像。支持图片、文字首字母、图标三种模式。</p>
    <page-avatar-ex1 /><page-avatar-ex2 /><page-avatar-ex3 /><page-avatar-props
  /></elf-container>
`);

export { PageAvatar };
