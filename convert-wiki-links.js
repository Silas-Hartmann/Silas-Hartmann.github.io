const fs = require('fs');
const path = require('path');

// Konfiguration
const repoPath = '.'; // Aktuelles Verzeichnis (passen Sie das an, wenn Sie das Skript von einem anderen Verzeichnis aus ausführen)
const fileExtension = '.md'; // Dateierweiterung der zu verarbeitenden Dateien

// Regex-Pattern für Wiki-Links
// [[Link]] oder [[Link|Text]]
const wikiLinkRegex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;

// Funktion zum Umwandeln von Wiki-Links in Markdown-Links
function convertWikiLinksToMarkdown(content) {
  return content.replace(wikiLinkRegex, (match, link, altText) => {
    // Wenn kein alternativer Text vorhanden ist, verwenden wir den Link als Text
    const displayText = altText || link;
    
    // Erstelle den Markdown-Link mit .html-Endung
    return `[${displayText}](${link}.html)`;
  });
}

// Funktion zum rekursiven Durchsuchen eines Verzeichnisses
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Wenn es ein Verzeichnis ist, verarbeite es rekursiv
      // Ignoriere .git und andere spezielle Verzeichnisse
      if (item !== '.git' && item !== 'node_modules' && !item.startsWith('.')) {
        processDirectory(itemPath);
      }
    } else if (stats.isFile() && item.endsWith(fileExtension)) {
      // Wenn es eine Markdown-Datei ist, verarbeite sie
      processFile(itemPath);
    }
  }
}

// Funktion zum Verarbeiten einer Datei
function processFile(filePath) {
  console.log(`Verarbeite Datei: ${filePath}`);
  
  try {
    // Dateiinhalt lesen
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Wiki-Links in Markdown-Links umwandeln
    const updatedContent = convertWikiLinksToMarkdown(content);
    
    // Wenn Änderungen vorgenommen wurden, schreibe die aktualisierte Datei
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Links in Datei ${filePath} umgewandelt`);
    } else {
      console.log(`Keine Änderungen in Datei ${filePath}`);
    }
  } catch (error) {
    console.error(`Fehler beim Verarbeiten der Datei ${filePath}:`, error);
  }
}

// Hauptfunktion
function main() {
  console.log('Starte Umwandlung von Wiki-Links zu Markdown-Links...');
  processDirectory(repoPath);
  console.log('Umwandlung abgeschlossen!');
}

main();
