# /review

Führe ein vollständiges Code-Review des aktuellen Stands durch, bevor ein PR gemergt wird.

## Checkliste

### Funktionalität
- [ ] Alle Punkte der Definition of Done erfüllt (siehe @.claude/rules/spec.md)
- [ ] Kartengenerierung korrekt: 24 zufällige Felder + 1 Freifeld (Position 13)
- [ ] Validierung greift bei < 24 Feldern im Pool
- [ ] Druckausgabe auf A4 getestet (oder manuell verifizierbar)

### Code-Qualität
- [ ] Keine Inline-Styles im HTML
- [ ] Alle Farben als CSS Custom Properties, nirgendwo hardgecodet
- [ ] Dark Mode via `@media (prefers-color-scheme: dark)` vorhanden
- [ ] Keine externen Ressourcen (Fonts, CDN, APIs)
- [ ] Kein `console.log` oder Debug-Code im finalen Stand

### UX
- [ ] Phase 1: Beim Laden nur Headline + ein Button sichtbar
- [ ] Phasenübergänge animiert (kein abruptes Erscheinen)
- [ ] Alle Texte in Nutzersprache (kein Technikjargon)

### Git
- [ ] Commits folgen Conventional Commits
- [ ] Jede Datei in eigenem Commit
- [ ] PR-Titel und -Beschreibung verständlich, enthält `Closes #Nr`

## Ausgabe

Fasse Findings in drei Kategorien zusammen:
- 🔴 **Blocker** – muss vor Merge behoben werden
- 🟡 **Verbesserung** – empfohlen, aber kein Blocker
- 🟢 **Gut** – positiv auffällige Stellen

Gib am Ende eine klare Empfehlung: **Merge freigeben** oder **Änderungen nötig**.
