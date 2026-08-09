import type { FileSystem, ToolkitConfig } from "./models.js";
import { parseJsonAsUnknown, validateToolkitConfig } from "./validation.js";

/** Reads, parses, and validates configuration before the workflow uses it. */
export async function loadToolkitConfig(path: string, fileSystem: FileSystem): Promise<ToolkitConfig> {
  const text = await fileSystem.readText(path, "configuration file");
  return validateToolkitConfig(parseJsonAsUnknown(text, "Configuration file"));
}
