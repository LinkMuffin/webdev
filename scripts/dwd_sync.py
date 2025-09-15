# scripts/dwd_sync.py
import os, math, requests
from datetime import datetime, date, timezone, timedelta
from typing import Any, Dict, List, Optional, Tuple

PB_URL = os.environ.get("PB_URL", "http://localhost:8090").rstrip("/")
USER   = os.environ["PB_USER_EMAIL"]
PASS   = os.environ["PB_USER_PASSWORD"]

DWD_API     = os.environ.get("DWD_API", "https://dwd.api.proxy.bund.dev").rstrip("/")
STATION     = os.environ.get("DWD_STATION", "10444")
WINDOW_DAYS = int(os.environ.get("WINDOW_DAYS", "7"))

SOWING_DATE_STR = os.environ.get("SOWING_DATE", f"{datetime.now(timezone.utc).year}-05-01")
SOWING_DATE = date.fromisoformat(SOWING_DATE_STR)

LAT = float(os.environ.get("LAT", "51.54"))
LON = float(os.environ.get("LON", "9.93"))
LOCNAME = os.environ.get("LOCATION", "Göttingen")

SCALE_TENTHS = os.environ.get("DWD_SCALE_TENTHS", "1") not in ("0", "false", "False", "no")

# ---------- Helpers for PocketBase ----------

def pb_ts(dt: date) -> str:
    """PocketBase mag 'YYYY-MM-DD HH:MM:SS.000Z' – kein 'T', mit Millisekunden."""
    return datetime(dt.year, dt.month, dt.day, tzinfo=timezone.utc).strftime("%Y-%m-%d %H:%M:%S.000Z")

def user_login() -> Tuple[str, str]:
    url = f"{PB_URL}/api/collections/users/auth-with-password"
    r = requests.post(url, json={"identity": USER, "password": PASS}, timeout=20)
    r.raise_for_status()
    j = r.json()
    return j["token"], j["record"]["id"]

def upsert(collection: str, data: Dict[str, Any], token: str, rid: Optional[str] = None) -> Dict[str, Any]:
    h = {"Authorization": f"Bearer {token}"}
    if rid:
        r = requests.patch(f"{PB_URL}/api/collections/{collection}/records/{rid}", json=data, headers=h, timeout=20)
    else:
        r = requests.post(f"{PB_URL}/api/collections/{collection}/records", json=data, headers=h, timeout=20)
    if r.status_code in (401, 403):
        raise SystemExit(f"{collection}: {r.status_code} {r.text}\n→ Prüfe API-Rules (Create/Update) für deinen User.")
    if r.status_code >= 400:
        # Mehr Diagnose bei 400 (z.B. UNIQUE, falscher Typ, required etc.)
        raise SystemExit(f"{collection}: {r.status_code} {r.text}\nPayload: {data}")
    r.raise_for_status()
    return r.json()

def snapshot_id_for(token: str, station: str, ts_iso: str):
    """Suche vorhandenen Record exakt für (station_id, ts)."""
    h = {"Authorization": f"Bearer {token}"}
    # Wichtig: SINGLE quotes im Filter & ts im PB-Format
    r = requests.get(
        f"{PB_URL}/api/collections/weather_snapshots/records",
        headers=h,
        params={"page": 1, "perPage": 1, "filter": f"station_id = '{station}' && ts = '{ts_iso}'"},
        timeout=20
    )
    r.raise_for_status()
    items = r.json().get("items", [])
    return items[0]["id"] if items else None

def latest_record_id(collection: str, token: str) -> Optional[str]:
    h = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{PB_URL}/api/collections/{collection}/records?page=1&perPage=1&sort=-updated", headers=h, timeout=20)
    r.raise_for_status()
    items = r.json().get("items", [])
    return items[0]["id"] if items else None

# ---------- Agrarformeln ----------

def hargreaves_eto_mm_day(tmin: float, tmax: float, tmean: float, lat_deg: float, the_date: date) -> float:
    doy = the_date.timetuple().tm_yday
    phi = math.radians(lat_deg)
    dr = 1 + 0.033 * math.cos(2*math.pi/365 * doy)
    delta = 0.409 * math.sin(2*math.pi/365 * doy - 1.39)
    ws = math.acos(-math.tan(phi) * math.tan(delta))
    Ra = (24*60/ math.pi) * 0.0820 * dr * ( ws*math.sin(phi)*math.sin(delta) + math.cos(phi)*math.cos(delta)*math.sin(ws) )
    et0 = 0.0023 * (tmean + 17.8) * math.sqrt(max(tmax - tmin, 0.0)) * Ra
    return max(et0, 0.0)

def kc_maize(day_after_sowing: int) -> float:
    if day_after_sowing < 30: return 0.3
    if day_after_sowing < 60: return 0.3 + (day_after_sowing-30)*(1.2-0.3)/30
    if day_after_sowing < 110: return 1.2
    if day_after_sowing < 140: return 0.7
    return 0.5

