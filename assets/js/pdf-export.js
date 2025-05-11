// pdf-export.js - Funktionalität für den Export von Arbeitsblättern als PDF

document.addEventListener('DOMContentLoaded', function() {
  console.log('PDF-Export-System wird geladen...');
  
  // Funktion zum Hinzufügen der PDF-Download-Buttons am Ende der Seite
  function addPdfButtons() {
    const mainContent = document.querySelector('main') || document.body;
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
        mainContent.insertBefore(buttonContainer, checkButton.nextSibling);
      } else {
        mainContent.appendChild(buttonContainer);
      }
    }
  }
  
  // Funktion zur Generierung des PDFs
  function generatePDF(includeSolutions) {
    // html2pdf.js laden, falls noch nicht vorhanden
    if (typeof html2pdf === 'undefined') {
      console.log('html2pdf wird geladen...');
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = function() {
        console.log('html2pdf geladen, generiere PDF...');
        createPDF(includeSolutions);
      };
      document.head.appendChild(script);
    } else {
      createPDF(includeSolutions);
    }
  }
  
  // Funktion zur eigentlichen PDF-Erstellung
  function createPDF(includeSolutions) {
    // Seiten-Kopie erstellen, um das Original nicht zu verändern
    const originalContent = document.querySelector('main') || document.body;
    const pdfContent = originalContent.cloneNode(true);
    
    // PDF-Stile für die Kopie
    preparePDFContent(pdfContent, includeSolutions);
    
    // Temporären Container außerhalb des sichtbaren Bereichs erstellen
    const tempContainer = document.createElement('div');
    tempContainer.className = 'pdf-temp-container';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.appendChild(pdfContent);
    document.body.appendChild(tempContainer);
    
    // PDF Dateiname
    const title = document.title || 'Arbeitsblatt';
    const filename = includeSolutions ? `${title} - Lösung.pdf` : `${title}.pdf`;
    
    // PDF-Optionen
    const options = {
      margin: [15, 15, 15, 15], // [top, right, bottom, left] in mm
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compressPDF: true,
        fontSize: 9  // Schriftgröße auf 9 PT setzen
      }
    };
    
    // PDF generieren
    html2pdf().set(options).from(tempContainer).save().then(() => {
      // Nach Generierung temporären Container entfernen
      document.body.removeChild(tempContainer);
    });
  }
  
  // Inhalt für PDF vorbereiten
  function preparePDFContent(content, includeSolutions) {
    // PDF-Download-Buttons entfernen
    const pdfButtons = content.querySelectorAll('.pdf-buttons-container');
    pdfButtons.forEach(btn => btn.remove());
    
    // "Antworten überprüfen" Button entfernen
    const checkButton = content.querySelector('.check-all-answers-btn');
    if (checkButton) checkButton.remove();
    
    // Quiz-Ergebnis-Container entfernen
    const resultContainer = content.querySelector('#quiz-total-result');
    if (resultContainer) resultContainer.remove();
    
    // Interaktive Elemente anpassen
    const quizQuestions = content.querySelectorAll('.interactive-quiz-question');
    quizQuestions.forEach(question => {
      const formattedQuestion = question.querySelector('.formatted-question');
      const questionType = formattedQuestion.getAttribute('data-type');
      
      // Rückmeldungen entfernen
      const feedback = formattedQuestion.querySelector('.feedback');
      if (feedback) feedback.remove();
      
      if (questionType === 'multiple-choice') {
        // Radiobuttons für Multiple-Choice handhaben
        const correctIndex = formattedQuestion.getAttribute('data-correct');
        const options = formattedQuestion.querySelectorAll('.option-label');
        
        options.forEach((option, index) => {
          const radio = option.querySelector('input[type="radio"]');
          
          if (includeSolutions) {
            // Für Lösungs-PDF: richtige Antwort markieren
            if (index.toString() === correctIndex) {
              option.classList.add('pdf-correct-answer');
              radio.checked = true;
            }
          } else {
            // Für Arbeitsblatt-PDF: Radiobuttons durch Checkboxen ersetzen
            const checkbox = document.createElement('div');
            checkbox.className = 'pdf-checkbox';
            option.replaceChild(checkbox, radio);
          }
        });
      } 
      else if (questionType === 'text') {
        // Textfelder handhaben
        const textareaContainer = formattedQuestion.querySelector('.text-input-container');
        const textarea = textareaContainer.querySelector('.text-answer');
        
        if (includeSolutions) {
          // Für Lösungs-PDF: korrekte Antwort anzeigen
          const correctAnswer = formattedQuestion.getAttribute('data-correct');
          textarea.value = correctAnswer.split('|')[0]; // erste korrekte Antwort nehmen
          textarea.disabled = true;
          textarea.classList.add('pdf-solution');
        } else {
          // Für Arbeitsblatt-PDF: leeres Feld mit Lineatur
          const lines = document.createElement('div');
          lines.className = 'pdf-lined-textarea';
          textareaContainer.replaceChild(lines, textarea);
        }
      }
      else if (questionType === 'gap-text') {
        // Lückentext handhaben
        const gapContainer = formattedQuestion.querySelector('.gap-text-container');
        const inputs = gapContainer.querySelectorAll('.gap-input');
        const correctAnswers = JSON.parse(formattedQuestion.getAttribute('data-correct'));
        
        inputs.forEach((input, index) => {
          if (includeSolutions) {
            // Für Lösungs-PDF: korrekte Antwort anzeigen
            const answer = correctAnswers[index] ? correctAnswers[index].split('|')[0] : '';
            input.value = answer;
            input.disabled = true;
            input.classList.add('pdf-solution');
          } else {
            // Für Arbeitsblatt-PDF: längere Linie für handschriftliches Ausfüllen
            const line = document.createElement('span');
            line.className = 'pdf-gap-line';
            gapContainer.replaceChild(line, input);
          }
        });
      }
    });
    
    return content;
  }
  
  // Buttons hinzufügen, wenn Quizfragen vorhanden sind
  const quizQuestions = document.querySelectorAll('.interactive-quiz-question');
  if (quizQuestions.length > 0) {
    addPdfButtons();
  }
});
