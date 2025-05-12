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
    
    // Überprüfung, ob es sich um eine Quizfrage handelt
    const questionInfo = checkIfNewFormatQuizQuestion(h3, questionElements);
    
    if (questionInfo.isQuizQuestion) {
      questionCount++;
      
      // Wir erstellen einen Container für diese Frage
      const questionContainer = document.createElement('div');
      questionContainer.className = 'interactive-quiz-question';
      questionContainer.id = `quiz-question-${questionCount}`;
      
      // Verarbeite die Frage und füge sie zum Container hinzu
      processQuestion(h3, questionElements, questionContainer, questionCount, questionInfo);
      
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

// Prüft, ob es sich um eine Quizfrage im neuen Format handelt
function checkIfNewFormatQuizQuestion(h3, elements) {
  // Standardrückgabewert
  const result = {
    isQuizQuestion: false,
    type: null,
    originalText: h3.textContent,
    cleanedText: h3.textContent
  };
  
  // Regex, um die "Aufgabe X [TYP]" Struktur zu erkennen
  const taskTypeRegex = /^Aufgabe\s+\d+\s*\[(MC|SC|OFFEN|LÜCKE|ORDER)\]\s*(.*)$/i;
  const match = h3.textContent.match(taskTypeRegex);
  
  if (match) {
    const taskType = match[1].toUpperCase();
    const remainingText = match[2];
    
    result.isQuizQuestion = true;
    result.type = taskType;
    result.cleanedText = "Aufgabe " + h3.textContent.split(/\s+\[/)[0].substring(8) + 
                         (remainingText ? ": " + remainingText : "");
  } else {
    // Falls keine explizite Typisierung gefunden wurde, prüfe auf die alten Formate
    // Diese Funktion bleibt für Rückwärtskompatibilität bestehen
    const legacyResult = checkIfQuizQuestion(elements);
    result.isQuizQuestion = legacyResult;
  }
  
  return result;
}

// Prüft, ob es sich um eine Quizfrage im alten Format handelt
function checkIfQuizQuestion(elements) {
  // Überprüfen, ob ein Lückentext vorliegt
  if (elements.some(el => el.textContent.includes('Lücken:'))) {
    return true;
  }
  
  // Überprüfen, ob Textantwort vorliegt
  if (elements.some(el => el.textContent.includes('Antwort:'))) {
    return true;
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
      return true;
    }
    
    // Überprüfen auf Checkboxen - nur als Quiz betrachten, wenn Checkboxen vorhanden sind
    const hasCheckboxes = Array.from(listItems).some(item => {
      const itemText = item.textContent.trim();
      return itemText.startsWith('[ ]') || itemText.startsWith('[x]') || itemText.startsWith('[X]');
    });
    
    return hasCheckboxes;
  }
  
  return false;
}

// Sammelt die Elemente einer Frage bis zum Trennstrich oder zur nächsten Überschrift
function collectQuestionElements(h3) {
  const elements = [];
  let currentElement = h3.nextElementSibling;
  
  // Sammle alle Elemente bis zur nächsten Überschrift oder einem Trennstrich (---)
  while (currentElement && 
         !/^H[1-6]$/.test(currentElement.tagName) && 
         !(currentElement.tagName === 'HR')) {
    elements.push(currentElement);
    currentElement = currentElement.nextElementSibling;
  }
  
  return elements;
}

// Verarbeitet eine erkannte Quiz-Frage und erstellt interaktive Elemente
function processQuestion(h3, elements, container, questionNumber, questionInfo) {
  // Falls questionInfo nicht übergeben wurde, erstelle ein Standard-Objekt
  if (!questionInfo) {
    questionInfo = {
      isQuizQuestion: true,
      type: null,
      originalText: h3.textContent,
      cleanedText: h3.textContent
    };
  }
  
  // Verwende den bereinigten Text ohne Typ-Kennung
  const questionText = questionInfo.cleanedText;
  
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
  let correctIndices = [];
  let description = '';
  let gapAnswers = [];
  let gapText = '';
  let orderItems = [];
  
  // Den Typ aus der Überschrift verwenden, falls vorhanden
  if (questionInfo.type) {
    switch (questionInfo.type) {
      case 'MC':
        questionType = 'multiple-choice';
        break;
      case 'SC':
        questionType = 'single-choice';
        break;
      case 'OFFEN':
        questionType = 'text';
        break;
      case 'LÜCKE':
        questionType = 'gap-text';
        break;
      case 'ORDER':
        questionType = 'order';
        break;
    }
  }
  
  // Prüfe auf Reihenfolge-Aufgaben (ORDER)
  if (questionType === 'order' || elements.some(el => el.tagName === 'OL')) {
    questionType = 'order';
    
    // Finde die geordnete Liste (OL) in den Elementen
    const olElement = elements.find(el => el.tagName === 'OL');
    
    if (olElement) {
      const listItems = olElement.querySelectorAll('li');
      
      // Die richtige Reihenfolge ist die Reihenfolge in der nummerierten Liste
      listItems.forEach((item, index) => {
        orderItems.push({
          text: item.textContent.trim(),
          correctPosition: index
        });
      });
    }
  }
  
  // Prüfen, ob es einen Lückentext gibt
  let hasGapText = false;
  let gapParagraphIndex = -1;
  
  // Erst einmal alle Elemente durchgehen, um zu prüfen, ob "Lücken:" vorkommt
  elements.forEach((element, index) => {
    if (element.textContent.includes('Lücken:')) {
      hasGapText = true;
      gapParagraphIndex = index;
    }
  });
  
  // Wenn Lückentext gefunden oder aus Überschrift erkannt, dann verarbeiten
  if (hasGapText || questionType === 'gap-text') {
    questionType = 'gap-text';
    
    if (gapParagraphIndex !== -1) {
      // Extrahiere die Lückentext-Antworten aus dem Element mit "Lücken:"
      const gapParaElement = elements[gapParagraphIndex];
      const match = /Lücken:\s*(.+)/.exec(gapParaElement.textContent);
      if (match) {
        const answersText = match[1].trim();
        // Trenne Antworten durch Komma, und jede Antwort kann Alternativen mit | haben
        gapAnswers = answersText.split(',').map(ans => ans.trim());
      }
    }
    
    // Suche nach dem Lückentext in den Elementen
    for (let i = 0; i < elements.length; i++) {
      const prevEl = elements[i];
      if (i !== gapParagraphIndex && prevEl.textContent.includes('[') && prevEl.textContent.includes(']')) {
        gapText = prevEl.innerHTML;
        break;
      }
    }
  } 
  // Prüfe auf Multiple-Choice-Fragen
  else if (elements.some(el => el.tagName === 'UL') || 
           questionType === 'multiple-choice' || 
           questionType === 'single-choice') {
    
    if (questionType === 'single-choice') {
      questionType = 'multiple-choice'; // Behandeln als multiple-choice mit radio buttons
    }
    
    const ulElement = elements.find(el => el.tagName === 'UL');
    if (ulElement) {
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
  // Prüfe auf Textantwort-Fragen
  else if (elements.some(el => el.textContent.includes('Antwort:')) || 
           questionType === 'text') {
    questionType = 'text';
    
    // Finde das Element mit "Antwort:"
    const answerElement = elements.find(el => el.textContent.includes('Antwort:'));
    
    if (answerElement) {
      // Versuche, die Antwort zu extrahieren
      const match = /Antwort:\s*(.+)/.exec(answerElement.textContent);
      if (match) {
        correctAnswer = match[1].trim();
      }
    }
  }
  
  // Sammle erklärende Texte für die Beschreibung
  elements.forEach((element, index) => {
    // Nur Elemente zur Beschreibung hinzufügen, die nicht für die Frage-Identifikation verwendet werden
    if (questionType === 'gap-text' && index === gapParagraphIndex) {
      // Lücken-Zeile nicht zur Beschreibung hinzufügen
      return;
    }
    
    if (questionType === 'gap-text' && gapText && gapText.includes(element.innerHTML)) {
      // Lückentext-Paragraph nicht zur Beschreibung hinzufügen
      return;
    }
    
    if (element.tagName === 'UL' && (questionType === 'multiple-choice' || questionType === 'single-choice')) {
      // Multiple-Choice-Liste nicht zur Beschreibung hinzufügen
      return;
    }
    
    if (element.textContent.includes('Antwort:') && questionType === 'text') {
      // Antwort-Zeile nicht zur Beschreibung hinzufügen
      return;
    }
    
    if (element.tagName === 'OL' && questionType === 'order') {
      // Geordnete Liste bei Reihenfolge-Aufgaben nicht zur Beschreibung hinzufügen
      return;
    }
    
    // Alle anderen Elemente als Beschreibung hinzufügen
    if (element.textContent.trim()) {
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
  if ((questionType === 'multiple-choice' || questionType === 'single-choice') && options.length > 0) {
    formattedQuestion.setAttribute('data-type', 'multiple-choice');
    formattedQuestion.setAttribute('data-correct', JSON.stringify(correctIndices));
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    options.forEach((optionText, index) => {
      const label = document.createElement('label');
      label.className = 'option-label';
      
      // Bei MC immer Checkboxen verwenden (statt Radio-Buttons)
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = `q-${questionNumber}`;
      checkbox.value = index;
      checkbox.dataset.index = index;
      
      label.appendChild(checkbox);
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
    
    // Container für die Musterlösung erstellen (anfangs versteckt)
    const solutionContainer = document.createElement('div');
    solutionContainer.className = 'solution-container';
    solutionContainer.style.display = 'none';
    
    const solutionTitle = document.createElement('h4');
    solutionTitle.textContent = 'Musterlösung:';
    solutionContainer.appendChild(solutionTitle);
    
    const solutionText = document.createElement('div');
    solutionText.className = 'solution-text';
    
    // Aufbereiten der Musterlösung - bei mehreren Optionen nehmen wir die erste
    const primarySolution = correctAnswer.split('|')[0];
    solutionText.textContent = primarySolution;
    
    solutionContainer.appendChild(solutionText);
    
    // Selbsteinschätzungs-Bereich erstellen
    const selfAssessment = document.createElement('div');
    selfAssessment.className = 'self-assessment';
    selfAssessment.style.display = 'none';
    
    const assessmentTitle = document.createElement('h4');
    assessmentTitle.textContent = 'Bewerte deine Antwort:';
    selfAssessment.appendChild(assessmentTitle);
    
    const assessmentButtons = document.createElement('div');
    assessmentButtons.className = 'assessment-buttons';
    
    ['Korrekt', 'Teilweise korrekt', 'Falsch'].forEach(assessment => {
      const button = document.createElement('button');
      button.textContent = assessment;
      button.className = 'assessment-button';
      button.addEventListener('click', function() {
        // Alle Buttons zurücksetzen
        assessmentButtons.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('selected');
        });
        // Ausgewählten Button markieren
        this.classList.add('selected');
      });
      assessmentButtons.appendChild(button);
    });
    
    selfAssessment.appendChild(assessmentButtons);
    
    inputContainer.appendChild(solutionContainer);
    inputContainer.appendChild(selfAssessment);
    
    formattedQuestion.appendChild(inputContainer);
  }
  else if (questionType === 'gap-text' && gapText && gapAnswers.length > 0) {
    formattedQuestion.setAttribute('data-type', 'gap-text');
    formattedQuestion.setAttribute('data-correct', JSON.stringify(gapAnswers));
    
    const gapContainer = document.createElement('div');
    gapContainer.className = 'gap-text-container';
    
    // Erstelle einen Container für die Drag & Drop-Wörter
    const wordsContainer = document.createElement('div');
    wordsContainer.className = 'gap-words-container';
    wordsContainer.innerHTML = '<strong>Verfügbare Wörter:</strong>';
    
    // Erstelle den Drag & Drop-Bereich für die Wörter
    const wordsList = document.createElement('div');
    wordsList.className = 'gap-words-list';
    
    // Sammle alle korrekten Wörter für die Lücken
    let allWords = [];
    gapAnswers.forEach(answer => {
      // Für jede Antwort nehmen wir nur die erste Option vor dem |
      const primaryOption = answer.split('|')[0];
      allWords.push(primaryOption);
    });
    
    // Optional: Mische die Wörter
    allWords = shuffleArray(allWords);
    
    // Erstelle für jedes Wort ein Drag & Drop-Element
    allWords.forEach((word, wordIndex) => {
      const wordElement = document.createElement('div');
      wordElement.className = 'gap-word';
      wordElement.textContent = word;
      wordElement.setAttribute('draggable', 'true');
      wordElement.dataset.word = word;
      
      // Drag & Drop-Eventlistener
      wordElement.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', word);
        e.dataTransfer.setData('application/word-index', wordIndex);
        this.classList.add('dragging');
      });
      
      wordElement.addEventListener('dragend', function() {
        this.classList.remove('dragging');
      });
      
      wordsList.appendChild(wordElement);
    });
    
    wordsContainer.appendChild(wordsList);
    
    // Extrahiere Lücken aus dem Text und ersetze sie durch Drop-Bereiche
    let gapIndex = 0;
    const gapTextWithDropzones = gapText.replace(/\[([^\]]*)\]/g, (match) => {
      const dropzone = document.createElement('div');
      dropzone.className = 'gap-dropzone';
      dropzone.dataset.gapIndex = gapIndex;
      dropzone.textContent = 'Wort hier ablegen...';
      
      // Drop-Events
      dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
      });
      
      dropzone.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
      });
      
      dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const word = e.dataTransfer.getData('text/plain');
        const wordIndex = e.dataTransfer.getData('application/word-index');
        
        // Setze das Wort in die Lücke
        this.textContent = word;
        this.classList.add('filled');
        this.dataset.filledWith = word;
      });
      
      gapIndex++;
      return dropzone.outerHTML;
    });
    
    gapContainer.innerHTML = gapTextWithDropzones;
    
    // Füge erst den Text mit den Lücken, dann die Wörter hinzu
    formattedQuestion.appendChild(gapContainer);
    formattedQuestion.appendChild(wordsContainer);
  }   
  else if (questionType === 'order' && orderItems.length > 0) {
    formattedQuestion.setAttribute('data-type', 'order');
    formattedQuestion.setAttribute('data-correct', JSON.stringify(orderItems.map(item => item.correctPosition)));
    
    const orderContainer = document.createElement('div');
    orderContainer.className = 'order-container';
    
    // Mische die Elemente, um sie in zufälliger Reihenfolge anzuzeigen
    const shuffledItems = [...orderItems];
    shuffleArray(shuffledItems);
    
    // Erstelle eine sortierbare Liste
    const sortableList = document.createElement('div');
    sortableList.className = 'sortable-list';
    
    // Erstelle für jedes Element einen verschiebbaren Eintrag
    shuffledItems.forEach((item, index) => {
      const itemContainer = document.createElement('div');
      itemContainer.className = 'order-item-container';
      
      // Nummerierung links
      const numberLabel = document.createElement('div');
      numberLabel.className = 'order-number';
      numberLabel.textContent = (index + 1) + '.';
      itemContainer.appendChild(numberLabel);
      
      // Verschiebbares Element
      const itemElement = document.createElement('div');
      itemElement.className = 'order-item';
      itemElement.textContent = item.text;
      itemElement.setAttribute('draggable', 'true');
      itemElement.dataset.originalPosition = orderItems.findIndex(original => original.text === item.text);
      
      // Drag & Drop Event-Listener
      itemElement.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', index);
        this.classList.add('dragging');
        
        // Speichere Referenz auf das gezogene Element
        sortableList.dataset.draggedItem = index;
      });
      
      itemElement.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        delete sortableList.dataset.draggedItem;
      });
      
      // Handle-Symbol für Drag & Drop
      const dragHandle = document.createElement('div');
      dragHandle.className = 'order-item-handle';
      dragHandle.innerHTML = '&#8942;&#8942;'; // Unicode für zwei vertikale Punktlinien
      
      itemElement.appendChild(dragHandle);
      itemContainer.appendChild(itemElement);
      sortableList.appendChild(itemContainer);
    });
    
    // Event-Listener für die Drop-Zone
    sortableList.addEventListener('dragover', function(e) {
      e.preventDefault();
      const draggedIndex = parseInt(this.dataset.draggedItem);
      const targetContainer = findDropTarget(e.clientY, this);
      
      if (targetContainer && targetContainer !== this.children[draggedIndex]) {
        // Bestimme, ob nach oben oder unten einzufügen
        const targetRect = targetContainer.getBoundingClientRect();
        const targetMiddle = targetRect.top + targetRect.height / 2;
        const insertAfter = e.clientY > targetMiddle;
        
        // Blinken-Effekt für die Drop-Position
        clearDropEffects(this);
        targetContainer.classList.add(insertAfter ? 'drop-after' : 'drop-before');
      }
    });
    
    sortableList.addEventListener('dragleave', function() {
      clearDropEffects(this);
    });
    
    sortableList.addEventListener('drop', function(e) {
      e.preventDefault();
      const draggedIndex = parseInt(this.dataset.draggedItem);
      const draggedItem = this.children[draggedIndex];
      const targetContainer = findDropTarget(e.clientY, this);
      
      if (targetContainer && draggedItem !== targetContainer) {
        // Bestimme, ob nach oben oder unten einzufügen
        const targetRect = targetContainer.getBoundingClientRect();
        const targetMiddle = targetRect.top + targetRect.height / 2;
        const insertAfter = e.clientY > targetMiddle;
        
        // Einfügen an der richtigen Position
        if (insertAfter) {
          this.insertBefore(draggedItem, targetContainer.nextSibling);
        } else {
          this.insertBefore(draggedItem, targetContainer);
        }
        
        // Aktualisiere die Nummerierung
        updateOrderNumbers(this);
      }
      
      clearDropEffects(this);
    });
    
    // Hilfsfunktionen für das Drag & Drop
    function findDropTarget(clientY, container) {
      return Array.from(container.children).find(child => {
        const rect = child.getBoundingClientRect();
        return clientY >= rect.top && clientY <= rect.bottom;
      });
    }
    
    function clearDropEffects(container) {
      Array.from(container.children).forEach(child => {
        child.classList.remove('drop-before', 'drop-after');
      });
    }
    
    function updateOrderNumbers(container) {
      Array.from(container.children).forEach((child, index) => {
        const numberLabel = child.querySelector('.order-number');
        if (numberLabel) {
          numberLabel.textContent = (index + 1) + '.';
        }
      });
    }
    
    orderContainer.appendChild(sortableList);
    
    // Füge Buttons zum Verschieben hinzu
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'order-controls';
    
    const moveUpButton = document.createElement('button');
    moveUpButton.className = 'order-control-button';
    moveUpButton.textContent = '↑ Nach oben';
    moveUpButton.addEventListener('click', function() {
      moveSelectedItem(sortableList, -1);
    });
    
    const moveDownButton = document.createElement('button');
    moveDownButton.className = 'order-control-button';
    moveDownButton.textContent = '↓ Nach unten';
    moveDownButton.addEventListener('click', function() {
      moveSelectedItem(sortableList, 1);
    });
    
    controlsContainer.appendChild(moveUpButton);
    controlsContainer.appendChild(moveDownButton);
    orderContainer.appendChild(controlsContainer);
    
    // Funktion zum Verschieben eines ausgewählten Elements
    function moveSelectedItem(container, direction) {
      const selected = container.querySelector('.order-item.selected');
      if (!selected) {
        alert('Bitte wähle zuerst ein Element aus.');
        return;
      }
      
      const itemContainer = selected.parentNode;
      const index = Array.from(container.children).indexOf(itemContainer);
      const newIndex = index + direction;
      
      // Prüfe, ob die neue Position gültig ist
      if (newIndex >= 0 && newIndex < container.children.length) {
        if (direction > 0) {
          container.insertBefore(itemContainer, container.children[newIndex + 1]);
        } else {
          container.insertBefore(itemContainer, container.children[newIndex]);
        }
        
        // Aktualisiere die Nummerierung
        updateOrderNumbers(container);
      }
    }
    
    // Klick-Ereignis für die Auswahl von Elementen
    sortableList.addEventListener('click', function(e) {
      const item = e.target.closest('.order-item');
      if (item) {
        // Entferne die Auswahl von allen anderen Elementen
        Array.from(this.querySelectorAll('.order-item')).forEach(el => {
          el.classList.remove('selected');
        });
        
        // Markiere das angeklickte Element
        item.classList.add('selected');
      }
    });
    
    formattedQuestion.appendChild(orderContainer);
  }
  else {
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

// Überprüft alle Antworten und gibt Feedback
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
      const checkedOptions = question.querySelectorAll('input[type="checkbox"]:checked');
      let correctIndices = [];
      
      try {
        correctIndices = JSON.parse(correctAnswer);
      } catch (e) {
        // Fallback für alte Datenformate
        if (correctAnswer && !isNaN(parseInt(correctAnswer))) {
          correctIndices = [parseInt(correctAnswer)];
        }
      }
      
      // Wenn keine Option ausgewählt wurde
      if (checkedOptions.length === 0) {
        feedbackDiv.textContent = 'Keine Antwort ausgewählt.';
        feedbackDiv.className = 'feedback no-answer';
        
        // Zeige die richtigen Antworten an
        showCorrectMCAnswers(question, correctIndices);
        return;
      }
      
      // Überprüfe, ob alle ausgewählten Optionen korrekt sind
      let allCorrect = true;
      let selectedIndices = Array.from(checkedOptions).map(option => parseInt(option.dataset.index));
      
      // Bei nur einer korrekten Antwort
      if (correctIndices.length === 1 && selectedIndices.length === 1) {
        allCorrect = selectedIndices[0] === correctIndices[0];
      }
      // Bei mehreren korrekten Antworten - alle ausgewählten müssen korrekt sein
      else {
        // Alle ausgewählten müssen in der korrekten Liste sein
        selectedIndices.forEach(index => {
          if (!correctIndices.includes(index)) {
            allCorrect = false;
          }
        });
        
        // Zusätzlich muss mindestens eine korrekte Option gewählt sein
        if (selectedIndices.length === 0 || !selectedIndices.some(index => correctIndices.includes(index))) {
          allCorrect = false;
        }
      }
      
      if (allCorrect) {
        feedbackDiv.textContent = 'Richtig!';
        feedbackDiv.className = 'feedback correct';
        correctCount++;
      } else {
        feedbackDiv.textContent = 'Falsche Antwort.';
        feedbackDiv.className = 'feedback incorrect';
        
        // Zeige die richtigen Antworten an
        showCorrectMCAnswers(question, correctIndices);
      }
    } else if (type === 'text' || type === 'unknown') {
      const answerField = question.querySelector('.text-answer');
      if (!answerField) {
        console.error('Textantwortfeld nicht gefunden');
        return;
      }
      
      const userAnswer = answerField.value.trim();
      
      if (type === 'text') {
        // Bei offenen Aufgaben zeigen wir die Musterlösung und Selbsteinschätzung
        const solutionContainer = question.querySelector('.solution-container');
        const selfAssessment = question.querySelector('.self-assessment');
        
        if (solutionContainer) solutionContainer.style.display = 'block';
        if (selfAssessment) selfAssessment.style.display = 'block';
        
        feedbackDiv.textContent = 'Vergleiche deine Antwort mit der Musterlösung und bewerte sie selbst.';
        feedbackDiv.className = 'feedback info';
      }
      else if (type === 'unknown') {
        feedbackDiv.textContent = 'Diese Antwort kann nicht automatisch überprüft werden.';
        feedbackDiv.className = 'feedback no-answer';
      }
      else if (!userAnswer) {
        feedbackDiv.textContent = 'Keine Antwort eingegeben.';
        feedbackDiv.className = 'feedback no-answer';
      }
      else {
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
          feedbackDiv.textContent = 'Falsche oder unvollständige Antwort. Die richtige Antwort wäre: ' + possibleAnswers[0];
          feedbackDiv.className = 'feedback incorrect';
        }
      }
    } else if (type === 'order') {
      // Überprüfung für die Reihenfolge-Aufgaben
      const sortableList = question.querySelector('.sortable-list');
      
      if (!sortableList) {
        console.error('Sortierbare Liste nicht gefunden');
        feedbackDiv.textContent = 'Fehler: Keine sortierbaren Elemente gefunden.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      
      try {
        // Hole die korrekten Positionen aus dem Attribut
        const correctPositions = JSON.parse(correctAnswer);
        
        // Sammle die aktuellen Positionen
        const currentItems = Array.from(sortableList.querySelectorAll('.order-item'));
        const currentPositions = currentItems.map(item => parseInt(item.dataset.originalPosition));
        
        // Prüfe, ob die aktuelle Reihenfolge korrekt ist
        let isCorrect = true;
        for (let i = 0; i < correctPositions.length; i++) {
          if (correctPositions[i] !== currentPositions[i]) {
            isCorrect = false;
            break;
          }
        }
        
        if (isCorrect) {
          feedbackDiv.textContent = 'Richtige Reihenfolge!';
          feedbackDiv.className = 'feedback correct';
          correctCount++;
        } else {
          feedbackDiv.textContent = 'Die Reihenfolge ist nicht korrekt.';
          feedbackDiv.className = 'feedback incorrect';
          
          // Zeige die korrekte Reihenfolge an
          const correctOrderDiv = document.createElement('div');
          correctOrderDiv.className = 'correct-order';
          correctOrderDiv.innerHTML = '<strong>Richtige Reihenfolge:</strong>';
          
          const correctItemsList = document.createElement('ol');
          correctItemsList.className = 'correct-order-list';
          
          // Sortiere die Items nach den korrekten Positionen und füge sie zur Liste hinzu
          const itemsWithCorrectOrder = currentItems
            .map((item, i) => ({ item: item.textContent, originalPosition: parseInt(item.dataset.originalPosition) }))
            .sort((a, b) => a.originalPosition - b.originalPosition);
          
          itemsWithCorrectOrder.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.item;
            correctItemsList.appendChild(listItem);
          });
          
          correctOrderDiv.appendChild(correctItemsList);
          feedbackDiv.appendChild(correctOrderDiv);
        }
      } catch (error) {
        console.error('Fehler bei der Überprüfung der Reihenfolge:', error);
        feedbackDiv.textContent = 'Fehler bei der Überprüfung: ' + error.message;
        feedbackDiv.className = 'feedback no-answer';
      }
    }
    else if (type === 'gap-text') {
      // Überprüfung für Lückentext mit Drag & Drop
      const gapDropzones = question.querySelectorAll('.gap-dropzone');
      let allCorrect = true;
      let totalGaps = gapDropzones.length;
      let correctGaps = 0;
      
      if (gapDropzones.length === 0) {
        console.error('Keine Lückentext-Dropzones gefunden');
        feedbackDiv.textContent = 'Fehler: Keine Dropzones gefunden.';
        feedbackDiv.className = 'feedback no-answer';
        return;
      }
      
      try {
        const correctAnswers = JSON.parse(correctAnswer);
        
        // Prüfe jede Lücke
        gapDropzones.forEach((dropzone, index) => {
          const userAnswer = dropzone.dataset.filledWith || '';
          
          if (!userAnswer || dropzone.textContent === 'Wort hier ablegen...') {
            allCorrect = false;
            dropzone.classList.add('gap-empty');
            return;
          }
          
          dropzone.classList.remove('gap-empty');
          
          // Hole die korrekten Antworten für diese Lücke
          const correctOptions = correctAnswers[index] ? correctAnswers[index].split('|').map(a => a.trim()) : [];
          const userAnswerLower = userAnswer.toLowerCase();
          
          // Überprüfe, ob die Antwort korrekt ist
          const isCorrect = correctOptions.some(option => {
            const optionLower = option.toLowerCase();
            return userAnswerLower === optionLower;
          });
          
          if (isCorrect) {
            dropzone.classList.add('gap-correct');
            dropzone.classList.remove('gap-incorrect');
            correctGaps++;
          } else {
            dropzone.classList.add('gap-incorrect');
            dropzone.classList.remove('gap-correct');
            allCorrect = false;
            
            // Zeige die richtige Antwort an
            const correctTip = document.createElement('div');
            correctTip.className = 'gap-correct-answer';
            correctTip.textContent = "Richtig wäre: " + correctOptions[0];
            dropzone.appendChild(correctTip);
          }
        });
        
        // Zeige das Ergebnis an
        if (gapDropzones.length === 0) {
          feedbackDiv.textContent = 'Fehler bei der Lückentext-Prüfung.';
          feedbackDiv.className = 'feedback no-answer';
        } else if (gapDropzones.length > 0 && totalGaps === correctGaps) {
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

// Hilfsfunktion zum Anzeigen der richtigen MC-Antworten
function showCorrectMCAnswers(question, correctIndices) {
  const options = question.querySelectorAll('.option-label');
  
  options.forEach((option, index) => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    const isCorrect = correctIndices.includes(index);
    
    if (isCorrect) {
      option.classList.add('correct-option');
      
      // Füge ein visuelles Indikator hinzu
      const correctIndicator = document.createElement('span');
      correctIndicator.className = 'correct-indicator';
      correctIndicator.textContent = ' ✓';
      correctIndicator.style.color = 'green';
      correctIndicator.style.fontWeight = 'bold';
      option.appendChild(correctIndicator);
    }
  });
}

// Hilfsfunktion zum Mischen eines Arrays
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}