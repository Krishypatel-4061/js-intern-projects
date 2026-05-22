const lengthSlider = document.getElementById("length-slider");
const lengthVal = document.getElementById("length-val");
const chkUpper = document.getElementById("chk-uppercase");
const chkLower = document.getElementById("chk-lowercase");
const chkNumbers = document.getElementById("chk-numbers");
const chkSymbols = document.getElementById("chk-symbols");
const generateBtn = document.getElementById("generate-btn");
const passDisplay = document.getElementById("password-display");
const copyBtn = document.getElementById("copy-btn");
const saveBtn = document.getElementById("save-btn");

const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

const searchInput = document.getElementById("search-input");
const vaultList = document.getElementById("vault-list");
const toast = document.getElementById("toast");

const labelModal = document.getElementById("label-modal");
const labelInput = document.getElementById("label-input");
const cancelSaveBtn = document.getElementById("cancel-save");
const confirmSaveBtn = document.getElementById("confirm-save");

const CHARS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~|}{[]:;?><,./-='
};

let currentPassword = "";
let vault = JSON.parse(localStorage.getItem("passwordVault")) || [];

// Update length UI
lengthSlider.addEventListener("input", (e) => {
    lengthVal.textContent = e.target.value;
});

const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
};

const calculateStrength = (password, length) => {
    let types = 0;
    if (/[A-Z]/.test(password)) types++;
    if (/[a-z]/.test(password)) types++;
    if (/[0-9]/.test(password)) types++;
    if (/[^A-Za-z0-9]/.test(password)) types++;

    if (length < 8 || types < 2) return { text: "Weak", color: "var(--strength-weak)", width: "33%" };
    if (length >= 12 && types >= 3) return { text: "Strong", color: "var(--strength-strong)", width: "100%" };
    return { text: "Medium", color: "var(--strength-medium)", width: "66%" };
};

const generatePassword = () => {
    const length = parseInt(lengthSlider.value);
    let charset = "";
    let mandatoryChars = [];

    if (chkUpper.checked) { charset += CHARS.upper; mandatoryChars.push(CHARS.upper[Math.floor(Math.random() * CHARS.upper.length)]); }
    if (chkLower.checked) { charset += CHARS.lower; mandatoryChars.push(CHARS.lower[Math.floor(Math.random() * CHARS.lower.length)]); }
    if (chkNumbers.checked) { charset += CHARS.numbers; mandatoryChars.push(CHARS.numbers[Math.floor(Math.random() * CHARS.numbers.length)]); }
    if (chkSymbols.checked) { charset += CHARS.symbols; mandatoryChars.push(CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)]); }

    if (!charset) {
        showToast("Please select at least one character type!");
        return;
    }

    let password = [...mandatoryChars];
    for (let i = password.length; i < length; i++) {
        password.push(charset[Math.floor(Math.random() * charset.length)]);
    }

    // Shuffle
    password = password.sort(() => Math.random() - 0.5).join("");
    
    currentPassword = password;
    passDisplay.textContent = password;
    passDisplay.classList.remove("placeholder");

    // Update Strength
    const strength = calculateStrength(password, length);
    strengthText.textContent = `Strength: ${strength.text}`;
    strengthText.style.color = strength.color;
    strengthBar.style.width = strength.width;
    strengthBar.style.backgroundColor = strength.color;
};

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", () => {
    if (!currentPassword) return;
    navigator.clipboard.writeText(currentPassword).then(() => {
        showToast("Copied to clipboard!");
    });
});

saveBtn.addEventListener("click", () => {
    if (!currentPassword) return;
    
    const isDuplicate = vault.some(v => v.password === currentPassword);
    if (isDuplicate) {
        showToast("Password already saved in vault!");
        return;
    }

    labelInput.value = "";
    labelModal.classList.remove("hidden");
});

cancelSaveBtn.addEventListener("click", () => {
    labelModal.classList.add("hidden");
});

confirmSaveBtn.addEventListener("click", () => {
    const label = labelInput.value.trim() || "Untitled Password";
    const now = new Date();
    
    vault.push({
        id: Date.now().toString(),
        password: currentPassword,
        label: label,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
    });

    localStorage.setItem("passwordVault", JSON.stringify(vault));
    labelModal.classList.add("hidden");
    showToast("Saved to Vault!");
    renderVault();
});

const renderVault = (searchTerm = "") => {
    vaultList.innerHTML = "";
    
    let filteredVault = vault;
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        filteredVault = vault.filter(v => 
            v.label.toLowerCase().includes(lowerTerm) || 
            v.password.toLowerCase().includes(lowerTerm)
        );
    }

    if (filteredVault.length === 0) {
        vaultList.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">${searchTerm ? "No matching passwords found." : "Your vault is empty."}</p>`;
        return;
    }

    // Sort newest first
    filteredVault.sort((a, b) => b.id - a.id).forEach(item => {
        const el = document.createElement("div");
        el.className = "vault-item";
        el.innerHTML = `
            <div class="vault-item-info">
                <div class="vault-item-label">${item.label}</div>
                <div class="vault-item-pass">••••••••••••</div>
                <div class="vault-item-meta">Created: ${item.date} ${item.time}</div>
            </div>
            <div class="vault-item-actions">
                <button class="icon-btn copy-vault-btn" data-pass="${item.password}" title="Copy">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
                <button class="icon-btn delete-vault-btn" data-id="${item.id}" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;
        vaultList.appendChild(el);
    });

    document.querySelectorAll(".copy-vault-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const pass = e.currentTarget.getAttribute("data-pass");
            navigator.clipboard.writeText(pass).then(() => showToast("Copied from vault!"));
        });
    });

    document.querySelectorAll(".delete-vault-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            vault = vault.filter(v => v.id !== id);
            localStorage.setItem("passwordVault", JSON.stringify(vault));
            renderVault(searchInput.value.trim());
            showToast("Password deleted.");
        });
    });
};

searchInput.addEventListener("input", (e) => {
    renderVault(e.target.value.trim());
});

// Init
renderVault();
// generate initial empty/placeholder or just first password
generatePassword();
