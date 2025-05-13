const fs = require('fs');
const path = require('path');

// Konfiguration
const repoPath = '.'; // Aktuelles Verzeichnis
const fileExtension = '.md'; // Dateierweiterung der zu verarbeitenden Dateien

// Regex-Pattern für Wiki-Links - erfasst auch Bild-Links mit ![[...]]
// Hinweis: (?<![!]) bedeutet, dass dem [[ kein ! voransteht (negative lookbehind)
const wikiLinkRegex = /(?<!!)\[\[(.*?)(?:\|(.*?))?\]\]/g;
const wikiImageLinkRegex = /!\[\[(.*?)\]\]/g;

// Debug-Funktion zum Anzeigen von verarbeiteten Links
function debugLink(originalText, newText, filePath) {
  if (originalText !== newText) {
    console.log(`\nIn Datei ${filePath}:`);
    console.log(`Original: ${originalText}`);
    console.log(`Neu:      ${newText}`);
  }
}

// Funktion zum Umwandeln von Wiki-Links in Markdown-Links
function convertWikiLinksToMarkdown(content, sourceFilePath) {
  let newContent = content;
  
  // 1. Normale Wiki-Links umwandeln
  newContent = newContent.replace(wikiLinkRegex, (match, link, altText) => {
    // Wenn kein alternativer Text vorhanden ist, verwenden wir den Link als Text
    const displayText = altText || link;
    
    // Erstelle den Markdown-Link mit .html-Endung
    const newLink = `[${displayText}](${link}.html)`;
    
    // Debug-Ausgabe
    debugLink(match, newLink, sourceFilePath);
    
    return newLink;
  });
  
  // 2. Bild-Links umwandeln
  newContent = newContent.replace(wikiImageLinkRegex, (match, imageLink) => {
    // Erstelle den Markdown-Bild-Link
    const newImageLink = `![${imageLink}](${imageLink})`;
    
    // Debug-Ausgabe
    debugLink(match, newImageLink, sourceFilePath);
    
    return newImageLink;
  });
  
  return newContent;
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
      if (item !== '.git' && item !== 'node_modules' && item !== '_site' && !item.startsWith('.')) {
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
    const updatedContent = convertWikiLinksToMarkdown(content, filePath);
    
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
  console.log(`Arbeitsverzeichnis: ${process.cwd()}`);
  console.log('Verzeichnisinhalt:');
  try {
    const files = fs.readdirSync('.');
    files.forEach(file => {
      console.log(`- ${file}`);
    });
  } catch (error) {
    console.error('Fehler beim Lesen des Verzeichnisinhalts:', error);
  }
  
  try {
    processDirectory(repoPath);
    console.log('Umwandlung abgeschlossen!');
  } catch (error) {
    console.error('Fehler während der Verarbeitung:', error);
    process.exit(1);
  }
}

main();
