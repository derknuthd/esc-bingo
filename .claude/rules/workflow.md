# Workflow – ESC Bingo

## Entwicklungsserver

Da kein Build-Schritt vorhanden ist, reicht ein einfacher HTTP-Server:

```bash
python3 -m http.server 8080
```

Direkt `index.html` als `file://` zu öffnen kann bei ES-Modulen (`import`/`export`)
zu CORS-Fehlern führen — immer über den lokalen Server testen.
Hard-refresh (⌘⇧R) nicht vergessen.
