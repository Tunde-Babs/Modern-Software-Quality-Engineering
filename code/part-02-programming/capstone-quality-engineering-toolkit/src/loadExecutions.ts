import type { ExecutionRecord, FileSystem } from "./models.js";
import { parseJsonAsUnknown, validateExecutionCollection } from "./validation.js";

/** Treats a fixture file as untrusted until every record is validated. */
export async function loadExecutions(path: string, fileSystem: FileSystem): Promise<readonly ExecutionRecord[]> {
  const text = await fileSystem.readText(path, "execution fixture");
  return validateExecutionCollection(parseJsonAsUnknown(text, "Execution fixture"));
}