# ---------- DWD Parsing ----------

def extract_station_payload(j: Any, station: str) -> Dict[str, Any]:
    if isinstance(j, dict):
        if station in j: return j[station]
        if "data" in j and isinstance(j["data"], dict) and station in j["data"]: return j["data"][station]
        if len(j) == 1: return list(j.values())[0]
    if isinstance(j, list) and j: return j[0]
    raise SystemExit(f"Unbekanntes JSON-Format für Station {station}: Schlüssel nicht gefunden.")

def pick(value: Any, *keys: str, default=None):
    if isinstance(value, dict):
        for k in keys:
            if k in value and value[k] is not None:
                return value[k]
    return default

def parse_days(s: Dict[str, Any]) -> Tuple[str, float, float, List[Dict[str, Any]]]:
    name = s.get("name") or LOCNAME
    lat  = float(s.get("latitude") or LAT)
    lon  = float(s.get("longitude") or LON)

    days = s.get("days") or s.get("daily") or s.get("forecastDays") or []
    if not isinstance(days, list) or not days:
        raise SystemExit("Keine Tagesliste im Station-Payload gefunden.")

    out: List[Dict[str, Any]] = []
    for d in days:
        dt: Optional[date] = None
        raw_date = d.get("date") or d.get("dayDate") or d.get("start")
        if raw_date is not None:
            try:
                dt = datetime.fromtimestamp(int(raw_date)/1000, tz=timezone.utc).date()
            except Exception:
                try:
                    dt = datetime.fromisoformat(str(raw_date).replace("Z","+00:00")).date()
                except Exception:
                    dt = None
        if dt is None:
            idx = len(out)
            dt = (datetime.now(timezone.utc).date() + timedelta(days=idx))

        tmin = pick(d, "temperatureMin", "tmin", "tMin", default=0)
        tmax = pick(d, "temperatureMax", "tmax", "tMax", default=0)
        rr   = pick(d, "precipitation", "precipitationSum", "rr24", default=0)

        try:
            tmin = float(tmin); tmax = float(tmax); rr = float(rr)
        except Exception:
            tmin, tmax, rr = 0.0, 0.0, 0.0

        if SCALE_TENTHS:
            tmin /= 10.0; tmax /= 10.0; rr /= 10.0

        tmean = (tmin + tmax)/2.0
        out.append({"date": dt, "tmin": tmin, "tmax": tmax, "tmean": tmean, "rr": rr})

    return name, lat, lon, out

# ---------- Main ----------

def main():
    token, user_id = user_login()

    url = f"{DWD_API}/v30/stationOverviewExtended?stationIds={STATION}"
    j = requests.get(url, timeout=25).json()
    s = extract_station_payload(j, str(STATION))
    name, lat, lon, days = parse_days(s)

    # Snapshots je Tag (Upsert)
    for d in days:
        dt: date = d["date"]
        et0 = hargreaves_eto_mm_day(d["tmin"], d["tmax"], d["tmean"], float(lat), dt)
        ts = pb_ts(dt)  # <<— GENAUES PB-Format
        data = {
            "station_id": str(STATION),
            "lat": float(lat), "lon": float(lon),
            "ts": ts,
            "t2m_K": round(d["tmean"] + 273.15, 2),
            "rr_mm": round(d["rr"], 2),
            "eto_mm": round(et0, 2),
        }
        rid = snapshot_id_for(token, str(STATION), ts)
        upsert("weather_snapshots", data, token, rid)

    # Wasserbilanzfenster
    days_sorted = sorted(days, key=lambda x: x["date"])
    today = datetime.now(timezone.utc).date()
    future = [d for d in days_sorted if d["date"] >= today]
    window = future[:WINDOW_DAYS] if future else days_sorted[-WINDOW_DAYS:]

    balance = 0.0
    for d in window:
        das = max((d["date"] - SOWING_DATE).days, 0)
        kc = kc_maize(das)
        et0 = hargreaves_eto_mm_day(d["tmin"], d["tmax"], d["tmean"], float(lat), d["date"])
        etc = kc * et0
        balance += (d["rr"] - etc)

    bal = round(balance, 1)
    level = "ok" if bal >= 0 else ("warnung" if bal >= -30 else "kritisch")
    state = {"ok": "vital", "warnung": "gestresst", "kritisch": "vertrocknet"}[level]

    rid = latest_record_id("maize_indicator", token)
    upsert("maize_indicator", {
        "location_name": name,
        "lat": float(lat), "lon": float(lon),
        "window_days": WINDOW_DAYS,
        "water_balance_mm": bal,
        "stress_level": level,
        "plant_state": state
    }, token, rid)

    print(f"OK: station={STATION} name={name} lat={lat} lon={lon} balance={bal}mm level={level} state={state} (user={user_id})")

if __name__ == "__main__":
    main()

