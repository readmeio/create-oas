/* eslint-disable import/no-unresolved */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'url';

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
  ask({}).then(console.log);
}

export default ask;
