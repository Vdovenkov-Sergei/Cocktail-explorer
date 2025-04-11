const cocktailList = document.querySelector('.cocktail-list');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-btn');
const clearButton = document.querySelector('#clear-btn');
const resultCount = document.querySelector('#result-count');
const idleAnimation = document.querySelector('#idle-animation');

const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

let isOpenModal = false;

async function fetchCocktails() {
    const cocktailName = searchInput.value.trim();

	if (!cocktailName) {
		searchInput.value = '';
        return alert("Please enter cocktail name.");
    }

    const url = `${API_URL}search.php?&s=${cocktailName}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.drinks) {
        displayCocktails(data.drinks);
        searchInput.blur();
    } else {
        resultCount.textContent = 'No cocktails found.';
        cocktailList.innerHTML = '';
        showIdleAnimation(true);
    }
}

function displayCocktails(cocktails) {
    cocktailList.innerHTML = '';
    resultCount.textContent = `${cocktails.length} cocktails found.`;
    showIdleAnimation(false);

    cocktails.forEach(cocktail => {
        const card = document.createElement('article');
        card.classList.add('cocktail-card');

        card.innerHTML = `
            <img src="${cocktail.strDrinkThumb}/small" alt="${cocktail.strDrink}">
            <h3>${cocktail.strDrink}</h3>
            <p>${cocktail.strCategory}</p>
        `;
        
        card.addEventListener('click', () => {
            if (!isOpenModal) {
                showCocktailDetails(cocktail.idDrink);
                isOpenModal = true;
            }
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
        const modal = document.createElement('dialog');
        modal.classList.add('cocktail-modal');
        modal.innerHTML = generateModalContent(cocktail);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
            isOpenModal = false;
		});
		
		modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                isOpenModal = false;
            }
        });

        document.body.appendChild(modal);
    }
}

function generateModalContent(cocktail) {
    return `
        <div class="cocktail-modal-content">
            <h2>${cocktail.strDrink}</h2>
            <span class="close-modal"><strong>&times;</strong></span>
            <div class="cocktail-main-info">
                <img src="${cocktail.strDrinkThumb}/medium" alt="${cocktail.strDrink}">
                <div class="cocktail-text-info">
                    <p><strong>Category:</strong> ${cocktail.strCategory}, ${cocktail.strAlcoholic}</p>
                    <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
                    <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
                    <p><strong>Ingredients:</strong></p>
                    ${getIngredients(cocktail)}
                </div>
            </div>
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
                    <p>${ingredient}${measure ? ', ' + measure : ''}</p>
                </li>
            `;
            ingredientsList.push(ingredientItem);
        }
    }
    return '<ul class="ingredient-list">' + ingredientsList.join('') + '</ul>';
}

function showIdleAnimation(show) {
    if (show) {
        idleAnimation.style.display = 'flex';
    } else {
        idleAnimation.style.display = 'none';
    }
}

searchButton.addEventListener('click', fetchCocktails);
clearButton.addEventListener('click', () => {
    searchInput.value = '';
    resultCount.textContent = 'Ready to search...';
    cocktailList.innerHTML = '';
    showIdleAnimation(true);
});
searchInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		fetchCocktails();
	}
});