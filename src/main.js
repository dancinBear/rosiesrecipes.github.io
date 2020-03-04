import * as recipes from "./recipes.js";

let recipeWrapper;
let contents;
let searchBar;
let searchButton;
let searchResults;


const init = () => {
    recipeWrapper = document.querySelector("#recipeWrapper");
    contents = document.querySelector("#contents");
    searchResults = document.querySelector("#searchResults");
    searchBar = document.querySelector("#searchBar");
    searchButton = document.querySelector("#searchButton");
    searchButton.onclick = (e) => {
        window.location = `./search.html?${searchBar.value}`;
    }
    if (recipeWrapper != null) parse();
    if (contents != null) displayAll(recipes.all, contents);
    if (searchResults != null) search();
}

const parse = () => {
    let query = window.location.search.slice(1);
    let recipe;
    if (query == "random") {
        recipe = recipes.all[Math.floor(Math.random() * recipes.all.length)];
    } else {
        query = decodeURI(query);
        for (let r of recipes.all) {
            if (query == r.name) {
                recipe = r;
                break;
            }
        }
        if (recipe == null) {
            recipeWrapper.innerHTML = "<p>Sorry, couldn't find what you were looking for!</p>";
            return;
        }
    }
    generate(recipe);
    console.log(recipe.name);
    console.log(query);
}

const generate = (recipe) => {
    let bigString;
    bigString = `<h2>${recipe.name}</h2>`;
    bigString += `<img src="${recipe.img}" alt="${recipe.name}">`;
    bigString += deChunk(recipe.intro, "p");
    bigString += "<h3>Ingredients</h3><ul>";
    bigString += deChunk(recipe.ingredients, "li");
    bigString += "</ul><h3>Procedure</h3><ol>";
    bigString += deChunk(recipe.procedure, "li");
    bigString += "</ol>";

    recipeWrapper.innerHTML = bigString;


}

const displayAll = (list, section) => {
    let bigString = "";
    for (let recipe of list) {
        let encoded = encodeURI(recipe.name);
        bigString += `<p><a href="recipe.html?${encoded}">${recipe.name}</a></p>`;
    }
    section.innerHTML = bigString;
}

const search = () => {
    let query = window.location.search.slice(1);
    let results = [];
    for (let recipe of recipes.all) {
        if (recipe.name.toLowerCase().includes(query)) results.push(recipe);
    }
    for (let recipe of recipes.all) {
        if (results.includes(recipe)) continue;
        for (let ingredient of recipe.ingredients) {
            if (ingredient.toLowerCase().includes(query)) results.push(recipe);
        }
    }
    if (results.length == 0) {
        searchResults.innerHTML = `<p>Sorry, couldn't find what you were looking for!</p>`;
    } else {
        displayAll(results, searchResults);
    }
}

const deChunk = (chunk, wrapper) => {
    let comp = "";
    for (let para of chunk) {
        comp += `<${wrapper}>${para}</${wrapper}>`;
    }
    return comp;
}

export {
    init
};
