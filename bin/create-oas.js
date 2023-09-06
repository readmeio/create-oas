/* eslint-disable import/no-unresolved */
// import fs from 'node:fs';
// import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'url';

async function ask({ input = process.stdin, output = process.stdout }) {
  const rl = readline.createInterface({
    input,
    output,
  });

  // let pkg;
  // if (fs.existsSync('./package.json')) {
  //   // eslint-disable-next-line import/no-dynamic-require, global-require
  //   pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), '/package.json'), 'utf8'));
  //   // console.log(pkg);
  // }

  // console.log({ pkg });

  const title = await rl.question('Title of the API? ');

  const version = await rl.question('Version number? ');

  const license = await rl.question('License? ');

  const url = await rl.question('Full base URL? ');

  const out = await rl.question('Output location? ');

  return { title, version, license, url, out };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  ask({});
}

export default ask;
