# Quiz-System für interaktive Arbeitsblätter

Ein einfaches, auf Markdown basierendes System zur Erstellung interaktiver Arbeitsblätter und Quizzes. Mit diesem System können Lehrkräfte und Bildungsexperten ohne HTML- oder JavaScript-Kenntnisse interaktive Übungen erstellen.

## Funktionen

- Automatische Umwandlung von Markdown zu interaktiven Quiz-Elementen
- Verschiedene Aufgabentypen: Multiple-Choice, Single-Choice, Textantworten, Lückentext
- Sofortiges Feedback zu Antworten
- Einfache Integration in beliebige Markdown-Dokumente
- PDF-Export für Arbeitsblätter und Lösungen
- Optimiert für die Verwendung mit Obsidian
- Mobil-freundliches, responsives Design

## Aufgabentypen

Es gibt zwei Möglichkeiten, Aufgaben zu definieren:

### A. Neue Format-Definition mit Typ-Markierung

Jede Aufgabe beginnt mit einer H3-Überschrift (###), gefolgt vom Wort "Aufgabe", einer Nummer und dem Typ in eckigen Klammern. Die Aufgabe wird durch eine horizontale Linie (---) beendet.

```markdown
### Aufgabe 1 [TYP]

Inhalt der Aufgabe...

---
```

Dabei kann TYP einer der folgenden sein:
- [MC] - Multiple Choice
- [SC] - Single Choice
- [OFFEN] - Offene Texteingabe
- [LÜCKE] - Lückentext

### B. Herkömmliches Format (weiterhin unterstützt)

Alternativ können Aufgaben auch weiterhin im herkömmlichen Format ohne explizite Typ-Markierung erstellt werden. Das System erkennt den Typ anhand des Inhalts.

### 1. Multiple-Choice-Fragen [MC]

Auswahl aus mehreren Optionen. Die richtige Antwort wird durch `(richtige Option)`, `(richtig)` oder `(correct)` am Ende markiert.

```markdown
### Aufgabe 1 [MC]

Welches dieser Tiere ist ein Säugetier?

- Krokodil
- Adler
- Delfin (richtige Option)
- Forelle
```

### 2. Single-Choice-Fragen [SC]

Ähnlich wie Multiple-Choice, jedoch wird explizit deutlich gemacht, dass nur eine Option ausgewählt werden soll.

```markdown
### Aufgabe 2 [SC]

Was ist die Hauptstadt von Deutschland?

- Paris
- London
- Berlin (richtige Option)
- Rom
```

### 3. Textantwort-Fragen [OFFEN]

Freitextfelder, bei denen die Antwort gegen eine oder mehrere mögliche Lösungen geprüft wird.

```markdown
### Aufgabe 3 [OFFEN]

Was ist die chemische Formel für Wasser?

Antwort: H2O|H₂O
```

### 4. Lückentext [LÜCKE]

Texte mit Lücken, in die der Benutzer die korrekten Begriffe eintragen muss.

```markdown
### Aufgabe 4 [LÜCKE]

Die [deutsche] Einheit wurde am [3. Oktober] [1990] gefeiert.

Lücken: deutsche, 3. Oktober|3.Oktober, 1990
```

## Einfache Erstellung

1. Erstelle eine neue `.md` Datei in diesem Repository
2. Füge den YAML-Header hinzu:
   ```yaml
   ---
   layout: default
   title: Dein Arbeitsblatt-Titel
   ---
   ```
3. Strukturiere dein Dokument mit Überschriften (# für Haupttitel, ## für Abschnitte)
4. Füge Quizfragen mit H3-Überschriften (###) hinzu und folge den Formatvorgaben
5. Du kannst entweder das neue Format mit Typkennzeichnung oder das herkömmliche Format verwenden

## Beispiele

Im Repository findest du bereits einige Beispiel-Arbeitsblätter:

- [Physik-Quiz](https://silas-hartmann.github.io/beispiel-quiz-neu.html) - Demonstriert Multiple-Choice und Textantworten
- [Lückentext-Beispiel](https://silas-hartmann.github.io/beispiel-lueckentext.html) - Zeigt die Verwendung von Lückentexten
- [Neue Aufgabenformate](https://silas-hartmann.github.io/beispiel-aufgabenformate.html) - Demonstriert alle Aufgabentypen im neuen Format

## PDF-Export

Das System bietet die Möglichkeit, Arbeitsblätter und Lösungen als PDF zu exportieren:

- **Arbeitsblatt als PDF**: Wandelt die interaktiven Elemente in ein druckbares Format um, mit ausreichend Platz zum handschriftlichen Ausfüllen
- **Lösung als PDF**: Enthält alle korrekten Antworten für eine einfache Kontrolle

Beide PDF-Varianten haben folgende Eigenschaften:
- Standardschriftgröße von 9 PT für optimale Lesbarkeit
- Lineatur für handschriftliche Einträge bei Textfeldern
- Checkbox-Darstellung für Multiple-Choice-Fragen
- Automatische Formatierung von Lückentexten mit Linien zum Ausfüllen

## Technische Details

Das System verwendet:
- Jekyll für die statische Website-Generierung
- Vanilla JavaScript für die Umwandlung der Markdown-Elemente in interaktive Quiz-Elemente
- CSS für das responsive Design und die Darstellung der Quiz-Elemente
- html2pdf.js für die Generierung der PDF-Dateien

Die Transformation von Markdown zu interaktiven Elementen erfolgt client-seitig mit dem JavaScript-Code in `assets/js/markdown-quiz.js`. Die Styles werden in `assets/css/quiz-styles.css` definiert. Die PDF-Export-Funktionalität befindet sich in `assets/js/pdf-export.js` mit zugehörigen Stilen in `assets/css/pdf-export.css`.

## Anpassung und Erweiterung

- **Design anpassen**: Ändere die CSS-Dateien, um das Aussehen der Quiz-Elemente anzupassen
- **Neue Aufgabentypen hinzufügen**: Erweitere die JavaScript-Dateien, um neue Aufgabentypen zu unterstützen
- **Markdown-Regeln ändern**: Passe die Erkennungsmuster für Fragen in der JavaScript-Datei an
- **PDF-Format anpassen**: Passe die PDF-Generierungsoptionen in `pdf-export.js` an

## Verwendung mit Obsidian

Dieses System ist optimal für den Obsidian-Workflow, da:
1. Du deine Arbeitsblätter in Obsidian erstellen und bearbeiten kannst
2. Die Markdown-Syntax mit Obsidian kompatibel ist
3. Nach dem Export zu GitHub Pages werden die statischen Markdown-Elemente in interaktive Quiz-Elemente umgewandelt

## Anleitung

Für eine detaillierte Anleitung besuche:
- [Anleitung zum Quiz-System](https://silas-hartmann.github.io/quiz-system-anleitung-neu.html)

## Für KI-Tools

Eine kompakte Anleitung für KI-Tools ist unter folgendem Link verfügbar:
- [KI-Anleitung für Arbeitsblatt-Erstellung](https://silas-hartmann.github.io/ki-anleitung-arbeitsblatt.html)
