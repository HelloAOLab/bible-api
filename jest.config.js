/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "transform": {
    "\\.usfm": "<rootDir>/tools/fileTransformer.js",
    "\\.usx": "<rootDir>/tools/fileTransformer.js",
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/pages/test.tsx',
    '/build/',
  ],
  roots: [
    "<rootDir>/src",
    "<rootDir>/docs"
  ]
};