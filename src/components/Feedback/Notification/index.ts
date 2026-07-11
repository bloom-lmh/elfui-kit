// elf-notification - 通知组件
//
// 命令式 API：
//   ElfNotification("通知内容")
//   ElfNotification.success("操作成功")
//   ElfNotification({ title: "成功", message: "订单创建成功", type: "success" })

import { registerComponents } from "elfui";

import { Notification as NotificationElement } from "./component";

import type {
  NotificationHandle,
  NotificationOptions,
  NotificationPosition,
  NotificationType
} from "./types";

export type {
  NotificationHandle,
  NotificationOptions,
  NotificationPosition,
  NotificationType
} from "./types";

registerComponents(NotificationElement);

const STACK_GAP = 16;

const activeStacks: Record<NotificationPosition, HTMLElement[]> = {
  "top-right": [],
  "top-left": [],
  "bottom-right": [],
  "bottom-left": []
};

const restack = (position: NotificationPosition): void => {
  const stack = activeStacks[position];
  let offset = 16;
  for (const el of stack) {
    el.style.setProperty("--_offset", `${offset}px`);
    const height = el.getBoundingClientRect().height || 80;
    offset += height + STACK_GAP;
  }
};

const removeFromStack = (el: HTMLElement, position: NotificationPosition): void => {
  const stack = activeStacks[position];
  const index = stack.indexOf(el);
  if (index >= 0) {
    stack.splice(index, 1);
  }
  restack(position);
};

interface NotificationEl extends HTMLElement {
  titleText?: string;
  message?: string;
  type?: NotificationType;
  position?: NotificationPosition;
  closable?: boolean;
  close?: () => void;
}

const createNotification = (
  options: NotificationOptions | string,
  type?: NotificationType
): NotificationHandle => {
  const opts: NotificationOptions =
    typeof options === "string" ? { message: options } : { ...options };
  if (type) opts.type = type;

  const position: NotificationPosition = opts.position ?? "top-right";
  const duration = opts.duration ?? 4500;
  const baseOffset = opts.offset ?? 16;

  const el = document.createElement("elf-notification") as NotificationEl;
  el.message = opts.message;
  if (opts.title) {
    el.titleText = opts.title;
    el.setAttribute("title-text", opts.title);
  }
  if (opts.type) {
    el.type = opts.type;
    el.setAttribute("type", opts.type);
  }
  el.position = position;
  el.setAttribute("position", position);
  if (opts.closable === false) {
    el.closable = false;
    el.setAttribute("closable", "false");
  }

  let timer: ReturnType<typeof setTimeout> | null = null;
  let removed = false;

  const remove = (): void => {
    if (removed) return;
    removed = true;

    if (typeof el.close === "function") {
      el.close();
    } else {
      el.setAttribute("data-closing", "");
    }

    if (timer) clearTimeout(timer);
    removeFromStack(el, position);

    setTimeout(() => {
      el.parentNode?.removeChild(el);
    }, 220);
  };

  el.addEventListener("close", remove);

  if (opts.onClick) {
    el.addEventListener("click", opts.onClick);
  }

  document.body.appendChild(el);
  el.style.setProperty("--_offset", `${baseOffset}px`);
  activeStacks[position].push(el);
  queueMicrotask(() => restack(position));

  if (duration > 0) {
    timer = setTimeout(remove, duration);
  }

  return { close: remove };
};

interface NotificationApi {
  (options: NotificationOptions | string): NotificationHandle;
  info(options: NotificationOptions | string): NotificationHandle;
  success(options: NotificationOptions | string): NotificationHandle;
  warning(options: NotificationOptions | string): NotificationHandle;
  error(options: NotificationOptions | string): NotificationHandle;
  closeAll(): void;
}

const fn = ((options: NotificationOptions | string): NotificationHandle =>
  createNotification(options)) as NotificationApi;

fn.info = (options) => createNotification(options, "info");
fn.success = (options) => createNotification(options, "success");
fn.warning = (options) => createNotification(options, "warning");
fn.error = (options) => createNotification(options, "error");

fn.closeAll = () => {
  const positions: NotificationPosition[] = [
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left"
  ];
  for (const position of positions) {
    for (const el of [...activeStacks[position]]) {
      el.dispatchEvent(new CustomEvent("close"));
    }
  }
};

export const ElfNotification: NotificationApi = fn;
