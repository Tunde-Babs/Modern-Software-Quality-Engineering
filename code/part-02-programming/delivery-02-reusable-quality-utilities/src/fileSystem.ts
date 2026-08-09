import { readFile, writeFile } from "node:fs/promises";

export interface TextFileSystem {
  readUtf8(path: string): Promise<string>;
  writeUtf8(path: string, contents: string): Promise<void>;
}

export const nodeTextFileSystem: TextFileSystem = {
  async readUtf8(path: string): Promise<string> {
    return readFile(path, "utf8");
  },
  async writeUtf8(path: string, contents: string): Promise<void> {
    await writeFile(path, contents, "utf8");
  },
};
