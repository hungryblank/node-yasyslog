var config = module.exports;

config.unit = {
  rootPath: '../',
  environment: 'node',
  sources: ['lib/*.js'],
  tests: [
    'test/*-test.js'
  ]
};
