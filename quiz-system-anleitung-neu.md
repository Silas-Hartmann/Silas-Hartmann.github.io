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
- Lückentexte mit mehreren Eingabefeldern
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

Multiple-Choice-Fragen werden mit einer Liste von Optionen definiert. Es gibt zwei Möglichkeiten:

#### a) Mit klassischen Aufzählungspunkten und Markierung der richtigen Antwort:

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

#### b) Mit Checkboxen (Aufgaben zum Ankreuzen):

```markdown
### Welche der folgenden Städte sind Hauptstädte?

- [ ] New York
- [x] Berlin
- [ ] Sydney
- [x] Paris
```

Wichtige Punkte:
- Die Frage selbst wird als Überschrift (mit `###`) definiert
- Antwortmöglichkeiten werden als Checkboxen dargestellt
- Richtige Antworten werden mit `[x]` oder `[X]` markiert, falsche mit `[ ]`
- Dieses Format ist besonders hilfreich für Fragen, bei denen mehrere Antworten richtig sein können

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

### 4. Lückentext-Fragen erstellen

Für Lückentexte, in denen mehrere fehlende Wörter ergänzt werden sollen:

```markdown
### Vervollständige den Satz:

Die [deutsche] Einheit wurde am [3. Oktober] [1990] gefeiert.

Lücken: deutsche, 3. Oktober|3.Oktober, 1990
```

Wichtige Punkte:
- Die Frage selbst wird als Überschrift (mit `###`) definiert
- Der Text enthält Platzhalter in eckigen Klammern `[...]`
- Unterhalb folgt eine Zeile, die mit `Lücken:` beginnt
- Die korrekten Antworten werden durch Kommas getrennt in der Reihenfolge der Lücken angegeben
- Alternative Antworten für jede Lücke können mit `|` getrennt werden
- Die Antwortzeile wird in der interaktiven Anzeige automatisch versteckt

## Wichtiger Hinweis zu normalen Aufzählungen vs. Quizfragen

Eine normale Aufzählung nach einer `###`-Überschrift wird **NICHT** automatisch als Quizfrage erkannt:

```markdown
### Merkmale des Ersten Weltkriegs

* Erster globaler Konflikt
* Einsatz neuer Waffentechnologien
* Millionen von Opfern
```

Die obige Aufzählung wird als normaler Text angezeigt und nicht in ein interaktives Quiz umgewandelt.

**Um eine Multiple-Choice-Quizfrage zu erstellen**, muss ENTWEDER:
- Eine der Antwortoptionen mit `(richtige Option)`, `(richtig)` oder `(correct)` markiert sein, ODER
- Das Checkbox-Format mit `- [ ]` und `- [x]` verwendet werden

## Beispiel für ein vollständiges Quiz

```markdown
## Quiz: Geographie-Test

### Die Hauptstadt von Frankreich ist:

- Paris (richtige Option)
- Lyon
- Marseille
- Nizza

### Welche dieser Städte liegen in Afrika?

- [ ] Seoul
- [x] Kairo
- [x] Nairobi
- [ ] Bangkok

### Nenne die chemische Formel für Kohlendioxid:

Gib die Formel an.

Antwort: CO2|CO₂

### Vervollständige den Satz:

[Deutschland] ist ein Land in [Europa] mit der Hauptstadt [Berlin].

Lücken: Deutschland, Europa, Berlin
```

## Beispiele

Vollständige Beispiel-Arbeitsblätter mit verschiedenen Quizformaten:

- [Physik-Quiz](beispiel-quiz-neu.html) (Multiple-Choice und Textantwort)
- [Lückentext-Beispiel](beispiel-lueckentext.html) (Lückentexte in verschiedenen Fächern)

## Tipps und Tricks

- **Wichtig**: Bei Multiple-Choice-Fragen mit einfachen Aufzählungen musst du die richtige Antwort mit `(richtige Option)` kennzeichnen
- Für Aufgaben mit mehreren richtigen Antworten oder zum Ankreuzen, verwende das Checkbox-Format mit `- [ ]` und `- [x]`
- Normale Aufzählungen unter einer `###`-Überschrift werden nicht als Quizfragen erkannt
- Schreibe die Fragen in einer klaren, präzisen Sprache
- Bei Multiple-Choice-Fragen sollten die falschen Antworten plausibel sein
- Bei Textantworten kannst du verschiedene Schreibweisen durch die Alternative-Syntax (`|`) akzeptieren
- Bei Lückentexten achte darauf, dass die Anzahl der Lücken und der angegebenen Antworten übereinstimmt
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