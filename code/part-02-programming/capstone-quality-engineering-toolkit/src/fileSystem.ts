import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { ToolkitError } from "./errors.js";
import type { FileSystem } from "./models.js";

/** Node adapter for the explicit file boundary used by the reference runner. */
export const nodeFileSystem: FileSystem = {
  async readText(path: string, purpose: string): Promise<string> {
    try {
      return await readFile(path, "utf8");
    } catch (error: unknown) {
      throw new ToolkitError(
        "dependency-failure",
        `Unable to read the ${purpose}.`,
        { operation: "read-file", expected: purpose },
        error,
      );
    }
  },

  async writeText(path: string, content: string, purpose: string): Promise<void> {
    try {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, "utf8");
    } catch (error: unknown) {
      throw new ToolkitError(
        "dependency-failure",
        `Unable to write the ${purpose}.`,
        { operation: "write-file", expected: purpose },
        error,
      );
    }
  },
};
