const apiKey = "f45ee56f";

const input = document.getElementById("movieInput");
const resultDiv = document.getElementById("movieResult");
const loader = document.getElementById("loader");
const historyList = document.getElementById("history");

let history = JSON.parse(localStorage.getItem("history")) || [];
renderHistory();

// ENTER KEY SEARCH
function handleEnter(event) {
    if (event.key === "Enter") {
        searchMovie();
    }
}

// MAIN SEARCH FUNCTION
function searchMovie(movieNameFromHistory = null) {
    const movieName = movieNameFromHistory || input.value.trim();

    if (movieName === "") {
        resultDiv.innerHTML = "<p>Please enter a movie name</p>";
        return;
    }

    loader.classList.remove("hidden");
    resultDiv.innerHTML = "";

    fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            loader.classList.add("hidden");

            if (data.Response === "False") {
                resultDiv.innerHTML = "<p>Movie not found ❌</p>";
            } else {
                resultDiv.innerHTML = `
                    <div class="movie-card">
                        <img src="${data.Poster}">
                        <h3>${data.Title}</h3>
                        <p>Year: ${data.Year}</p>
                        <p>Rating: ⭐ ${data.imdbRating}</p>
                    </div>
                `;

                saveHistory(movieName);
            }
        })
        .catch(() => {
            loader.classList.add("hidden");
            resultDiv.innerHTML = "<p>Something went wrong ⚠️</p>";
        });

    input.value = "";
}

// SAVE SEARCH HISTORY
function saveHistory(movie) {
    if (!history.includes(movie)) {
        history.unshift(movie);
        if (history.length > 5) history.pop();
        localStorage.setItem("history", JSON.stringify(history));
        renderHistory();
    }
}

// SHOW HISTORY
function renderHistory() {
    historyList.innerHTML = "";

    history.forEach(movie => {
        const li = document.createElement("li");
        li.innerText = movie;
        li.onclick = () => searchMovie(movie);
        historyList.appendChild(li);
    });
}