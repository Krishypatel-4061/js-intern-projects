document.addEventListener("DOMContentLoaded", () => {
    let userScore = 0;
    let compScore = 0;

    const choices = ['rock', 'paper', 'scissors'];
    const emojis = {
        'rock': '✊',
        'paper': '✋',
        'scissors': '✌️',
        'none': '❔'
    };

    const userScoreEl = document.getElementById("user-score");
    const compScoreEl = document.getElementById("comp-score");
    const resultMessage = document.getElementById("result-message");
    const userChoiceDisplay = document.getElementById("user-choice-display");
    const compChoiceDisplay = document.getElementById("comp-choice-display");
    const resetBtn = document.getElementById("reset");

    const buttons = document.querySelectorAll(".choice-btn");

    function getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }

    function determineWinner(user, comp) {
        if (user === comp) return "tie";
        if (
            (user === "rock" && comp === "scissors") ||
            (user === "paper" && comp === "rock") ||
            (user === "scissors" && comp === "paper")
        ) {
            return "user";
        }
        return "comp";
    }

    function animateDisplay(element, choice) {
        element.classList.remove('pop-animation');
        void element.offsetWidth; // Trigger reflow
        element.textContent = emojis[choice];
        element.classList.add('pop-animation');
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const userChoice = btn.getAttribute("data-choice");
            const compChoice = getComputerChoice();

            animateDisplay(userChoiceDisplay, userChoice);
            animateDisplay(compChoiceDisplay, compChoice);

            const winner = determineWinner(userChoice, compChoice);

            if (winner === "user") {
                userScore++;
                userScoreEl.textContent = userScore;
                resultMessage.textContent = "You Win! 🎉";
                resultMessage.style.color = "var(--accent)";
            } else if (winner === "comp") {
                compScore++;
                compScoreEl.textContent = compScore;
                resultMessage.textContent = "Computer Wins! 💻";
                resultMessage.style.color = "var(--danger)";
            } else {
                resultMessage.textContent = "It's a Tie! 🤝";
                resultMessage.style.color = "var(--text-muted)";
            }
        });
    });

    resetBtn.addEventListener("click", () => {
        userScore = 0;
        compScore = 0;
        userScoreEl.textContent = userScore;
        compScoreEl.textContent = compScore;
        
        resultMessage.textContent = "Make your move to start!";
        resultMessage.style.color = "var(--accent)";
        
        animateDisplay(userChoiceDisplay, 'none');
        animateDisplay(compChoiceDisplay, 'none');
    });
});