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
  
  // Nach einer <ul> (ungeordnete Liste) für Multiple-Choice oder nach einem <p> mit "Antwort:" für Textantworten suchen
  elements.forEach(element => {
    if (element.tagName === 'UL') {
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
    else if (element.tagName === 'P' && element.textContent.includes('Antwort:')) {
      questionType = 'text';
      const match = /Antwort:\s*(.+)/.exec(element.textContent);
      if (match) {
        correctAnswer = match[1].trim();
      }
    }
    else {
      // Sonstige erklärende Texte
      if (element.textContent.trim() && !element.textContent.includes('Antwort:')) {
        description += element.outerHTML;
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
    
    const textarea = document.createElement('textarea');
    textarea.className = 'text-answer';
    textarea.placeholder = 'Deine Antwort hier eingeben...';
    formattedQuestion.appendChild(textarea);
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
    } else if (type === 'text') {
      const userAnswer = question.querySelector('.text-answer').value.trim().toLowerCase();
      const possibleAnswers = correctAnswer.split('|').map(a => a.trim().toLowerCase());
      
      if (!userAnswer) {
        feedbackDiv.textContent = 'Keine Antwort eingegeben.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      
      if (possibleAnswers.some(answer => userAnswer.includes(answer))) {
        feedbackDiv.textContent = 'Richtig!';
        feedbackDiv.className = 'feedback correct';
        correctCount++;
      } else {
        feedbackDiv.textContent = 'Falsche oder unvollständige Antwort.';
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