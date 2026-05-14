# Workflow Tips

## Debugging

- Provide screenshots when reporting visual issues
- Check browser console (errors and warnings) before describing a bug
- Run long-running terminal commands as background tasks for better log visibility
- Hard-refresh (⌘⇧R) when testing to rule out browser cache

## Entwicklungsserver

Da kein Build-Schritt vorhanden ist, reicht ein einfacher HTTP-Server:

```bash
python3 -m http.server 8080
```

Direkt `index.html` als `file://` zu öffnen kann bei ES-Modulen (`import`/`export`)
zu CORS-Fehlern führen — immer über den lokalen Server testen.

## Context management

- Perform `/compact` at ~50% context usage
- Start with plan mode for complex tasks
- Break subtasks small enough to complete in under 50% context
