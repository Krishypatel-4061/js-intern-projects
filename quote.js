const URL = "https://dummyjson.com/quotes/random";

const quotePara = document.querySelector("#quote");
const authorPara = document.querySelector("#author");
const btn = document.querySelector("#generateQuote");
const copyBtn = document.querySelector("#copy-btn");
const favoriteBtn = document.querySelector("#favorite-btn");
const favoritesList = document.querySelector("#favorites-list");
const toast = document.querySelector("#toast");

let currentQuote = null;
let favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];

const renderFavorites = () => {
    favoritesList.innerHTML = "";
    if (favorites.length === 0) {
        favoritesList.innerHTML = "<p style='color: var(--text-muted); font-size: 0.9rem;'>No favorites saved yet.</p>";
        return;
    }

    favorites.forEach((fav, index) => {
        const li = document.createElement("li");
        li.className = "favorite-item";
        li.innerHTML = `
            <div class="favorite-content">
                <p>"${fav.text}"</p>
                <span>- ${fav.author}</span>
            </div>
            <button class="delete-btn" data-index="${index}" aria-label="Delete favorite">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;
        favoritesList.appendChild(li);
    });

    document.querySelectorAll(".delete-btn").forEach(delBtn => {
        delBtn.addEventListener("click", (e) => {
            const idx = e.currentTarget.getAttribute("data-index");
            favorites.splice(idx, 1);
            localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
            renderFavorites();
            updateFavoriteButtonState();
        });
    });
};

const showToast = (message) => {
    toast.textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
};

const updateFavoriteButtonState = () => {
    if (!currentQuote) return;
    const isFav = favorites.some(f => f.text === currentQuote.quote);
    if (isFav) {
        favoriteBtn.classList.add("active");
    } else {
        favoriteBtn.classList.remove("active");
    }
};

const getQuote = async () => {
    btn.disabled = true;
    btn.textContent = "Loading...";
    quotePara.style.opacity = 0.5;

    try {
        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        currentQuote = data;

        quotePara.innerText = `"${data.quote}"`;
        authorPara.innerText = `- ${data.author}`;
        quotePara.style.opacity = 1;
        
        updateFavoriteButtonState();

    } catch (error) {
        console.error("Fetch failed:", error);
        quotePara.innerText = "Sorry, couldn't fetch a quote right now!";
        authorPara.innerText = "";
        currentQuote = null;
    } finally {
        btn.disabled = false;
        btn.textContent = "Generate New Quote";
        quotePara.style.opacity = 1;
    }
};

copyBtn.addEventListener("click", () => {
    if (!currentQuote) return;
    const textToCopy = `"${currentQuote.quote}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

favoriteBtn.addEventListener("click", () => {
    if (!currentQuote) return;
    const isFavIndex = favorites.findIndex(f => f.text === currentQuote.quote);
    
    if (isFavIndex >= 0) {
        // Remove from favs
        favorites.splice(isFavIndex, 1);
        showToast("Removed from favorites");
    } else {
        // Add to favs
        favorites.push({ text: currentQuote.quote, author: currentQuote.author });
        showToast("Added to favorites");
    }
    
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    updateFavoriteButtonState();
    renderFavorites();
});

btn.addEventListener("click", getQuote);

// Init
renderFavorites();
// Fetch first quote automatically
getQuote();