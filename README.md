# Quiz-System für interaktive Arbeitsblätter

Ein einfaches, auf Markdown basierendes System zur Erstellung interaktiver Arbeitsblätter und Quizzes. Mit diesem System können Lehrkräfte und Bildungsexperten ohne HTML- oder JavaScript-Kenntnisse interaktive Übungen erstellen.

## Funktionen

- Automatische Umwandlung von Markdown zu interaktiven Quiz-Elementen
- Verschiedene Aufgabentypen: Multiple-Choice, Textantworten, Lückentext
- Sofortiges Feedback zu Antworten
- Einfache Integration in beliebige Markdown-Dokumente
- Optimiert für die Verwendung mit Obsidian
- Mobil-freundliches, responsives Design

## Aufgabentypen

### 1. Multiple-Choice-Fragen

Einfache Auswahl aus mehreren Optionen. Die richtige Antwort wird durch `(richtige Option)`, `(richtig)` oder `(correct)` am Ende markiert.

```markdown
### Wie lautet die Hauptstadt von Deutschland?

- Paris
- Berlin (richtige Option)
- Madrid
- Rom
```

### 2. Textantwort-Fragen

Freitextfelder, bei denen die Antwort gegen eine oder mehrere mögliche Lösungen geprüft wird.

```markdown
### Was ist die chemische Formel für Wasser?

Gib die Formel an.

Antwort: H2O|H₂O
```

### 3. Lückentext

Texte mit Lücken, in die der Benutzer die korrekten Begriffe eintragen muss.

```markdown
### Vervollständige den Satz:

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

## Beispiele

Im Repository findest du bereits einige Beispiel-Arbeitsblätter:

- [Physik-Quiz](https://silas-hartmann.github.io/beispiel-quiz-neu.html) - Demonstriert Multiple-Choice und Textantworten
- [Lückentext-Beispiel](https://silas-hartmann.github.io/beispiel-lueckentext.html) - Zeigt die Verwendung von Lückentexten

## Technische Details

Das System verwendet:
- Jekyll für die statische Website-Generierung
- Vanilla JavaScript für die Umwandlung der Markdown-Elemente in interaktive Quiz-Elemente
- CSS für das responsive Design und die Darstellung der Quiz-Elemente

Die Transformation von Markdown zu interaktiven Elementen erfolgt client-seitig mit dem JavaScript-Code in `assets/js/markdown-quiz.js`. Die Styles werden in `assets/css/quiz-styles.css` definiert.

## Anpassung und Erweiterung

- **Design anpassen**: Ändere die CSS-Datei, um das Aussehen der Quiz-Elemente anzupassen
- **Neue Aufgabentypen hinzufügen**: Erweitere die JavaScript-Datei, um neue Aufgabentypen zu unterstützen
- **Markdown-Regeln ändern**: Passe die Erkennungsmuster für Fragen in der JavaScript-Datei an

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
