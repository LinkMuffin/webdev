# scripts/dedup_snapshots.py
# Löscht Duplikate pro (station_id, ts) – behält den jüngsten Record.
import os, requests
from collections import defaultdict

PB_URL  = os.environ.get("PB_URL", "http://localhost:8090").rstrip("/")
USER    = os.environ["PB_USER_EMAIL"]
PASS    = os.environ["PB_USER_PASSWORD"]
STATION = os.environ.get("DWD_STATION", "10444")

def login():
    r = requests.post(f"{PB_URL}/api/collections/users/auth-with-password",
                      json={"identity": USER, "password": PASS}, timeout=20)
    r.raise_for_status()
    j = r.json()
    return {"Authorization": f'Bearer {j["token"]}'}

def fetch_all(headers):
    items, page = [], 1
    while True:
        r = requests.get(f"{PB_URL}/api/collections/weather_snapshots/records",
                         headers=headers,
                         params={"page":page, "perPage":200, "sort":"ts",
                                 "filter": f'station_id = "{STATION}"'},
                         timeout=30)
        r.raise_for_status()
        j = r.json()
        items += j.get("items", [])
        if page * j.get("perPage", 200) >= j.get("totalItems", 0): break
        page += 1
    return items

def main():
    h = login()
    items = fetch_all(h)
    groups = defaultdict(list)
    for it in items:
        key = (it["station_id"], it["ts"])
        groups[key].append(it)

    to_delete = []
    for _, g in groups.items():
        if len(g) > 1:
            g.sort(key=lambda x: x["updated"], reverse=True)  # jüngsten behalten
            to_delete += [x["id"] for x in g[1:]]

    for rid in to_delete:
        requests.delete(f"{PB_URL}/api/collections/weather_snapshots/records/{rid}",
                        headers=h, timeout=15).raise_for_status()

    print(f"Deleted {len(to_delete)} duplicate records.")

if __name__ == "__main__":
    main()

