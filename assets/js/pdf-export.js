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
      // Warten, um der Status-Anzeige Zeit zum Rendern zu geben
      setTimeout(() => {
        try {
          // PDF Dateiname
          const pageTitle = document.querySelector('h1')?.textContent || document.title || 'Arbeitsblatt';
          const sanitizedTitle = pageTitle.replace(/[^a-z0-9äöüß\s-]/gi, '').trim();
          const filename = includeSolutions 
            ? `${sanitizedTitle} - Lösung.pdf` 
            : `${sanitizedTitle}.pdf`;
          
          console.log(`Erzeuge PDF mit Dateinamen: ${filename}`);
          
          // Gesamtes Dokument für PDF vorbereiten
          const content = preparePDFDocument(includeSolutions);
          
          // PDF-Optionen
          const options = {
            margin: [10, 10, 10, 10],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              logging: true,
              backgroundColor: '#FFFFFF'
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait',
            }
          };
          
          // PDF generieren
          html2pdf().from(content).set(options).save().then(() => {
            console.log('PDF erfolgreich generiert und zum Download angeboten');
            document.body.removeChild(statusMsg);
            
            // Temporäres Element entfernen, wenn es existiert
            const tempElement = document.getElementById('temp-pdf-content');
            if (tempElement && tempElement.parentNode) {
              tempElement.parentNode.removeChild(tempElement);
            }
          }).catch(error => {
            console.error('Fehler beim Generieren des PDFs:', error);
            statusMsg.textContent = 'Fehler beim Generieren des PDFs. Bitte später erneut versuchen.';
            setTimeout(() => {
              if (document.body.contains(statusMsg)) {
                document.body.removeChild(statusMsg);
              }
            }, 3000);
          });
        } catch (error) {
          console.error('Fehler beim Vorbereiten des PDFs:', error);
          statusMsg.textContent = 'Fehler beim Vorbereiten des PDFs. Bitte später erneut versuchen.';
          setTimeout(() => {
            if (document.body.contains(statusMsg)) {
              document.body.removeChild(statusMsg);
            }
          }, 3000);
        }
      }, 100);
    } catch (error) {
      console.error('Allgemeiner Fehler bei der PDF-Generierung:', error);
      if (document.body.contains(statusMsg)) {
        document.body.removeChild(statusMsg);
      }
    }
  }
  
  // Bereitet das gesamte Dokument für den PDF-Export vor
  function preparePDFDocument(includeSolutions) {
    console.log('Bereite gesamtes Dokument für PDF-Export vor');
    
    // Hauptinhalt finden
    const mainContent = document.querySelector('.main-content') || document.querySelector('main') || document.body;
    
    // Temporäres Element erstellen
    const tempElement = document.createElement('div');
    tempElement.id = 'temp-pdf-content';
    tempElement.className = 'pdf-document';
    tempElement.style.padding = '20px';
    tempElement.style.backgroundColor = '#fff';
    tempElement.style.position = 'fixed';
    tempElement.style.top = '-9999px';
    tempElement.style.left = '-9999px';
    tempElement.style.width = '210mm'; // A4-Breite
    
    // Inhalt kopieren
    tempElement.innerHTML = mainContent.innerHTML;
    
    // PDF für Druck vorbereiten
    preparePDFContent(tempElement, includeSolutions);
    
    // An Dokument anhängen (außerhalb des sichtbaren Bereichs)
    document.body.appendChild(tempElement);
    
    return tempElement;
  }
  
  // Bereitet den Inhalt für das PDF vor
  function preparePDFContent(container, includeSolutions) {
    console.log('Vorbereitung der PDF-Inhalte, Lösungen einschließen:', includeSolutions);
    
    try {
      // PDF-spezifische Stile direkt einfügen
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        * {
          font-family: Arial, sans-serif !important;
          font-size: 9pt !important;
        }
        h1 { font-size: 14pt !important; }
        h2 { font-size: 12pt !important; }
        h3 { font-size: 10pt !important; }
        .question-prompt { font-weight: bold; }
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
        .interactive-quiz-question {
          border: 1px solid #ddd;
          margin: 15px 0;
          padding: 10px;
          page-break-inside: avoid;
        }
      `;
      container.prepend(styleElement);
      
      // Nicht benötigte Elemente entfernen
      const elementsToRemove = [
        '.pdf-buttons-container',
        '.check-all-answers-btn',
        '#quiz-total-result',
        '.feedback'
      ];
      
      elementsToRemove.forEach(selector => {
        const elements = container.querySelectorAll(selector);
        elements.forEach(element => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        });
      });
      
      // Interaktive Elemente für das PDF anpassen
      const quizQuestions = container.querySelectorAll('.interactive-quiz-question');
      console.log(`${quizQuestions.length} Quizfragen gefunden`);
      
      quizQuestions.forEach((question, questionIndex) => {
        const formattedQuestion = question.querySelector('.formatted-question');
        if (!formattedQuestion) {
          console.warn(`Keine formatierte Frage für Frage ${questionIndex+1} gefunden`);
          return;
        }
        
        const questionType = formattedQuestion.getAttribute('data-type');
        console.log(`Bearbeite Frage ${questionIndex+1}, Typ: ${questionType}`);
        
        // Je nach Fragetyp anpassen
        if (questionType === 'multiple-choice') {
          // Multiple-Choice-Fragen bearbeiten
          const correctIndex = formattedQuestion.getAttribute('data-correct');
          const options = formattedQuestion.querySelectorAll('.option-label');
          
          options.forEach((option, index) => {
            const radio = option.querySelector('input[type="radio"]');
            if (!radio) return;
            
            if (includeSolutions) {
              // Lösungs-PDF: Richtige Antwort markieren
              if (index.toString() === correctIndex) {
                option.classList.add('pdf-correct-answer');
                radio.checked = true;
              }
            } else {
              // Arbeitsblatt-PDF: Checkbox statt Radio
              const checkbox = document.createElement('div');
              checkbox.className = 'pdf-checkbox';
              
              // Radiobutton ersetzen
              if (radio.parentNode) {
                radio.parentNode.replaceChild(checkbox, radio);
              }
            }
          });
        } 
        else if (questionType === 'text') {
          // Textfelder bearbeiten
          const textareaContainer = formattedQuestion.querySelector('.text-input-container');
          if (!textareaContainer) return;
          
          const textarea = textareaContainer.querySelector('.text-answer');
          if (!textarea) return;
          
          if (includeSolutions) {
            // Lösungs-PDF: Korrekte Antwort anzeigen
            const correctAnswer = formattedQuestion.getAttribute('data-correct');
            textarea.value = correctAnswer ? correctAnswer.split('|')[0] : '';
            textarea.disabled = true;
            textarea.style.fontWeight = 'bold';
            textarea.style.color = '#1976D2';
            textarea.style.border = '1px solid #1976D2';
            textarea.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
          } else {
            // Arbeitsblatt-PDF: Liniertes Textfeld
            const lines = document.createElement('div');
            lines.className = 'pdf-lined-textarea';
            
            if (textarea.parentNode) {
              textarea.parentNode.replaceChild(lines, textarea);
            }
          }
        }
        else if (questionType === 'gap-text') {
          // Lückentext bearbeiten
          const gapContainer = formattedQuestion.querySelector('.gap-text-container');
          if (!gapContainer) return;
          
          const inputs = gapContainer.querySelectorAll('.gap-input');
          const correctAnswersJson = formattedQuestion.getAttribute('data-correct');
          
          try {
            const correctAnswers = correctAnswersJson ? JSON.parse(correctAnswersJson) : [];
            
            inputs.forEach((input, index) => {
              if (includeSolutions) {
                // Lösungs-PDF: Korrekte Antwort einfügen
                const answer = correctAnswers[index] ? correctAnswers[index].split('|')[0] : '';
                input.value = answer;
                input.disabled = true;
                input.style.fontWeight = 'bold';
                input.style.color = '#1976D2';
                input.style.border = '1px solid #1976D2';
                input.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
              } else {
                // Arbeitsblatt-PDF: Linie zum Ausfüllen
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
      });
    } catch (error) {
      console.error('Fehler bei der Vorbereitung des PDF-Inhalts:', error);
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
