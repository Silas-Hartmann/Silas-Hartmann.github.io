// obsidian-callouts.js - Konvertiert Obsidian-Callouts in HTML-Elemente

document.addEventListener('DOMContentLoaded', function() {
  console.log('Obsidian Callouts werden initialisiert...');
  processCallouts();
});

function processCallouts() {
  // Finde alle Blockquote-Elemente
  const blockquotes = document.querySelectorAll('blockquote');
  
  blockquotes.forEach(blockquote => {
    // Überprüfe, ob es sich um einen Obsidian-Callout handelt
    const firstParagraph = blockquote.querySelector('p:first-child');
    
    if (firstParagraph && firstParagraph.textContent.trim().startsWith('[!')) {
      let firstParagraphText = firstParagraph.textContent.trim();
      
      // Extrahiere den Callout-Typ
      const calloutTypeMatch = firstParagraphText.match(/\[!([a-zA-Z0-9-_]+)\]/);
      
      if (calloutTypeMatch) {
        const calloutType = calloutTypeMatch[1].toLowerCase();
        
        // Analysiere, ob es ein faltbarer Callout ist (+ oder -)
        let foldable = 0;
        let defaultState = 'expanded';
        
        if (firstParagraphText.includes('[!' + calloutType + ']+')) {
          foldable = 1;
          defaultState = 'expanded';
        } else if (firstParagraphText.includes('[!' + calloutType + ']-')) {
          foldable = 1;
          defaultState = 'collapsed';
        }
        
        // Extrahiere den Titel (Text nach der Callout-Deklaration)
        let title = '';
        const titleRegex = new RegExp('\\[!' + calloutType + '\\][+-]?\\s*(.*?)$');
        const titleMatch = firstParagraphText.match(titleRegex);
        
        if (titleMatch && titleMatch[1].trim()) {
          title = titleMatch[1].trim();
        } else {
          // Standard-Titel basierend auf dem Callout-Typ festlegen
          title = calloutType.charAt(0).toUpperCase() + calloutType.slice(1);
        }
        
        // Erstelle das Callout-Element
        const calloutDiv = document.createElement('div');
        calloutDiv.className = 'callout';
        calloutDiv.setAttribute('data-callout', calloutType);
        calloutDiv.setAttribute('data-callout-fold', foldable.toString());
        
        if (foldable && defaultState === 'collapsed') {
          calloutDiv.classList.add('is-collapsed');
        }
        
        // Erstelle das Icon-Element
        const iconDiv = document.createElement('div');
        iconDiv.className = 'callout-icon';
        calloutDiv.appendChild(iconDiv);
        
        // Erstelle den Content-Container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'callout-content';
        
        // Füge den Titel hinzu, wenn vorhanden
        const titleDiv = document.createElement('div');
        titleDiv.className = 'callout-title';
        titleDiv.textContent = title;
        contentDiv.appendChild(titleDiv);
        
        // Wenn faltbar, füge einen Event-Listener hinzu
        if (foldable) {
          titleDiv.addEventListener('click', function() {
            calloutDiv.classList.toggle('is-collapsed');
          });
        }
        
        // Kopiere alle Elemente aus der Blockquote außer dem ersten Paragraph
        // in das Content-Div
        const contentElements = Array.from(blockquote.children).slice(1);
        contentElements.forEach(element => {
          contentDiv.appendChild(element.cloneNode(true));
        });
        
        // Füge das Content-Div zum Callout-Div hinzu
        calloutDiv.appendChild(contentDiv);
        
        // Ersetze das Blockquote durch das Callout-Div
        blockquote.parentNode.replaceChild(calloutDiv, blockquote);
      }
    }
  });
}
