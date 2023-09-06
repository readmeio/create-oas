import { writeFile as writeFilePromise } from 'node:fs/promises';

function createOas({ title, version, url, license }) {
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

  return oas;
}

function writeFile(out, oas) {
  const data = JSON.stringify(oas, null, 2);
  // if (out.match(/.(yaml|yml)/)) {
  //   body = YAML.stringify(swagger);
  //   body = body.replace(/^\s\s/gm, '').replace(/^---\n/, '');
  // }
  return writeFilePromise(out, data);
}

export default createOas;
export { writeFile };
