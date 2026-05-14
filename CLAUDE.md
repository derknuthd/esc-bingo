# ESC Bingo – Druckvorlagen-Generator

Statische Web-App (Vanilla HTML/CSS/JS, kein Build-Schritt, kein Framework) zum Erstellen
und Drucken individueller Bingo-Karten für den Eurovision Song Contest.
Läuft komplett im Browser, keine externen Abhängigkeiten, keine externen Fonts.

## Stack

| Layer       | Entscheidung                                  |
|-------------|-----------------------------------------------|
| Framework   | Kein Framework – Vanilla HTML/CSS/JS           |
| Styling     | CSS Custom Properties (keine Utility-Library) |
| Interaktion | Vanilla JS (ES2020+, kein Transpiler)          |
| Druck       | CSS `@media print` + `window.print()`         |
| Hosting     | Statisch – GitHub Pages, Root `/`             |

## Dateistruktur

```
esc-bingo/
├── index.html              # Haupt-App
├── style.css               # Globale Styles + Print-Styles
├── app.js                  # Logik: Generator, Shuffle, Druck
├── presets.js              # ESC-Klischee-Felder (exportiertes Array)
├── .gitignore
├── README.md
├── .claude/
│   ├── rules/
│   │   ├── conventions.md  # CSS-, Git- und Code-Conventions
│   │   ├── ux.md           # UX-Prinzipien & Progressive Disclosure
│   │   └── spec.md         # Funktionale Anforderungen & Definition of Done
│   └── commands/
│       └── review.md       # /review-Command
└── local/                  # Nicht committed – Testdateien, Scratch, PDFs
```

## Regeln

@.claude/rules/conventions.md
@.claude/rules/ux.md
@.claude/rules/spec.md

## Vor der Umsetzung

**Erstelle zuerst einen Plan und warte auf Bestätigung, bevor du mit dem Coden anfängst.**

## Best Practices Referenz

https://github.com/shanraisshan/claude-code-best-practice
