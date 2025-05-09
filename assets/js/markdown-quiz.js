// markdown-quiz.js - Wandelt Quiz-Listen in interaktive Elemente um

document.addEventListener('DOMContentLoaded', function() {
  console.log('Quiz-System wird geladen...');
  
  // Debug-Ausgabe der Seitenstruktur
  const bodyHtml = document.body.innerHTML;
  console.log('Seite geladen. HTML-Struktur:', bodyHtml.substring(0, 500) + '...');
  
  // Wir suchen Text-Marker für Quiz-Bereiche
  const paragraphs = document.querySelectorAll('p');
  console.log('Anzahl Paragraphen:', paragraphs.length);
  
  paragraphs.forEach((p, index) => {
    console.log(`Paragraph ${index}:`, p.textContent.substring(0, 50));
    if (p.textContent.trim() === ':::quiz') {
      console.log('Quiz-Marker gefunden!');
    }
  });
  
  // Alternativ: Wir suchen nach Listen, die nach einer h3-Überschrift kommen
  const h3Elements = document.querySelectorAll('h3');
  console.log('Anzahl h3:', h3Elements.length);
  
  h3Elements.forEach((h3, index) => {
    console.log(`Überschrift ${index}:`, h3.textContent);
    
    // Erstellen eines Quiz-Containers für diese Überschrift
    const quizContainer = document.createElement('div');
    quizContainer.className = 'interactive-quiz';
    quizContainer.id = `quiz-${index}`;
    
    // Sammeln der relevanten Elemente für diese Frage
    const questionElements = collectQuestionElements(h3);
    
    if (questionElements.length > 0) {
      console.log(`Frage ${index} hat ${questionElements.length} Elemente`);
      
      // Frage verarbeiten und zum Container hinzufügen
      processQuestion(h3, questionElements, quizContainer, index);
      
      // Container nach der Überschrift einfügen
      h3.parentNode.insertBefore(quizContainer, h3.nextSibling);
      
      // Ursprüngliche Elemente ausblenden
      h3.style.display = 'none';
      questionElements.forEach(el => {
        el.style.display = 'none';
      });
    }
  });
  
  // "Antworten überprüfen"-Buttons hinzufügen
  document.querySelectorAll('.interactive-quiz').forEach(quiz => {
    if (!quiz.querySelector('.check-answers-btn')) {
      const checkButton = document.createElement('button');
      checkButton.textContent = 'Antworten überprüfen';
      checkButton.className = 'check-answers-btn';
      checkButton.addEventListener('click', () => checkAnswers(quiz));
      quiz.appendChild(checkButton);
    }
  });
});

function collectQuestionElements(h3) {
  const elements = [];
  let currentElement = h3.nextElementSibling;
  
  // Sammle alle Elemente bis zur nächsten Überschrift
  while (currentElement && 
         !/^H[1-6]$/.test(currentElement.tagName) &&
         !currentElement.textContent.trim().startsWith(':::')) {
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
  questionPrompt.textContent = `${questionNumber + 1}. ${questionText}`;
  formattedQuestion.appendChild(questionPrompt);
  
  // Typ und Inhalt der Frage bestimmen
  let questionType = 'unknown';
  let correctAnswer = '';
  let options = [];
  let correctIndex = -1;
  let description = '';
  
  elements.forEach(element => {
    if (element.tagName === 'UL') {
      questionType = 'multiple-choice';
      const listItems = element.querySelectorAll('li');
      
      listItems.forEach((item, index) => {
        const optionText = item.textContent.trim();
        options.push(optionText);
        
        // Richtige Option suchen
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
      description += element.outerHTML;
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