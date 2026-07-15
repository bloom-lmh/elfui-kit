// Navigation components
import { registerComponents } from "elfui";

import { Anchor } from "./Anchor/index";
import { AnchorLink } from "./AnchorLink/index";
import { BackTop } from "./BackTop/index";
import { Breadcrumb } from "./Breadcrumb/index";
import { BreadcrumbItem } from "./BreadcrumbItem/index";
import { Dropdown } from "./Dropdown/index";
import { DropdownItem } from "./DropdownItem/index";
import { DropdownMenu } from "./DropdownMenu/index";
import { Menu } from "./Menu/index";
import { PageHeader } from "./PageHeader/index";
import { Step } from "./Step/index";
import { Steps } from "./Steps/index";
import { TabPane } from "./TabPane/index";
import { Tabs } from "./Tabs/index";

registerComponents(Anchor, AnchorLink, BackTop, Breadcrumb, BreadcrumbItem, Dropdown, DropdownMenu, DropdownItem, Menu, Steps, Step, Tabs, TabPane, PageHeader);

export type {
  AnchorChangeDetail,
  AnchorClickDetail,
  AnchorElement,
  AnchorFieldNames,
  AnchorItem,
  AnchorLinkProps,
  AnchorLinkSlots,
  AnchorProps,
  AnchorSlots
} from "./Anchor/types";
export type {
  BackTopElement,
  BackTopProps,
  BackTopShape
} from "./BackTop/types";
export type {
  BreadcrumbFieldNames,
  BreadcrumbItem,
  BreadcrumbItemProps,
  BreadcrumbItemSlots,
  BreadcrumbProps,
  BreadcrumbRouteLocation,
  BreadcrumbSlots
} from "./Breadcrumb/types";
export type {
  DropdownButtonProps,
  DropdownButtonType,
  DropdownCommandDetail,
  DropdownCommand,
  DropdownEffect,
  DropdownElement,
  DropdownEmits,
  DropdownExpose,
  DropdownFieldNames,
  DropdownItem,
  DropdownItemProps,
  DropdownItemSlots,
  DropdownMenuProps,
  DropdownMenuSlots,
  DropdownPlacement,
  DropdownProps,
  DropdownSize,
  DropdownSlots,
  DropdownTrigger,
  DropdownTriggerMode,
  DropdownVirtualRef
} from "./Dropdown/types";
export type {
  StepProps,
  StepSlots,
  StepItem,
  StepsChangeDetail,
  StepsDirection,
  StepsProps,
  StepsSize,
  StepStatus,
  StepsExpose,
  StepsSlots
} from "./Steps/types";
export type {
  TabPaneName,
  TabPaneProps,
  TabPaneSlots,
  TabsAlign,
  TabsBeforeLeave,
  TabsDensity,
  TabsDirection,
  TabsExpose,
  TabsFieldNames,
  TabsItem,
  TabsPaneContext,
  TabsPosition,
  TabsProps,
  TabsSlots,
  TabsTransition,
  TabsType
} from "./Tabs/types";
