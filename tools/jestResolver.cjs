const path = require('path');

const reactPackage =
    path.resolve(__dirname, '../packages/free-use-bible-api-react') + path.sep;
const clientSource = path.resolve(
    __dirname,
    '../packages/free-use-bible-api/index.ts'
);

/**
 * Points free-use-bible-api-react's imports of `free-use-bible-api` at the
 * client's source, so its tests run before anything has been built.
 *
 * Scoped to that package because free-use-bible-api-test deliberately imports
 * the version published to npm.
 */
module.exports = (request, options) => {
    if (
        request === 'free-use-bible-api' &&
        (options.basedir + path.sep).startsWith(reactPackage)
    ) {
        return clientSource;
    }
    return options.defaultResolver(request, options);
};
