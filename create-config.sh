#!/bin/sh
# Create a basic config.json file for the Bible API
API_PATH="${API_OUTPUT_PATH:-/app/api}"

# Create config.json with basic API information
cat > "${API_PATH}/api/config.json" <<EOF
{
  "version": "1.0.0",
  "apiBase": "/api",
  "endpoints": {
    "translations": "/api/available-translations.json",
    "commentaries": "/api/available-commentaries.json",
    "datasets": "/api/available-datasets.json"
  }
}
EOF

echo "Created config.json at ${API_PATH}/api/config.json"
