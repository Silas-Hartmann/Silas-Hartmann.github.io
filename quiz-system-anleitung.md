---
layout: default
title: Anleitung zum Quiz-System
---

# Anleitung zum Markdown-basierten Quiz-System

Mit diesem System kannst du interaktive Quizfragen direkt in deinen Markdown-Dateien erstellen, ohne HTML-Code schreiben zu müssen. Das ist besonders praktisch, wenn du Obsidian für die Verwaltung deiner Inhalte verwendest.

## Was kann das Quiz-System?

Das Quiz-System ermöglicht:

- Multiple-Choice-Fragen mit automatischer Auswertung
- Textantworten mit Prüfung gegen mehrere mögliche richtige Antworten
- Kombination mehrerer Quizfragen in einem Arbeitsblatt
- Sofortiges Feedback für Schülerinnen und Schüler
- Zusammenfassung mit Gesamtergebnis

## Wie erstelle ich ein Quiz?

### 1. Quiz-Bereich definieren

Ein Quiz-Bereich wird mit dem Tag `:::quiz` begonnen und mit `:::` beendet:

```markdown
:::quiz

[Hier kommen deine Fragen]

:::
```

### 2. Multiple-Choice-Fragen erstellen

Multiple-Choice-Fragen werden mit einer Überschrift (Markdown-Syntax `###`) und einfachen Listen definiert:

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
:::quiz

### Die Hauptstadt von Frankreich ist:

- Paris (richtige Option)
- Lyon
- Marseille
- Nizza

### Nenne die chemische Formel für Kohlendioxid:

Antwort: CO2|CO₂

:::
```

### 5. Mehrere Quizzes auf einer Seite

Du kannst mehrere Quiz-Bereiche auf einer Seite definieren:

```markdown
## Einführungsquiz

:::quiz
... Quizfragen ...
:::

## Fortgeschrittenes Quiz

:::quiz
... Weitere Quizfragen ...
:::
```

Jeder Quiz-Bereich hat seinen eigenen "Antworten überprüfen"-Button und separate Auswertung.

## Beispiel

Ein vollständiges Beispiel-Arbeitsblatt mit Quiz findest du hier: [Physik-Quiz](beispiel-quiz.html)

## Tipps und Tricks

- **Wichtig**: Bei Multiple-Choice-Fragen musst du die richtige Antwort mit `(richtige Option)` kennzeichnen
- Schreibe die Fragen in einer klaren, präzisen Sprache
- Bei Multiple-Choice-Fragen sollten die falschen Antworten plausibel sein
- Bei Textantworten kannst du verschiedene Schreibweisen durch die Alternative-Syntax (`|`) akzeptieren
- Das Quiz-System ist responsive und funktioniert auf Mobilgeräten
- Du kannst beliebig viele Quizfragen in einem Quiz-Bereich kombinieren

## Technische Details

Das Quiz-System verwendet JavaScript, um die Markdown-Struktur in interaktive Elemente umzuwandeln. Die Skripte und Stylesheets werden automatisch in jede Seite eingebunden.

Die richtigen Antworten werden direkt im Markdown-Code gespeichert und sind für technisch versierte Nutzer einsehbar (wie bei jeder client-seitigen Lösung). Für eine sicherere Prüfungslösung wäre ein serverseitiges System erforderlich.
