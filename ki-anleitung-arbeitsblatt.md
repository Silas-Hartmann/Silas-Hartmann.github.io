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

### 1. Multiple-Choice (zwei Formate möglich)

#### a) Mit Aufzählungspunkten und Markierung:
```markdown
### Fragentitel
- Falsche Antwort
- Richtige Antwort (richtige Option)
- Falsche Antwort
- Falsche Antwort
```

#### b) Mit Checkboxen (empfohlen für Ankreuzaufgaben):
```markdown
### Fragentitel
- [ ] Falsche Antwort
- [x] Richtige Antwort
- [ ] Falsche Antwort
- [x] Weitere richtige Antwort
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
- **NEUE REGEL**: Eine H3-Überschrift mit normaler Aufzählung wird NICHT als Quiz erkannt
- Multiple-Choice wird NUR erkannt, wenn:
  - Richtige Option mit `(richtige Option)`, `(richtig)` oder `(correct)` markiert ist, ODER
  - Das Checkbox-Format mit `- [ ]` und `- [x]` verwendet wird
- Textantworten: Zeile mit `Antwort:` und möglichen Lösungen, getrennt durch `|`
- Lückentext: 
  - Text mit Platzhaltern in eckigen Klammern `[...]` 
  - Lösung mit `Lücken:` und Antworten für jede Lücke, getrennt durch Komma
  - Alternative Lösungen für eine Lücke durch `|` trennen
- Bei Textantworten und Lückentext werden Teillösungen akzeptiert
- HTML-Code ist nicht notwendig - Transformation erfolgt automatisch
- Obsidian-kompatibel: Standard-Markdown funktioniert, Callouts werden nicht transformiert

## PDF-Export
Die Arbeitsblätter können als PDF heruntergeladen werden:

### PDF-Varianten
- **Arbeitsblatt-PDF**: Interaktive Elemente werden durch ausdruckbare Formate ersetzt
  - Textfelder werden durch linierte Bereiche zum handschriftlichen Ausfüllen ersetzt
  - Multiple-Choice-Optionen werden zu Checkboxen 
  - Lückentexte erhalten Unterstreichungen für handschriftliche Einträge
- **Lösungs-PDF**: Enthält alle korrekten Antworten
  - Richtige Multiple-Choice-Optionen sind markiert und hervorgehoben
  - Textantworten zeigen die korrekte Lösung
  - Lückentexte sind mit richtigen Einträgen ausgefüllt

### Eigenschaften
- Standardschriftgröße im PDF beträgt 9 PT für optimale Lesbarkeit
- Automatische Umformatierung für Druckmedien
- Buttons zum Download erscheinen automatisch am Ende jedes Arbeitsblatts

## Formatierung
- Strukturiere mit `#` (H1), `##` (H2) für Abschnitte
- Nutze Markdown-Formatierung für Listen, *Hervorhebungen*, **Fettdruck**, etc.
- Füge Bilder ein mit `![Alt-Text](Bild-URL)`
- LaTeX-Formeln mit `$...$` für Inline oder `$$...$$` für Block-Formeln

## Beispiel für ein vollständiges Arbeitsblatt
```markdown
---
layout: default
title: Sprachen-Quiz
---

# Sprachen-Arbeitsblatt

## Einführung
### Grundlagen der französischen Sprache
* Französisch gehört zu den romanischen Sprachen
* Es wird weltweit von etwa 300 Millionen Menschen gesprochen
* Es ist Amtssprache in 29 Ländern

## Interaktive Übungen

### Die Hauptstadt von Frankreich ist:
- Rom
- Paris (richtige Option)
- Madrid
- Berlin

### Welche dieser Worte sind französisch?
- [ ] House
- [x] Maison
- [ ] Casa
- [x] Bonjour

### Wie lautet "Guten Tag" auf Französisch?
Gib die französische Übersetzung an.

Antwort: Bonjour

### Vervollständige den Satz:
Die [Französische] Revolution begann im Jahr [1789] und endete [1799].

Lücken: französische|Französische, 1789, 1799|im Jahr 1799
```

**Hinweis**: In diesem Beispiel wird die erste H3-Überschrift "Grundlagen der französischen Sprache" mit normaler Aufzählung NICHT als interaktive Quizfrage erkannt, sondern als normaler Text angezeigt. Nur die Fragen mit spezieller Formatierung werden zu interaktiven Quiz-Elementen.