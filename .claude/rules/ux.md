# UX-Prinzipien

## Progressive Disclosure

Komplexität erscheint erst, wenn sie gebraucht wird. Features werden nicht entfernt —
sie werden zum richtigen Moment sichtbar.

Die App hat **zwei Phasen**. Beim Laden ist ausschließlich Phase 1 sichtbar.

### Phase 1 – Start
- Großes, zentriertes Headline (z.B. „Dein ESC Bingo")
- Genau ein primärer Button: „Bingo-Karte erstellen"
- Kein Editor, keine Listen, keine Optionen sichtbar

### Phase 2 – Konfigurieren & Drucken (nach Klick auf Phase-1-Button)
- Kartenvorschau (editierbarer Titel + 5×5-Raster) sichtbar
- Preset-Tags und eigene Felder über den ⋯-Button konfigurierbar
- Stepper für Anzahl Karten (1–20)
- Primär: „Drucken / Als PDF speichern" (ruft `window.print()` auf)
- Dezenter „Zurück"-Link zu Phase 1

**Übergänge:** CSS-Transition, Fade + leichtes Slide — nie abrupt.

## Design

- Ästhetik: festlich, Eurovision-würdig, nicht kitschig — Confetti-Energie mit klarer Typografie
- Farbpalette: ESC-inspiriert (Gold, Magenta, Deep Blue, Weiß) als CSS Custom Properties
- Kein generisches „Lila-Gradient auf Weiß"
- Druckversion schwarzweiß-freundlich: Farben → Grautöne, Raster und Text klar erkennbar
- Responsive: grundlegende Nutzbarkeit auf Smartphone, Druck-Workflow ist Desktop
