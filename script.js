let mcqs = [];
let currentIndex = 0;
let userAnswers = [];
let correctCount = 0;

// Load MCQs from JSON
async function loadMCQs() {
    try {
        const response = await fetch('mcqs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        mcqs = await response.json();
        console.log('Loaded', mcqs.length, 'MCQs');
        console.log('First MCQ:', mcqs[0]);
        document.getElementById('total').textContent = mcqs.length;
        displayQuestion();
    } catch (error) {
        console.error('Error loading MCQs:', error);
        document.getElementById('question').textContent = 'Error: ' + error.message;
        alert('Failed to load questions: ' + error.message);
    }
}

// Get correct option letter for current question
function getCorrectOption(mcq) {
    const correctAnswer = mcq['Correct Answer'];
    const options = ['A', 'B', 'C', 'D'];
    
    for (let opt of options) {
        const optionText = mcq[`Option ${opt}`];
        if (optionText && optionText.trim() === correctAnswer.trim()) {
            return opt;
        }
    }
    console.warn('Could not find correct option for:', mcq.Question);
    console.warn('Correct Answer:', correctAnswer);
    console.warn('Options:', {A: mcq['Option A'], B: mcq['Option B'], C: mcq['Option C'], D: mcq['Option D']});
    return null;
}

// Display current question
function displayQuestion() {
    if (currentIndex >= mcqs.length) {
        showSummary();
        return;
    }

    const mcq = mcqs[currentIndex];
    const questionNumber = currentIndex + 1;
    const correctOption = getCorrectOption(mcq);
    
    document.getElementById('current').textContent = questionNumber;
    document.getElementById('q-number').textContent = questionNumber;
    document.getElementById('question').textContent = mcq.Question;
    
    // Create options
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    const options = ['A', 'B', 'C', 'D'];
    options.forEach(opt => {
        const optionText = mcq[`Option ${opt}`];
        if (optionText) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = `${opt}. ${optionText}`;
            optionDiv.dataset.option = opt;
            
            // Check if already answered
            if (userAnswers[currentIndex]) {
                optionDiv.classList.add('disabled');
                if (userAnswers[currentIndex] === opt) {
                    optionDiv.classList.add('selected');
                    if (opt === correctOption) {
                        optionDiv.classList.add('correct');
                    } else {
                        optionDiv.classList.add('incorrect');
                    }
                }
                if (opt === correctOption) {
                    optionDiv.classList.add('correct');
                }
            } else {
                optionDiv.addEventListener('click', () => selectOption(opt));
            }
            
            optionsContainer.appendChild(optionDiv);
        }
    });
    
    // Show feedback if already answered
    const feedback = document.getElementById('feedback');
    if (userAnswers[currentIndex]) {
        showFeedback(userAnswers[currentIndex] === correctOption);
    } else {
        feedback.classList.remove('show', 'correct', 'incorrect');
    }
    
    // Update button states
    document.getElementById('prev-btn').disabled = currentIndex === 0;
    updateScore();
}

// Select an option
function selectOption(option) {
    const mcq = mcqs[currentIndex];
    const correctOption = getCorrectOption(mcq);
    
    userAnswers[currentIndex] = option;
    
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.add('disabled');
        const optLetter = opt.dataset.option;
        
        if (optLetter === option) {
            opt.classList.add('selected');
            if (option === correctOption) {
                opt.classList.add('correct');
            } else {
                opt.classList.add('incorrect');
            }
        }
        
        if (optLetter === correctOption) {
            opt.classList.add('correct');
        }
    });
    
    // Update score
    if (option === correctOption) {
        correctCount++;
    }
    
    showFeedback(option === correctOption);
    updateScore();
}

// Show feedback
function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.classList.add('show');
    
    if (isCorrect) {
        feedback.classList.remove('incorrect');
        feedback.classList.add('correct');
        feedback.textContent = '✓ Correct! Well done.';
    } else {
        feedback.classList.remove('correct');
        feedback.classList.add('incorrect');
        const mcq = mcqs[currentIndex];
        const correctOption = getCorrectOption(mcq);
        const correctAnswer = mcq['Correct Answer'];
        feedback.textContent = `✗ Incorrect. The correct answer is ${correctOption}. ${correctAnswer}`;
    }
}

// Update score display
function updateScore() {
    document.getElementById('correct').textContent = correctCount;
    document.getElementById('attempted').textContent = userAnswers.filter(a => a).length;
}

// Navigation
document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex++;
    displayQuestion();
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayQuestion();
    }
});

// Show summary
function showSummary() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
    
    const totalAnswered = userAnswers.filter(a => a).length;
    const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    
    document.getElementById('final-score').textContent = correctCount;
    document.getElementById('final-total').textContent = totalAnswered;
    document.getElementById('final-percentage').textContent = percentage + '%';
}

// Restart quiz
document.getElementById('restart-btn').addEventListener('click', () => {
    currentIndex = 0;
    userAnswers = [];
    correctCount = 0;
    
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('summary').style.display = 'none';
    
    displayQuestion();
});

// Initialize
loadMCQs();
