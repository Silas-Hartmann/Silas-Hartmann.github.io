// Initialisierungsfunktion für den Text-Highlighter
function initTextHighlighter() {
  // Elemente erstellen
  createHighlighterUI();
  
  // Event-Listener für Textauswahl
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('touchend', handleTextSelection);
  
  // Event-Listener für Klicks auf markierte Textstellen (Radiergummi-Funktion)
  document.addEventListener('click', handleEraserClick);
  
  // Gespeicherte Highlights laden und anwenden
  loadHighlights();
  
  // Prüfe, ob es der erste Besuch ist und zeige ggf. den Tooltip an
  checkFirstVisitAndShowTooltip();
}

// Zustandsvariablen
let eraserModeActive = false;
let highlighterModeActive = false;
let activeHighlightColor = null;

// Die verfügbaren Farben als Konstante
const HIGHLIGHT_COLORS = [
  { name: 'yellow', hex: '#FFEB3B' },
  { name: 'green', hex: '#4CAF50' },
  { name: 'blue', hex: '#2196F3' },
  { name: 'red', hex: '#F44336' }
];

// Aktuelle Position im Farb-Rotationssystem
let currentColorIndex = 0;

// UI-Elemente erstellen
function createHighlighterUI() {
  // Floating-Button-Container erstellen
  const container = document.createElement('div');
  container.className = 'highlighter-container';
  
  // Button-Container für Highlighter und Radiergummi
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'highlighter-buttons';
  
  // Haupt-Toggle-Button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'highlighter-toggle';
  // Lucide Highlighter-Icon
  toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-highlighter"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>';
  toggleButton.title = 'Text markieren';
  buttonContainer.appendChild(toggleButton);
  
  // Radiergummi-Button
  const eraserButton = document.createElement('button');
  eraserButton.className = 'eraser-toggle';
  // Lucide Eraser-Icon
  eraserButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>';
  eraserButton.title = 'Markierungen entfernen';
  buttonContainer.appendChild(eraserButton);
  
  // Button-Container dem Hauptcontainer hinzufügen
  container.appendChild(buttonContainer);
  
  // Container zur Seite hinzufügen
  document.body.appendChild(container);
  
  // Event-Listener für den Highlighter-Button
  toggleButton.addEventListener('click', () => {
    // Wenn Radiergummi aktiv ist, deaktivieren
    if (eraserModeActive) {
      deactivateEraserMode();
    }
    
    // Textmarker-Modus umschalten
    toggleHighlighterMode(toggleButton);
  });

  // Radiergummi-Funktion
  eraserButton.addEventListener('click', () => {
    // Wenn Textmarker aktiv ist, deaktivieren
    if (highlighterModeActive) {
      deactivateHighlighterMode();
    }
    
    // Radiergummi-Modus umschalten
    toggleEraserMode(eraserButton);
  });
}

// Aktiviert oder deaktiviert den Textmarker-Modus
function toggleHighlighterMode(toggleButton) {
  if (highlighterModeActive) {
    // Wenn bereits aktiv, deaktivieren
    deactivateHighlighterMode();
  } else {
    // Wenn nicht aktiv, aktivieren und Farbe rotieren
    highlighterModeActive = true;
    
    // Zur nächsten Farbe wechseln
    currentColorIndex = (currentColorIndex + 1) % HIGHLIGHT_COLORS.length;
    activeHighlightColor = HIGHLIGHT_COLORS[currentColorIndex].name;
    
    // UI aktualisieren
    updateHighlighterButton(toggleButton, activeHighlightColor);
    
    // Hinzufügen der Klasse für den aktiven Textmarker-Modus
    document.body.classList.add('highlighter-mode');
    document.body.classList.add(`highlighter-${activeHighlightColor}`);
  }
}

