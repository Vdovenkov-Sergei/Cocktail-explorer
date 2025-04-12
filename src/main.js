const cocktailList = document.querySelector('.cocktail-list');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-btn');
const clearIcon = document.querySelector('#clear-icon');
const resultCount = document.querySelector('#result-count');
const idleAnimation = document.querySelector('#idle-animation');

const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

let isOpenModal = false;

async function fetchCocktails() {
    const cocktailName = searchInput.value.trim();
    if (cocktailName) {
        const url = `${API_URL}search.php?&s=${cocktailName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch cocktails using ${cocktailName}`)
            }
            const data = await response.json();
            sessionStorage.setItem('lastSearch', cocktailName);

            if (data.drinks) {
                displayCocktails(data.drinks);
                searchInput.blur();
            } else {
                resultCount.textContent = 'No cocktails found.';
                cocktailList.innerHTML = '';
                showIdleAnimation(true);
            }
        } catch (error) {
            resultCount.textContent = 'Something went wrong. Try again later.';
            console.error('Error fetching cocktails:', error);
            cocktailList.innerHTML = '';
            showIdleAnimation(true);
        }
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
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch details for cocktail with id ${id}`);
        }

        const data = await response.json();
        if (data.drinks) {
            const cocktail = data.drinks[0];
            const modal = document.createElement('dialog');
            modal.classList.add('cocktail-modal');
            modal.innerHTML = generateModalContent(cocktail);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    isOpenModal = false;
                }
            });
            document.body.appendChild(modal);
        }
    } catch (error) {
        console.error('Error fetching cocktail details:', error);
        resultCount.textContent = 'Something went wrong. Please try again later.';
    }
}

function generateModalContent(cocktail) {
    return `
        <div class="cocktail-modal-content">
            <h2>${cocktail.strDrink}</h2>
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

function updateSearchButtonState() {
    const trimmedValue = searchInput.value.trim();
    searchButton.disabled = trimmedValue === '';
}

searchButton.addEventListener('click', fetchCocktails);
searchInput.addEventListener('input', () => {
    clearIcon.style.display = searchInput.value ? 'block' : 'none';
    updateSearchButtonState();
});
clearIcon.addEventListener('click', () => {
    searchInput.value = '';
    clearIcon.style.display = 'none';
    searchButton.disabled = true;
    searchInput.focus();
    clearIcon.blur();
});
searchInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter' && searchInput.value.trim()) {
		fetchCocktails();
	}
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpenModal) {
        const modal = document.querySelector('.cocktail-modal');
        modal?.remove();
        isOpenModal = false;
    }
});

const lastSearch = sessionStorage.getItem('lastSearch');
if (lastSearch) {
    searchInput.value = lastSearch;
    clearIcon.style.display = 'block';
    searchButton.disabled = false;
    fetchCocktails();
}