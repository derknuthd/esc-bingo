---
name: issue-refinement
description: Definition of Ready und Acceptance-Criteria-Stil für esc-bingo Issues
user-invocable: false
---

# Issue Refinement — esc-bingo

## Definition of Ready

Ein Issue ist bereit wenn:
- [ ] Ziel klar: Was ist danach anders?
- [ ] Acceptance Criteria als Checkboxen formuliert
- [ ] Scope passt in einen PR (~100–150 Zeilen)
- [ ] Kein offener Designentscheid
- [ ] Abhängigkeiten zu anderen Issues benannt
- [ ] Betroffene Dateien identifiziert (soweit bekannt)

## Acceptance Criteria — Stil

Konkret und prüfbar — nicht „funktioniert korrekt", sondern messbar:
- `app.js` zeigt Fehlermeldung wenn weniger als 24 Felder im Pool sind
- Keine Inline-Styles im HTML
- Phasenübergang ist per CSS-Transition animiert (kein abruptes Erscheinen)
- Keine Konsolenfehler beim Laden

## Besonderheiten je Label

**`bug`** — Ist-Zustand + Soll-Zustand + Reproduktionsschritte
**`feature`** — Nutzen aus User-Perspektive, Abhängigkeiten explizit
**`chore`** — Kein neues Verhalten, nur messbare Qualitätsverbesserung
**`test`** — Datei/Funktion + zu testende Szenarien (Happy Path, Edge Cases, Fehler)

## Was NICHT in den Issue gehört

- Implementierungsdetails (wie gebaut wird — entscheidet Claude)
- Infos die bereits in CLAUDE.md oder den Rules stehen
