import { defineHtml, html } from "elfui";

const groupCode = `<elf-avatar-group collapse-avatars max-collapse-avatars="3">
  <elf-avatar alt="Ada Lovelace"></elf-avatar>
  <elf-avatar alt="Grace Hopper"></elf-avatar>
  <elf-avatar alt="Linus Torvalds"></elf-avatar>
  <elf-avatar alt="Margaret Hamilton"></elf-avatar>
  <elf-avatar alt="Alan Turing"></elf-avatar>
</elf-avatar-group>`;

const tooltipCode = `<elf-avatar-group
  size="sm"
  shape="square"
  collapse-avatars
  collapse-avatars-tooltip
  max-collapse-avatars="2"
  placement="bottom"
  effect="dark"
>
  <elf-avatar alt="Ada"></elf-avatar>
  <elf-avatar alt="Grace"></elf-avatar>
  <elf-avatar alt="Linus"></elf-avatar>
  <elf-avatar alt="Margaret"></elf-avatar>
</elf-avatar-group>`;

const PageAvatarEx3 = defineHtml(html`
  <h2>Avatar Group</h2>
  <elf-playground title="collapse avatars" :code=${groupCode}>
    <elf-avatar-group collapse-avatars max-collapse-avatars="3">
      <elf-avatar alt="Ada Lovelace"></elf-avatar>
      <elf-avatar alt="Grace Hopper"></elf-avatar>
      <elf-avatar alt="Linus Torvalds"></elf-avatar>
      <elf-avatar alt="Margaret Hamilton"></elf-avatar>
      <elf-avatar alt="Alan Turing"></elf-avatar>
    </elf-avatar-group>
  </elf-playground>
  <elf-playground title="tooltip, size and shape inheritance" :code=${tooltipCode}>
    <elf-avatar-group
      size="sm"
      shape="square"
      collapse-avatars
      collapse-avatars-tooltip
      max-collapse-avatars="2"
      placement="bottom"
      effect="dark"
    >
      <elf-avatar alt="Ada"></elf-avatar>
      <elf-avatar alt="Grace"></elf-avatar>
      <elf-avatar alt="Linus"></elf-avatar>
      <elf-avatar alt="Margaret"></elf-avatar>
    </elf-avatar-group>
  </elf-playground>
`);

export { PageAvatarEx3 };
