document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date");
    const calculateBtn = document.getElementById("button");
    const resultContainer = document.getElementById("result-container");
    const errorMessage = document.getElementById("error-message");
    const ageMessage = document.getElementById("age-message");
    const yearsEl = document.getElementById("years");
    const monthsEl = document.getElementById("months");
    const daysEl = document.getElementById("days");

    // Set max attribute on date input to today
    const todayStr = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', todayStr);

    calculateBtn.addEventListener("click", () => {
        const birthdateValue = dateInput.value;

        // Reset views
        resultContainer.classList.add("hidden");
        errorMessage.classList.add("hidden");

        if (!birthdateValue) {
            showError("Please select a valid date.");
            return;
        }

        const birthDate = new Date(birthdateValue);
        const today = new Date();

        if (birthDate > today) {
            showError("Welcome back, time traveler! Please select a date in the past.");
            return;
        }

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += previousMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Display results
        yearsEl.textContent = years;
        monthsEl.textContent = months;
        daysEl.textContent = days;
        
        ageMessage.textContent = `You are exactly:`;
        
        resultContainer.classList.remove("hidden");
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }
});