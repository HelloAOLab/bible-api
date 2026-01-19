FROM node:20.17.0-alpine AS base

# Install pnpm using npm (more reliable than corepack prepare)
RUN npm install -g pnpm@10.12.1

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/helloao-cli/package.json ./packages/helloao-cli/
COPY packages/helloao-tools/package.json ./packages/helloao-tools/
# Copy Prisma schema file (needed for postinstall script)
COPY packages/helloao-cli/schema.prisma ./packages/helloao-cli/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the project
RUN pnpm run build

# Generate Prisma client
RUN pnpm exec prisma generate --schema=./packages/helloao-cli/schema.prisma

# Default command (can be overridden in docker-compose)
CMD ["node", "--version"]
