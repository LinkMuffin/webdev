#Landwetter - Wetter-Dashboard für Landwirtschaft

Web-App für Landwirt:Innen: aktuelle Wetterdaten, 3-Tage-Prognose, Niederschlagsradar,
Wind & Böen, **Mais-Gesundheitsindikator**

## Features

- **Dashboard mit Widgets**: Aktuelles Wetter, 3-Tage-Proggnose, Wind & Böen, Niederschlagsradar, Mais-Gesundheit
- **Drag & Drop**: (react-grid-layout) + **Layout-Speicherung** pro User
- **Live-Updates** via PocketBase Realtime
- **Dark/Light/System - Theme** + Lokalisierung **Deutsch/Englisch** umschaltbar
- **Mais-Indikator**: Wasserbilanz über Fenster 'window_days' (ET nach Hargreaves, Kc-Kurve für Mais)

##Stack

- **Frontend**: Next.js(React+TypeScript)
- **Backend/DB**: PocketBase (Auth, REST, Realtime, SQLite)
- **Importer/Cron**: Python-Skript 'scripts/dwd_sync.py' (holt DWD-Daten)

## Repository-Struktur

landwetter/


##Vorraussetzungen

- Node 18+/20+
- Python 3.10+
- PocketBase Binary (oder Docker)
- Internetzugang für DWD-API

## Pocketbase starten

'''bash
# Beispiel: lokaler Start (Binary)
./pocketbase serve --https=0.0.0.0:8090 -dir
