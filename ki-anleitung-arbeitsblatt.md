---
layout: default
title: KI-Anleitung Arbeitsblatt Erstellung
---

# Kompakte Anleitung zur Erstellung von Arbeitsblättern für silas-hartmann.github.io

## Dateistruktur
- Datei als `.md` speichern (Markdown)
- YAML-Frontmatter erforderlich
```
---
layout: default
title: Titel des Arbeitsblatts
---
```

## Aufgabentypen

### 1. Multiple-Choice
```markdown
### Fragentitel
- Falsche Antwort
- Richtige Antwort (richtige Option)
- Falsche Antwort
- Falsche Antwort
```

### 2. Textantwort
```markdown
### Fragentitel
Beschreibung oder Anweisung.

Antwort: korrekte_antwort|alternative_antwort
```

## Wichtige Regeln
- Jede Frage beginnt mit `###` (H3-Überschrift)
- Multiple-Choice: Richtige Option mit `(richtige Option)`, `(richtig)` oder `(correct)` markieren
- Textantworten: Zeile mit `Antwort:` und möglichen Lösungen, getrennt durch `|`
- Bei Textantworten werden Teillösungen akzeptiert (z.B. "E=mc²" wird bei "E=mc²|E = mc²|e=mc2" als richtig gewertet)
- HTML-Code ist nicht notwendig - Transformation erfolgt automatisch
- Obsidian-kompatibel: Standard-Markdown funktioniert, Callouts werden nicht transformiert

## Formatierung
- Strukturiere mit `#` (H1), `##` (H2) für Abschnitte
- Nutze Markdown-Formatierung für Listen, *Hervorhebungen*, **Fettdruck**, etc.
- Füge Bilder ein mit `![Alt-Text](Bild-URL)`
- LaTeX-Formeln mit `$...$` für Inline oder `$$...$$` für Block-Formeln

## Beispiel
```markdown
---
layout: default
title: Physik-Quiz
---

# Physik-Arbeitsblatt: Energie

## Einführung
Kurze Einführung zum Thema...

## Quiz: Grundlagen

### Die Einheit der Arbeit im SI-System ist:
- Newton (N)
- Joule (J) (richtige Option)
- Watt (W)
- Pascal (Pa)

### Wie lautet die berühmte Formel von Einstein?
Gib die mathematische Formel an.

Antwort: E=mc²|E = mc²|e=mc2
```