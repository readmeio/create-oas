import assert from 'node:assert/strict';
import test from 'node:test';

import createOas from '../index.js';

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
