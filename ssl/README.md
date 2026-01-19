# SSL Certificates

This directory contains SSL certificates for HTTPS support.

## Quick Start

Generate a self-signed certificate for local development:

```bash
./generate-self-signed.sh
```

This will create:
- `cert.pem` - SSL certificate
- `key.pem` - Private key

## Certificate Types

### Self-Signed (Development)

The included `generate-self-signed.sh` script creates a self-signed certificate valid for 365 days. This is perfect for local development.

**Note**: Browsers will show a security warning for self-signed certificates. You can safely proceed by clicking "Advanced" → "Proceed to localhost".

### Let's Encrypt (Production)

For production use, replace the self-signed certificate with a Let's Encrypt certificate:

1. Install Certbot:
   ```bash
   # macOS
   brew install certbot
   
   # Linux
   sudo apt-get install certbot
   ```

2. Obtain certificate:
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. Copy certificates:
   ```bash
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
   sudo chmod 644 ./ssl/cert.pem
   sudo chmod 600 ./ssl/key.pem
   ```

## File Permissions

- `cert.pem`: `644` (readable by nginx)
- `key.pem`: `600` (only readable by owner)

The `generate-self-signed.sh` script sets these permissions automatically.

## Nginx Configuration

The certificates are mounted into the nginx container at `/etc/nginx/ssl/` and configured in `nginx.conf`.

Both HTTP (port 80) and HTTPS (port 443) are enabled - no redirects.
