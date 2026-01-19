# Docker Setup

This project includes Docker Compose configuration to build and serve the Bible API through nginx.

## Prerequisites

- Docker and Docker Compose installed
- A Bible API database file (`bible-api.db`) - see options below

## Quick Start

1. **Optional**: Copy the example environment file and customize it:
   ```bash
   cp env.example .env
   # Edit .env if you need to change defaults
   ```

2. **Start the services** (the database will be automatically downloaded if it doesn't exist):
   ```bash
   docker compose up -d
   ```

The setup will automatically:
- Download the database from the configured source URL if it doesn't exist
- Generate all API files
- Start nginx to serve the API

### Manual Database Setup (Optional)

If you prefer to set up the database manually:

**Option 1: Download the Database**
```bash
docker-compose run --rm bible-api-generator sh -c "pnpm run db:clone"
```

**Option 2: Initialize a New Database**
```bash
docker-compose run --rm bible-api-generator sh -c "pnpm run cli init /app/bible-api.db"
```

## Services

### bible-api-generator

This service:
- Builds the project
- Generates API JSON files from the database
- Writes files to a shared volume

### nginx

This service:
- Serves the generated API files
- Available on port 80
- Includes CORS headers for API access
- Configured with gzip compression

## Accessing the API

Once the services are running, the API will be available at:

- `http://localhost/api/available_translations.json`
- `http://localhost/api/{translation}/books.json`
- `http://localhost/api/{translation}/{book}/{chapter}.json`

## Configuration

### Environment Variables

The Docker Compose setup supports configuration through environment variables. Copy `env.example` to `.env` and customize as needed:

```bash
cp env.example .env
```

Available environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `BIBLE_DB_SOURCE_URL` | `https://bible.helloao.org/bible.db` | URL to download the database from |
| `BIBLE_DB_PATH` | `/app/db/bible-api.db` | Path to the database file inside the container |
| `BIBLE_DB_MIN_SIZE` | `1000` | Minimum database file size in bytes (for validation) |
| `API_OUTPUT_PATH` | `/app/api` | Path where API files will be generated |
| `API_OVERWRITE` | `true` | Whether to overwrite existing API files |
| `API_PRETTY_PRINT` | `true` | Whether to pretty-print JSON files |
| `API_TRANSLATIONS` | (empty) | Comma-separated list of specific translations to generate (empty = all) |
| `API_BATCH_SIZE` | `50` | Number of translations to process in each batch |
| `NODE_ENV` | `production` | Node.js environment |
| `NGINX_PORT` | `80` | Port to expose nginx on the host |
| `CORS_ALLOW_ORIGIN` | `*` | CORS allowed origin (passed to nginx container) |

### Port

To change the port, set the `NGINX_PORT` environment variable in your `.env` file:

```bash
NGINX_PORT=8080
```

Or modify the `ports` section in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

### Database Location

The database is stored in a Docker volume by default. The path inside the container can be changed via the `BIBLE_DB_PATH` environment variable.

### Nginx Configuration

The nginx configuration is in `nginx.conf`. You can modify it to change server settings, add SSL, or adjust CORS headers. Note that CORS configuration in nginx.conf is static - to change it dynamically, you would need to use a template system or modify the file directly.

## Regenerating API Files

To regenerate the API files after database changes:

```bash
docker-compose restart bible-api-generator
```

Or to force regeneration:

```bash
docker-compose run --rm bible-api-generator sh -c "pnpm run cli upload-api-files /app/api -- --db /app/bible-api.db --overwrite --pretty"
```

## Viewing Logs

```bash
# View all logs
docker-compose logs -f

# View generator logs
docker-compose logs -f bible-api-generator

# View nginx logs
docker-compose logs -f nginx
```

## Stopping Services

```bash
docker-compose down
```

To also remove volumes:

```bash
docker-compose down -v
```

## Troubleshooting

### Database Not Found

If you see an error about the database not being found, you need to either:
1. Download it using `pnpm run db:clone`
2. Initialize it using `pnpm run cli init /app/bible-api.db`
3. Mount an existing database file

### API Files Not Appearing

Check the generator logs:
```bash
docker-compose logs bible-api-generator
```

Ensure the database is properly mounted and contains data.

### Port Already in Use

If port 80 is already in use, set `NGINX_PORT` in your `.env` file:
```bash
NGINX_PORT=8080
```

Or modify the `ports` section in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"
```
