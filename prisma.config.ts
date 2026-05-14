import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: './packages/helloao-cli/schema.prisma',
    migrations: {
        path: './packages/helloao-cli/migrations',
    },
    datasource: {
        url: './bible-api.dev.db',
    },
});
