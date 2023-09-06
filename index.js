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

export default createOas;
