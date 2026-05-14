# Conventions

## Code

- Kein Linter – halte dich an den Stil des umgebenden Codes
- Vanilla JS ES2020+, kein Transpiler, keine npm-Abhängigkeiten
- Keine externen Fonts – ausschließlich system-native Font-Stacks:
  - Display: `ui-rounded, "SF Pro Display", "Helvetica Neue", system-ui, sans-serif`
  - Text: `system-ui, -apple-system, sans-serif`
  - Charakter durch `font-weight: 800–900`, `letter-spacing`, nicht durch externe Fonts

## CSS

- **Mobile-first** – Styles beginnen beim kleinsten Viewport, Breakpoints überschreiben nach oben
- Keine Inline-Styles (`style="..."`), keine Style-Attribute im HTML
- Alles über CSS-Klassen und Custom Properties
- Modernes CSS bevorzugen: `@layer`, `@container`, `clamp()`, `gap`, `grid`, logical properties
- BEM-ähnliche Klassennames: `.block__element--modifier`
- **Dark Mode von Anfang an** – nicht nachträglich patchen:
  ```css
  :root { --color-bg: #fff; --color-text: #111; }
  @media (prefers-color-scheme: dark) { :root { --color-bg: #111; --color-text: #f0f0f0; } }
  ```
- Alle Farben als CSS Custom Properties in `:root` definieren, nirgendwo hardcoden

## Git

- Commits: Englisch, Conventional Commits (`feat` / `fix` / `refactor` / `chore` / `docs` / `test` / `style`)
- **Ein Commit pro Datei** – niemals mehrere Dateiänderungen in einen Commit bündeln
- Mindestens ein Commit pro abgeschlossener Aufgabe
- Branch: `feature/issue-{nr}-kurzbeschreibung`
- PRs: ein Feature pro PR, immer mit `Closes #Nr`
- Vor dem Merge immer `/review` ausführen
- Squash Merge in `main`
- Labels: `feature`, `bug`, `chore`, `security`, `test`, `ready`
  – vom Issue auf den PR übertragen; `ready` vom Issue entfernen wenn Umsetzung beginnt
