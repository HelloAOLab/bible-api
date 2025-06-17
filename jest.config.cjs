/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '\\.usfm': '<rootDir>/tools/fileTransformer.cjs',
        '\\.usx': '<rootDir>/tools/fileTransformer.cjs',
        '\\.codex': '<rootDir>/tools/fileTransformer.cjs',
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
                useESM: true,
            },
        ],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '@helloao/tools': '<rootDir>/packages/helloao-tools',
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    roots: ['<rootDir>/packages', '<rootDir>/docs'],
};
