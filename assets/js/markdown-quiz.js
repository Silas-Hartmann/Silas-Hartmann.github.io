// markdown-quiz.js - Wandelt Quiz-Listen in interaktive Elemente um

document.addEventListener('DOMContentLoaded', function() {
  console.log('Quiz-System wird geladen...');
  
  // Wir sammeln alle h3-Überschriften als potentielle Quizfragen
  const quizQuestions = document.querySelectorAll('h3');
  console.log(`${quizQuestions.length} potentielle Quizfragen gefunden`);
  
  if (quizQuestions.length === 0) return;
  
  // Erstelle einen Container für alle Quiz-Fragen
  const quizContainer = document.createElement('div');
  quizContainer.className = 'quiz-container';
  
  // Zähler für die Fragen
  let questionCount = 0;
  
  // Verarbeite jede h3-Überschrift als potentielle Quizfrage
  quizQuestions.forEach((h3, index) => {
    // Sammeln der relevanten Elemente für diese Frage
    const questionElements = collectQuestionElements(h3);
    
    if (questionElements.length > 0) {
      questionCount++;
      console.log(`Frage ${questionCount} wird verarbeitet`);
      
      // Wir erstellen einen Container für diese Frage
      const questionContainer = document.createElement('div');
      questionContainer.className = 'interactive-quiz-question';
      questionContainer.id = `quiz-question-${questionCount}`;
      
      // Verarbeite die Frage und füge sie zum Container hinzu
      processQuestion(h3, questionElements, questionContainer, questionCount);
      
      // Füge die Frage zum Quiz-Container hinzu
      quizContainer.appendChild(questionContainer);
      
      // Verstecke die ursprünglichen Elemente
      h3.style.display = 'none';
      questionElements.forEach(el => {
        el.style.display = 'none';
      });
      
      // Füge den Container nach der Überschrift ein
      h3.parentNode.insertBefore(questionContainer, h3.nextSibling);
    }
  });
  
  // Wenn Quizfragen gefunden wurden, füge einen "Antworten überprüfen" Button am Ende der Seite hinzu
  if (questionCount > 0) {
    const checkButton = document.createElement('button');
    checkButton.textContent = 'Alle Antworten überprüfen';
    checkButton.className = 'check-all-answers-btn';
    checkButton.addEventListener('click', function() {
      checkAllAnswers();
    });
    
    // Füge den Button am Ende der Seite ein
    const mainContent = document.querySelector('main') || document.body;
    mainContent.appendChild(checkButton);
    
    // Füge auch einen Container für das Gesamtergebnis hinzu
    const resultContainer = document.createElement('div');
    resultContainer.id = 'quiz-total-result';
    resultContainer.className = 'quiz-total-result';
    resultContainer.style.display = 'none';
    mainContent.appendChild(resultContainer);
  }
});

function collectQuestionElements(h3) {
  const elements = [];
  let currentElement = h3.nextElementSibling;
  
  // Sammle alle Elemente bis zur nächsten Überschrift
  while (currentElement && 
         !/^H[1-6]$/.test(currentElement.tagName)) {
    elements.push(currentElement);
    currentElement = currentElement.nextElementSibling;
  }
  
  return elements;
}

