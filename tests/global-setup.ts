import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST_ARTIFACTS = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/index.d.cts',
] as const;

export function setup() {
  const root = process.cwd();
  const missing = DIST_ARTIFACTS.some((file) => !existsSync(path.join(root, file)));

  if (missing) {
    execSync('npm run build', { stdio: 'inherit', cwd: root });
  }
}
