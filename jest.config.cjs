/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '\\.usfm': '<rootDir>/tools/fileTransformer.cjs',
        '\\.usx': '<rootDir>/tools/fileTransformer.cjs',
        '\\.codex': '<rootDir>/tools/fileTransformer.cjs',
        // Type-checks free-use-bible-api-react against the client's source, the
        // same way `tools/jestResolver.cjs` loads it at runtime.
        'packages/free-use-bible-api-react/.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig:
                    'packages/free-use-bible-api-react/tsconfig.test.json',
                useESM: true,
            },
        ],
        '^.+\\.tsx?$': [
            '<rootDir>/tools/tsJestTransformer.cjs',
            {
                tsconfig: 'tsconfig.test.json',
                useESM: true,
            },
        ],
    },
    moduleNameMapper: {
        // The generated Prisma client imports the ES module builds of its query compiler.
        // Jest runs the tests as CommonJS, so use the CommonJS builds instead.
        '^@prisma/client/runtime/(.*)\\.mjs$': '@prisma/client/runtime/$1.js',
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^@helloao/tools/(.*)\\.js$': '<rootDir>/packages/helloao-tools/$1',
        '@helloao/tools': '<rootDir>/packages/helloao-tools',
    },
    resolver: '<rootDir>/tools/jestResolver.cjs',
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    roots: ['<rootDir>/packages', '<rootDir>/docs'],
};
