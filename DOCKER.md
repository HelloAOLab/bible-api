# Docker Setup

This project includes Docker Compose configuration to build and serve the Bible API through nginx.

## Prerequisites

- Docker and Docker Compose installed
- A Bible API database file (`bible-api.db`) - see options below

## Quick Start

### Option 1: Using an Existing Database

If you already have a `bible-api.db` file in the project root:

```bash
docker-compose up -d
```

### Option 2: Download the Database

You can download the database from the public API:

```bash
# Download the database first
docker-compose run --rm bible-api-generator sh -c "pnpm run db:clone"
```

Then start the services:

```bash
docker-compose up -d
```

### Option 3: Initialize a New Database

To initialize a new database from the Bible source files:

```bash
# Initialize the database
docker-compose run --rm bible-api-generator sh -c "pnpm run cli init /app/bible-api.db"
```

Then start the services:

```bash
docker-compose up -d
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

### Port

To change the port, modify the `ports` section in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

### Database Location

The database is mounted from `./bible-api.db` in the project root. You can change this path in the `volumes` section of `docker-compose.yml`.

### Nginx Configuration

The nginx configuration is in `nginx.conf`. You can modify it to change server settings, add SSL, or adjust CORS headers.

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

If port 80 is already in use, change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"
```
