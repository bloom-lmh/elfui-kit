/** @internal Documentation-site infrastructure; not part of the ElfUI public component API. */
export interface PlaygroundProps {
  title: string;
  code: string;
  script: string;
  controlsCollapsible: boolean;
  controlsCollapsed: boolean;
}

export type PlaygroundEmits = {
  copy: [code: string];
  copyError: [error: unknown];
  controlsToggle: [collapsed: boolean];
};

export interface PlaygroundSlots {
  default?: unknown;
  status?: unknown;
  controls?: unknown;
}

export interface PlaygroundExpose {
  showTemplate: () => void;
  showScript: () => void;
  copy: () => Promise<boolean>;
  toggleControls: () => void;
}

export type PlaygroundElement = HTMLElement & PlaygroundProps & PlaygroundExpose;
