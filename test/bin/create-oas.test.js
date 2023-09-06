import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import test from 'node:test';

import bin from '../../bin/create-oas.js';

function getNextQuestion(output) {
  return new Promise(resolve => {
    output.once('data', data => {
      resolve(data.toString());
    });
  });
}

test('command line program accepts user input', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const promise = bin({ input, output });

  assert.equal(await getNextQuestion(output), 'Title of the API? ');
  input.write('name\n');

  assert.equal(await getNextQuestion(output), 'Version number? ');
  input.write('1.0.0\n');

  assert.equal(await getNextQuestion(output), 'License? ');
  input.write('MIT\n');

  assert.equal(await getNextQuestion(output), 'Full base URL? ');
  input.write('https://example.com\n');

  assert.equal(await getNextQuestion(output), 'Output location? ');
  input.write('openapi.json\n');

  assert.deepEqual(await promise, {
    title: 'name',
    version: '1.0.0',
    license: 'MIT',
    url: 'https://example.com',
    out: 'openapi.json',
  });
});
