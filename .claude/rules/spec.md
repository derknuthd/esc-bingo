# Spezifikation

## Funktionale Anforderungen

### Bingo-Karte
- Klassisches 5×5-Raster (25 Felder)
- Mittleres Feld (Position 13) ist immer Freifeld: „FREI" oder ⭐
- Felder werden per Fisher-Yates zufällig aus dem Pool gezogen

### Felder-Pool
- Presets aus `presets.txt` als klickbare Tags; aktive Tags visuell markiert
- Eigene Begriffe per Texteingabe + Enter oder Button hinzufügbar
- Aktive Felder als entfernbare Chips (× zum Entfernen)
- Mindestens 24 Einträge erforderlich; Validierung mit visueller Fehlermeldung
- Zähler: „X von mindestens 24 Feldern gewählt"

### Karten generieren
- „Karte generieren": neue gemischte Karte aus dem Pool
- „Neue Karte": weitere zufällige Variante (für mehrere Spieler:innen)
- Optionales Namensfeld – erscheint oben auf der Karte

### Druckausgabe
- „Drucken / Als PDF speichern" ruft `window.print()` auf
- `@media print`:
  - Nur Karte(n) sichtbar, UI ausgeblendet
  - Eine Karte pro DIN-A4-Seite (Portrait), `page-break-after: always`
  - Klare Schrift, sichtbare Rasterränder

## Preset-Felder (`presets.txt`)

Mindestens 40 Einträge. Startpunkt:

```js
export const ESC_PRESETS = [
  "Pianoballade zum Auftakt",
  "Massive key change",
  "Tänzer:innen mit Flagge",
  "Jemand weint auf der Bühne",
  "Pyrotechnik",
  "LED-Kostüm",
  "Englisch + Landessprache gemischt",
  "Kommentar über den Moderator",
  "„We are one" im Text",
  "Schlagzeug-Solo",
  "Bizarre Requisite",
  "Jury gibt 12 Punkte an Nachbarland",
  "Jemand fällt fast hin",
  "Waving-Kamera-Fahrt",
  "Mittelalter-Ästhetik",
  "Drag-Performance",
  "Falsett-Moment",
  "Militärischer Marsch-Rhythmus",
  "Lichtshow geht schief",
  "Jemand spielt Violine selbst",
  "Nul points Kandidat:in",
  "Sprechendes Moderationsduo",
  "Technische Probleme",
  "Vogelperspektive-Kamera",
  "Herz-Geste ans Publikum",
  "Chor erscheint aus dem Nichts",
  "Kostümwechsel live",
  "Overdramatisches Ende",
  "Bestes Land scheidet im Halbfinale aus",
  "Ballon-Effekt",
  // weitere ergänzen bis ≥ 40
];
```

## Nicht-Anforderungen

- ❌ Kein Backend, keine Datenbank, keine User-Accounts
- ❌ Kein Echtzeit-Multiplayer
- ❌ Kein „Feld ankreuzen während des Streams"-Modus
- ❌ Kein Framework (React, Vue, Svelte etc.)
- ❌ Kein Build-Schritt (kein Vite, Webpack etc.)

## GitHub-Setup

1. Repo-Einstellungen → Pages → Source: `main`, Root `/`
2. `index.html` liegt im Root
3. Kein CI/CD nötig

## Entwicklungsreihenfolge

1. `presets.txt` – vollständige Liste (≥ 40 Einträge)
2. `app.js` – Shuffle-Logik + Kartengenerierung (erst Funktion, dann DOM)
3. `index.html` + `style.css` – Phase-1-UI, dann Phase 2
4. `@media print` CSS finalisieren
5. Polishing: Animationen, Fehlerzustände, Dark Mode, Mobile-Check

## Definition of Done

- [ ] Mindestens 40 Presets vorhanden
- [ ] Eigene Felder hinzufügbar und entfernbar
- [ ] Karte: 24 zufällige Felder + 1 Freifeld
- [ ] Druckausgabe füllt A4-Seite sauber
- [ ] Mehrere Karten druckbar (je Seite eine)
- [ ] Validierung bei zu wenig Feldern
- [ ] Keine externen Font-Requests (Network-Tab sauber)
- [ ] Beim Laden nur Phase 1 sichtbar
- [ ] Phasenübergänge mit CSS-Transition animiert
- [ ] Dark Mode funktioniert (`prefers-color-scheme: dark`)
- [ ] Keine Konsolenfehler
- [ ] Läuft auf GitHub Pages
