'use strict';
window.onload = function() {
    fillLangSelect();
    fillNumberSelect();
};

function fillLangSelect() {
    const languages = {
        cs : "CZECH", 
        de : "GERMAN", 
        en : "ENGLISH", 
        es : "SPANISH",
        eu : "BASQUE",
        fr : "FRENCH",
        gl : "GALICIAN",
        hu : "HUNGARIAN",
        it : "ITALIAN",
        lt : "LITHUANIAN",
        pl : "POLISH",
        sv : "SWEDISH"
    }
    const langSelect = document.getElementById("selLang");
    langSelect.innerHTML = `<option value="any" selected>ANY</option>`;

    Object.entries(languages).forEach(([code, name]) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = name;
        langSelect.appendChild(option);
    });
}

function fillNumberSelect() {
    const numSelect = document.getElementById("selNum");
    numSelect.innerHTML = `<option value="all" selected>All</option>`;

    for (let i = 1; i <= 10; i++) {
        const option = document.createElement("option");
        option.value = String(i);
        option.textContent = i;
        numSelect.appendChild(option);
    }
}

document.getElementById("jokesForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    callAPI(formData);
});

const baseURL = "http://127.0.0.1:5000/api/v1/jokes/";
//const baseURL = "/api/v1/jokes/";

async function callAPI(input) {
    hideJokes();
    hideError();

    let id = input.get("id");

    if (id) {
        if (id >= 0 && id < 953) {
            console.log("Call API passing the ID. Ignore other inputs");
            const result = await fetch(`${baseURL}${id}`);
            const data = await result.json();

            if (typeof(data.joke) === "object") {
                displayJoke(data.joke.text);
            } else {
                displayJoke(data.joke);
            }

        } else {
            console.log("Add a valid ID between 0 and 952");
            showError(`404 Not Found: Joke ${id} not found, try an id between 0 and 952`);
        }
        return;
    }
    const language = input.get("language");
    const category = input.get("category");
    const number = input.get("number");

    if (!language || !category || number == null) {
        console.log("Raise error to fill the required fields or provide joke id.");
        showError("Fill the required fields or provide joke id.");
        return;
    }

    if (number != "all" && (number < 0 || number > 10)) {
        console.log("Raise error asking user to provide num 1-9 or 'all'.");
        showError("Provide a number between 1-9 or 'all'.")
        return;
    }

    console.log("Calling API with lang, category, and number")
    console.log(language, category, number);
    const result = await fetch(`${baseURL}${language}/${category}/${number}`);
    const data = await result.json();

    displayJokes(data.jokes);
}

function displayJokes(jokes) {
    const jokesDiv = document.getElementById("jokes");
    jokesDiv.innerHTML = "";
    const bulmaClass = "card card-content has-text-centered has-text-black has-text-weight-bold has-background-success-light mb-2";

    if (!jokes || jokes.length === 0) {
        const article = document.createElement("article");
        article.className = bulmaClass;
        article.setAttribute("role", "article");
        article.textContent = "There are no jokes in the chosen combination of languages and categories";

        jokesDiv.appendChild(article);
        return;
    }

    jokes.forEach(joke => {
        const article = document.createElement("article");
        article.className = bulmaClass;
        article.setAttribute("role", "article");

        article.textContent = joke;
        jokesDiv.appendChild(article);
    });
}

function displayJoke(joke) {
    const jokesDiv = document.getElementById("jokes");
    jokesDiv.innerHTML = "";

    const article = document.createElement("article");
    article.className = "card card-content has-text-centered has-text-black has-text-weight-bold has-background-success-light mb-2";
    article.setAttribute("role", "article");

    article.textContent = joke;
    jokesDiv.appendChild(article);
}

function hideJokes() {
    const jokesDiv = document.getElementById("jokes");
    jokesDiv.innerHTML = "";
}

function showError(message) {
    const errorDiv = document.getElementById("errors");

    const article = document.createElement("article");
    article.textContent = message;
    article.className = "card card-content has-text-centered has-text-black has-text-weight-bold has-background-danger-light mb-2";

    errorDiv.appendChild(article);
}

function hideError() {
    const errorDiv = document.getElementById("errors");
    while (errorDiv.firstChild) {
        errorDiv.removeChild(errorDiv.firstChild);
    }
}
