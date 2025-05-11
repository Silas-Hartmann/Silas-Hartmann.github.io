// pdf-export.js - Funktionalität für den Export von Arbeitsblättern als PDF

document.addEventListener('DOMContentLoaded', function() {
  console.log('PDF-Export-System wird geladen...');
  
  // Funktion zum Hinzufügen der PDF-Download-Buttons am Ende der Seite
  function addPdfButtons() {
    const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.body;
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
      
      // Container nach dem "Antworten überprüfen" Button einfügen
      const checkButton = document.querySelector('.check-all-answers-btn');
      if (checkButton) {
        checkButton.parentNode.insertBefore(buttonContainer, checkButton.nextSibling);
      } else {
        mainContent.appendChild(buttonContainer);
      }
    }
  }
  
  // Funktion zur Generierung des PDFs
  function generatePDF(includeSolutions) {
    // HTML2PDF-Bibliothek dynamisch laden, falls noch nicht vorhanden
    if (typeof html2pdf === 'undefined') {
      console.log('HTML2PDF wird geladen...');
      
      // Status-Anzeige für den Benutzer
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'pdf-loading-message';
      loadingMsg.textContent = 'PDF wird vorbereitet, bitte warten...';
      loadingMsg.style.position = 'fixed';
      loadingMsg.style.top = '50%';
      loadingMsg.style.left = '50%';
      loadingMsg.style.transform = 'translate(-50%, -50%)';
      loadingMsg.style.padding = '20px';
      loadingMsg.style.background = 'rgba(0,0,0,0.7)';
      loadingMsg.style.color = 'white';
      loadingMsg.style.borderRadius = '5px';
      loadingMsg.style.zIndex = '9999';
      document.body.appendChild(loadingMsg);
      
      // Script laden
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = function() {
        console.log('HTML2PDF erfolgreich geladen');
        
        // Kurze Verzögerung, um sicherzustellen, dass alles initialisiert ist
        setTimeout(() => {
          document.body.removeChild(loadingMsg);
          createPDF(includeSolutions);
        }, 500);
      };
      script.onerror = function() {
        console.error('Fehler beim Laden von HTML2PDF');
        loadingMsg.textContent = 'Fehler beim Laden der PDF-Bibliothek. Bitte später erneut versuchen.';
        setTimeout(() => {
          document.body.removeChild(loadingMsg);
        }, 3000);
      };
      document.head.appendChild(script);
    } else {
      createPDF(includeSolutions);
    }
  }
  
  // Funktion zur eigentlichen PDF-Erstellung
  function createPDF(includeSolutions) {
    console.log('Beginne PDF-Generierung...');
    
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
      // Kompletten Inhalt der Seite holen
      const contentElement = document.querySelector('.main-content') || document.querySelector('main') || document.body;
      
      // Neuen Container für den PDF-Inhalt erstellen
      const pdfContainer = document.createElement('div');
      pdfContainer.className = 'pdf-content-container';
      
      // Seiteninhalt klonen
      const clonedContent = contentElement.cloneNode(true);
      pdfContainer.appendChild(clonedContent);
      
      // PDF für Druck vorbereiten
      preparePDFContent(pdfContainer, includeSolutions);
      
      // PDF-Container in die Seite einfügen (aber nicht sichtbar)
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.width = '210mm'; // A4 Breite
      pdfContainer.style.padding = '10mm';
      pdfContainer.style.visibility = 'hidden';
      document.body.appendChild(pdfContainer);
      
      // PDF Dateiname
      const title = document.title || 'Arbeitsblatt';
      const filename = includeSolutions ? `${title} - Lösung.pdf` : `${title}.pdf`;
      
      // PDF-Optionen
      const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        fontFaces: [
          {
            family: 'Arial',
            style: 'normal'
          }
        ]
      };
      
      console.log('Starte HTML2PDF Konvertierung');
      
      // PDF generieren
      html2pdf()
        .from(pdfContainer)
        .set(options)
        .save()
        .then(() => {
          console.log('PDF erfolgreich generiert');
          // Aufräumen
          document.body.removeChild(pdfContainer);
          document.body.removeChild(statusMsg);
        })
        .catch(error => {
          console.error('Fehler bei der PDF-Generierung:', error);
          statusMsg.textContent = 'Fehler bei der PDF-Generierung. Bitte später erneut versuchen.';
          setTimeout(() => {
            document.body.removeChild(statusMsg);
          }, 3000);
        });
    } catch (error) {
      console.error('Fehler bei der Vorbereitung der PDF-Generierung:', error);
      statusMsg.textContent = 'Fehler bei der Vorbereitung des PDFs. Bitte später erneut versuchen.';
      setTimeout(() => {
        document.body.removeChild(statusMsg);
      }, 3000);
    }
  }
  
  // Inhalt für PDF vorbereiten
  function preparePDFContent(container, includeSolutions) {
    console.log('PDF-Inhalt wird vorbereitet, Lösungen einschließen:', includeSolutions);
    
    try {
      // Sicherstellen, dass wir mit dem Inhalt innerhalb des Containers arbeiten
      const content = container.querySelector('.main-content') || container.querySelector('main') || container.firstChild;
      
      if (!content) {
        console.error('Kein Content-Element gefunden!');
        return;
      }
      
      // PDF-spezifische Klasse hinzufügen
      container.classList.add('pdf-document');
      
      // PDF-Download-Buttons entfernen
      const pdfButtons = content.querySelectorAll('.pdf-buttons-container');
      pdfButtons.forEach(btn => btn.parentNode && btn.parentNode.removeChild(btn));
      
      // "Antworten überprüfen" Button entfernen
      const checkButton = content.querySelector('.check-all-answers-btn');
      if (checkButton && checkButton.parentNode) {
        checkButton.parentNode.removeChild(checkButton);
      }
      
      // Quiz-Ergebnis-Container entfernen
      const resultContainer = content.querySelector('#quiz-total-result');
      if (resultContainer && resultContainer.parentNode) {
        resultContainer.parentNode.removeChild(resultContainer);
      }
      
      // Interaktive Elemente anpassen
      const quizQuestions = content.querySelectorAll('.interactive-quiz-question');
      console.log(`${quizQuestions.length} Quizfragen gefunden`);
      
      quizQuestions.forEach((question, questionIndex) => {
        const formattedQuestion = question.querySelector('.formatted-question');
        if (!formattedQuestion) {
          console.warn(`Keine formatierte Frage für Frage ${questionIndex+1} gefunden`);
          return;
        }
        
        const questionType = formattedQuestion.getAttribute('data-type');
        console.log(`Bearbeite Frage ${questionIndex+1}, Typ: ${questionType}`);
        
        // Rückmeldungen entfernen
        const feedback = formattedQuestion.querySelector('.feedback');
        if (feedback && feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
        
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
                option.style.fontWeight = 'bold';
                option.style.color = '#388E3C';
                option.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                option.style.padding = '5px';
                option.style.borderRadius = '4px';
                radio.checked = true;
              }
            } else {
              // Arbeitsblatt-PDF: Checkbox statt Radio
              const checkbox = document.createElement('div');
              checkbox.className = 'pdf-checkbox';
              checkbox.style.display = 'inline-block';
              checkbox.style.width = '12px';
              checkbox.style.height = '12px';
              checkbox.style.border = '1px solid #000';
              checkbox.style.marginRight = '8px';
              checkbox.style.verticalAlign = 'middle';
              
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
            lines.style.position = 'relative';
            lines.style.width = '100%';
            lines.style.minHeight = '120px';
            lines.style.border = '1px solid #ddd';
            lines.style.padding = '0';
            lines.style.background = 'linear-gradient(transparent, transparent 19px, #ccc 19px, #ccc 20px)';
            lines.style.backgroundSize = '100% 20px';
            lines.style.lineHeight = '20px';
            lines.style.marginTop = '10px';
            
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
                line.style.display = 'inline-block';
                line.style.width = '120px';
                line.style.height = '1px';
                line.style.borderBottom = '1px solid #000';
                line.style.margin = '0 3px';
                line.style.verticalAlign = 'middle';
                
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
      
      // PDF-spezifischen Stil hinzufügen
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .pdf-document {
          font-size: 9pt !important;
          line-height: 1.3 !important;
          font-family: Arial, sans-serif !important;
        }
        
        .pdf-document .interactive-quiz-question {
          border: 1px solid #ddd;
          break-inside: avoid;
          margin: 15px 0;
          padding: 10px;
          page-break-inside: avoid;
        }
        
        @media print {
          body {
            font-size: 9pt !important;
          }
        }
      `;
      container.appendChild(styleElement);
      
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
