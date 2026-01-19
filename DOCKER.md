# Docker Setup

This project includes Docker Compose configuration to build and serve the Bible API through nginx.

## Prerequisites

- Docker and Docker Compose installed
- A Bible API database file (`bible.db`) in the project root directory (11GB+ file)

## Quick Start

1. **Ensure `bible.db` exists** in the project root directory:
   ```bash
   ls -lh bible.db
   # Should show an ~11GB file
   ```

2. **Optional**: Copy the example environment file and customize it:
   ```bash
   cp env.example .env
   # Edit .env if you need to change defaults
   ```

3. **Start the services**:
   ```bash
   docker compose up -d
   ```

The setup will:
- Mount your local `bible.db` file into the container
- Generate all API files from the database (only if they don't already exist)
- Start nginx to serve the API

**Note**: On subsequent runs, the generator will skip file generation if files already exist. To force regeneration, set `API_OVERWRITE=true` in your `.env` file or remove the volume.

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
- Generates API JSON files from the database (if they don't exist)
- Writes files to a shared volume
- Skips generation on subsequent runs unless `API_OVERWRITE=true`

### nginx

This service:
- Serves the generated API files
- Available on ports 80 (HTTP) and 443 (HTTPS)
- Automatically redirects HTTP to HTTPS
- Includes CORS headers for API access
- Configured with gzip compression
- Uses SSL/TLS encryption for HTTPS

## Accessing the API

Once the services are running, the API will be available at:

- `https://localhost/api/available_translations.json` (HTTPS - recommended)
- `https://localhost/api/{translation}/books.json`
- `https://localhost/api/{translation}/{book}/{chapter}.json`

**Note**: HTTP requests on port 80 will automatically redirect to HTTPS on port 443.

For development with self-signed certificates, browsers will show a security warning. This is expected - you can proceed by clicking "Advanced" and "Proceed to localhost".

## Configuration

### Environment Variables

The Docker Compose setup supports configuration through environment variables. Copy `env.example` to `.env` and customize as needed:

```bash
cp env.example .env
```

Available environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `BIBLE_DB_PATH` | `/app/db/bible.db` | Path to the database file inside the container |
| `API_OUTPUT_PATH` | `/app/api` | Path where API files will be generated |
| `API_OVERWRITE` | `false` | Whether to overwrite existing API files. Set to `true` to force regeneration on every startup |
| `API_PRETTY_PRINT` | `true` | Whether to pretty-print JSON files |
| `API_TRANSLATIONS` | (empty) | Comma-separated list of specific translations to generate (empty = all) |
| `API_BATCH_SIZE` | `10` | Number of translations to process in each batch (lower = less memory, slower) |
| `NODE_ENV` | `production` | Node.js environment |
| `NGINX_HTTP_PORT` | `80` | Port to expose nginx HTTP on the host |
| `NGINX_HTTPS_PORT` | `443` | Port to expose nginx HTTPS on the host |
| `CORS_ALLOW_ORIGIN` | `*` | CORS allowed origin (passed to nginx container) |

### Ports

To change the ports, set the `NGINX_HTTP_PORT` and `NGINX_HTTPS_PORT` environment variables in your `.env` file:

```bash
NGINX_HTTP_PORT=8080
NGINX_HTTPS_PORT=8443
```

Or modify the `ports` section in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"   # HTTP port
  - "8443:443"  # HTTPS port
```

### SSL Certificates

The nginx service requires SSL certificates to enable HTTPS. You have two options:

#### Option 1: Self-Signed Certificate (Development)

For local development, generate a self-signed certificate:

```bash
./ssl/generate-self-signed.sh
```

This will create `ssl/cert.pem` and `ssl/key.pem` files.

#### Option 2: Let's Encrypt (Production)

For production, use Let's Encrypt certificates:

1. Install Certbot: `sudo apt-get install certbot` (or `brew install certbot` on macOS)
2. Obtain certificates: `sudo certbot certonly --standalone -d yourdomain.com`
3. Copy certificates to the `ssl/` directory:
   ```bash
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
   sudo chmod 644 ./ssl/cert.pem
   sudo chmod 600 ./ssl/key.pem
   ```

See `ssl/README.md` for detailed instructions.

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

If ports 80 or 443 are already in use, set `NGINX_HTTP_PORT` and `NGINX_HTTPS_PORT` in your `.env` file:
```bash
NGINX_HTTP_PORT=8080
NGINX_HTTPS_PORT=8443
```

Or modify the `ports` section in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"
  - "8443:443"
```

### SSL Certificate Errors

If nginx fails to start with SSL errors, ensure:
1. SSL certificates exist in the `ssl/` directory
2. Files are named `cert.pem` and `key.pem`
3. Permissions are correct: `cert.pem` (644), `key.pem` (600)

Generate a self-signed certificate for development:
```bash
./ssl/generate-self-signed.sh
```
