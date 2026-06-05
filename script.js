// Quiz Daten
const quizData = [
    {
        question: "Welcher Planet ist der größte in unserem Sonnensystem?",
        answers: ["Saturn", "Jupiter", "Neptune", "Uranus"],
        correct: 1,
        points: 100
    },
    {
        question: "Wie viele Kontinente gibt es auf der Erde?",
        answers: ["5", "6", "7", "8"],
        correct: 2,
        points: 100
    },
    {
        question: "In welchem Jahr fiel die Berliner Mauer?",
        answers: ["1987", "1988", "1989", "1990"],
        correct: 2,
        points: 100
    },
    {
        question: "Welches ist das größte Organ des menschlichen Körpers?",
        answers: ["Herz", "Hirn", "Haut", "Lunge"],
        correct: 2,
        points: 100
    },
    {
        question: "Wie viele Saiten hat eine Gitarre?",
        answers: ["4", "5", "6", "7"],
        correct: 2,
        points: 100
    },
    {
        question: "Welcher ist der längste Fluss der Welt?",
        answers: ["Amazon", "Nil", "Jangtsekiang", "Mississippi"],
        correct: 1,
        points: 100
    },
    {
        question: "In welchem Land liegt die Statue von Christus dem Erlöser?",
        answers: ["Peru", "Kolumbien", "Brasilien", "Venezuela"],
        correct: 2,
        points: 100
    },
    {
        question: "Wie viele Quadrate sind auf einem Schachbrett?",
        answers: ["64", "72", "80", "100"],
        correct: 0,
        points: 100
    },
    {
        question: "Welches Element hat das chemische Symbol 'Au'?",
        answers: ["Silber", "Aluminium", "Gold", "Argon"],
        correct: 2,
        points: 100
    },
    {
        question: "Wie schnell reist das Licht?",
        answers: ["300.000 m/s", "300.000 km/s", "30.000 km/s", "3.000 km/s"],
        correct: 1,
        points: 100
    }
];

// Globale Variablen
let currentQuestion = 0;
let currentScore = 0;
let timeLeft = 30;
let timerInterval = null;
let isAnswering = false;
let playerName = "";

// Bildschirme initialisieren
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Quiz starten
function startQuiz() {
    const usernameInput = document.getElementById('usernameInput');
    playerName = usernameInput.value.trim();
    
    if (!playerName) {
        usernameInput.style.borderColor = '#FF6B6B';
        usernameInput.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.5)';
        alert('Bitte geben Sie Ihren Namen ein!');
        return;
    }
    
    currentQuestion = 0;
    currentScore = 0;
    showScreen('quizScreen');
    document.getElementById('totalQuestions').textContent = quizData.length;
    document.getElementById('playerName').textContent = '👤 ' + playerName;
    loadQuestion();
}

// Frage laden
function loadQuestion() {
    const question = quizData[currentQuestion];
    
    document.getElementById('currentQuestion').textContent = currentQuestion + 1;
    document.getElementById('question').textContent = question.question;
    
    const answerElements = document.querySelectorAll('.answer-text');
    answerElements.forEach((elem, index) => {
        elem.textContent = question.answers[index];
    });
    
    // Answer-Options zurücksetzen
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected', 'wrong', 'disabled');
        option.style.pointerEvents = 'auto';
    });
    
    isAnswering = false;
    startTimer();
}

// Timer starten
function startTimer() {
    timeLeft = 30;
    document.getElementById('timeLeft').textContent = timeLeft;
    document.getElementById('timerCircle').classList.remove('warning');
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        
        if (timeLeft <= 10) {
            document.getElementById('timerCircle').classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            skipQuestion();
        }
    }, 1000);
}

// Antwort auswählen
function selectAnswer(index) {
    if (isAnswering) return;
    
    isAnswering = true;
    clearInterval(timerInterval);
    
    const question = quizData[currentQuestion];
    const answerOptions = document.querySelectorAll('.answer-option');
    
    // Alle Options als disabled markieren
    answerOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    if (index === question.correct) {
        // Richtig!
        answerOptions[index].classList.add('selected');
        currentScore += question.points + Math.max(0, timeLeft * 5); // Bonus für verbleibende Zeit
        document.getElementById('currentScore').textContent = currentScore;
    } else {
        // Falsch!
        answerOptions[index].classList.add('wrong');
        answerOptions[question.correct].classList.add('selected');
    }
    
    // Nach 2 Sekunden zur nächsten Frage gehen
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

// Zur nächsten Frage gehen
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Frage überspringen (bei Timer-Ablauf)
function skipQuestion() {
    nextQuestion();
}

// Ergebnisse anzeigen
function showResults() {
    clearInterval(timerInterval);
    
    const maxScore = quizData.reduce((sum, q) => sum + q.points + 150, 0); // 150 = max Zeit-Bonus pro Frage
    
    document.getElementById('finalScore').textContent = currentScore;
    document.getElementById('maxScore').textContent = maxScore;
    document.getElementById('playerResultName').textContent = playerName + ' 🎉';
    
    let message = '';
    const percentage = (currentScore / maxScore) * 100;
    
    if (percentage >= 90) {
        message = "Ausgezeichnet! Du bist ein Quiz-Meister! 🏆";
    } else if (percentage >= 70) {
        message = "Sehr gut! Du hast großartige Kenntnisse! 👍";
    } else if (percentage >= 50) {
        message = "Gut gemacht! Du kannst es noch besser! 💪";
    } else {
        message = "Versuch es nochmal! Übung macht den Meister! 📚";
    }
    
    document.getElementById('resultMessage').textContent = message;
    showScreen('resultsScreen');
}

// Quiz neustarten
function restartQuiz() {
    showScreen('startScreen');
    currentScore = 0;
    playerName = '';
    document.getElementById('currentScore').textContent = currentScore;
    document.getElementById('usernameInput').value = '';
    document.getElementById('usernameInput').style.borderColor = 'white';
    document.getElementById('usernameInput').style.boxShadow = 'none';
}

// Event Listener für Username Input
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('usernameInput');
    
    // Bei Enter-Taste Quiz starten
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startQuiz();
        }
    });
    
    // Fehlerformat entfernen wenn Benutzer tippt
    usernameInput.addEventListener('input', () => {
        usernameInput.style.borderColor = 'white';
        usernameInput.style.boxShadow = 'none';
    });
});