// Deaktiviert den Textmarker-Modus
function deactivateHighlighterMode() {
  highlighterModeActive = false;
  
  // Entferne alle Farb-Klassen vom Body
  document.body.classList.remove('highlighter-mode');
  HIGHLIGHT_COLORS.forEach(color => {
    document.body.classList.remove(`highlighter-${color.name}`);
  });
  
  // Button zurücksetzen
  const toggleButton = document.querySelector('.highlighter-toggle');
  if (toggleButton) {
    resetHighlighterButton(toggleButton);
  }
  
  activeHighlightColor = null;
}

// Aktualisiert das Aussehen des Textmarker-Buttons basierend auf der aktiven Farbe
function updateHighlighterButton(button, color) {
  // Entferne alle vorherigen Farb-Klassen
  HIGHLIGHT_COLORS.forEach(c => {
    button.classList.remove(`highlighter-active-${c.name}`);
  });
  
  // Füge die Klasse für die aktive Farbe hinzu
  button.classList.add(`highlighter-active-${color}`);
  
  // Setze Titel für bessere Bedienbarkeit
  button.title = `Textmarker aktiv (${color})`;
}

// Setzt den Textmarker-Button zurück
function resetHighlighterButton(button) {
  // Entferne alle Farb-Klassen
  HIGHLIGHT_COLORS.forEach(color => {
    button.classList.remove(`highlighter-active-${color.name}`);
  });
  
  button.title = 'Text markieren';
}

// Umschalten des Radiergummi-Modus
function toggleEraserMode(eraserButton) {
  eraserModeActive = !eraserModeActive;
  
  if (eraserModeActive) {
    // Radiergummi aktivieren
    eraserButton.classList.add('active');
    document.body.classList.add('eraser-mode');
  } else {
    // Radiergummi deaktivieren
    deactivateEraserMode();
  }
}

// Deaktiviert den Radiergummi-Modus
function deactivateEraserMode() {
  eraserModeActive = false;
  const eraserButton = document.querySelector('.eraser-toggle');
  if (eraserButton) {
    eraserButton.classList.remove('active');
  }
  document.body.classList.remove('eraser-mode');
}

// Handler für Klicks im Radiergummi-Modus
function handleEraserClick(event) {
  // Nur im Radiergummi-Modus aktiv
  if (!eraserModeActive) return;
  
  // Überprüfe, ob auf eine Textmarkierung geklickt wurde
  let target = event.target;
  
  // Wenn direkt auf eine Textmarkierung geklickt wurde
  if (target.classList && target.classList.contains('text-highlight')) {
    removeHighlight(target);
  }
  // Wenn auf ein Element innerhalb einer Textmarkierung geklickt wurde
  else {
    // Suche nach der übergeordneten Textmarkierung
    let parent = target.closest('.text-highlight');
    if (parent) {
      removeHighlight(parent);
    }
  }
}

// Entfernt eine Textmarkierung
function removeHighlight(highlightElement) {
  const highlightId = highlightElement.dataset.highlightId;
  
  try {
    // Text aus dem markierten Element extrahieren
    const text = highlightElement.textContent;
    
    // Erstelle ein Textknoten mit dem Inhalt
    const textNode = document.createTextNode(text);
    
    // Ersetze das Highlight-Element durch den Textknoten
    highlightElement.parentNode.replaceChild(textNode, highlightElement);
    
    // Aus dem localStorage entfernen
    removeHighlightFromStorage(highlightId);
  } catch (e) {
    console.error('Fehler beim Entfernen des Highlights:', e);
  }
}

// Entfernt ein Highlight aus dem localStorage
function removeHighlightFromStorage(highlightId) {
  try {
    let highlights = getHighlights();
    
    // Filtere das zu entfernende Highlight heraus
    highlights = highlights.filter(h => h.id !== highlightId);
    
    // Aktualisiere den localStorage
    localStorage.setItem('text-highlights', JSON.stringify(highlights));
  } catch (e) {
    console.error('Fehler beim Entfernen des Highlights aus dem Speicher:', e);
  }
}

