function createOas({ title, version, license, url }) {
  return {
    openapi: '3.1.0',
    info: {
      version,
      title,

    },
    servers: [
      {
        url,
      },
    ],
    paths: {},
  };

  // license: {
  //   name: license,
  // },
}

export default createOas;
