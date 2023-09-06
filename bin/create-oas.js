#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'url';

import { createOas, writeFile } from '../index.js';

async function question(rl, query, defaultValue) {
  const answer = await rl.question(`${query} ${defaultValue ? `(${defaultValue}) ` : ''}`);
  return answer || defaultValue || question(rl, query, defaultValue);
}

async function ask({ input = process.stdin, output = process.stdout, cwd = process.cwd() }) {
  const rl = readline.createInterface({
    input,
    output,
  });

  let pkg = {};
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(cwd, '/package.json'), 'utf8'));
  } catch (e) {
    /* empty */
  }

  const title = await question(rl, 'Title of the API?', pkg.name);
  const version = await question(rl, 'Version number?', pkg.version);
  const license = await question(rl, 'License?', pkg.license);
  const url = await question(rl, 'Full base URL?');
  const out = await question(rl, 'Output location?', 'openapi.json');

  rl.close();
  return { title, version, license, url, out };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  ask({})
    .then(createOas)
    .then(writeFile)
    .then(() => {
      process.exit(0);
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error('Error generating oas file', e.message);
      process.exit(1);
    });
}

export default ask;
