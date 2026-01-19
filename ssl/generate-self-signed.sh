#!/bin/bash
# Generate self-signed SSL certificate for local development

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Generating self-signed SSL certificate for local development..."

# Generate private key
openssl genrsa -out key.pem 2048

# Generate certificate signing request
openssl req -new -key key.pem -out cert.csr -subj "/C=US/ST=State/L=City/O=Dev/CN=localhost"

# Generate self-signed certificate (valid for 365 days)
openssl x509 -req -days 365 -in cert.csr -signkey key.pem -out cert.pem

# Clean up CSR
rm cert.csr

# Set permissions
chmod 600 key.pem
chmod 644 cert.pem

echo "✅ SSL certificate generated successfully!"
echo "   Certificate: $SCRIPT_DIR/cert.pem"
echo "   Private key: $SCRIPT_DIR/key.pem"
echo ""
echo "⚠️  This is a self-signed certificate. Browsers will show a security warning."
echo "   For production, use Let's Encrypt or a trusted CA certificate."
