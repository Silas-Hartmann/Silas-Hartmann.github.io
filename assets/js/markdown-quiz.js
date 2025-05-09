// markdown-quiz.js - Wandelt Quiz-Listen in interaktive Elemente um

document.addEventListener('DOMContentLoaded', function() {
  console.log('Quiz-System wird geladen...');
  
  // Wir suchen Text-Marker für Quiz-Bereiche
  const quizMarkers = document.querySelectorAll('p');
  
  quizMarkers.forEach(marker => {
    if (marker.textContent.trim() === ':::quiz') {
      console.log('Quiz gefunden');
      
      // Wir beginnen einen neuen Quiz-Container
      const quizContainer = document.createElement('div');
      quizContainer.className = 'interactive-quiz';
      
      // Wir sammeln alle Elemente bis zum schließenden :::
      let currentElement = marker.nextElementSibling;
      const quizElements = [];
      
      while (currentElement && !currentElement.textContent.trim().includes(':::')) {
        quizElements.push(currentElement);
        const nextElement = currentElement.nextElementSibling;
        currentElement = nextElement;
      }
      
      // Wir ersetzen den Start-Marker mit dem Quiz-Container
      marker.replaceWith(quizContainer);
      
      // Wir entfernen den End-Marker, wenn wir ihn gefunden haben
      if (currentElement && currentElement.textContent.trim() === ':::') {
        currentElement.remove();
      }
      
      // Verarbeiten der Quizfragen
      processQuizElements(quizElements, quizContainer);
      
      // Hinzufügen des Überprüfen-Buttons
      const checkButton = document.createElement('button');
      checkButton.textContent = 'Antworten überprüfen';
      checkButton.className = 'check-answers-btn';
      checkButton.addEventListener('click', () => checkAnswers(quizContainer));
      quizContainer.appendChild(checkButton);
    }
  });
});

function processQuizElements(elements, container) {
  let currentQuestion = null;
  let options = [];
  let correctOption = -1;
  let questionCount = 0;
  let answerText = '';
  
  elements.forEach(element => {
    // Neue Frage beginnt mit einer h3
    if (element.tagName === 'H3') {
      // Wenn wir bereits eine Frage bearbeiten, dann schließen wir sie erst ab
      if (currentQuestion) {
        finishQuestion(currentQuestion, options, correctOption, answerText, container, questionCount);
        options = [];
        correctOption = -1;
        answerText = '';
      }
      
      // Neue Frage starten
      questionCount++;
      currentQuestion = {
        text: element.textContent.replace(/\[.*\]$/, '').trim(), // Entferne Anker-Links am Ende
        type: 'unknown', // Wird später bestimmt
        element: element
      };
    } 
    // Wir prüfen auf Listenpunkte für Multiple Choice
    else if (element.tagName === 'UL' && currentQuestion) {
      currentQuestion.type = 'multiple-choice';
      
      // Listenpunkte verarbeiten
      const listItems = element.querySelectorAll('li');
      listItems.forEach((item, index) => {
        const optionText = item.textContent.trim();
        options.push(optionText);
        
        // Erste Option mit [x] oder richtige Option durch andere Informationen
        if (optionText.includes('(richtige Option)') || 
            optionText.includes('(correct)') ||
            optionText.includes('(richtig)')) {
          correctOption = index;
        }
      });
      
      // Wenn keine Option explizit als korrekt markiert ist, nehmen wir die erste
      if (correctOption === -1 && listItems.length > 0) {
        correctOption = 0;
      }
    }
    // Text nach der Frage oder Antwort-Text
    else if (currentQuestion) {
      const text = element.textContent.trim();
      
      // Suche nach Antwort-Text
      if (text.startsWith('Antwort:')) {
        currentQuestion.type = 'text';
        answerText = text.replace('Antwort:', '').trim();
      }
      // Sonstiger erklärender Text
      else if (element.tagName !== 'UL') {
        if (!currentQuestion.description) {
          currentQuestion.description = '';
        }
        currentQuestion.description += element.outerHTML;
      }
    }
  });
  
  // Die letzte Frage abschließen, falls vorhanden
  if (currentQuestion) {
    finishQuestion(currentQuestion, options, correctOption, answerText, container, questionCount);
  }
}

function finishQuestion(question, options, correctOption, answerText, container, questionNumber) {
  // Wir erstellen eine formatierte Frage basierend auf dem Typ
  const formattedQuestion = document.createElement('div');
  formattedQuestion.className = 'formatted-question';
  
  const questionPrompt = document.createElement('div');
  questionPrompt.className = 'question-prompt';
  questionPrompt.textContent = `${questionNumber}. ${question.text}`;
  formattedQuestion.appendChild(questionPrompt);
  
  // Füge die Beschreibung hinzu, falls vorhanden
  if (question.description) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'question-content';
    descriptionDiv.innerHTML = question.description;
    formattedQuestion.appendChild(descriptionDiv);
  }
  
  if (question.type === 'multiple-choice' && options.length > 0) {
    formattedQuestion.setAttribute('data-type', 'multiple-choice');
    formattedQuestion.setAttribute('data-correct', correctOption);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    options.forEach((optionText, index) => {
      // Entferne Marker für richtige Antworten aus dem anzuzeigenden Text
      const cleanOptionText = optionText
        .replace('(richtige Option)', '')
        .replace('(correct)', '')
        .replace('(richtig)', '')
        .trim();
      
      const label = document.createElement('label');
      label.className = 'option-label';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `q-${questionNumber}`;
      radio.value = index;
      
      label.appendChild(radio);
      label.appendChild(document.createTextNode(` ${cleanOptionText}`));
      optionsContainer.appendChild(label);
    });
    
    formattedQuestion.appendChild(optionsContainer);
  } 
  else if (question.type === 'text' || answerText) {
    formattedQuestion.setAttribute('data-type', 'text');
    formattedQuestion.setAttribute('data-correct', answerText);
    
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
  
  container.appendChild(formattedQuestion);
  
  // Die ursprünglichen Elemente verstecken
  question.element.style.display = 'none';
}

function checkAnswers(container) {
  const questions = container.querySelectorAll('.formatted-question');
  let correctCount = 0;
  
  questions.forEach(question => {
    const type = question.getAttribute('data-type');
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
  let resultDiv = container.querySelector('.quiz-result');
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.className = 'quiz-result';
    container.appendChild(resultDiv);
  }
  
  resultDiv.textContent = `Ergebnis: ${correctCount} von ${questions.length} Fragen richtig beantwortet!`;
}