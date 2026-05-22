const questionsData = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Tool Multi Language", "Hyperlink and Text Markup Language"],
        correct: 1,
        explanation: "HTML is the standard markup language for documents designed to be displayed in a web browser."
    },
    {
        question: "Which of the following is a Javascript framework?",
        options: ["React", "Laravel", "Django", "Spring"],
        correct: 0,
        explanation: "React is a popular JavaScript library/framework for building user interfaces."
    },
    {
        question: "What does CSS stand for?",
        options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets", "Creative Style Sheets"],
        correct: 0,
        explanation: "CSS describes how HTML elements are to be displayed on screen, paper, or in other media."
    },
    {
        question: "Which HTML element is used to define an internal style sheet?",
        options: ["<script>", "<style>", "<css>", "<link>"],
        correct: 1,
        explanation: "The <style> element is used to embed CSS styles directly within an HTML document."
    },
    {
        question: "What is the correct syntax to output 'Hello World' in JavaScript?",
        options: ["print('Hello World');", "echo 'Hello World';", "console.log('Hello World');", "document.write('Hello World');"],
        correct: 2,
        explanation: "console.log() is the standard way to print output to the browser console in JavaScript."
    },
    {
        question: "Which of these is NOT a valid JavaScript data type?",
        options: ["Number", "String", "Boolean", "Float"],
        correct: 3,
        explanation: "In JavaScript, all numbers are of type 'Number'. There is no separate 'Float' type."
    },
    {
        question: "How do you declare a CSS variable?",
        options: ["$var-name: value;", "var var-name = value;", "--var-name: value;", "@var-name: value;"],
        correct: 2,
        explanation: "CSS custom properties (variables) are prefixed with two dashes (e.g., --main-color)."
    },
    {
        question: "Which HTTP method is typically used to update data on a server?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correct: 2,
        explanation: "PUT (or PATCH) is standardly used in RESTful APIs to update existing resources."
    },
    {
        question: "In Git, which command is used to save your changes locally?",
        options: ["git push", "git commit", "git save", "git upload"],
        correct: 1,
        explanation: "git commit records the changes to the local repository. git push sends them to a remote server."
    },
    {
        question: "What is the purpose of the 'alt' attribute on an <img> tag?",
        options: ["To provide alternative text for screen readers", "To make the image load faster", "To style the image", "To create a tooltip"],
        correct: 0,
        explanation: "The alt attribute provides accessibility for screen readers and displays text if the image fails to load."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let questionStartTime = 0;
let totalQuizTime = 0; // in seconds
let questionTimerInterval;
let quizTimerInterval;
let currentQuestionTime = 0;

// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const questionCounter = document.getElementById("question-counter");
const progressBar = document.getElementById("progress-bar");
const questionTimerEl = document.getElementById("question-timer");

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", resetQuiz);

function startQuiz() {
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    totalQuizTime = 0;
    
    // Start global timer
    quizTimerInterval = setInterval(() => {
        totalQuizTime++;
    }, 1000);
    
    loadQuestion();
}

function loadQuestion() {
    nextBtn.classList.add("hidden");
    const currentQ = questionsData[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questionsData.length}`;
    
    // Update progress bar
    const progress = ((currentQuestionIndex) / questionsData.length) * 100;
    progressBar.style.width = `${progress}%`;

    optionsContainer.innerHTML = "";
    currentQ.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = option;
        btn.addEventListener("click", () => selectOption(index, btn));
        optionsContainer.appendChild(btn);
    });

    // Reset question timer
    currentQuestionTime = 0;
    questionTimerEl.textContent = `⏳ 00:00`;
    clearInterval(questionTimerInterval);
    questionTimerInterval = setInterval(() => {
        currentQuestionTime++;
        const m = String(Math.floor(currentQuestionTime / 60)).padStart(2, '0');
        const s = String(currentQuestionTime % 60).padStart(2, '0');
        questionTimerEl.textContent = `⏳ ${m}:${s}`;
    }, 1000);
}

function selectOption(selectedIndex, btnElement) {
    clearInterval(questionTimerInterval);
    const currentQ = questionsData[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQ.correct;
    
    // Record answer
    userAnswers.push({
        question: currentQ.question,
        userPicked: currentQ.options[selectedIndex],
        correctAnswer: currentQ.options[currentQ.correct],
        isCorrect: isCorrect,
        explanation: currentQ.explanation,
        timeTaken: currentQuestionTime
    });

    if (isCorrect) score++;

    // Disable all options and show colors
    const options = optionsContainer.children;
    for (let i = 0; i < options.length; i++) {
        options[i].disabled = true;
        if (i === currentQ.correct) {
            options[i].classList.add("correct");
            options[i].innerHTML += " ✅";
        } else if (i === selectedIndex && !isCorrect) {
            options[i].classList.add("wrong");
            options[i].innerHTML += " ❌";
        }
    }

    nextBtn.classList.remove("hidden");
    if (currentQuestionIndex === questionsData.length - 1) {
        nextBtn.textContent = "Finish Quiz";
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(quizTimerInterval);
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    const percentage = Math.round((score / questionsData.length) * 100);
    document.getElementById("final-score").textContent = `${score}/${questionsData.length}`;
    document.getElementById("final-percentage").textContent = `${percentage}%`;
    
    // Format total time
    const m = String(Math.floor(totalQuizTime / 60)).padStart(2, '0');
    const s = String(totalQuizTime % 60).padStart(2, '0');
    document.getElementById("total-time").textContent = `${m}:${s}`;

    const circle = document.querySelector(".score-circle");
    circle.style.background = `conic-gradient(var(--primary) ${percentage}%, var(--border) 0%)`;

    let grade = "";
    let color = "";
    let feedback = "";
    
    if (percentage >= 90) {
        grade = "A+"; color = "var(--success)"; feedback = "Outstanding performance!";
    } else if (percentage >= 75) {
        grade = "A"; color = "var(--primary)"; feedback = "Great job! Excellent knowledge.";
    } else if (percentage >= 60) {
        grade = "B"; color = "#3b82f6"; feedback = "Good effort! You passed comfortably.";
    } else if (percentage >= 40) {
        grade = "C"; color = "var(--warning)"; feedback = "You passed, but barely.";
    } else {
        grade = "F"; color = "var(--danger)"; feedback = "Needs improvement. Try again!";
    }

    document.getElementById("grade-title").textContent = `Grade: ${grade}`;
    document.getElementById("grade-title").style.color = color;
    document.getElementById("feedback-text").textContent = feedback;

    // Render Review List
    const reviewContainer = document.getElementById("review-container");
    reviewContainer.innerHTML = "";
    
    userAnswers.forEach((ans, i) => {
        const item = document.createElement("div");
        item.classList.add("review-item");
        
        const statusColor = ans.isCorrect ? "var(--success)" : "var(--danger)";
        const statusText = ans.isCorrect ? "Correct" : "Incorrect";

        item.innerHTML = `
            <h3>Q${i + 1}: ${ans.question}</h3>
            <div class="review-detail">Your Answer: <span style="color: ${statusColor}">${ans.userPicked}</span> (${statusText})</div>
            ${!ans.isCorrect ? `<div class="review-detail">Correct Answer: <span style="color: var(--success)">${ans.correctAnswer}</span></div>` : ''}
            <div class="review-detail">Time Taken: <span>${ans.timeTaken}s</span></div>
            <div class="review-explanation">${ans.explanation}</div>
        `;
        reviewContainer.appendChild(item);
    });
}

function resetQuiz() {
    resultScreen.classList.remove("active");
    startScreen.classList.add("active");
    nextBtn.textContent = "Next Question";
}
