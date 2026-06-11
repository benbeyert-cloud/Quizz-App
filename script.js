// Quiz Daten
const quizData = [
    {
        question: "How many pinwheels are there in Germany?",
        answers: ["31.000", "42.000", "37.000", "24.000"],
        correct: 0,
        points: 100
    },
    {
        question: "How much does a pinwheel cost?",
        answers: ["7-9 Milionen", "3-6 Milionen", "13-15 Milionen", "800 Tausend"],
        correct: 1,
        points: 100
    },
    {
        question: "How much power does a pinwheel generate in one day?",
        answers: ["120.000 kWh", "150.000 kWh", "50.000 kWh", "210.000 kWh"],
        correct: 2,
        points: 100
    },
    {
        question: "For how many households does one pinwheel generate power?",
        answers: ["300", "200", "700", "2000"],
        correct: 2,
        points: 100
    },
    {
        question: "Wich country has the most pinwheels?",
        answers: ["Germany", "USA", "China", "Japan"],
        correct: 2,
        points: 100
    },
    {
        question: "When was the first pinwheel built?",
        answers: ["Year 1100", "Year 500", "Year 1400", "Year 1800"],
        correct: 1,
        points: 100
    },
    {
        question: "Whats more expensive One ore Ofshore pinwheels?",
        answers: ["They cost the same", "Oneshore is more expensive", "Ofshore is more expensive", "We cant messure that"],
        correct: 2,
        points: 100
    },
    {
        question: "What the use of the Yaw System?",
        answers: ["Maximizes energy capture", "It brushes the teath of the pinwheel", "It turns the nacel into the wind", "It turns the turbine towords the wind"],
        correct: 0,
        points: 100
    },
    {
        question: "Wind and what energie are a good combination?",
        answers: ["Atomic", "Water", "Solar", "Bio"],
        correct: 2,
        points: 100
    },
    {
        question: "What is the order of the steps to come from wind to energy?",
        answers: ["Rotor Shaft, Wind Blades, Generator, Transform","Wind Blades, Rotor Shaft, Generator, Transform","Wind Blades, Rotor Shaft, Transform, Generator","Generator, Wind Blades, Rotor Shaft, Transform"],
        correct: 1,
        points: 100
    }
];

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