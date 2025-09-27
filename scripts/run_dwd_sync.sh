#!/bin/bash
set -euo pipefail

cd /home/cloud/landwetter/scripts

# === ENV für dwd_sync.py ===
export PB_URL="http://127.0.0.1:8090"
export PB_USER_EMAIL="testUser@example.com"
export PB_USER_PASSWORD="testPassword"

# DWD & Modell-Parameter
export DWD_STATION="10444"
export DWD_API="https://dwd.api.proxy.bund.dev"
export SOWING_DATE="2025-05-01"
export WINDOW_DAYS="7"
export LOCATION="Goettingen"
export LAT="51.54"
export LON="9.93"

# venv-Python direkt aufrufen
exec /home/cloud/landwetter/scripts/.venv/bin/python3 dwd_sync.py
