---
layout: default
title: Anleitung zum Quiz-System (neue Version)
---

# Anleitung zum Markdown-basierten Quiz-System (neue Version)

Mit diesem System kannst du interaktive Quizfragen direkt in deinen Markdown-Dateien erstellen, ohne HTML-Code schreiben zu müssen. Das ist besonders praktisch, wenn du Obsidian für die Verwaltung deiner Inhalte verwendest.

## Was kann das Quiz-System?

Das Quiz-System ermöglicht:

- Multiple-Choice-Fragen mit automatischer Auswertung
- Textantworten mit Prüfung gegen mehrere mögliche richtige Antworten
- Kombination mehrerer Quizfragen in einem Arbeitsblatt
- Sofortiges Feedback für Schülerinnen und Schüler
- Zusammenfassung mit Gesamtergebnis

## Wie erstelle ich ein Quiz?

### 1. Überschriften für Fragen verwenden

Jede Quizfrage beginnt mit einer Überschrift der dritten Ebene (`###`):

```markdown
### Wie lautet die Hauptstadt von Deutschland?
```

### 2. Multiple-Choice-Fragen erstellen

Multiple-Choice-Fragen werden mit einer Liste von Optionen definiert:

```markdown
### Wie lautet die Hauptstadt von Deutschland?

- Paris
- Berlin (richtige Option)
- Madrid
- Rom
```

Wichtige Punkte:
- Die Frage selbst wird als Überschrift (mit `###`) definiert
- Antwortmöglichkeiten werden als einfache Liste dargestellt
- Die richtige Antwort wird mit `(richtige Option)` markiert
- Du kannst alternativ auch `(richtig)` oder `(correct)` verwenden

### 3. Textantwort-Fragen erstellen

Für Fragen, die eine Texteingabe erfordern:

```markdown
### Was ist die chemische Formel für Wasser?

Gib die Formel an.

Antwort: H2O|H₂O
```

Wichtige Punkte:
- Die Frage selbst wird als Überschrift (mit `###`) definiert
- Beliebiger Erklärungstext kann hinzugefügt werden
- Die Antwort wird in einer Zeile mit `Antwort:` angegeben
- Mehrere akzeptable Antworten können mit `|` getrennt werden
- Diese Antwortzeile wird in der interaktiven Anzeige automatisch versteckt

### 4. Beispiel für ein vollständiges Quiz

```markdown
## Quiz: Geographie-Test

### Die Hauptstadt von Frankreich ist:

- Paris (richtige Option)
- Lyon
- Marseille
- Nizza

### Nenne die chemische Formel für Kohlendioxid:

Gib die Formel an.

Antwort: CO2|CO₂
```

## Beispiel

Ein vollständiges Beispiel-Arbeitsblatt mit Quiz findest du hier: [Physik-Quiz (neu)](beispiel-quiz-neu.html)

## Tipps und Tricks

- **Wichtig**: Bei Multiple-Choice-Fragen musst du die richtige Antwort mit `(richtige Option)` kennzeichnen
- Schreibe die Fragen in einer klaren, präzisen Sprache
- Bei Multiple-Choice-Fragen sollten die falschen Antworten plausibel sein
- Bei Textantworten kannst du verschiedene Schreibweisen durch die Alternative-Syntax (`|`) akzeptieren
- Das Quiz-System ist responsive und funktioniert auf Mobilgeräten
- Du kannst beliebig viele Quizfragen in einem Arbeitsblatt kombinieren

## Anpassung für den Obsidian-Workflow

Diese Syntax ist besonders vorteilhaft für den Obsidian-Workflow:

1. Du kannst die Fragen ganz normal in Obsidian schreiben und bearbeiten
2. Die Syntax verwendet Standard-Markdown-Elemente (Überschriften und Listen)
3. Die Markierung der richtigen Antwort ist einfach zu lesen und zu bearbeiten
4. Wenn du das Dokument in Obsidian betrachtest, siehst du bereits, welche Antworten richtig sind
5. Nach dem Export zu GitHub Pages werden die statischen Markdown-Elemente in interaktive Quiz-Elemente umgewandelt

## Technische Details

Das Quiz-System verwendet JavaScript, um die Markdown-Struktur in interaktive Elemente umzuwandeln. Die Skripte und Stylesheets werden automatisch in jede Seite eingebunden.

Die richtigen Antworten werden direkt im Markdown-Code gespeichert und sind für technisch versierte Nutzer einsehbar (wie bei jeder client-seitigen Lösung). Für eine sicherere Prüfungslösung wäre ein serverseitiges System erforderlich.
