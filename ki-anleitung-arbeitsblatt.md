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

### 3. Lückentext
```markdown
### Fragentitel
Dies ist ein Text mit [Lücke1] und weiteren [Lücke2] im Text.

Lücken: Antwort1|Alternative1, Antwort2|Alternative2
```

## Wichtige Regeln
- Jede Frage beginnt mit `###` (H3-Überschrift)
- Multiple-Choice: Richtige Option mit `(richtige Option)`, `(richtig)` oder `(correct)` markieren
- Textantworten: Zeile mit `Antwort:` und möglichen Lösungen, getrennt durch `|`
- Lückentext: 
  - Text mit Platzhaltern in eckigen Klammern `[...]` 
  - Lösung mit `Lücken:` und Antworten für jede Lücke, getrennt durch Komma
  - Alternative Lösungen für eine Lücke durch `|` trennen
- Bei Textantworten und Lückentext werden Teillösungen akzeptiert
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
title: Sprachen-Quiz
---

# Sprachen-Arbeitsblatt

## Quiz: Grundlagen

### Die Hauptstadt von Frankreich ist:
- Rom
- Paris (richtige Option)
- Madrid
- Berlin

### Wie lautet "Guten Tag" auf Französisch?
Gib die französische Übersetzung an.

Antwort: Bonjour

### Vervollständige den Satz:
Die [Französische] Revolution begann im Jahr [1789] und endete [1799].

Lücken: französische|Französische, 1789, 1799|im Jahr 1799
```