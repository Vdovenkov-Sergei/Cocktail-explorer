const cocktailList = document.querySelector('.cocktail-list');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const resultCount = document.getElementById('result-count');

const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

async function fetchCocktails() {
    const cocktailName = searchInput.value.trim();

	if (!cocktailName) {
		searchInput.value = '';
        return alert("Please enter cocktail name.");
    }

    const searchQuery = `&s=${cocktailName}`;
    const url = `${API_URL}search.php?${searchQuery}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.drinks) {
        displayCocktails(data.drinks);
    } else {
        resultCount.textContent = 'No cocktails found.';
        cocktailList.innerHTML = '';
    }
}

function displayCocktails(cocktails) {
    cocktailList.innerHTML = '';
    resultCount.textContent = `${cocktails.length} cocktails found.`;

    cocktails.forEach(cocktail => {
        const card = document.createElement('div');
        card.classList.add('cocktail-card');
        card.innerHTML = `
            <img src="${cocktail.strDrinkThumb}/medium" alt="${cocktail.strDrink}">
            <h3>${cocktail.strDrink}</h3>
            <p>${cocktail.strCategory}</p>
        `;
        card.addEventListener('click', () => {
            showCocktailDetails(cocktail.idDrink);
        });
        cocktailList.appendChild(card);
    });
}

async function showCocktailDetails(id) {
    const url = `${API_URL}lookup.php?i=${id}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.drinks) {
        const cocktail = data.drinks[0];

        const modal = document.createElement('article');
        modal.classList.add('cocktail-modal');
        modal.innerHTML = generateModalContent(cocktail);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
		});
		
		modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }
}

function generateModalContent(cocktail) {
    return `
        <div class="cocktail-modal-content">
            <span class="close-modal">&times;</span>
            <h2>${cocktail.strDrink}</h2>
            <img src="${cocktail.strDrinkThumb}/large" alt="${cocktail.strDrink}">
            <p><strong>Category:</strong> ${cocktail.strCategory}, ${cocktail.strAlcoholic}</p>
            <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
            <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
            <p><strong>Ingredients:</strong> ${getIngredients(cocktail)}</p>
        </div>
    `;
}

function getIngredients(cocktail) {
    const ingredientsList = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        if (ingredient) {
            const ingredientItem = `
                <li class="ingredient-item">
                    <span class="ingredient-name">${ingredient}</span>
                    <span class="ingredient-quantity">${measure ? measure : ''}</span>
                </li>
            `;
            ingredientsList.push(ingredientItem);
        }
    }
    return '<ul class="ingredient-list">' + ingredientsList.join('') + '</ul>';
}


searchButton.addEventListener('click', fetchCocktails);
searchInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		fetchCocktails();
	}
});