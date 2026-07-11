// 反馈类组件
import { registerComponents } from "elfui";

import { Alert } from "./Alert/index";
import { Dialog } from "./Dialog/index";
import { Drawer } from "./Drawer/index";
import { Loading } from "./Loading/index";
import { PopConfirm } from "./PopConfirm/index";
import { Tooltip } from "./Tooltip/index";
import { Tour } from "./Tour/index";

registerComponents(Alert, Dialog, Drawer, Loading, PopConfirm, Tooltip, Tour);

export { ElfMessage } from "./Message/index";
export { ElfNotification } from "./Notification/index";

export type { AlertProps, AlertType, AlertVariant } from "./Alert/types";
export type { DialogProps, DialogSize } from "./Dialog/types";
export type { LoadingProps } from "./Loading/types";
export type { MessageHandle, MessageOptions, MessagePosition, MessageType } from "./Message/types";
export type {
  NotificationHandle,
  NotificationOptions,
  NotificationPosition,
  NotificationType
} from "./Notification/types";
export type { DrawerDirection, DrawerProps } from "./Drawer/types";
export type { PopConfirmPlacement, PopConfirmProps, PopConfirmTrigger } from "./PopConfirm/types";
export type { TourPlacement, TourProps, TourStep } from "./Tour/types";
export type {
  TooltipPlacement,
  TooltipEffect,
  TooltipTrigger,
  TooltipProps
} from "./Tooltip/types";
