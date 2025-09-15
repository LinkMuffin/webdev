# scripts/update_demo.py
# Demo-Feeder für PocketBase mit USER-Login (kein Admin).
# Erzeugt/aktualisiert einen maize_indicator und schreibt einen weather_snapshots-Eintrag.
#
# Vorher:
#   pip install requests
#   export PB_URL=http://localhost:8090
#   export PB_USER_EMAIL='dein_user@example.com'
#   export PB_USER_PASSWORD='DeinPasswort'
#   (optional) export LAT=51.54; export LON=9.93; export LOCATION='Göttingen'
#
# Regeln in PB (Collections -> API Rules):
#   maize_indicator:
#       List/View:   @request.auth.id != ""
#       Create/Update: @request.auth.id = "<DEINE_USER_ID>"   (oder einfacher: @request.auth.id != "")
#   weather_snapshots:
#       List/View:   @request.auth.id != ""
#       Create/Update: @request.auth.id = "<DEINE_USER_ID>"   (oder einfacher: @request.auth.id != "")

import os
import random
from datetime import datetime, timezone
import requests

PB_URL = os.environ.get("PB_URL", "http://localhost:8090").rstrip("/")
USER   = os.environ["PB_USER_EMAIL"]
PASS   = os.environ["PB_USER_PASSWORD"]

LAT     = float(os.environ.get("LAT", "51.54"))
LON     = float(os.environ.get("LON", "9.93"))
LOCNAME = os.environ.get("LOCATION", "Göttingen")

def user_login():
    """Login als normaler 'users'-Benutzer. Gibt (token, user_id) zurück."""
    url = f"{PB_URL}/api/collections/users/auth-with-password"
    r = requests.post(url, json={"identity": USER, "password": PASS}, timeout=15)
    r.raise_for_status()
    j = r.json()
    token = j["token"]
    user_id = j["record"]["id"]
    return token, user_id

def latest_record_id(collection: str, token: str):
    """Liest die ID des zuletzt aktualisierten Records oder None."""
    h = {"Authorization": f"Bearer {token}"}
    url = f"{PB_URL}/api/collections/{collection}/records?page=1&perPage=1&sort=-updated"
    r = requests.get(url, headers=h, timeout=15)
    r.raise_for_status()
    items = r.json().get("items", [])
    return items[0]["id"] if items else None

def upsert_record(collection: str, data: dict, token: str, rid: str | None):
    """PATCH wenn rid vorhanden, sonst POST."""
    h = {"Authorization": f"Bearer {token}"}
    if rid:
        url = f"{PB_URL}/api/collections/{collection}/records/{rid}"
        r = requests.patch(url, json=data, headers=h, timeout=15)
    else:
        url = f"{PB_URL}/api/collections/{collection}/records"
        r = requests.post(url, json=data, headers=h, timeout=15)
    if r.status_code in (401, 403):
        raise SystemExit(
            f"{collection}: {r.status_code} {r.text}\n"
            "→ Prüfe die API Rules (Create/Update) für deinen User oder den Login."
        )
    r.raise_for_status()
    return r.json()

def update_maize_indicator(token: str):
    """Simuliert eine Wasserbilanz und schreibt den maize_indicator."""
    balance = round(random.uniform(-60, 20), 1)  # mm
    level = "ok" if balance >= 0 else ("warnung" if balance >= -30 else "kritisch")
    state = {"ok": "vital", "warnung": "gestresst", "kritisch": "vertrocknet"}[level]

    data = {
        "location_name": LOCNAME,
        "lat": LAT,
        "lon": LON,
        "window_days": 7,
        "water_balance_mm": balance,
        "stress_level": level,
        "plant_state": state,
        # kein eigenes 'updated_at' Feld nötig – PB hat 'updated' als Systemfeld
    }
    rid = latest_record_id("maize_indicator", token)
    upsert_record("maize_indicator", data, token, rid)
    return balance, level, state

def insert_weather_snapshot(token: str):
    """Legt einen simplen Wetter-Snapshot an (random Werte)."""
    ts = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    t2m_K = round(273.15 + 20 + random.uniform(-5, 5), 2)  # ~15..25°C
    rr_mm = round(max(0.0, random.uniform(0, 5)), 2)       # 0..5 mm
    eto_mm = round(max(0.0, random.uniform(0, 6)), 2)      # 0..6 mm

    data = {
        "station_id": "DEMO",
        "lat": LAT,
        "lon": LON,
        "ts": ts,
        "t2m_K": t2m_K,
        "rr_mm": rr_mm,
        "eto_mm": eto_mm,
    }
    upsert_record("weather_snapshots", data, token, rid=None)

def main():
    token, user_id = user_login()
    bal, level, state = update_maize_indicator(token)
    insert_weather_snapshot(token)
    print(f"OK (user={user_id}): balance={bal} mm, level={level}, state={state}")

if __name__ == "__main__":
    main()

