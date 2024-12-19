const SelectedDate = document.getElementById("search-input");
const image = document.getElementById("current-image");
const searchHistory = document.getElementById("search-history");
const btn = document.getElementById("btn");

const API_KEY = "NaKJKGaUb30Pg4u7bNuz4yzsV8MeFPtPtXfSHaFW";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    await fetchImageData(currentDate);
}

async function getImageOfTheDay(event) {
    event.preventDefault(); // Prevent page reload

    const selectedDate = SelectedDate.value;
    if (!selectedDate) {
        alert("Please select a date!");
        return;
    }

    await fetchImageData(selectedDate);
    saveSearch(selectedDate);
    addSearchToHistory();
}

async function fetchImageData(date) {
    try {
        const response = await fetch(`${BASE_URL}?date=${date}&api_key=${API_KEY}`);
        const data = await response.json();

        if (response.ok) {
            displayImage(data);
        } else {
            alert(`Error: ${data.msg || "Failed to fetch data from NASA API"}`);
        }
    } catch (error) {
        alert("Error fetching data from NASA API: " + error.message);
    }
}

function displayImage(data) {
    const imageContainer = document.getElementById("current-image");
    imageContainer.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.date}</p>
        ${data.media_type === "image" 
            ? `<img src="${data.url}" alt="${data.title}" style="max-width: 100%;"/>` 
            : `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width: 100%; height: 500px;"></iframe>`}
        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

function addSearchToHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];

    // Clear and repopulate the list to avoid duplicates
    searchHistory.innerHTML = "";
    searches.forEach(date => {
        const listItem = document.createElement("li");
        listItem.textContent = date;
        listItem.addEventListener("click", () => fetchImageData(date)); // Fetch and display data for the clicked date
        searchHistory.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", getCurrentImageOfTheDay);
btn.addEventListener("click", getImageOfTheDay);
addSearchToHistory();