// Prüft, ob es der erste Besuch ist und zeigt ggf. den Tooltip an
function checkFirstVisitAndShowTooltip() {
  if (!localStorage.getItem('highlighter-tooltip-shown')) {
    // Erstelle den Tooltip
    createTooltip();
    
    // Markiere, dass der Tooltip angezeigt wurde
    localStorage.setItem('highlighter-tooltip-shown', 'true');
  }
}

// Erstellt den Tooltip
function createTooltip() {
  // Das Highlighter-Icon für den Tooltip
  const highlighterIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-highlighter"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>';
  
  // Das Eraser-Icon für den Tooltip
  const eraserIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>';
  
  // Erstelle Tooltip-Element
  const tooltip = document.createElement('div');
  tooltip.className = 'highlighter-tooltip';
  tooltip.innerHTML = `
    <div class="highlighter-tooltip-content">
      <p><strong>Text-Markierung:</strong></p>
      <ol>
        <li>Auf diesen Button klicken <span class="tooltip-icon">${highlighterIconSvg}</span></li>
        <li>Text markieren, er wird automatisch hervorgehoben</li>
        <li>Erneuter Klick auf den Button deaktiviert die Funktion</li>
      </ol>
      <p><strong>Markierungen entfernen:</strong></p>
      <ol>
        <li>Auf diesen Button klicken <span class="tooltip-icon eraser-icon">${eraserIconSvg}</span></li>
        <li>Auf eine Markierung klicken, um sie zu entfernen</li>
      </ol>
      <button class="tooltip-close-btn">Verstanden</button>
    </div>
    <div class="tooltip-arrow"></div>
  `;
  
  // Zur Seite hinzufügen
  document.body.appendChild(tooltip);
  
  // Position des Tooltips berechnen und setzen
  const highlighterButton = document.querySelector('.highlighter-toggle');
  if (highlighterButton) {
    const buttonRect = highlighterButton.getBoundingClientRect();
    
    // Position des Tooltips setzen
    tooltip.style.bottom = `${window.innerHeight - buttonRect.top + 10}px`;
    tooltip.style.right = `${window.innerWidth - buttonRect.left - buttonRect.width / 2}px`;
  }
  
  // Event-Listener für den "Verstanden"-Button
  const closeButton = tooltip.querySelector('.tooltip-close-btn');
  closeButton.addEventListener('click', () => {
    tooltip.classList.add('tooltip-hiding');
    
    // Nach der Animation entfernen
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    }, 300);
  });
  
  // Tooltip automatisch nach 15 Sekunden ausblenden (längere Zeit wegen mehr Inhalt)
  setTimeout(() => {
    if (tooltip.parentNode && !tooltip.classList.contains('tooltip-hiding')) {
      tooltip.classList.add('tooltip-hiding');
      
      // Nach der Animation entfernen
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 300);
    }
  }, 15000);
}

// Behandelt die Textauswahl
function handleTextSelection(event) {
  // Im Radiergummi-Modus keine Textauswahl verarbeiten
  if (eraserModeActive) return;
  
  // Wenn Textmarker-Modus aktiv ist, automatisch hervorheben
  if (highlighterModeActive && activeHighlightColor) {
    const selection = window.getSelection();
    
    if (selection.toString().trim() !== '' && !selection.isCollapsed) {
      highlightSelection(activeHighlightColor);
    }
    return;
  }
}

