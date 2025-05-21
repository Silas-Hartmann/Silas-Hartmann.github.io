# Github-Pages Repository für Unterrichtsmaterial

dies ist ein github Pages repository, mithilfe dessen eine Lehkraft Unterrichtsmaterial mit ihren Schülern teilen kann. Die Unterrichtsmaterialien werden dabei erst als markdown erstellt und dann mittels js und css Dateien und der integrierten Funktionalität von github pages in html umgewandelt. 

## Bisher enthaltene Features

- Umwandlung einfacher Markdown-Dokumente in html Dateien
- Quiz-Funktionalität mit interaktiven Aufgabenformen und der Möglichkeit zur Selbstkorrektur
- Feature für Texthighlighting in Arbeitsblätter, verschiedenfarbige Markierungen und Radierfunktion
- rudimentäres System zum PDF Export

## Geplante Features

- Integration von Excalidraw
- Verbesserung des PDF-Exports
- integration weiterer Aufgabenformate
- Differenzierung der verschiedenen Seiten nach Typ mit individuellen Features


# Quiz-Beispielformate für interaktive Arbeitsblätter

> **WICHTIG:** Für die korrekte Erkennung und Verarbeitung der Quiz-Aufgaben ist die genaue Einhaltung des Formats entscheidend. Jede Aufgabe muss mit einer H3-Überschrift im Format `### Aufgabe X [TYP]` beginnen, wobei X die Aufgabennummer und TYP einer der unterstützten Typen (MC, SC, OFFEN, LÜCKE, ORDER) ist. Nach jeder Aufgabe muss ein horizontaler Trennstrich (`---`) folgen, um die Aufgaben voneinander zu trennen. Abweichungen von diesem Format können dazu führen, dass die Aufgaben nicht korrekt erkannt und in interaktive Elemente umgewandelt werden.

Hier ist eine Datei, die alle unterstützten Aufgabenformate mit korrekter Markdown-Syntax demonstriert:

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

## Code-Struktur und Funktionsweise (Quiz)

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
