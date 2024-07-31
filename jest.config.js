/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "transform": {
    "\\.usfm": "<rootDir>/tools/fileTransformer.js",
    "\\.usx": "<rootDir>/tools/fileTransformer.js",
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
  ],
  roots: [
    "<rootDir>/packages",
    "<rootDir>/docs"
  ],
};