let { task, desc } = require('jake');
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');

function makeGlobbablePath(path) {
    return path.replace(/\\/g, '/');
}

let folders = [
    `${__dirname}/packages/helloao-tools`,
    `${__dirname}/packages/helloao-cli`,
];

let patterns = [
    `/**/*.js`,
    `/**/*.js.map`,
    `/**/*.cjs`,
    `/**/*.cjs.map`,
    `/**/*.ts.map`,
    `/**/*.d.ts`,
    `/**/*.tsbuildinfo`,
];

let negativePatterns = [
    `/typings/**/*`,
    `/node_modules/**/*`,
    `**/prisma-gen/**/*`,
];

let globs = [];
folders.forEach((f) => {
    patterns.forEach((p) => {
        globs.push(f + p);
    });

    negativePatterns.forEach((p) => {
        globs.push(`!${f}${p}`);
    });
});

globs = globs.map((g) => makeGlobbablePath(g));

task('clean', [], async function () {
    const { deleteAsync } = await import('del');
    const deleted = await deleteAsync(globs);
});
