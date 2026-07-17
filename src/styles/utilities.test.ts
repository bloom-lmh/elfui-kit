import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";
import { compileString } from "sass-embedded";

import { navItems, routes } from "../routes";

const utilitySource = readFileSync(resolve(process.cwd(), "src/styles/utilities.scss"), "utf8");
const utilityStyles = compileString(utilitySource).css;

describe("ElfUI utility classes", () => {
  it("publishes every documented utility family", () => {
    for (const className of [
      "border-primary", "rounded-pill", "visually-hidden", "cursor-pointer",
      "d-md-grid", "elevation-24", "justify-space-between", "float-right",
      "opacity-50", "overflow-x-auto", "position-sticky", "w-100", "ma-n2",
      "text-h4"
    ]) {
      expect(utilityStyles).toContain(`.${className}`);
    }
  });

  it("keeps the utilities menu and routes in sync", () => {
    const utilityNav = navItems.filter((item) => item.group === "Utilities 工具类");
    const routePaths = new Set(routes.map((route) => route.path));

    expect(utilityNav).toHaveLength(14);
    expect(utilityNav.every((item) => routePaths.has(item.to))).toBe(true);
  });
});
