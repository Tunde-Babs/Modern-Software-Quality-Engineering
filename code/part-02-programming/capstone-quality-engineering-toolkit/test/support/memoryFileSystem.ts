import { ToolkitError } from "../../src/errors.js";
import type { FileSystem } from "../../src/models.js";

/** A small fake filesystem used to control workflow input and output in tests. */
export class MemoryFileSystem implements FileSystem {
  private readonly entries: Map<string, string>;
  private readonly failWrites: boolean;

  constructor(entries: Readonly<Record<string, string>>, options: { readonly failWrites?: boolean } = {}) {
    this.entries = new Map(Object.entries(entries));
    this.failWrites = options.failWrites ?? false;
  }

  async readText(path: string, purpose: string): Promise<string> {
    const value = this.entries.get(path);
    if (value === undefined) {
      throw new ToolkitError("dependency-failure", `Unable to read the ${purpose}.`, {
        operation: "read-file",
        expected: purpose,
      });
    }

    return value;
  }

  async writeText(path: string, content: string, purpose: string): Promise<void> {
    if (this.failWrites) {
      throw new ToolkitError("dependency-failure", `Unable to write the ${purpose}.`, {
        operation: "write-file",
        expected: purpose,
      });
    }

    this.entries.set(path, content);
  }

  writtenText(path: string): string | undefined {
    return this.entries.get(path);
  }
}
