import { writeFile as writeFilePromise } from 'node:fs/promises';
import { extname } from 'node:path';

import yaml from 'js-yaml';

function createOas({ title, version, url, license, out }) {
  const oas = {
    openapi: '3.1.0',
    info: {
      title,
      version,
    },
    servers: [
      {
        url,
      },
    ],
    paths: {},
  };

  if (license) {
    oas.info.license = { name: license };
  }

  return { out, oas };
}

function writeFile({ out, oas }) {
  const data = JSON.stringify(oas, null, 2);
  const extension = extname(out);
  if (extension === '.yaml' || extension === '.yml') {
    return writeFilePromise(out, yaml.dump(oas));
  }
  return writeFilePromise(out, data);
}

export { createOas, writeFile };
