// Initialisierungsfunktion für den Text-Highlighter
function initTextHighlighter() {
  // Elemente erstellen
  createHighlighterUI();
  
  // Event-Listener für Textauswahl
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('touchend', handleTextSelection);
  
  // Gespeicherte Highlights laden und anwenden
  loadHighlights();
  
  // Prüfe, ob es der erste Besuch ist und zeige ggf. den Tooltip an
  checkFirstVisitAndShowTooltip();
}

// UI-Elemente erstellen
function createHighlighterUI() {
  // Floating-Button-Container erstellen
  const container = document.createElement('div');
  container.className = 'highlighter-container';
  
  // Haupt-Toggle-Button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'highlighter-toggle';
  toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 5-3 1.5-3-3-3 3-3-1.5L3 8l2 9 4 3 5 1 5-1 4-3 2-9-5-3z"/><path d="M9 11v4"/><path d="M15 11v4"/><path d="M9 15h6"/></svg>';
  toggleButton.title = 'Text markieren';
  container.appendChild(toggleButton);
  
  // Farbauswahl-Container
  const colorContainer = document.createElement('div');
  colorContainer.className = 'highlighter-colors';
  
  // Farboptionen
  const colors = [
    { name: 'yellow', hex: '#FFEB3B' },
    { name: 'green', hex: '#4CAF50' },
    { name: 'blue', hex: '#2196F3' },
    { name: 'red', hex: '#F44336' }
  ];
  
  // Erstellung der Farbschaltflächen
  colors.forEach(color => {
    const colorButton = document.createElement('button');
    colorButton.className = 'highlighter-color-option';
    colorButton.dataset.color = color.name;
    colorButton.style.backgroundColor = color.hex;
    colorButton.title = color.name.charAt(0).toUpperCase() + color.name.slice(1);
    
    colorButton.addEventListener('click', () => {
      highlightSelection(color.name);
    });
    
    colorContainer.appendChild(colorButton);
  });
  
  // Farboptionen in Container einfügen
  container.appendChild(colorContainer);
  
  // Container zur Seite hinzufügen
  document.body.appendChild(container);
  
  // Toggle-Funktion für die Farbauswahl
  toggleButton.addEventListener('click', () => {
    container.classList.toggle('colors-visible');
  });

  // Außerhalb klicken schließt Farbauswahl
  document.addEventListener('click', (event) => {
    if (!container.contains(event.target)) {
      container.classList.remove('colors-visible');
    }
  });
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
  // Erstelle Tooltip-Element
  const tooltip = document.createElement('div');
  tooltip.className = 'highlighter-tooltip';
  tooltip.innerHTML = `
    <div class="highlighter-tooltip-content">
      <p><strong>Text-Markierung:</strong></p>
      <ol>
        <li>Text markieren</li>
        <li>Auf diesen Button klicken <span class="tooltip-icon">🎯</span></li>
        <li>Farbe auswählen</li>
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
  
  // Tooltip automatisch nach 10 Sekunden ausblenden
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
  }, 10000);
}

// Behandelt die Textauswahl
function handleTextSelection(event) {
  const selection = window.getSelection();
  const highlighterContainer = document.querySelector('.highlighter-container');
  
  if (selection.toString().trim() !== '' && !selection.isCollapsed) {
    // Nur anzeigen, wenn die Highlighter-Farbauswahl sichtbar ist
    if (highlighterContainer.classList.contains('colors-visible')) {
      // Positioniere die Schaltflächen nicht - sie sind bereits als schwebende Schaltfläche sichtbar
    }
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
    
    // Highlight-Span erstellen
    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'text-highlight ' + color;
    
    // Wende das Highlight an
    range.surroundContents(highlightSpan);
    
    // Speichere das Highlight
    saveHighlight({
      path: window.location.pathname,
      color: color,
      textContent: highlightSpan.textContent,
      html: highlightSpan.outerHTML,
      id: generateUniqueId()
    });
    
    // Auswahl löschen
    selection.removeAllRanges();
    
    // Farbauswahl schließen
    document.querySelector('.highlighter-container').classList.remove('colors-visible');
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
