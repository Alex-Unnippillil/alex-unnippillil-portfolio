module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./tests/init.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
};
