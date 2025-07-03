// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',

  // Use babel-jest to transform JS/TS/JSX/TSX
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  // By default node_modules are ignored — we need to transform axios (ESM)
  transformIgnorePatterns: [
    // ignore everything in node_modules except axios
    '/node_modules/(?!(axios)/)',
  ],

  // CSS modules & friends → stub out to identity-obj-proxy
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // file extensions Jest will look for
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  // run this after env is set up
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
