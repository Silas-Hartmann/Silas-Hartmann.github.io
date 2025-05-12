# Quiz-Beispielformate für interaktive Arbeitsblätter

Hier ist eine Datei, die alle unterstützten Aufgabenformate mit korrekter Markdown-Syntax demonstriert:

```markdown
# Quiz-Übungssammlung

## Multiple-Choice-Aufgaben

### Aufgabe 1 [MC]
Welche Planeten gehören zu unserem Sonnensystem?
- Merkur (richtige Option)
- Pluto
- Venus (richtige Option)
- Andromeda
- Mars (richtige Option)
---

## Single-Choice-Aufgaben

### Aufgabe 2 [SC]
Was ist die Hauptstadt von Frankreich?
- London
- Berlin
- Paris (richtig)
- Madrid
---

## Offene Fragen

### Aufgabe 3 [OFFEN]
Erkläre in eigenen Worten, was der Klimawandel ist und nenne mindestens zwei Folgen.

Antwort: Der Klimawandel bezeichnet die langfristige Veränderung des Erdklimas durch menschliche Aktivitäten. Folgen sind unter anderem steigende Meeresspiegel und extreme Wetterereignisse.
---

## Lückentext-Aufgaben

### Aufgabe 4 [LÜCKE]
Vervollständige den Text über das Sonnensystem:

Das [Sonnensystem] besteht aus der [Sonne] und allen Himmelskörpern, die sie umkreisen.

Lücken: Sonnensystem, Sonne
---

## Reihenfolge-Aufgaben

### Aufgabe 5 [ORDER]
Bringe die folgenden Schritte in die richtige Reihenfolge:

1. Erster Schritt
2. Zweiter Schritt
3. Dritter Schritt
4. Vierter Schritt
---
```

# Überarbeitete README.md

```markdown
# Quiz-System für interaktive Arbeitsblätter

Ein modulares JavaScript-System zur automatischen Umwandlung von Markdown-Aufgaben in interaktive Quiz-Elemente. Einfach zu verwenden, ohne HTML- oder JavaScript-Kenntnisse.

## Aufgabenformat und Syntax

Alle Aufgaben folgen diesem einheitlichen Format:

```markdown
### Aufgabe X [TYP]
Aufgabentext und -inhalte je nach Typ
---
```

- Die Überschrift beginnt mit `### Aufgabe` gefolgt von einer Nummer
- Der Typ steht in eckigen Klammern: [MC], [SC], [OFFEN], [LÜCKE] oder [ORDER]
- Jede Aufgabe endet mit einem Trennstrich `---`

## Unterstützte Aufgabentypen

### 1. Multiple-Choice [MC]
**Format:**
```markdown
### Aufgabe X [MC]
Fragetext
- Option 1
- Option 2 (richtige Option)
- Option 3
---
```
Markierung richtiger Antworten durch `(richtige Option)`, `(richtig)` oder `(correct)`.

### 2. Single-Choice [SC]
**Format:**
```markdown
### Aufgabe X [SC]
Fragetext
- Option 1
- Option 2 (richtig)
- Option 3
---
```
Technisch wie MC, aber semantisch für Einzelauswahl.

### 3. Lückentext [LÜCKE]
**Format:**
```markdown
### Aufgabe X [LÜCKE]
Text mit [Lücke1] und [Lücke2].
Lücken: Wort1, Wort2
---
```
Alternative Antworten mit Pipe-Symbol: `Lücken: Wort1|Alternative1, Wort2`

### 4. Offene Aufgaben [OFFEN]
**Format:**
```markdown
### Aufgabe X [OFFEN]
Fragetext
Antwort: Erwartete Antwort als Musterlösung
---
```
Mit Selbsteinschätzungs-Buttons nach der Überprüfung.

### 5. Reihenfolge [ORDER]
**Format:**
```markdown
### Aufgabe X [ORDER]
Aufgabenstellung
1. Erster Schritt
2. Zweiter Schritt
3. Dritter Schritt
---
```
Die korrekte Reihenfolge wird aus der nummerierten Liste übernommen.

## Code-Struktur und Funktionsweise

Das System besteht aus zwei Hauptdateien:
- **markdown-quiz.js**: Transformiert Markdown zu interaktiven Quiz-Elementen
- **quiz-styles.css**: Definiert das visuelle Erscheinungsbild der Quiz-Elemente

### Hauptkomponenten des Codes:

1. **Erkennung der Quizfragen**: 
   - Scannt nach H3-Überschriften mit dem Format `### Aufgabe X [TYP]`
   - Sammelt alle zugehörigen Elemente bis zum nächsten Trennstrich

2. **Aufgabenverarbeitung**:
   - Extrahiert Typ, Frage, Optionen und korrekte Antworten
   - Erstellt entsprechende interaktive HTML-Elemente (Checkboxen, Eingabefelder, etc.)
   - Implementiert Drag & Drop für Lückentext und Reihenfolge-Aufgaben

3. **Antwortüberprüfung**:
   - Vergleicht Benutzereingaben mit den hinterlegten korrekten Antworten
   - Gibt visuelles Feedback und zeigt bei Bedarf korrekte Lösungen
   - Berechnet das Gesamtergebnis aller Aufgaben

### JavaScript-Funktionen:

- `checkIfNewFormatQuizQuestion()`: Erkennt Quizfragen im vorgegebenen Format
- `collectQuestionElements()`: Sammelt alle zu einer Frage gehörenden Elemente
- `processQuestion()`: Hauptfunktion zur Umwandlung in interaktive Elemente
- `checkAllAnswers()`: Überprüft alle Antworten und gibt Feedback
- `shuffleArray()`: Hilfsfunktion zum Zufallsmischen von Arrays (für Lückentext)

## Spezielle Features

- **Drag & Drop**: Für Lückentext und Reihenfolge-Aufgaben mit der nativen Drag & Drop API
- **Visuelle Rückmeldung**: Farbliches Feedback (grün für richtig, rot für falsch)
- **Anzeige korrekter Lösungen**: Bei falschen Antworten werden die richtigen Lösungen angezeigt
- **Selbsteinschätzung**: Bei offenen Aufgaben mit Bewertungsbuttons

## Integration in eigene Seiten

1. Binde die CSS- und JS-Dateien in dein HTML-Dokument ein:
   ```html
   <link rel="stylesheet" href="quiz-styles.css">
   <script src="markdown-quiz.js" defer></script>
   ```

2. Erstelle Markdown-Inhalte mit den beschriebenen Aufgabenformaten
3. Das Script wandelt automatisch alle passenden H3-Überschriften in interaktive Quizfragen um

## Beispiele

Im Repository findest du Beispiel-Arbeitsblätter:
- [Physik-Quiz](https://silas-hartmann.github.io/beispiel-quiz-neu.html)
- [Lückentext-Beispiel](https://silas-hartmann.github.io/beispiel-lueckentext.html)

## Anpassung und Erweiterung

- **Design anpassen**: Modifiziere die CSS-Datei `quiz-styles.css`
- **Neue Aufgabentypen**: Erweitere die `processQuestion()` Funktion in `markdown-quiz.js`
- **Markdown-Regeln ändern**: Passe die Erkennungsmuster in `checkIfNewFormatQuizQuestion()` an
```

Diese README bietet jetzt detaillierte Informationen über:
1. Das korrekte Markdown-Format für alle Quiz-Typen
2. Die Struktur des JavaScript-Codes und seine Hauptfunktionen
3. Die Integration des Systems in eigene Seiten
4. Anpassungs- und Erweiterungsmöglichkeiten