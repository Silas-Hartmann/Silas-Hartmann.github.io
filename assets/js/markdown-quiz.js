// markdown-quiz.js - Wandelt Markdown-Quiz-Syntax in interaktive Elemente um

document.addEventListener('DOMContentLoaded', function() {
  // Suche nach Quiz-Bereichen
  const quizRegex = /:::quiz\s([\s\S]*?):::/g;
  const content = document.querySelector('.page-content') || document.body;
  
  if (!content) return;
  
  let html = content.innerHTML;
  let quizCount = 0;
  
  // Ersetze jeden Quiz-Block mit einem interaktiven Quiz
  html = html.replace(quizRegex, (match, quizContent) => {
    quizCount++;
    return `<div class="interactive-quiz" id="quiz-${quizCount}">${processQuizContent(quizContent, quizCount)}</div>`;
  });
  
  content.innerHTML = html;
  
  // Füge "Überprüfen"-Buttons zu allen Quizzes hinzu
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

function processQuizContent(content, quizId) {
  // Finde alle Fragen im Quiz-Content
  const questionRegex = /#{3,6}\s(.+?)\s*\n([\s\S]*?)(?=#{3,6}|$)/g;
  let processedContent = '';
  let questionCount = 0;
  
  let match;
  while ((match = questionRegex.exec(content)) !== null) {
    questionCount++;
    const questionText = match[1].trim();
    const questionContent = match[2].trim();
    
    // Bestimme den Fragetyp und verarbeite entsprechend
    if (questionContent.includes('- [ ]') || questionContent.includes('- [x]')) {
      // Multiple-Choice-Frage
      processedContent += processMultipleChoice(questionText, questionContent, quizId, questionCount);
    } else {
      // Textantwort
      processedContent += processTextAnswer(questionText, questionContent, quizId, questionCount);
    }
  }
  
  return processedContent;
}

function processMultipleChoice(questionText, content, quizId, questionNumber) {
  const optionRegex = /- \[([ x])\]\s(.+?)$/gm;
  let options = [];
  let correctIndex = -1;
  
  let match;
  let i = 0;
  while ((match = optionRegex.exec(content)) !== null) {
    const isCorrect = match[1] === 'x';
    const optionText = match[2].trim();
    
    options.push(optionText);
    
    if (isCorrect) {
      correctIndex = i;
    }
    
    i++;
  }
  
  // Fallback, wenn keine Antwort als korrekt markiert ist
  if (correctIndex === -1) correctIndex = 0;
  
  // Erstelle das HTML für die Multiple-Choice-Frage
  let html = `<div class="formatted-question" data-type="multiple-choice" data-correct="${correctIndex}">
    <div class="question-prompt">${questionNumber}. ${questionText}</div>
    <div class="options-container">`;
  
  options.forEach((option, index) => {
    html += `
      <label class="option-label">
        <input type="radio" name="q-${quizId}-${questionNumber}" value="${index}">
        ${option}
      </label>`;
  });
  
  html += `
    </div>
    <div class="feedback" style="display: none;"></div>
  </div>`;
  
  return html;
}

function processTextAnswer(questionText, content, quizId, questionNumber) {
  // Suche nach der Antwort in einem Antwortblock in der Form:
  // Antwort: richtige Antwort | alternative Antwort
  const answerRegex = /Antwort:\s*(.+?)$/m;
  let correctAnswer = '';
  
  const match = answerRegex.exec(content);
  if (match) {
    correctAnswer = match[1].trim();
    // Entferne die Antwortzeile aus dem Inhalt, damit sie nicht angezeigt wird
    content = content.replace(answerRegex, '');
  }
  
  // Erstelle das HTML für die Textantwort-Frage
  let html = `<div class="formatted-question" data-type="text" data-correct="${correctAnswer}">
    <div class="question-prompt">${questionNumber}. ${questionText}</div>
    <div class="question-content">${content.trim()}</div>
    <textarea class="text-answer" placeholder="Deine Antwort hier eingeben..."></textarea>
    <div class="feedback" style="display: none;"></div>
  </div>`;
  
  return html;
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