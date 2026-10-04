# Fit & Leicht

App zum Abnehmen mit Sport: Kalorienrechner, Gewichtsverlauf, Trainings- und
Ernährungstagebuch mit Lebensmittel-Datenbank und Barcode-Scanner, Intervallfasten, Übungs-Anleitungen, Analyse, Intervall-Timer, Schritte, Erfolge, Wochenpläne und Erinnerungen
(auf Android direkt in Google Kalender). Sie lässt sich aufs Handy
installieren und läuft danach **auch offline**.

Die ausführliche Anleitung steht in **[README.html](README.html)**
(installieren, offline nutzen, Erinnerungen, Daten sichern, GitHub Pages einrichten).

## Kurz

1. Einmalig GitHub Pages einschalten: *Settings → Pages → Deploy from a branch*, Ordner `/ (root)`.
2. Die angezeigte Adresse am Handy öffnen und „Zum Home-Bildschirm“ bzw. „App installieren“ wählen.
3. Unter **Plan → Erinnerungen** die Zeiten einstellen und „In den Kalender übernehmen“ tippen.

| Datei | Inhalt |
| --- | --- |
| `index.html` | Aufbau der App |
| `styles.css` | Design |
| `app.js` | Logik |
| `data.js` | Lebensmittel und Übungen |
| `README.html` | Anleitung |
| `manifest.webmanifest` | Daten für die Installation |
| `sw.js` | Offline-Modus (bei Änderungen `VERSION` erhöhen) |
| `icons/` | App-Icons |
| `fonts/` | Schrift Barlow, lokal gespeichert (SIL Open Font License) |

Die Daten bleiben nur auf dem Gerät. Ab und zu unter *Profil* ein Backup herunterladen.
