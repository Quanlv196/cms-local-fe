#!/bin/sh

# Create config directory if not exists
mkdir -p /usr/share/nginx/html/config

# Generate runtime env.js with proper formatting
cat > /usr/share/nginx/html/config/env.js << EOF
window._env_ = {
  REACT_APP_BASE_URL: '${REACT_APP_BASE_URL:-http://localhost:8080}',
  REACT_APP_APP_MODE: '${REACT_APP_APP_MODE:-production}'
};
EOF

echo "Generated runtime environment:"
cat /usr/share/nginx/html/config/env.js

exec "$@"
