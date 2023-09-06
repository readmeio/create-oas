import { readFileSync } from 'fs';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { PassThrough } from 'node:stream';
import test from 'node:test';

import ask from '../../bin/create-oas.js';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

function getNextQuestion(output) {
  return new Promise(resolve => {
    output.once('data', data => {
      resolve(data.toString().trim());
    });
  });
}

test('command line program accepts user input', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const promise = ask({ input, output, cwd: await mkdtemp(tmpdir()) });

  assert.strictEqual(await getNextQuestion(output), 'Title of the API?');
  input.write('name\n');

  assert.strictEqual(await getNextQuestion(output), 'Version number?');
  input.write('1.0.0\n');

  assert.strictEqual(await getNextQuestion(output), 'License?');
  input.write('MIT\n');

  assert.strictEqual(await getNextQuestion(output), 'Full base URL?');
  input.write('https://example.com\n');

  assert.strictEqual(await getNextQuestion(output), 'Output location? (openapi.json)');
  input.write('openapi.json\n');

  assert.deepEqual(await promise, {
    title: 'name',
    version: '1.0.0',
    license: 'MIT',
    url: 'https://example.com',
    out: 'openapi.json',
  });
});

test('should fetch defaults appropriately', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const promise = ask({ input, output });
  assert.strictEqual(await getNextQuestion(output), 'Title of the API? (create-oas)');
  input.write('\n');
  assert.strictEqual(await getNextQuestion(output), `Version number? (${pkg.version})`);
  input.write('\n');
  assert.strictEqual(await getNextQuestion(output), 'License? (MIT)');
  input.write('\n');
  assert.strictEqual(await getNextQuestion(output), 'Full base URL?');
  input.write('https://example.com\n');
  assert.strictEqual(await getNextQuestion(output), 'Output location? (openapi.json)');
  input.write('\n');

  assert.deepEqual(await promise, {
    title: 'create-oas',
    version: pkg.version,
    license: 'MIT',
    url: 'https://example.com',
    out: 'openapi.json',
  });
});

test('should re-ask the same question if no answer or default given', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const promise = ask({ input, output });

  let question = '';

  while (question !== 'Full base URL?') {
    // eslint-disable-next-line no-await-in-loop
    question = await getNextQuestion(output);
    input.write('\n');
  }

  input.write('\n');
  assert.strictEqual(await getNextQuestion(output), 'Full base URL?');
  input.write('https://example.com\n');

  await getNextQuestion(output);

  input.write('\n');

  assert.strictEqual((await promise).url, 'https://example.com');
});
