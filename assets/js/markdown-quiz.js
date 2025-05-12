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
    
    // Prüfen, ob es sich um eine Aufgabe handelt und welchen Typ sie hat
    const questionInfo = identifyQuestionType(h3, questionElements);
    
    if (questionElements.length > 0 && questionInfo.isQuizQuestion) {
      questionCount++;
      
      // Wir erstellen einen Container für diese Frage
      const questionContainer = document.createElement('div');
      questionContainer.className = 'interactive-quiz-question';
      questionContainer.id = `quiz-question-${questionCount}`;
      
      // Verarbeite die Frage und füge sie zum Container hinzu
      processQuestion(h3, questionElements, questionContainer, questionCount, questionInfo.type);
      
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

// Neue Funktion zur Identifikation des Aufgabentyps anhand der Überschrift und Elemente
function identifyQuestionType(h3, elements) {
  const result = {
    isQuizQuestion: false,
    type: 'unknown'
  };
  
  // Prüfen, ob es das Muster "### Aufgabe X [TYP]" gibt oder ob die Überschrift selbst "Aufgabe" enthält
  const headingText = h3.textContent.trim();
  const typePattern = /Aufgabe\s+\d+\s*\[([^\]]+)\]/i;
  const typeMatch = headingText.match(typePattern);
  
  if (typeMatch) {
    // Hier wurde ein Aufgabentyp in der Überschrift gefunden
    const taskType = typeMatch[1].toUpperCase();
    result.isQuizQuestion = true;
    
    switch (taskType) {
      case 'MC':
        result.type = 'multiple-choice';
        break;
      case 'SC':
        result.type = 'single-choice';
        break;
      case 'OFFEN':
        result.type = 'text';
        break;
      case 'LÜCKE':
        result.type = 'gap-text';
        break;
      default:
        result.type = 'unknown';
    }
    
    return result;
  }
  
  // Falls kein [TYP] gefunden wurde, verwende die bisherige Logik
  // Überprüfen, ob ein Lückentext vorliegt
  if (elements.some(el => el.textContent.includes('Lücken:'))) {
    result.isQuizQuestion = true;
    result.type = 'gap-text';
    return result;
  }
  
  // Überprüfen, ob Textantwort vorliegt
  if (elements.some(el => el.textContent.includes('Antwort:'))) {
    result.isQuizQuestion = true;
    result.type = 'text';
    return result;
  }
  
  // Überprüfen, ob eine UL mit Checkboxen vorliegt
  const ulElement = elements.find(el => el.tagName === 'UL');
  if (ulElement) {
    const listItems = ulElement.querySelectorAll('li');
    
    // Multiple-Choice-Frage mit (richtige Option) markiert
    const hasCorrectMarker = Array.from(listItems).some(item => {
      return item.textContent.includes('(richtige Option)') || 
             item.textContent.includes('(correct)') || 
             item.textContent.includes('(richtig)');
    });
    
    if (hasCorrectMarker) {
      result.isQuizQuestion = true;
      result.type = 'multiple-choice';
      return result;
    }
    
    // Überprüfen auf Checkboxen - nur als Quiz betrachten, wenn Checkboxen vorhanden sind
    const hasCheckboxes = Array.from(listItems).some(item => {
      const itemText = item.textContent.trim();
      return itemText.startsWith('[ ]') || itemText.startsWith('[x]') || itemText.startsWith('[X]');
    });
    
    if (hasCheckboxes) {
      result.isQuizQuestion = true;
      result.type = 'multiple-choice';
      return result;
    }
  }
  
  return result;
}

function collectQuestionElements(h3) {
  const elements = [];
  let currentElement = h3.nextElementSibling;
  
  // Sammle alle Elemente bis zur nächsten Überschrift oder einem Trennstrich
  while (currentElement && 
         !/^H[1-6]$/.test(currentElement.tagName) &&
         !(currentElement.tagName === 'HR')) {
    elements.push(currentElement);
    currentElement = currentElement.nextElementSibling;
  }
  
  return elements;
}

