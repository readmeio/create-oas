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

test.todo('should add version information if provided');
