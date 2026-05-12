# Website Briefing Formular

Mehrstufiges Briefing-Formular für localoutput.com. Kunden füllen es aus, die Daten werden per E-Mail an hallo@localoutput.com gesendet.

## Inhalt

```
briefing.html     → Das Formular (single HTML file, kein Framework)
backend/
  server.js       → Express-Server mit Resend API
  package.json    → Dependencies
  .env            → API Key (nicht im Repo, lokal anlegen)
```

## Setup

```bash
cd backend
npm install
```

`.env` Datei anlegen:

```
RESEND_API_KEY=re_dein_api_key
PORT=3001
```

Server starten:

```bash
node server.js
```

`briefing.html` im Browser öffnen — fertig.

## Formular-Schritte

1. **Unternehmen** — Name, Branche, Stadt, Besonderheit, Website vorhanden?
2. **Designstil** — 10 Stile zur Auswahl mit Live-Vorschau, Referenz-Links
3. **Website-Inhalte** — Sections auswählen (Hero, Leistungen, Galerie …)
4. **Inhalte** — Leistungen & Preise, Öffnungszeiten, Kontaktdaten
5. **Features** — Terminbuchung, WhatsApp-Button, Kontaktformular
6. **Abschluss** — Fertigstellungstermin, Ansprechpartner, E-Mail

## E-Mail

Nach dem Absenden landet eine strukturierte HTML-Mail bei **hallo@localoutput.com** mit allen Angaben des Kunden.

> Die Absender-Domain `noreply@localoutput.com` muss in Resend verifiziert sein.
