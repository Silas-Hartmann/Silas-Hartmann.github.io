module.exports = async (params) => {
    // Zugriff auf die Obsidian API
    const app = this.app || window.app;
    
    // Nur die aktive Datei bearbeiten
    const activeView = app.workspace.getActiveViewOfType("markdown");
    
    if (!activeView) {
        new Notice("Keine Markdown-Datei geöffnet!");
        return;
    }
    
    const file = activeView.file;
    const content = await app.vault.read(file);
    
    // Links konvertieren
    const newContent = content
        .replace(/(?<!!)\[\[(.*?)(?:\|(.*?))?\]\]/g, (match, link, altText) => {
            const displayText = altText || link;
            return `[${displayText}](${link}.html)`;
        })
        .replace(/!\[\[(.*?)\]\]/g, (match, imageLink) => {
            return `![${imageLink}](${imageLink})`;
        });
    
    // Nur speichern, wenn es Änderungen gab
    if (content !== newContent) {
        await app.vault.modify(file, newContent);
        new Notice("Wiki-Links in der aktuellen Datei wurden konvertiert!");
    } else {
        new Notice("Keine Wiki-Links zum Konvertieren gefunden!");
    }

    return true;
};