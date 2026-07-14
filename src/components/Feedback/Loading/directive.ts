import { directive, type DirectiveDefinition } from "@elfui/runtime";

import { ElfLoading } from "./service";
import type { LoadingDirectiveValue, LoadingInstance, LoadingOptions } from "./types";

const instances = new WeakMap<HTMLElement, LoadingInstance>();

const normalizeValue = (value: LoadingDirectiveValue): { active: boolean; options: LoadingOptions } => {
  if (typeof value === "boolean") return { active: value, options: {} };
  const { loading = true, ...options } = value ?? {};
  return { active: Boolean(loading), options };
};

const closeInstance = (el: HTMLElement): void => {
  instances.get(el)?.close();
  instances.delete(el);
};

const updateInstance = (el: HTMLElement, value: LoadingDirectiveValue): void => {
  const { active, options } = normalizeValue(value);
  closeInstance(el);
  if (!active) return;
  instances.set(
    el,
    ElfLoading({
      ...options,
      target: el,
      fullscreen: false
    })
  );
};

export const loadingDirective: DirectiveDefinition<LoadingDirectiveValue, HTMLElement> = {
  mounted: (el, binding) => updateInstance(el, binding.value),
  updated: (el, binding) => updateInstance(el, binding.value),
  beforeUnmount: closeInstance
};

let registered = false;

export const registerLoadingDirective = (): void => {
  if (registered) return;
  directive("loading", loadingDirective);
  registered = true;
};
