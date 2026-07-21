import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import type { LocaleMessages } from "../../components/Providers/context";
import { PageHome } from "./index";

const MESSAGES: LocaleMessages = {
  home: {
    eyebrow: "English eyebrow",
    titleLead: "English title",
    titleAccent: "English accent",
    description: "English description",
    primaryAction: "Explore components",
    secondaryAction: "View Providers",
    proofLabel: "Project metrics",
    proofComponents: "components",
    proofTests: "tests",
    proofRuntime: "dependencies",
    visualLabel: "Dashboard preview",
    live: "Live",
    visualEyebrow: "Workspace",
    visualTitle: "Overview",
    metricRevenue: "Revenue",
    metricUsers: "Users",
    metricActivity: "Activity",
    metricWeek: "Week",
    visualReady: "Ready",
    principlesEyebrow: "Principles",
    principlesTitle: "Three principles",
    principlesDescription: "Principles description",
    principleOneTitle: "Native",
    principleOneDescription: "Native description",
    principleTwoTitle: "Centralized",
    principleTwoDescription: "Centralized description",
    principleThreeTitle: "Verified",
    principleThreeDescription: "Verified description",
    starterEyebrow: "Start",
    starterTitle: "Choose a path",
    starterDescription: "Starter description",
    starterForm: "Form flow",
    starterData: "Data workspace",
    starterLayout: "Responsive layout",
    codeTitle: "Provider setup",
    codeComment: "Configure once"
  }
};

beforeAll(async () => {
  await import("../../components");
  registerComponents(PageHome);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const homeTag = (): string =>
  String((PageHome as typeof PageHome & { __elfDefinition?: { tag?: string } }).__elfDefinition?.tag);

describe("HomePage localization", () => {
  it("renders page content from LocaleProvider messages", async () => {
    const provider = document.createElement("elf-locale-provider") as HTMLElement & {
      name?: string;
      messages?: LocaleMessages;
    };
    provider.name = "en-US";
    provider.messages = MESSAGES;
    provider.innerHTML = `<${homeTag()}></${homeTag()}>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const page = provider.querySelector(homeTag());
    expect(page?.shadowRoot?.textContent).toContain("English title");
    expect(page?.shadowRoot?.textContent).toContain("Explore components");
    expect(page?.shadowRoot?.textContent).not.toContain("home.titleLead");
  });

  it("publishes keyboard-focusable primary navigation", async () => {
    const provider = document.createElement("elf-locale-provider") as HTMLElement & {
      messages?: LocaleMessages;
    };
    provider.messages = MESSAGES;
    provider.innerHTML = `<${homeTag()}></${homeTag()}>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const page = provider.querySelector(homeTag());
    const links = page?.shadowRoot?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [];
    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute("href")).toBe("#/basic/button");
    expect(page?.shadowRoot?.querySelector(".principles, .starter")).toBeNull();
  });
});
