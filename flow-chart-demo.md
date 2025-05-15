---
layout: default # Or whatever layout your GitHub Pages site uses
title: Flow Chart Demo (Markdown)
---

# Interaktive Prozessdarstellung (Markdown Demo)

Dies ist eine Demo, wie ein Flow Chart aus Markdown-Syntax generiert werden kann.

## Beispiel Flow Chart

```flow-chart
1. England und Frankreich wollen das gleiche Stück Land kontrollieren
2. Es kommt zum Streit, es droht Krieg auch in Europa
3. Frankreich gibt nach
4. Die Beiden schließen ein Bündnis, weil sie Angst vor Deutschland haben
```

## Zweites Beispiel (kürzer)

```flow-chart
1. Schritt 1: Idee
2. Schritt 2: Planung
3. Schritt 3: Umsetzung
4. Schritt 4: Testen
5. Schritt 5: Veröffentlichung
```

## Wichtige Hinweise

Damit dies auf einer GitHub Pages Seite funktioniert, die Markdown in HTML umwandelt (z.B. mit Jekyll), müssen Sie sicherstellen:

1.  Die CSS-Datei (`assets/css/flow-chart.css`) ist korrekt verlinkt, typischerweise im `<head>` Ihrer Layout-Datei (z.B. `_layouts/default.html`).
    Beispiel für den Link im Head:
    `<link rel="stylesheet" href="{{ '/assets/css/flow-chart.css' | relative_url }}">`
2.  Die JavaScript-Datei (`assets/js/flow-chart.js`) ist korrekt eingebunden, typischerweise am Ende des `<body>` Ihrer Layout-Datei.
    Beispiel für das Skript-Tag:
    `<script src="{{ '/assets/js/flow-chart.js' | relative_url }}"></script>`

Wenn Ihr Markdown-Prozessor die ` ```flow-chart ` Syntax nicht in `<pre><code class="language-flow-chart">...</code></pre>` umwandelt, oder wenn Sie es direkt in HTML-Dateien verwenden möchten, können Sie die manuelle Methode mit `<div class="flow-chart-markdown-source">...</div>` verwenden, wie in `flow-chart-demo.html` gezeigt.
