let analyzedPassword = ["vijay"];

function viewAllPasswords() {
    const rawData = localStorage.getItem("analyzedPasswords");
    const passwordList = rawData ? JSON.parse(rawData) : [];

    // Send the full list to the screen
    drawTableOnScreen(passwordList);
}

// ⚠️ THIS WAS MISSING! Wiring the View Button:
document.getElementById("viewpass").onclick = viewAllPasswords;