#!/bin/bash
set -euo pipefail

cd /home/marvin/Introduction_into_web_development/Abschlussprojekt/landwetter/scripts

# === ENV für dwd_sync.py (ANPASSEN!) ===
export PB_URL="http://localhost:8090"
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
exec /home/marvin/Introduction_into_web_development/Abschlussprojekt/landwetter/scripts/.venv/bin/python3 dwd_sync.py
