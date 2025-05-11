// pdf-export.js - Funktionalität für den Export von Arbeitsblättern als PDF

document.addEventListener('DOMContentLoaded', function() {
  console.log('PDF-Export-System wird geladen...');
  
  // Prüfen, ob html2pdf verfügbar ist
  if (typeof html2pdf === 'undefined') {
    console.error('HTML2PDF-Bibliothek wurde nicht geladen. PDF-Export wird nicht verfügbar sein.');
    return;
  } else {
    console.log('HTML2PDF-Bibliothek gefunden. PDF-Export ist verfügbar.');
  }
  
  // Funktion zum Hinzufügen der PDF-Download-Buttons am Ende der Seite
  function addPdfButtons() {
    const mainContent = document.querySelector('.main-content') || document.querySelector('main') || document.body;
    const existingButtons = document.querySelectorAll('.pdf-download-btn');
    
    // Nur hinzufügen, wenn noch keine PDF-Buttons vorhanden sind
    if (existingButtons.length === 0) {
      // Container für die Buttons erstellen
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'pdf-buttons-container';
      
      // Button für das Arbeitsblatt
      const worksheetButton = document.createElement('button');
      worksheetButton.textContent = 'Arbeitsblatt als PDF herunterladen';
      worksheetButton.className = 'pdf-download-btn worksheet-btn';
      worksheetButton.addEventListener('click', function() {
        generatePDF(false);
      });
      
      // Button für die Lösung
      const solutionButton = document.createElement('button');
      solutionButton.textContent = 'Lösung als PDF herunterladen';
      solutionButton.className = 'pdf-download-btn solution-btn';
      solutionButton.addEventListener('click', function() {
        generatePDF(true);
      });
      
      // Buttons zum Container hinzufügen
      buttonContainer.appendChild(worksheetButton);
      buttonContainer.appendChild(solutionButton);
      
      // Container nach dem "Antworten überprüfen" Button einfügen oder am Ende
      const checkButton = document.querySelector('.check-all-answers-btn');
      if (checkButton && checkButton.parentNode) {
        checkButton.parentNode.insertBefore(buttonContainer, checkButton.nextSibling);
      } else {
        mainContent.appendChild(buttonContainer);
      }
    }
  }
  
  // Funktion zur Generierung des PDFs
  function generatePDF(includeSolutions) {
    console.log('PDF-Generierung gestartet, Lösungen einschließen:', includeSolutions);
    
    // Status-Anzeige
    const statusMsg = document.createElement('div');
    statusMsg.className = 'pdf-status-message';
    statusMsg.textContent = 'PDF wird generiert...';
    statusMsg.style.position = 'fixed';
    statusMsg.style.top = '50%';
    statusMsg.style.left = '50%';
    statusMsg.style.transform = 'translate(-50%, -50%)';
    statusMsg.style.padding = '20px';
    statusMsg.style.background = 'rgba(0,0,0,0.7)';
    statusMsg.style.color = 'white';
    statusMsg.style.borderRadius = '5px';
    statusMsg.style.zIndex = '9999';
    document.body.appendChild(statusMsg);
    
    try {
      // Seite für den Druck vorbereiten
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Bitte erlauben Sie Popup-Fenster für diese Seite, um PDFs zu generieren.');
        document.body.removeChild(statusMsg);
        return;
      }
      
      // Titel aus der aktuellen Seite holen
      const title = document.title || 'Arbeitsblatt';
      const pageTitle = includeSolutions ? `${title} - Lösung` : title;
      
      // Inhalte für das Druckfenster vorbereiten
      const content = preparePrintContent(includeSolutions);
      
      // Druck-Fenster aufbauen
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${pageTitle}</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 9pt;
              line-height: 1.3;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 0;
            }
            h1 { font-size: 14pt; margin-top: 0; }
            h2 { font-size: 12pt; }
            h3 { font-size: 10pt; }
            .interactive-quiz-question {
              border: 1px solid #ddd;
              margin: 15px 0;
              padding: 10px;
              page-break-inside: avoid;
            }
            .question-prompt {
              font-weight: bold;
              margin-bottom: 10px;
            }
            .formatted-question {
              margin-bottom: 10px;
              padding: 15px;
              background-color: #fff;
              border-radius: 6px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            }
            .option-label {
              display: flex;
              align-items: center;
              padding: 5px;
              margin: 5px 0;
            }
            .pdf-checkbox {
              display: inline-block;
              width: 12px;
              height: 12px;
              border: 1px solid #000;
              margin-right: 8px;
              vertical-align: middle;
            }
            .pdf-lined-textarea {
              position: relative;
              width: 100%;
              min-height: 120px;
              border: 1px solid #ddd;
              padding: 0;
              background: linear-gradient(transparent, transparent 19px, #ccc 19px, #ccc 20px);
              background-size: 100% 20px;
              line-height: 20px;
              margin-top: 10px;
            }
            .pdf-gap-line {
              display: inline-block;
              width: 100px;
              height: 1px;
              border-bottom: 1px solid #000;
              margin: 0 3px;
              vertical-align: middle;
            }
            .pdf-correct-answer {
              font-weight: bold;
              color: #388E3C;
              background-color: rgba(76, 175, 80, 0.1);
              border-radius: 4px;
              padding: 5px;
            }
            .pdf-solution {
              font-weight: bold;
              color: #1976D2;
              border: 1px solid #1976D2;
              background-color: rgba(33, 150, 243, 0.1);
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              .no-print {
                display: none;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${content}
          </div>
          <script>
            // Automatischer Druck, sobald die Seite geladen ist
            window.onload = function() {
              window.print();
              setTimeout(function() {
                // Fenster nach kurzer Zeit schließen, falls der Benutzer den Druck abbricht
                window.close();
              }, 1000);
            };
          </script>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Status-Nachricht entfernen
      setTimeout(() => {
        document.body.removeChild(statusMsg);
      }, 1000);
      
    } catch (error) {
      console.error('Fehler bei der PDF-Generierung:', error);
      statusMsg.textContent = 'Fehler bei der PDF-Generierung. Bitte später erneut versuchen.';
      setTimeout(() => {
        document.body.removeChild(statusMsg);
      }, 3000);
    }
  }
  
  // Bereitet den Inhalt für den Druck vor
  function preparePrintContent(includeSolutions) {
    console.log('Bereite Inhalte für den Druck vor, Lösungen einschließen:', includeSolutions);
    
    // Hauptinhalt klonen
    const mainContent = document.querySelector('.main-content') || document.querySelector('main') || document.body;
    const contentClone = mainContent.cloneNode(true);
    
    // Nicht benötigte Elemente entfernen
    const elementsToRemove = [
      '.pdf-buttons-container',
      '.check-all-answers-btn',
      '#quiz-total-result',
      '.feedback',
      'script'
    ];
    
    elementsToRemove.forEach(selector => {
      const elements = contentClone.querySelectorAll(selector);
      elements.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    });
    
    // Interaktive Elemente anpassen
    const quizQuestions = contentClone.querySelectorAll('.interactive-quiz-question');
    console.log(`${quizQuestions.length} Quizfragen gefunden zum Vorbereiten`);
    
    quizQuestions.forEach((question, index) => {
      processQuestionForPrint(question, includeSolutions, index);
    });
    
    // HTML-String zurückgeben
    return contentClone.innerHTML;
  }
  
  // Verarbeitet eine einzelne Frage für den Druck
  function processQuestionForPrint(question, includeSolutions, index) {
    const formattedQuestion = question.querySelector('.formatted-question');
    if (!formattedQuestion) return;
    
    const questionType = formattedQuestion.getAttribute('data-type');
    console.log(`Verarbeite Frage ${index+1} vom Typ ${questionType} für Druck`);
    
    // Feedback-Elemente entfernen
    const feedback = formattedQuestion.querySelector('.feedback');
    if (feedback && feedback.parentNode) {
      feedback.parentNode.removeChild(feedback);
    }
    
    // Je nach Fragetyp anpassen
    if (questionType === 'multiple-choice') {
      const correctIndex = formattedQuestion.getAttribute('data-correct');
      const options = formattedQuestion.querySelectorAll('.option-label');
      
      options.forEach((option, optionIndex) => {
        const radio = option.querySelector('input[type="radio"]');
        if (!radio) return;
        
        if (includeSolutions) {
          // Für Lösungs-PDF: richtige Antwort markieren
          if (optionIndex.toString() === correctIndex) {
            option.classList.add('pdf-correct-answer');
            radio.checked = true;
            option.style.fontWeight = 'bold';
          }
        } else {
          // Für Arbeitsblatt-PDF: Radiobuttons durch Checkboxen ersetzen
          const checkbox = document.createElement('div');
          checkbox.className = 'pdf-checkbox';
          
          if (radio.parentNode) {
            radio.parentNode.replaceChild(checkbox, radio);
          }
        }
      });
    } 
    else if (questionType === 'text') {
      const textareaContainer = formattedQuestion.querySelector('.text-input-container');
      if (!textareaContainer) return;
      
      const textarea = textareaContainer.querySelector('.text-answer');
      if (!textarea) return;
      
      if (includeSolutions) {
        // Für Lösungs-PDF: korrekte Antwort anzeigen
        const correctAnswer = formattedQuestion.getAttribute('data-correct');
        textarea.value = correctAnswer ? correctAnswer.split('|')[0] : '';
        textarea.disabled = true;
        textarea.classList.add('pdf-solution');
      } else {
        // Für Arbeitsblatt-PDF: leeres Feld mit Lineatur
        const lines = document.createElement('div');
        lines.className = 'pdf-lined-textarea';
        
        if (textarea.parentNode) {
          textarea.parentNode.replaceChild(lines, textarea);
        }
      }
    }
    else if (questionType === 'gap-text') {
      const gapContainer = formattedQuestion.querySelector('.gap-text-container');
      if (!gapContainer) return;
      
      const inputs = gapContainer.querySelectorAll('.gap-input');
      const correctAnswersJson = formattedQuestion.getAttribute('data-correct');
      
      try {
        const correctAnswers = correctAnswersJson ? JSON.parse(correctAnswersJson) : [];
        
        inputs.forEach((input, inputIndex) => {
          if (includeSolutions) {
            // Für Lösungs-PDF: korrekte Antwort anzeigen
            const answer = correctAnswers[inputIndex] ? correctAnswers[inputIndex].split('|')[0] : '';
            input.value = answer;
            input.disabled = true;
            input.classList.add('pdf-solution');
          } else {
            // Für Arbeitsblatt-PDF: längere Linie für handschriftliches Ausfüllen
            const line = document.createElement('span');
            line.className = 'pdf-gap-line';
            
            if (input.parentNode) {
              input.parentNode.replaceChild(line, input);
            }
          }
        });
      } catch (error) {
        console.error('Fehler beim Parsen der korrekten Antworten:', error);
      }
    }
  }
  
  // Buttons hinzufügen, wenn Quizfragen vorhanden sind
  const quizQuestions = document.querySelectorAll('.interactive-quiz-question');
  if (quizQuestions.length > 0) {
    // Warten, bis die Seite vollständig geladen ist
    setTimeout(() => {
      addPdfButtons();
    }, 500);
  }
});
