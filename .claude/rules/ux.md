# UX-Prinzipien

## Progressive Disclosure

Komplexität erscheint erst, wenn sie gebraucht wird. Features werden nicht entfernt —
sie werden zum richtigen Moment sichtbar.

Die App hat **drei Phasen**. Beim Laden ist ausschließlich Phase 1 sichtbar.

### Phase 1 – Start
- Großes, zentriertes Headline (z.B. „Dein ESC Bingo")
- Genau ein primärer Button: „Bingo-Karte erstellen"
- Kein Editor, keine Listen, keine Optionen sichtbar

### Phase 2 – Konfigurieren (nach Klick auf Phase-1-Button)
- Preset-Tags erscheinen als wählbare Chips (sanfte Einblend-Animation)
- Zähler: „X von mindestens 24 Feldern gewählt"
- Texteingabe für eigene Felder (Enter oder Button)
- „Karte generieren"-Button – erst aktiv wenn ≥ 24 Felder im Pool
- Dezenter „Zurück"-Link

### Phase 3 – Karte anzeigen & drucken
- Generierte Bingo-Karte(n) werden angezeigt
- Primär: „Drucken / Als PDF speichern"
- Sekundär (dezent): „Weitere Karte", „Felder bearbeiten"

**Übergänge:** CSS-Transition, Fade + leichtes Slide — nie abrupt.

## Weitere Prinzipien

- Kein Feature im primären Sichtbereich, das die meisten Nutzer nie brauchen
- Power-Features sind auffindbar, aber nie aufdringlich
- **Nutzersprache statt Technikbegriffe** – Konsequenz beschreiben, nicht Mechanismus:
  - ✅ „Zu wenig Felder ausgewählt" — ❌ „Pool-Validierung fehlgeschlagen"
  - ✅ „Wird gedruckt…" — ❌ „Rendere PDF…"
  - Maßstab: Würde Apple das so formulieren?

## Design

- Ästhetik: festlich, Eurovision-würdig, nicht kitschig — Confetti-Energie mit klarer Typografie
- Farbpalette: ESC-inspiriert (Gold, Magenta, Deep Blue, Weiß) als CSS Custom Properties
- Kein generisches „Lila-Gradient auf Weiß"
- Druckversion schwarzweiß-freundlich: Farben → Grautöne, Raster und Text klar erkennbar
- Responsive: grundlegende Nutzbarkeit auf Smartphone, Druck-Workflow ist Desktop
