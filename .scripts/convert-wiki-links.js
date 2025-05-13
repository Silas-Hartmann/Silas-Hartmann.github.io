// Diese Funktion wird von QuickAdd aufgerufen
module.exports = async function(params) {
    const { app, obsidian } = params;
    const vault = app.vault;
    const fileCount = { total: 0, converted: 0 };
    
    // Funktion zum Anzeigen von Benachrichtigungen
    const showNotice = (message, duration = 4000) => {
        new obsidian.Notice(message, duration);
    };
    
    showNotice("Wiki-Links werden konvertiert...");
    
    // Alle Markdown-Dateien im Vault durchlaufen
    const files = vault.getMarkdownFiles();
    fileCount.total = files.length;
    
    for (const file of files) {
        try {
            const content = await vault.read(file);
            const newContent = convertWikiLinksToMarkdown(content);
            
            if (content !== newContent) {
                await vault.modify(file, newContent);
                fileCount.converted++;
            }
        } catch (error) {
            console.error(`Fehler beim Verarbeiten von ${file.path}:`, error);
        }
    }
    
    showNotice(`Konvertierung abgeschlossen! ${fileCount.converted} von ${fileCount.total} Dateien aktualisiert.`);
    
    // Die eigentliche Konvertierungsfunktion
    function convertWikiLinksToMarkdown(content) {
        // Wiki-Links, aber nicht Bild-Links
        const wikiLinkRegex = /(?<!!)\[\[(.*?)(?:\|(.*?))?\]\]/g;
        // Bild-Links
        const wikiImageLinkRegex = /!\[\[(.*?)\]\]/g;
        
        // Standard-Links umwandeln
        let newContent = content.replace(wikiLinkRegex, (match, link, altText) => {
            const displayText = altText || link;
            return `[${displayText}](${link}.html)`;
        });
        
        // Bild-Links umwandeln
        newContent = newContent.replace(wikiImageLinkRegex, (match, imageLink) => {
            return `![${imageLink}](${imageLink})`;
        });
        
        return newContent;
    }
    
    // Gibt true zurück, damit QuickAdd weiß, dass alles erfolgreich war
    return true;
};