function processQuestion(h3, elements, container, questionNumber) {
  const questionText = h3.textContent.replace(/\[.*\]$/, '').trim();
  
  const formattedQuestion = document.createElement('div');
  formattedQuestion.className = 'formatted-question';
  
  const questionPrompt = document.createElement('div');
  questionPrompt.className = 'question-prompt';
  questionPrompt.textContent = `${questionNumber}. ${questionText}`;
  formattedQuestion.appendChild(questionPrompt);
  
  // Typ und Inhalt der Frage bestimmen
  let questionType = 'unknown';
  let correctAnswer = '';
  let options = [];
  let correctIndex = -1;
  let description = '';
  let gapAnswers = [];
  let gapText = '';
  
  // Nach einer <ul> (ungeordnete Liste) für Multiple-Choice oder nach einem <p> mit "Antwort:" für Textantworten suchen
  elements.forEach(element => {
    // Prüfen auf Lückentext - Paragraphen mit "Lücken:" 
    if (element.tagName === 'P' && element.textContent.includes('Lücken:')) {
      questionType = 'gap-text';
      
      // Suche nach dem Lückentext in den vorherigen Elementen
      const prevElements = Array.from(elements).slice(0, Array.from(elements).indexOf(element));
      
      for (const prevEl of prevElements) {
        if (prevEl.tagName === 'P' && prevEl.textContent.includes('[') && prevEl.textContent.includes(']')) {
          gapText = prevEl.innerHTML;
          break;
        }
      }
      
      // Extrahiere die Lückentext-Antworten
      const match = /Lücken:\s*(.+)/.exec(element.textContent);
      if (match) {
        const answersText = match[1].trim();
        // Trenne Antworten durch Komma, und jede Antwort kann Alternativen mit | haben
        gapAnswers = answersText.split(',').map(ans => ans.trim());
      }
    }
    else if (element.tagName === 'UL') {
      questionType = 'multiple-choice';
      const listItems = element.querySelectorAll('li');
      
      listItems.forEach((item, index) => {
        const optionText = item.textContent.trim();
        
        // Richtige Option suchen und Marker entfernen
        const cleanedText = optionText.replace(/\(richtige Option\)|\(correct\)|\(richtig\)/g, '').trim();
        options.push(cleanedText);
        
        if (optionText.includes('(richtige Option)') || 
            optionText.includes('(correct)') ||
            optionText.includes('(richtig)')) {
          correctIndex = index;
        }
      });
    } 
    else if (element.tagName === 'P') {
      // Erweiterte Erkennung für Textantworten
      if (element.textContent.includes('Antwort:')) {
        questionType = 'text';
        
        // Versuche, die Antwort zu extrahieren
        const match = /Antwort:\s*(.+)/.exec(element.textContent);
        if (match) {
          correctAnswer = match[1].trim();
        }
      }
      // Beschreibung nur hinzufügen, wenn es kein Lückentext ist und kein "Lücken:" enthält
      else if (!element.textContent.includes('Lücken:') && 
              !(element.textContent.includes('[') && element.textContent.includes(']') && 
                questionType === 'gap-text')) {
        if (element.textContent.trim()) {
          description += element.outerHTML;
        }
      }
    }
    else {
      // Andere Elemente als beschreibenden Text behandeln
      if (element.textContent.trim()) {
        // Prüfen, ob irgendwo im Element "Antwort:" vorkommt
        if (element.textContent.includes('Antwort:')) {
          questionType = 'text';
          
          const match = /Antwort:\s*(.+)/.exec(element.textContent);
          if (match) {
            correctAnswer = match[1].trim();
          }
        } 
        // Prüfen, ob es ein Lückentext-Element ist
        else if (element.textContent.includes('Lücken:')) {
          questionType = 'gap-text';
          
          const match = /Lücken:\s*(.+)/.exec(element.textContent);
          if (match) {
            const answersText = match[1].trim();
            gapAnswers = answersText.split(',').map(ans => ans.trim());
          }
        } 
        else {
          // Kein Lückentext und keine Antwort
          description += element.outerHTML;
        }
      }
    }
  });
  
  // Beschreibung hinzufügen, falls vorhanden
  if (description) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'question-content';
    descriptionDiv.innerHTML = description;
    formattedQuestion.appendChild(descriptionDiv);
  }
  
  // Je nach Fragetyp die entsprechenden Elemente hinzufügen
  if (questionType === 'multiple-choice' && options.length > 0) {
    formattedQuestion.setAttribute('data-type', 'multiple-choice');
    formattedQuestion.setAttribute('data-correct', correctIndex !== -1 ? correctIndex.toString() : '0');
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    options.forEach((optionText, index) => {
      const label = document.createElement('label');
      label.className = 'option-label';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `q-${questionNumber}`;
      radio.value = index;
      
      label.appendChild(radio);
      label.appendChild(document.createTextNode(` ${optionText}`));
      optionsContainer.appendChild(label);
    });
    
    formattedQuestion.appendChild(optionsContainer);
  } 
  else if (questionType === 'text') {
    formattedQuestion.setAttribute('data-type', 'text');
    formattedQuestion.setAttribute('data-correct', correctAnswer);
    
    const inputContainer = document.createElement('div');
    inputContainer.className = 'text-input-container';
    
    // Erstelle ein Textarea für die Antwort
    const textarea = document.createElement('textarea');
    textarea.className = 'text-answer';
    textarea.placeholder = 'Deine Antwort hier eingeben...';
    inputContainer.appendChild(textarea);
    
    formattedQuestion.appendChild(inputContainer);
  }
  else if (questionType === 'gap-text' && gapText && gapAnswers.length > 0) {
    formattedQuestion.setAttribute('data-type', 'gap-text');
    formattedQuestion.setAttribute('data-correct', JSON.stringify(gapAnswers));
    
    const gapContainer = document.createElement('div');
    gapContainer.className = 'gap-text-container';
    
    // Extrahiere Lücken aus dem Text und ersetze sie durch Eingabefelder
    let gapIndex = 0;
    const gapTextWithInputs = gapText.replace(/\[([^\]]*)\]/g, (match, placeholder) => {
      const input = `<input type="text" class="gap-input" data-gap-index="${gapIndex}" placeholder="${placeholder || 'Lücke ausfüllen...'}">`;
      gapIndex++;
      return input;
    });
    
    gapContainer.innerHTML = gapTextWithInputs;
    formattedQuestion.appendChild(gapContainer);
  } else {
    // Fallback für unerkannte Fragetypen - setze trotzdem ein Textfeld
    console.warn(`Fragetyp für Frage ${questionNumber} nicht erkannt, setze Standardtextfeld`);
    
    const fallbackContainer = document.createElement('div');
    fallbackContainer.className = 'text-input-container';
    
    const fallbackTextarea = document.createElement('textarea');
    fallbackTextarea.className = 'text-answer';
    fallbackTextarea.placeholder = 'Deine Antwort hier eingeben...';
    
    const fallbackNote = document.createElement('div');
    fallbackNote.className = 'fallback-note';
    fallbackNote.textContent = 'Hinweis: Fragetyp konnte nicht automatisch erkannt werden';
    fallbackNote.style.fontSize = '0.8em';
    fallbackNote.style.color = '#c00';
    
    fallbackContainer.appendChild(fallbackTextarea);
    fallbackContainer.appendChild(fallbackNote);
    
    formattedQuestion.appendChild(fallbackContainer);
    formattedQuestion.setAttribute('data-type', 'unknown');
  }
  
  // Feedback-Bereich hinzufügen
  const feedbackDiv = document.createElement('div');
  feedbackDiv.className = 'feedback';
  feedbackDiv.style.display = 'none';
  formattedQuestion.appendChild(feedbackDiv);
  
  // Frage zum Container hinzufügen
  container.appendChild(formattedQuestion);
}

