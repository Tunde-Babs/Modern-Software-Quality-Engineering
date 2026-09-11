import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

// Fail before installation if Pages selects an unverified toolchain.
assert.equal(process.versions.node, '24.20.0', 'WEB-5D requires tested Node 24.20.0');
const npm = execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim();
assert.equal(npm, '11.19.0', 'WEB-5D requires tested npm 11.19.0; revalidate a different version before deployment');
console.log(`Verified build toolchain: Node ${process.versions.node}, npm ${npm}`);
