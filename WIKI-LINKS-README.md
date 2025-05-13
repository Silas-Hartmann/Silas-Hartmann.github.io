# Wiki-Links zu Markdown-Links Konverter

Dieses Skript wandelt automatisch Obsidian-Wiki-Links in GitHub Pages-kompatible Markdown-Links um. Es ist speziell für die Verwendung mit GitHub Pages konzipiert, wo Markdown-Dateien in HTML-Seiten umgewandelt werden.

## Funktionsweise

Das Skript:

1. Durchsucht alle Markdown-Dateien (`.md`) im Repository
2. Findet alle Wiki-Links im Format `[[Link]]` oder `[[Link|Text]]`
3. Wandelt diese in Markdown-Links im Format `[Text](Link.html)` um
4. Speichert die Dateien mit den umgewandelten Links

## Vorteile

- Ermöglicht die Verwendung von Wiki-Links in Obsidian für eine bessere Benutzerfreundlichkeit
- Stellt sicher, dass Links auf GitHub Pages korrekt funktionieren
- Automatisiert die Umwandlung, sodass keine manuellen Schritte notwendig sind

## Verwendung

### Voraussetzungen

- Node.js muss installiert sein

### Ausführung

1. Navigieren Sie im Terminal zum Repository-Verzeichnis:
   ```
   cd pfad/zu/silas-hartmann.github.io
   ```

2. Führen Sie das Skript aus:
   ```
   node convert-wiki-links.js
   ```

### Integration in den Workflow

Sie können dieses Skript in Ihren GitHub-Workflow integrieren, um die Links automatisch zu konvertieren, wenn Sie Änderungen pushen. Alternativ können Sie es auch lokal vor jedem Push ausführen.

## Beispiel

### Vor der Konvertierung (in Obsidian):
```markdown
Hier ist ein Link zu [[Das_Ende_des_ersten_Weltkriegs]].
Und hier ist ein Link mit benutzerdefiniertem Text: [[Das_Ende_des_ersten_Weltkriegs|Ende des Krieges]].
```

### Nach der Konvertierung (für GitHub Pages):
```markdown
Hier ist ein Link zu [Das_Ende_des_ersten_Weltkriegs](Das_Ende_des_ersten_Weltkriegs.html).
Und hier ist ein Link mit benutzerdefiniertem Text: [Ende des Krieges](Das_Ende_des_ersten_Weltkriegs.html).
```

## Anpassung

Falls Sie die Funktionalität des Skripts anpassen möchten:

- Ändern Sie das `fileExtension` in der Konfiguration, um andere Dateitypen zu verarbeiten
- Passen Sie den regulären Ausdruck `wikiLinkRegex` an, wenn Sie andere Link-Formate haben
- Modifizieren Sie die Funktion `convertWikiLinksToMarkdown`, um das Ausgabeformat zu ändern
