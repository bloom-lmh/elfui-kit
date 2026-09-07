import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const packageManifest = JSON.parse(
  readFileSync(resolve(repositoryRoot, "packages/kit/package.json"), "utf8"),
);
const changelog = readFileSync(resolve(repositoryRoot, "CHANGELOG.md"), "utf8");
const version = String(packageManifest.version ?? "");
const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
const versionHeading = new RegExp(`^## \\[${escapedVersion}\\] - \\d{4}-\\d{2}-\\d{2}$`, "mu");

if (!versionHeading.test(changelog)) {
  console.error(`CHANGELOG.md is missing a dated entry for @elfui/kit@${version}.`);
  process.exit(1);
}

console.log(`CHANGELOG.md contains the release entry for @elfui/kit@${version}.`);