// Markiert die ausgewählte Textstelle
function highlightSelection(color) {
  const selection = window.getSelection();
  
  if (selection.toString().trim() === '') {
    return;
  }
  
  try {
    // Container für das Highlight
    const range = selection.getRangeAt(0);
    
    // Nicht hervorheben, wenn Elemente mehrere Block-Elemente umfassen
    // Dies verhindert seltsame Formatierungen über mehrere Container hinweg
    const startNode = range.startContainer;
    const endNode = range.endContainer;
    let startBlock = startNode.nodeType === Node.TEXT_NODE ? startNode.parentNode : startNode;
    let endBlock = endNode.nodeType === Node.TEXT_NODE ? endNode.parentNode : endNode;
    
    while (startBlock && !isBlockElement(startBlock)) {
      startBlock = startBlock.parentNode;
    }
    
    while (endBlock && !isBlockElement(endBlock)) {
      endBlock = endBlock.parentNode;
    }
    
    // Wenn die Auswahl verschiedene Block-Elemente umfasst, abbrechen
    if (startBlock !== endBlock) {
      console.warn('Highlights können nicht über mehrere Block-Elemente erstellt werden.');
      return;
    }
    
    // Generiere eine eindeutige ID
    const highlightId = generateUniqueId();
    
    // Highlight-Span erstellen
    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'text-highlight ' + color;
    highlightSpan.dataset.highlightId = highlightId;
    
    // Wende das Highlight an
    range.surroundContents(highlightSpan);
    
    // Speichere das Highlight
    saveHighlight({
      path: window.location.pathname,
      color: color,
      textContent: highlightSpan.textContent,
      html: highlightSpan.outerHTML,
      id: highlightId
    });
    
    // Auswahl löschen
    selection.removeAllRanges();
  } catch (e) {
    console.error('Fehler beim Hervorheben:', e);
  }
}

// Prüft, ob ein Element ein Block-Element ist
function isBlockElement(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
  
  const display = window.getComputedStyle(element).display;
  return display === 'block' || display === 'flex' || display === 'grid';
}

// Generiert eine eindeutige ID für Highlights
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Speichert ein Highlight im localStorage
function saveHighlight(highlight) {
  try {
    let highlights = getHighlights();
    highlights.push(highlight);
    localStorage.setItem('text-highlights', JSON.stringify(highlights));
  } catch (e) {
    console.error('Fehler beim Speichern des Highlights:', e);
  }
}

// Lädt alle Highlights aus dem localStorage
function getHighlights() {
  try {
    const savedHighlights = localStorage.getItem('text-highlights');
    return savedHighlights ? JSON.parse(savedHighlights) : [];
  } catch (e) {
    console.error('Fehler beim Laden der Highlights:', e);
    return [];
  }
}

// Wendet gespeicherte Highlights auf die aktuelle Seite an
function loadHighlights() {
  const highlights = getHighlights();
  const currentPath = window.location.pathname;
  
  // Filtere Highlights für die aktuelle Seite
  const pageHighlights = highlights.filter(h => h.path === currentPath);
  
  if (pageHighlights.length === 0) return;
  
  // Verzögerung, um sicherzustellen, dass die Seite vollständig geladen ist
  setTimeout(() => {
    pageHighlights.forEach(highlight => {
      applyHighlight(highlight);
    });
  }, 500);
}

// Wendet ein einzelnes Highlight an
function applyHighlight(highlight) {
  try {
    // Suche den exakten Text
    const textNodes = getTextNodesIn(document.body);
    
    for (let i = 0; i < textNodes.length; i++) {
      const node = textNodes[i];
      const text = node.textContent;
      
      if (text.includes(highlight.textContent)) {
        const range = document.createRange();
        const startIndex = text.indexOf(highlight.textContent);
        
        range.setStart(node, startIndex);
        range.setEnd(node, startIndex + highlight.textContent.length);
        
        const span = document.createElement('span');
        span.className = 'text-highlight ' + highlight.color;
        span.dataset.highlightId = highlight.id;
        
        try {
          range.surroundContents(span);
          break; // Nach erfolgreicher Anwendung beenden
        } catch (e) {
          console.warn('Konnte Highlight nicht anwenden:', e);
        }
      }
    }
  } catch (e) {
    console.error('Fehler beim Anwenden des Highlights:', e);
  }
}

// Findet alle Textknoten innerhalb eines Elements
function getTextNodesIn(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.trim() !== '') {
      textNodes.push(node);
    }
  }
  
  return textNodes;
}

// Ereignis-Listener für das Laden des DOM
document.addEventListener('DOMContentLoaded', initTextHighlighter);
