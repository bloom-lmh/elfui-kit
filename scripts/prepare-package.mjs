import { copyFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const libraryTypesPath = resolve(root, "lib-dist/library.d.ts");

await copyFile(resolve(root, "src/elements.generated.d.ts"), resolve(root, "lib-dist/elements.generated.d.ts"));

const libraryTypes = await readFile(libraryTypesPath, "utf8");
const declarations = `/// <reference path="./elements.generated.d.ts" />\n${libraryTypes.replace('import "./styles/utilities.scss";\n', "")}`;

await writeFile(libraryTypesPath, declarations, "utf8");
