import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test, { describe } from 'node:test';

import createOas, { writeFile } from '../index.js';

test('should create an oas file', () => {
  assert.deepEqual(
    createOas({
      title: 'Widgets API',
      version: '1.0.0',
      url: 'https://example.com',
      output: 'openapi.json',
    }),
    {
      openapi: '3.1.0',
      info: {
        version: '1.0.0',
        title: 'Widgets API',
      },
      servers: [
        {
          url: 'https://example.com',
        },
      ],
      paths: {},
    },
  );
});

test('should add version information if provided', () => {
  assert.deepEqual(
    createOas({
      license: 'MIT',
    }),
    {
      openapi: '3.1.0',
      info: {
        version: undefined,
        title: undefined,
        license: {
          name: 'MIT',
        },
      },
      servers: [
        {
          url: undefined,
        },
      ],
      paths: {},
    },
  );
});

describe('writeFile()', () => {
  test('should output the file to json if file extension is .json', async () => {
    const oas = createOas({
      title: 'Widgets API',
      version: '1.0.0',
      url: 'https://example.com',
      output: 'openapi.json',
    });
    const out = join(await mkdtemp(tmpdir()), 'openapi.json');
    await writeFile(out, oas);
    assert.deepEqual(await readFile(out, 'utf-8'), JSON.stringify(oas, null, 2));
  });

  test.todo('should output the file to yaml if file extension is .yaml/.yml', async () => {
    const oas = createOas({
      title: 'Widgets API',
      version: '1.0.0',
      url: 'https://example.com',
      output: 'openapi.json',
    });

    {
      const out = join(await mkdtemp(tmpdir()), 'openapi.yaml');
      await writeFile(out, oas);
      assert.deepEqual(await readFile(out, 'utf-8'), JSON.stringify(oas, null, 2));
    }

    {
      const out = join(await mkdtemp(tmpdir()), 'openapi.yml');
      await writeFile(out, oas);
      assert.deepEqual(await readFile(out, 'utf-8'), JSON.stringify(oas, null, 2));
    }
  });
});
