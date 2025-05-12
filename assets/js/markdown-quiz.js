// markdown-quiz.js - Wandelt Quiz-Listen in interaktive Elemente um

document.addEventListener('DOMContentLoaded', function() {
  console.log('Quiz-System wird geladen...');
  
  // Warten auf ein kurzes Delay, um sicherzustellen, dass das DOM vollständig geladen ist
  setTimeout(function() {
    initializeQuizSystem();
  }, 500); // Kurzes Delay für DOM-Stabilität
});

function initializeQuizSystem() {
  // Wir sammeln alle h3-Überschriften als potentielle Quizfragen
  const quizQuestions = document.querySelectorAll('h3');
  console.log(`${quizQuestions.length} potentielle Quizfragen gefunden`);
  
  if (quizQuestions.length === 0) return;
  
  // Debug-Information
  console.log('Quiz-Überschriften gefunden:');
  quizQuestions.forEach((h3, index) => {
    console.log(`${index + 1}: "${h3.textContent.trim()}"`);
  });
  
  // Zähler für die Fragen
  let questionCount = 0;
  
  // Verarbeite jede h3-Überschrift als potentielle Quizfrage
  quizQuestions.forEach((h3, index) => {
    try {
      // Debug-Info für jede Überschrift
      console.log(`Verarbeite Überschrift: "${h3.textContent.trim()}"`);
      
      // Sammeln der relevanten Elemente für diese Frage
      const questionElements = collectQuestionElements(h3);
      console.log(`- ${questionElements.length} zugehörige Elemente gefunden`);
      
      // Prüfen, ob es sich um eine Aufgabe handelt und welchen Typ sie hat
      const questionInfo = identifyQuestionType(h3, questionElements);
      console.log(`- Fragetyp: ${questionInfo.type}, isQuizQuestion: ${questionInfo.isQuizQuestion}`);
      
      // Das Muster für Aufgaben-Überschriften, die den Marker [MC], [SC] usw. enthalten
      // Verbesserte Regex, die auch Überschriften ohne Aufgabe-Wort erkennt
      const aufgabenPattern = /\[(MC|SC|OFFEN|LÜCKE|ORDER)\]/i;
      
      // Auch Fragen verarbeiten, die durch Elemente als Quiz erkannt wurden oder die [TYP] enthalten
      if ((questionElements.length > 0 && questionInfo.isQuizQuestion) || 
          aufgabenPattern.test(h3.textContent.trim())) {
        
        console.log(`- Überschrift als Quiz-Frage erkannt`);
        questionCount++;
        
        // Wir erstellen einen Container für diese Frage
        const questionContainer = document.createElement('div');
        questionContainer.className = 'interactive-quiz-question';
        questionContainer.id = `quiz-question-${questionCount}`;
      
      // Verarbeite die Frage und füge sie zum Container hinzu
      processQuestion(h3, questionElements, questionContainer, questionCount, questionInfo.type);
      
      // Füge die Frage direkt vor die Aufgaben-Überschrift ein
      h3.parentNode.insertBefore(questionContainer, h3);
      
      // Entferne NUR die Aufgaben-Überschrift und die zugehörigen Elemente bis zur nächsten HR
      let el = h3.nextElementSibling;
      while (el && el.tagName !== 'HR') {
        const toRemove = el;
        el = el.nextElementSibling;
        toRemove.parentNode.removeChild(toRemove);
      }
      
      // Entferne die Aufgaben-Überschrift selbst
      h3.parentNode.removeChild(h3);
      
      // Entferne die HR-Trennlinie (falls vorhanden)
      if (el && el.tagName === 'HR') {
        el.parentNode.removeChild(el);
      }
    } else {
      console.log(`- Überschrift nicht als Quiz-Frage erkannt`);
    }
  });
  
  // Button-Logik wie gehabt, aber nur einfügen, wenn mindestens eine Aufgabe erkannt wurde
  if (questionCount > 0) {
    console.log(`Insgesamt ${questionCount} Quiz-Fragen erfolgreich verarbeitet`);
    
    const mainContent = document.querySelector('.page-content .wrapper') || 
                        document.querySelector('main') || 
                        document.body;
    
    const checkButton = document.createElement('button');
    checkButton.textContent = 'Alle Antworten überprüfen';
    checkButton.className = 'check-all-answers-btn';
    checkButton.addEventListener('click', function() {
      checkAllAnswers();
    });
    mainContent.appendChild(checkButton);
    
    // Füge auch einen Container für das Gesamtergebnis hinzu
    const resultContainer = document.createElement('div');
    resultContainer.id = 'quiz-total-result';
    resultContainer.className = 'quiz-total-result';
    resultContainer.style.display = 'none';
    mainContent.appendChild(resultContainer);
  } else {
    console.log('Keine Quiz-Fragen zum Verarbeiten gefunden');
  }
}

// Verbesserte Funktion zur Identifikation des Aufgabentyps anhand der Überschrift und Elemente
function identifyQuestionType(h3, elements) {
  const result = {
    isQuizQuestion: false,
    type: 'unknown'
  };
  
  // Zunächst den Überschriftstext untersuchen
  const headingText = h3.textContent.trim();
  
  // Prüfen, ob es das Muster mit [TYP] in der Überschrift gibt
  // Unterstützt sowohl "Aufgabe X [TYP]" als auch nur "[TYP]" oder "Frage X [TYP]"
  const typePattern = /\[(MC|SC|OFFEN|LÜCKE|ORDER)\]/i;
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
      case 'ORDER':
        result.type = 'order';
        break;
      default:
        result.type = 'unknown';
    }
    
    return result;
  }
  
  // Falls kein [TYP] gefunden wurde, analysiere den Inhalt der Frage
  if (elements.length === 0) return result;
  
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
  
  // Überprüfen, ob eine UL mit Optionen vorliegt
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
      // Wenn nur eine richtige Option markiert ist, könnte es Single-Choice sein
      const correctOptions = Array.from(listItems).filter(item => {
        return item.textContent.includes('(richtige Option)') || 
               item.textContent.includes('(correct)') || 
               item.textContent.includes('(richtig)');
      });
      
      result.type = correctOptions.length === 1 ? 'single-choice' : 'multiple-choice';
      return result;
    }
    
    // Überprüfen auf Checkboxen-Format
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
  
  // Überprüfen auf ORDER-Typ (nummerierte Liste)
  const olElement = elements.find(el => el.tagName === 'OL');
  if (olElement) {
    result.isQuizQuestion = true;
    result.type = 'order';
    return result;
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
  let correctIndices = [];
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
          correctIndices.push(index);
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
    formattedQuestion.setAttribute('data-correct', JSON.stringify(correctIndices));
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    options.forEach((optionText, index) => {
      const label = document.createElement('label');
      label.className = 'option-label';
      
      // Änderung: Für Multiple-Choice Checkboxen statt Radio Buttons verwenden
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = `q-${questionNumber}`;
      checkbox.value = index;
      
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${optionText}`));
      optionsContainer.appendChild(label);
    });
    
    formattedQuestion.appendChild(optionsContainer);
  }
  else if (questionType === 'single-choice' && options.length > 0) {
    // Single-Choice nutzt Radio-Buttons
    formattedQuestion.setAttribute('data-type', 'single-choice');
    formattedQuestion.setAttribute('data-correct', JSON.stringify(correctIndices));
    
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
  else if (questionType === 'gap-text') {
    formattedQuestion.setAttribute('data-type', 'gap-text');
    formattedQuestion.setAttribute('data-correct', JSON.stringify(gapAnswers));
    
    const gapContainer = document.createElement('div');
    gapContainer.className = 'gap-text-container';
    
    // Erstellen einer Option-Box mit den Lücken-Antworten für Drag-and-Drop
    const optionsBox = document.createElement('div');
    optionsBox.className = 'gap-options-box';
    
    // Hinzufügen eines Hinweistextes
    const hintText = document.createElement('p');
    hintText.className = 'gap-hint';
    hintText.textContent = 'Ziehe die Begriffe in die passenden Lücken:';
    optionsBox.appendChild(hintText);
    
    // Erstelle Drag-and-Drop-Elemente für jede Lücke
    gapAnswers.forEach((answer, index) => {
      // Wenn es alternative Antworten gibt (durch | getrennt), verwende nur die erste
      const displayAnswer = answer.split('|')[0].trim();
      
      const option = document.createElement('div');
      option.className = 'gap-option';
      option.textContent = displayAnswer;
      option.setAttribute('draggable', true);
      option.setAttribute('data-answer', answer);
      option.setAttribute('data-index', index);
      
      // Event-Listener für Drag-and-Drop
      option.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', index);
        event.dataTransfer.setData('text/answer', answer);
        this.classList.add('dragging');
      });
      
      option.addEventListener('dragend', function() {
        this.classList.remove('dragging');
      });
      
      optionsBox.appendChild(option);
    });
    
    // Zufällige Anordnung der Optionen
    for (let i = optionsBox.children.length - 1; i > 1; i--) {
      const j = Math.floor(Math.random() * (i - 1)) + 1;
      optionsBox.insertBefore(optionsBox.children[j], optionsBox.children[i]);
    }
    
    // Hinzufügen der Options-Box zum Container
    gapContainer.appendChild(optionsBox);
    
    // Extrahiere Lücken aus dem Text und ersetze sie durch Drop-Zonen
    let gapIndex = 0;
    const gapTextWithDropZones = gapText.replace(/\[([^\]]*)\]/g, (match) => {
      const dropZone = `<div class="gap-drop-zone" data-gap-index="${gapIndex}" 
                           ondragover="event.preventDefault();" 
                           ondragenter="this.classList.add('drag-over');" 
                           ondragleave="this.classList.remove('drag-over');">
                         <span class="gap-placeholder">Lücke ausfüllen...</span>
                       </div>`;
      gapIndex++;
      return dropZone;
    });
    
    // Container für den Lückentext mit Drop-Zonen
    const textContainer = document.createElement('div');
    textContainer.className = 'gap-text-content';
    textContainer.innerHTML = gapTextWithDropZones;
    gapContainer.appendChild(textContainer);
    
    // Event-Listener für Drop-Ereignisse hinzufügen
    textContainer.addEventListener('drop', function(event) {
      event.preventDefault();
      const dropZone = event.target.closest('.gap-drop-zone');
      if (!dropZone) return;
      
      dropZone.classList.remove('drag-over');
      const answerIndex = event.dataTransfer.getData('text/plain');
      const answer = event.dataTransfer.getData('text/answer');
      
      // Finde das entsprechende Drag-Element
      const dragElement = optionsBox.querySelector(`.gap-option[data-index="${answerIndex}"]`);
      
      // Wenn das Element bereits in einer anderen Drop-Zone ist, zurück in die Options-Box
      const existingContainer = document.querySelector(`.gap-drop-zone .gap-option[data-index="${answerIndex}"]`);
      if (existingContainer) {
        const oldDropZone = existingContainer.closest('.gap-drop-zone');
        oldDropZone.innerHTML = '<span class="gap-placeholder">Lücke ausfüllen...</span>';
      }
      
      // Das Element in die Drop-Zone einfügen
      dropZone.innerHTML = '';
      if (dragElement) {
        const newDragEl = dragElement.cloneNode(true);
        newDragEl.classList.add('in-drop-zone');
        dropZone.appendChild(newDragEl);
        
        // Das Original in der Options-Box verstecken
        dragElement.style.visibility = 'hidden';
        
        // Möglichkeit zum Zurücksetzen
        newDragEl.addEventListener('click', function() {
          dropZone.innerHTML = '<span class="gap-placeholder">Lücke ausfüllen...</span>';
          dragElement.style.visibility = 'visible';
        });
      }
    });
    
    formattedQuestion.appendChild(gapContainer);
  } else if (questionType === 'order') {
    // ORDER-Aufgabe: Nummerierte Liste als Drag-and-Drop-Sortieraufgabe
    // 1. Finde die OL oder nummerierte LI-Elemente
    let orderItems = [];
    let correctOrder = [];
    let olElement = elements.find(el => el.tagName === 'OL');
    if (olElement) {
      // OL vorhanden
      orderItems = Array.from(olElement.querySelectorAll('li')).map(li => li.textContent.trim());
    } else {
      // Fallback: Suche nach Zeilen, die wie "1. ..." beginnen
      elements.forEach(el => {
        if (/^\d+\.\s+/.test(el.textContent.trim())) {
          orderItems.push(el.textContent.trim().replace(/^\d+\.\s+/, ''));
        }
      });
    }
    correctOrder = [...orderItems];
    // Mische die Reihenfolge für die Anzeige
    let shuffled = [...orderItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    formattedQuestion.setAttribute('data-type', 'order');
    formattedQuestion.setAttribute('data-correct', JSON.stringify(correctOrder));
    // Drag-and-Drop-Liste
    const orderContainer = document.createElement('div');
    orderContainer.className = 'order-container';
    shuffled.forEach((itemText, idx) => {
      const item = document.createElement('div');
      item.className = 'order-item';
      item.setAttribute('draggable', 'true');
      item.setAttribute('data-index', idx);
      item.textContent = itemText;
      orderContainer.appendChild(item);
    });
    // Drag-and-Drop-Logik
    let dragSrcEl = null;
    orderContainer.addEventListener('dragstart', function(e) {
      if (e.target.classList.contains('order-item')) {
        dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.textContent);
        setTimeout(() => { e.target.classList.add('dragging'); }, 0);
      }
    });
    orderContainer.addEventListener('dragend', function(e) {
      if (e.target.classList.contains('order-item')) {
        e.target.classList.remove('dragging');
      }
    });
    orderContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
      if (e.target.classList.contains('order-item')) {
        e.target.classList.add('drag-over');
      }
    });
    orderContainer.addEventListener('dragleave', function(e) {
      if (e.target.classList.contains('order-item')) {
        e.target.classList.remove('drag-over');
      }
    });
    orderContainer.addEventListener('drop', function(e) {
      e.preventDefault();
      if (e.target.classList.contains('order-item') && dragSrcEl && dragSrcEl !== e.target) {
        e.target.classList.remove('drag-over');
        // Elemente tauschen
        const items = Array.from(orderContainer.children);
        const fromIdx = items.indexOf(dragSrcEl);
        const toIdx = items.indexOf(e.target);
        if (fromIdx > -1 && toIdx > -1) {
          if (fromIdx < toIdx) {
            orderContainer.insertBefore(dragSrcEl, e.target.nextSibling);
          } else {
            orderContainer.insertBefore(dragSrcEl, e.target);
          }
        }
      }
    });
    formattedQuestion.appendChild(orderContainer);
    // Hinweistext
    const infoDiv = document.createElement('div');
    infoDiv.textContent = 'Ziehe die Aussagen in die richtige Reihenfolge!';
    infoDiv.className = 'order-hint';
    formattedQuestion.appendChild(infoDiv);
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
  
  // Modellantwort-Bereich hinzufügen (für offene Fragen)
  if (questionType === 'text') {
    const modelAnswerDiv = document.createElement('div');
    modelAnswerDiv.className = 'model-answer';
    modelAnswerDiv.style.display = 'none';
    modelAnswerDiv.innerHTML = `
      <h4>Musterlösung:</h4>
      <div class="model-answer-content">${correctAnswer}</div>
    `;
    formattedQuestion.appendChild(modelAnswerDiv);
  }
  
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
      const checkboxes = question.querySelectorAll('input[type="checkbox"]');
      let allCorrect = true;
      let anySelected = false;
      
      try {
        const correctIndices = JSON.parse(correctAnswer);
        
        checkboxes.forEach((checkbox, index) => {
          const isChecked = checkbox.checked;
          const shouldBeChecked = correctIndices.includes(index);
          
          if (isChecked) {
            anySelected = true;
          }
          
          // Falsche Antwort, wenn Soll und Ist nicht übereinstimmen
          if (isChecked !== shouldBeChecked) {
            allCorrect = false;
          }
          
          // Zeige die richtigen und falschen Antworten visuell an
          const label = checkbox.closest('label');
          if (shouldBeChecked) {
            label.classList.add('correct-option');
          }
          if (isChecked && !shouldBeChecked) {
            label.classList.add('incorrect-option');
          }
        });
        
        if (!anySelected) {
          feedbackDiv.textContent = 'Keine Antwort ausgewählt.';
          feedbackDiv.className = 'feedback no-answer';
          // Alle richtigen Antworten trotzdem markieren
          correctIndices.forEach(index => {
            const label = checkboxes[index].closest('label');
            label.classList.add('correct-option');
          });
          return;
        }
        
        if (allCorrect) {
          feedbackDiv.textContent = 'Richtig!';
          feedbackDiv.className = 'feedback correct';
          correctCount++;
        } else {
          feedbackDiv.textContent = 'Leider nicht ganz richtig.';
          feedbackDiv.className = 'feedback incorrect';
        }
      } catch (error) {
        console.error('Fehler beim Überprüfen der Multiple-Choice-Antwort:', error);
        feedbackDiv.textContent = 'Fehler bei der Überprüfung.';
        feedbackDiv.className = 'feedback no-answer';
      }
    } else if (type === 'single-choice') {
      const selectedOption = question.querySelector('input[type="radio"]:checked');
      
      try {
        const correctIndices = JSON.parse(correctAnswer);
        
        // Alle richtigen Optionen markieren (Feedback visuell)
        const radioButtons = question.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio, index) => {
          const label = radio.closest('label');
          if (correctIndices.includes(index)) {
            label.classList.add('correct-option');
          }
        });
        
        if (!selectedOption) {
          feedbackDiv.textContent = 'Keine Antwort ausgewählt.';
          feedbackDiv.className = 'feedback no-answer';
          return;
        }
        
        // Überprüfen, ob die gewählte Option korrekt ist
        const selectedIndex = parseInt(selectedOption.value);
        if (correctIndices.includes(selectedIndex)) {
          feedbackDiv.textContent = 'Richtig!';
          feedbackDiv.className = 'feedback correct';
          correctCount++;
        } else {
          const label = selectedOption.closest('label');
          label.classList.add('incorrect-option');
          feedbackDiv.textContent = 'Falsche Antwort.';
          feedbackDiv.className = 'feedback incorrect';
        }
      } catch (error) {
        console.error('Fehler beim Überprüfen der Single-Choice-Antwort:', error);
        feedbackDiv.textContent = 'Fehler bei der Überprüfung.';
        feedbackDiv.className = 'feedback no-answer';
      }
    } else if (type === 'text' || type === 'unknown') {
      const answerField = question.querySelector('.text-answer');
      const modelAnswerDiv = question.querySelector('.model-answer');
      
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
      
      // Für offene Fragen: Zeige die Musterlösung an und lasse den Schüler selbst entscheiden
      feedbackDiv.textContent = 'Bitte vergleiche deine Antwort mit der Musterlösung.';
      feedbackDiv.className = 'feedback self-check';
      
      // Musterlösung anzeigen
      if (modelAnswerDiv) {
        modelAnswerDiv.style.display = 'block';
      }
      
    } else if (type === 'gap-text') {
      // Überprüfung für Lückentext
      const gapDropZones = question.querySelectorAll('.gap-drop-zone');
      let allCorrect = true;
      let totalGaps = gapDropZones.length;
      let correctGaps = 0;
      
      if (gapDropZones.length === 0) {
        console.error('Keine Lückentext-Drop-Zonen gefunden');
        feedbackDiv.textContent = 'Fehler: Keine Drop-Zonen gefunden.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      
      try {
        const correctAnswers = JSON.parse(correctAnswer);
        
        // Prüfe jede Drop-Zone
        gapDropZones.forEach((dropZone, index) => {
          const gapOption = dropZone.querySelector('.gap-option');
          const gapIndex = parseInt(dropZone.getAttribute('data-gap-index'));
          
          // Wenn keine Option eingefügt wurde
          if (!gapOption) {
            allCorrect = false;
            
            // Zeige die korrekte Antwort an
              if (correctAnswers[gapIndex]) {
              const correctAnswer = correctAnswers[gapIndex].split('|')[0].trim();
              dropZone.innerHTML = `<div class="gap-correct-answer">${correctAnswer}</div>`;
            }
            return;
          }
          
          const userAnswer = gapOption.textContent.trim();
          const userAnswerLower = userAnswer.toLowerCase();
          
          // Hole die korrekten Antworten für diesen Index
          const correctOptions = correctAnswers[gapIndex] ? correctAnswers[gapIndex].split('|').map(a => a.trim()) : [];
          
          // Überprüfe, ob die Antwort korrekt ist
          const isCorrect = correctOptions.some(option => {
            const optionLower = option.toLowerCase();
            return userAnswerLower === optionLower;
          });
          
          if (isCorrect) {
            gapOption.classList.add('gap-correct');
            correctGaps++;
          } else {
            gapOption.classList.add('gap-incorrect');
            
            // Zeige die richtige Antwort an
            const correctAnswer = correctOptions.length > 0 ? correctOptions[0] : '';
            if (correctAnswer) {
              const correctEl = document.createElement('div');
              correctEl.className = 'gap-correct-answer';
              correctEl.textContent = correctAnswer;
              dropZone.appendChild(correctEl);
            }
            
            allCorrect = false;
          }
        });
        
        // Zeige das Ergebnis an
        if (totalGaps === correctGaps) {
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
    } else if (type === 'order') {
      // Überprüfung für Sortieraufgabe
      const orderItems = Array.from(question.querySelectorAll('.order-item'));
      const userOrder = orderItems.map(item => item.textContent.trim());
      let correctOrder = [];
      try {
        correctOrder = JSON.parse(correctAnswer);
      } catch (e) {
        feedbackDiv.textContent = 'Fehler bei der Auswertung.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      if (userOrder.length !== correctOrder.length) {
        feedbackDiv.textContent = 'Fehler: Anzahl der Elemente stimmt nicht.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      let allCorrect = true;
      for (let i = 0; i < userOrder.length; i++) {
        if (userOrder[i] !== correctOrder[i]) {
          allCorrect = false;
          break;
        }
      }
      if (allCorrect) {
        feedbackDiv.textContent = 'Richtige Reihenfolge!';
        feedbackDiv.className = 'feedback correct';
        correctCount++;
      } else {
        feedbackDiv.textContent = 'Die Reihenfolge stimmt noch nicht.';
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