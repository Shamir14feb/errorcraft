import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const DIST_ARTIFACTS = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/index.d.cts',
] as const;

describe('package exports', () => {
  it('expects production build artifacts (not TypeScript source)', () => {
    for (const file of DIST_ARTIFACTS) {
      expect(existsSync(path.join(packageRoot, file))).toBe(true);
    }

    const pkg = JSON.parse(
      readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
    ) as {
      main: string;
      module: string;
      types: string;
      exports: { '.': { import: { default: string }; require: { default: string } } };
    };

    expect(existsSync(path.join(packageRoot, pkg.main))).toBe(true);
    expect(existsSync(path.join(packageRoot, pkg.module))).toBe(true);
    expect(existsSync(path.join(packageRoot, pkg.types))).toBe(true);
    expect(existsSync(path.join(packageRoot, pkg.exports['.'].import.default))).toBe(
      true,
    );
    expect(existsSync(path.join(packageRoot, pkg.exports['.'].require.default))).toBe(
      true,
    );
  });

  it('supports ESM import from built distribution', async () => {
    const distUrl = new URL('../dist/index.js', import.meta.url).href;
    const mod = await import(distUrl);
    const error = new mod.NotFoundError('Missing');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });

  it('exports tryCatch helpers from built distribution', async () => {
    const distUrl = new URL('../dist/index.js', import.meta.url).href;
    const mod = await import(distUrl);
    expect(typeof mod.tryCatch).toBe('function');
    expect(typeof mod.tryCatchSync).toBe('function');

    const syncResult = mod.tryCatchSync(() => 1);
    expect(syncResult.ok).toBe(true);

    const asyncResult = await mod.tryCatch(async () => 'ok');
    expect(asyncResult.ok).toBe(true);
    if (asyncResult.ok) {
      expect(asyncResult.value).toBe('ok');
    }
  });

  it('supports CommonJS require from built distribution', () => {
    const require = createRequire(import.meta.url);
    const mod = require(path.join(packageRoot, 'dist/index.cjs'));
    const error = new mod.NotFoundError('Missing');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });

  it('loads in a real CommonJS consumer context', () => {
    const cjsEntry = path.join(packageRoot, 'dist/index.cjs');
    const script = [
      `const { NotFoundError, serializeError } = require(${JSON.stringify(cjsEntry)});`,
      `const err = new NotFoundError('User not found');`,
      `if (err.statusCode !== 404) process.exit(1);`,
      `if (serializeError(err).code !== 'NOT_FOUND') process.exit(2);`,
      `console.log('ok');`,
    ].join('');
    const output = execSync(`node -e ${JSON.stringify(script)}`, {
      cwd: packageRoot,
    });
    expect(output.toString().trim()).toBe('ok');
  });
});