function checkAllAnswers() {
  const questions = document.querySelectorAll('.formatted-question');
  let correctCount = 0;
  let totalCount = 0;
  
  questions.forEach(question => {
    const type = question.getAttribute('data-type');
    if (!type) return; // Wenn kein Typ gesetzt ist, überspringen
    
    totalCount++;
    const correctAnswer = question.getAttribute('data-correct');
    const feedbackDiv = question.querySelector('.feedback');
    feedbackDiv.style.display = 'block';
    
    if (type === 'multiple-choice') {
      const selectedOption = question.querySelector('input[type="radio"]:checked');
      
      if (!selectedOption) {
        feedbackDiv.textContent = 'Keine Antwort ausgewählt.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      
      if (selectedOption.value === correctAnswer) {
        feedbackDiv.textContent = 'Richtig!';
        feedbackDiv.className = 'feedback correct';
        correctCount++;
      } else {
        feedbackDiv.textContent = 'Falsche Antwort.';
        feedbackDiv.className = 'feedback incorrect';
      }
    } else if (type === 'text' || type === 'unknown') {
      const answerField = question.querySelector('.text-answer');
      if (!answerField) {
        console.error('Textantwortfeld nicht gefunden');
        return;
      }
      
      const userAnswer = answerField.value.trim();
      
      if (!userAnswer) {
        feedbackDiv.textContent = 'Keine Antwort eingegeben.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      
      if (type === 'unknown') {
        feedbackDiv.textContent = 'Diese Antwort kann nicht automatisch überprüft werden.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      
      // Verbesserte Überprüfung für Textantworten
      const possibleAnswers = correctAnswer.split('|').map(a => a.trim());
      const userAnswerLower = userAnswer.toLowerCase();
      
      // Überprüfen, ob eine der möglichen Antworten exakt übereinstimmt oder in der Benutzerantwort enthalten ist
      const isCorrect = possibleAnswers.some(answer => {
        const answerLower = answer.toLowerCase();
        return userAnswerLower === answerLower || userAnswerLower.includes(answerLower);
      });
      
      if (isCorrect) {
        feedbackDiv.textContent = 'Richtig!';
        feedbackDiv.className = 'feedback correct';
        correctCount++;
      } else {
        feedbackDiv.textContent = 'Falsche oder unvollständige Antwort.';
        feedbackDiv.className = 'feedback incorrect';
      }
    } else if (type === 'gap-text') {
      // Überprüfung für Lückentext
      const gapInputs = question.querySelectorAll('.gap-input');
      let allCorrect = true;
      let totalGaps = gapInputs.length;
      let correctGaps = 0;
      
      if (gapInputs.length === 0) {
        console.error('Keine Lückentext-Eingabefelder gefunden');
        return;
      }
      
      const correctAnswers = JSON.parse(correctAnswer);
      
      // Prüfe jede Lücke
      gapInputs.forEach((input, index) => {
        const userAnswer = input.value.trim();
        
        if (!userAnswer) {
          allCorrect = false;
          input.classList.add('gap-empty');
          return;
        }
        
        input.classList.remove('gap-empty');
        
        // Hole die korrekten Antworten für diese Lücke
        const correctOptions = correctAnswers[index] ? correctAnswers[index].split('|').map(a => a.trim()) : [];
        const userAnswerLower = userAnswer.toLowerCase();
        
        // Überprüfe, ob die Antwort korrekt ist
        const isCorrect = correctOptions.some(option => {
          const optionLower = option.toLowerCase();
          return userAnswerLower === optionLower || userAnswerLower.includes(optionLower);
        });
        
        if (isCorrect) {
          input.classList.add('gap-correct');
          input.classList.remove('gap-incorrect');
          correctGaps++;
        } else {
          input.classList.add('gap-incorrect');
          input.classList.remove('gap-correct');
          allCorrect = false;
        }
      });
      
      // Zeige das Ergebnis an
      if (gapInputs.length === 0) {
        feedbackDiv.textContent = 'Fehler bei der Lückentext-Prüfung.';
        feedbackDiv.className = 'feedback no-answer';
      } else if (gapInputs.length > 0 && totalGaps === correctGaps) {
        feedbackDiv.textContent = 'Alle Lücken richtig ausgefüllt!';
        feedbackDiv.className = 'feedback correct';
        correctCount++;
      } else {
        feedbackDiv.textContent = `${correctGaps} von ${totalGaps} Lücken richtig ausgefüllt.`;
        feedbackDiv.className = 'feedback incorrect';
      }
    }
  });
  
  // Zeige Gesamtergebnis
  const resultDiv = document.getElementById('quiz-total-result');
  if (resultDiv) {
    resultDiv.textContent = `Gesamtergebnis: ${correctCount} von ${totalCount} Fragen richtig beantwortet!`;
    resultDiv.style.display = 'block';
    
    // Scroll zum Ergebnis
    resultDiv.scrollIntoView({ behavior: 'smooth' });
  }
}