function processQuestion(h3, elements, container, questionNumber, questionType = 'unknown') {
  // Extrahiere den Fragetext ohne den [TYP] Teil
  const questionText = h3.textContent.replace(/\s*\[.*?\]\s*/, '').trim();
  
  const formattedQuestion = document.createElement('div');
  formattedQuestion.className = 'formatted-question';
  
  const questionPrompt = document.createElement('div');
  questionPrompt.className = 'question-prompt';
  questionPrompt.textContent = `${questionNumber}. ${questionText}`;
  formattedQuestion.appendChild(questionPrompt);
  
  // Sammle erklärende Texte für die Beschreibung
  let description = '';
  let gapParagraphIndex = -1;
  let gapTextIndex = -1;
  let answerElementIndex = -1;
  let ulElementIndex = -1;
  
  // Indizes wichtiger Elemente identifizieren
  elements.forEach((element, index) => {
    if (element.textContent.includes('Lücken:')) {
      gapParagraphIndex = index;
    }
    if (element.textContent.includes('[') && element.textContent.includes(']') && element.tagName !== 'UL') {
      gapTextIndex = index;
    }
    if (element.textContent.includes('Antwort:')) {
      answerElementIndex = index;
    }
    if (element.tagName === 'UL') {
      ulElementIndex = index;
    }
  });
  
  // Inhalt der Frage bestimmen (basierend auf dem bereits erkannten Typ)
  let correctAnswer = '';
  let options = [];
  let correctIndex = -1;
  let gapAnswers = [];
  let gapText = '';
  
  // Wenn der Fragetyp als 'gap-text' (Lückentext) erkannt wurde
  if (questionType === 'gap-text') {
    let hasGapText = false;
    
    if (gapParagraphIndex !== -1) {
      hasGapText = true;
      
      // Extrahiere die Lückentext-Antworten aus dem Element mit "Lücken:"
      const gapParaElement = elements[gapParagraphIndex];
      const match = /Lücken:\s*(.+)/.exec(gapParaElement.textContent);
      if (match) {
        const answersText = match[1].trim();
        // Trenne Antworten durch Komma, und jede Antwort kann Alternativen mit | haben
        gapAnswers = answersText.split(',').map(ans => ans.trim());
      }
      
      // Suche nach dem Lückentext in den vorherigen Elementen
      if (gapTextIndex !== -1) {
        gapText = elements[gapTextIndex].innerHTML;
      }
    } else {
      // Suche nach dem Lückentext mit eckigen Klammern in allen Elementen
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.textContent.includes('[') && el.textContent.includes(']') && el.tagName !== 'UL') {
          gapText = el.innerHTML;
          gapTextIndex = i;
          
          // Extrahiere die Antworten aus den eckigen Klammern
          const tempAnswers = [];
          const regex = /\[([^\]]+)\]/g;
          let match;
          
          while ((match = regex.exec(el.textContent)) !== null) {
            tempAnswers.push(match[1]);
          }
          
          if (tempAnswers.length > 0) {
            gapAnswers = tempAnswers;
          }
          
          break;
        }
      }
    }
  } 
  // Verarbeitung von Multiple-Choice oder Single-Choice Fragen
  else if (questionType === 'multiple-choice' || questionType === 'single-choice') {
    // Suche nach UL-Element
    if (ulElementIndex !== -1) {
      const ulElement = elements[ulElementIndex];
      const listItems = ulElement.querySelectorAll('li');
      
      listItems.forEach((item, index) => {
        const optionText = item.textContent.trim();
        
        // Richtige Option suchen und Marker entfernen
        const cleanedText = optionText.replace(/\(richtige Option\)|\(correct\)|\(richtig\)/g, '').trim();
        
        // Checkbox-Format verarbeiten
        let processedText = cleanedText;
        if (cleanedText.startsWith('[ ]') || cleanedText.startsWith('[x]') || cleanedText.startsWith('[X]')) {
          processedText = cleanedText.substring(3).trim();
        }
        
        options.push(processedText);
        
        if (optionText.includes('(richtige Option)') || 
            optionText.includes('(correct)') ||
            optionText.includes('(richtig)') ||
            optionText.includes('[x]') ||
            optionText.includes('[X]')) {
          correctIndex = index;
        }
      });
    }
  }
  // Verarbeitung von Textantwort-Fragen
  else if (questionType === 'text') {
    // Finde das Element mit "Antwort:"
    if (answerElementIndex !== -1) {
      const answerElement = elements[answerElementIndex];
      
      // Versuche, die Antwort zu extrahieren
      const match = /Antwort:\s*(.+)/.exec(answerElement.textContent);
      if (match) {
        correctAnswer = match[1].trim();
      }
    }
  }
  
  // Sammle die Beschreibung, indem du die Elemente ausschließt, die für die Frage-Identifikation verwendet werden
  elements.forEach((element, index) => {
    if (index !== gapParagraphIndex && index !== gapTextIndex && index !== answerElementIndex && index !== ulElementIndex) {
      if (element.textContent.trim()) {
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
  else if (questionType === 'single-choice' && options.length > 0) {
    // Single-Choice nutzt auch Radio-Buttons wie Multiple-Choice
    formattedQuestion.setAttribute('data-type', 'single-choice');
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
    // OHNE die Lösungsvorschläge zu verwenden
    let gapIndex = 0;
    const gapTextWithInputs = gapText.replace(/\[([^\]]*)\]/g, (match) => {
      const input = `<input type="text" class="gap-input" data-gap-index="${gapIndex}" placeholder="Lücke ausfüllen...">`;
      gapIndex++;
      return input;
    });
    
    gapContainer.innerHTML = gapTextWithInputs;
    formattedQuestion.appendChild(gapContainer);
  } else {
    // Fallback für unerkannte Fragetypen - setze trotzdem ein Textfeld
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
    
    if (type === 'multiple-choice' || type === 'single-choice') {
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
        feedbackDiv.textContent = 'Fehler: Keine Eingabefelder gefunden.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      
      try {
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
      } catch (error) {
        console.error('Fehler beim Parsen der korrekten Antworten:', error);
        feedbackDiv.textContent = 'Fehler bei der Lückentext-Prüfung: ' + error.message;
        feedbackDiv.className = 'feedback no-answer';
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