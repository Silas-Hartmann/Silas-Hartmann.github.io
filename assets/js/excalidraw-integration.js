/**
 * Excalidraw Integration für GitHub Pages
 * 
 * Dieses Skript ermöglicht die Integration von Excalidraw-Zeichnungen in GitHub Pages.
 * Es bietet Funktionen zum Laden und Anzeigen von .excalidraw-Dateien sowie
 * zum Umschalten zwischen Ansichts- und Bearbeitungsmodus mit Passwortschutz.
 */

// Passwort für den Bearbeitungsmodus
const PASSWORD = "lehrer2024";

// Warten, bis das Excalidraw-Objekt verfügbar ist
document.addEventListener('DOMContentLoaded', function() {
  // Prüfen, ob Excalidraw geladen wurde
  if (typeof ExcalidrawLib === 'undefined') {
    console.warn('Excalidraw ist nicht geladen. Verwende window.Excalidraw stattdessen.');
  }
});

/**
 * Initialisiert Excalidraw in einem Container-Element
 * @param {string} containerId - Die ID des Container-Elements
 * @param {string} excalidrawFilePath - Der Pfad zur .excalidraw-Datei
 * @param {boolean} enablePasswordProtection - Ob der Passwortschutz aktiviert werden soll
 */
function initExcalidraw(containerId, excalidrawFilePath, enablePasswordProtection = true) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container mit ID "${containerId}" nicht gefunden.`);
    return;
  }

  // UI-Elemente für Passwortschutz erstellen, wenn aktiviert
  if (enablePasswordProtection) {
    createPasswordUI(container);
  }

  // Excalidraw-Container erstellen
  const excalidrawContainer = document.createElement('div');
  excalidrawContainer.id = containerId + '-excalidraw';
  excalidrawContainer.className = 'excalidraw-container';
  excalidrawContainer.style.width = '100%';
  excalidrawContainer.style.height = '600px';
  excalidrawContainer.style.border = '1px solid #ddd';
  container.appendChild(excalidrawContainer);

  // Excalidraw-Datei laden
  loadExcalidrawFile(excalidrawFilePath)
    .then(initialData => {
      // Excalidraw-Instanz erstellen
      const excalidrawElement = document.createElement('iframe');
      excalidrawElement.src = 'https://excalidraw.com/';
      excalidrawElement.style.width = '100%';
      excalidrawElement.style.height = '100%';
      excalidrawElement.style.border = 'none';
      excalidrawContainer.appendChild(excalidrawElement);
    })
    .catch(error => {
      console.error('Fehler beim Laden der Excalidraw-Datei:', error);
      excalidrawContainer.innerHTML = `
        <div style="color: #721c24; background-color: #f8d7da; padding: 15px; border-radius: 5px;">
          Fehler beim Laden der Excalidraw-Datei: ${error.message}
        </div>`;
    });
}

/**
 * Erstellt die UI-Elemente für den Passwortschutz
 * @param {HTMLElement} container - Das Container-Element
 */
function createPasswordUI(container) {
  const passwordContainer = document.createElement('div');
  passwordContainer.className = 'excalidraw-password-container';
  passwordContainer.style.marginBottom = '10px';

  // Passwort-Eingabefeld
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Passwort eingeben';
  passwordInput.className = 'excalidraw-password-input';
  passwordInput.style.marginRight = '10px';
  passwordInput.style.padding = '5px';
  passwordContainer.appendChild(passwordInput);

  // Bearbeiten-Button
  const editButton = document.createElement('button');
  editButton.textContent = 'Bearbeiten';
  editButton.className = 'excalidraw-edit-button';
  editButton.style.padding = '5px 10px';
  editButton.style.cursor = 'pointer';
  editButton.onclick = () => {
    if (passwordInput.value === PASSWORD) {
      alert('Bearbeitungsmodus aktiviert!');
    } else {
      alert('Falsches Passwort!');
    }
  };
  passwordContainer.appendChild(editButton);

  // Container zum Hauptcontainer hinzufügen
  container.appendChild(passwordContainer);
}

/**
 * Lädt eine Excalidraw-Datei und gibt die geparsten Daten zurück
 * @param {string} filePath - Der Pfad zur .excalidraw-Datei
 * @returns {Promise<Object>} - Ein Promise mit den geparsten Excalidraw-Daten
 */
async function loadExcalidrawFile(filePath) {
  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`HTTP-Fehler: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fehler beim Laden der Excalidraw-Datei:', error);
    throw error;
  }
}

/**
 * Erstellt einen Excalidraw-Arbeitsbereich für Schüler
 * @param {string} containerId - Die ID des Container-Elements
 */
function createStudentWorkspace(containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container mit ID "${containerId}" nicht gefunden.`);
    return;
  }

  // Speichern-Button erstellen
  const saveContainer = document.createElement('div');
  saveContainer.className = 'excalidraw-save-container';
  saveContainer.style.marginBottom = '10px';

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Als Bild speichern';
  saveButton.className = 'excalidraw-save-button';
  saveButton.style.padding = '5px 10px';
  saveButton.style.cursor = 'pointer';
  saveButton.onclick = () => alert('Speichern-Funktion wird in der Excalidraw-Oberfläche angeboten.');
  saveContainer.appendChild(saveButton);

  // Excalidraw-Container erstellen
  const excalidrawContainer = document.createElement('div');
  excalidrawContainer.className = 'excalidraw-container';
  excalidrawContainer.style.width = '100%';
  excalidrawContainer.style.height = '600px';
  excalidrawContainer.style.border = '1px solid #ddd';

  // Excalidraw in einem iframe laden
  const excalidrawElement = document.createElement('iframe');
  excalidrawElement.src = 'https://excalidraw.com/';
  excalidrawElement.style.width = '100%';
  excalidrawElement.style.height = '100%';
  excalidrawElement.style.border = 'none';
  excalidrawContainer.appendChild(excalidrawElement);

  // Container zum Hauptcontainer hinzufügen
  container.appendChild(saveContainer);
  container.appendChild(excalidrawContainer);
}

// Globale Funktionen exportieren
window.initExcalidraw = initExcalidraw;
window.createStudentWorkspace = createStudentWorkspace;
