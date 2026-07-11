// Navigation components
import { registerComponents } from "elfui";

import { Anchor } from "./Anchor/index";
import { BackTop } from "./BackTop/index";
import { Breadcrumb } from "./Breadcrumb/index";
import { Dropdown } from "./Dropdown/index";
import { Menu } from "./Menu/index";
import { PageHeader } from "./PageHeader/index";
import { Steps } from "./Steps/index";
import { Tabs } from "./Tabs/index";

registerComponents(Anchor, BackTop, Breadcrumb, Dropdown, Menu, Steps, Tabs, PageHeader);

export type {
  AnchorChangeDetail,
  AnchorClickDetail,
  AnchorElement,
  AnchorFieldNames,
  AnchorItem,
  AnchorProps
} from "./Anchor/types";
export type {
  BackTopClickDetail,
  BackTopElement,
  BackTopProps,
  BackTopShape
} from "./BackTop/types";
export type {
  DropdownCommandDetail,
  DropdownFieldNames,
  DropdownItem,
  DropdownPlacement,
  DropdownProps,
  DropdownSize,
  DropdownTrigger
} from "./Dropdown/types";
export type {
  StepItem,
  StepsChangeDetail,
  StepsDirection,
  StepsProps,
  StepsSize,
  StepStatus
} from "./Steps/types";
