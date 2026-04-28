#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"

echo "🚗 NYC Turbo Jump"
echo "Iniciando servidor en: http://localhost:${PORT}"
echo "Para detenerlo: Ctrl+C"

python3 -m http.server "${PORT}"
