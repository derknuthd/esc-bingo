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
│   │   ├── conventions.md  # Projekt-spezifische Code-Conventions (Vanilla JS)
│   │   ├── ux.md           # ESC-spezifische UX-Phasen & Design
│   │   ├── spec.md         # Funktionale Anforderungen & Definition of Done
│   │   └── workflow.md     # Entwicklungsserver-Setup
│   ├── commands/
│   │   └── review.md       # /review-Command
│   └── skills/
│       └── issue-refinement/SKILL.md  # Definition of Ready & Acceptance Criteria
└── local/                  # Nicht committed – Testdateien, Scratch, PDFs
```

## Regeln

@.claude/rules/conventions.md
@.claude/rules/ux.md
@.claude/rules/spec.md

## Best Practices Referenz

https://github.com/shanraisshan/claude-code-best-practice
