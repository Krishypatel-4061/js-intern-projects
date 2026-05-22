const input = document.getElementById("text");
const btn = document.getElementById("btn");
const imageContainer = document.getElementById("image-container");
const loadMoreBtn = document.getElementById("load-more");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = "g2nrw2mu--I9wHK9UY4t74kCSfc2JMRca5u9w6sGyT4";

let currentQuery = "";
let page = 1;
const PER_PAGE = 12;

const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
};

const hideError = () => {
    errorMessage.classList.add("hidden");
};

const showLoader = () => {
    loader.classList.remove("hidden");
    loadMoreBtn.classList.add("hidden");
};

const hideLoader = (showLoadMore = false) => {
    loader.classList.add("hidden");
    if (showLoadMore) {
        loadMoreBtn.classList.remove("hidden");
    } else {
        loadMoreBtn.classList.add("hidden");
    }
};

const createImageCard = (image) => {
    const card = document.createElement("div");
    card.classList.add("image-card");

    const img = document.createElement("img");
    img.src = image.urls.regular;
    img.alt = image.alt_description || "Unsplash Image";
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.classList.add("image-overlay");
    const desc = document.createElement("p");
    desc.textContent = image.alt_description ? 
        image.alt_description.charAt(0).toUpperCase() + image.alt_description.slice(1) : 
        "Untitled Image";
    
    overlay.appendChild(desc);
    card.appendChild(img);
    card.appendChild(overlay);

    return card;
};

const fetchImages = async (query, pageNum, isNewSearch) => {
    hideError();
    showLoader();

    if (isNewSearch) {
        imageContainer.innerHTML = "";
    }

    try {
        const url = `${API_URL}?query=${encodeURIComponent(query)}&page=${pageNum}&per_page=${PER_PAGE}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Client-ID ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        const imagesArray = data.results;

        if (imagesArray.length === 0 && isNewSearch) {
            showError(`No images found for "${query}". Try another search term.`);
            hideLoader();
            return;
        }

        imagesArray.forEach(image => {
            const card = createImageCard(image);
            imageContainer.appendChild(card);
        });

        // Show load more if there are more pages
        const hasMorePages = pageNum < data.total_pages;
        hideLoader(hasMorePages);

    } catch (error) {
        console.error("Fetch failed:", error);
        showError("Failed to fetch images. Please try again later.");
        hideLoader();
    }
};

const handleSearch = () => {
    const text = input.value.trim();
    if (text) {
        currentQuery = text;
        page = 1;
        fetchImages(currentQuery, page, true);
    }
};

btn.addEventListener("click", handleSearch);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

loadMoreBtn.addEventListener("click", () => {
    if (currentQuery) {
        page++;
        fetchImages(currentQuery, page, false);
    }
});