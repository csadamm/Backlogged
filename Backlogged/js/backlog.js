//get references to backlog.html 
const gameList = document.getElementById('game-list');
const filterCheckboxes = document.querySelectorAll('#filter-options input[type="checkbox"]');
const sortSelect = document.getElementById('sort-order');

// read games from localStorage
function getGames(){
    const existing = localStorage.getItem('games');
    return existing ? JSON.parse(existing) : [];
}

function renderGames(){
    let games = getGames();

    //filter
    //get all checked values into an array
    const checkedValues = Array.from(filterCheckboxes)
        .filter(function(checkbox){
            return checkbox.checked;
        })
        .map(function(checkbox){
            return checkbox.value;
        });

    //filter games to only those whose status is in the checked values
    games = games.filter(function(game){
        return checkedValues.includes(game.status);
    });

    //sort
    const sortValue = sortSelect.value;
    if (sortValue === 'by-excitement-descending'){
        games.sort(function(a,b){
            //this will sort the array based on a comparison 
            //if the result is postive, order b first
            //if result is negative, a stays first in order
            return b.excitement - a.excitement;
        });
    }
    else if(sortValue === 'by-excitement-ascending'){
        games.sort(function(a,b){
            return a.excitement - b.excitement;
        });
    }
    else if(sortValue === 'by-rating-descending'){
        games.sort(function(a,b){
            return b.rating - a.rating;
        });
    }
    else if(sortValue === 'by-rating-ascending'){
        games.sort(function(a,b){
            return a.rating - b.rating;
        });
    }
    else if (sortValue === 'by-first'){
        games.sort(function(a,b){
            return a.id - b.id;
        });
    }
    else if(sortValue === 'by-last'){
        games.sort(function(a,b){
            return b.id - a.id;
        });
    }

    gameList.innerHTML = ''; //clear existing content

    if(games.length === 0){
        gameList.innerHTML = '<p class="empty-message">No games found. Add one below!</p>';
    }
    games.forEach(function(game){  
        const card = document.createElement('div');
        card.className = 'game-card';

        //build rating line based on condition
        let ratingHTML = '';
        if(game.status === 'Finished' || game.status === 'Dropped'){
            ratingHTML = `<p>Rating: ${game.rating}/5</p>`
        }
        let excitementHTML = '';
        if(game.status === 'Wishlist' || game.status === 'Current'){
            excitementHTML = `<p>Excitement: ${game.excitement}/10</p>`
        }
        let expectedHTML = '';
        if(game.status === 'Wishlist' || game.status === 'Current'){
            expectedHTML = `<p>Expected rating: ${game.expectedRating}/5</p>`
        }
        let hoursHTML = '';
        if(game.status === 'Finished' || game.status === 'Dropped'){
            hoursHTML = `<p>Play time: ${game.hours} hours</p>`
        }

            card.innerHTML = `
                <img src="${game.cover}" alt="${game.title} cover"/>
                <h3>${game.title}</h3>
                <p>${game.status}</p>
                ${excitementHTML}
                ${expectedHTML}
                ${ratingHTML}
                ${hoursHTML}
                <a href="game.html?id=${game.id}">View -></a>
                `;

            gameList.appendChild(card); //add card to the innerHTML 
    });

    //Add an "add new game" card at the end of the list
            const addCard = document.createElement('div');
            //give the addCard the game-card class so it inherit the card shape/border, and also give it a new class name to style further
            addCard.className = 'game-card add-new-card';
            addCard.innerHTML = `
                <a href="add.html">
                    <span class="add-new-icon">+</span>
                    <span class="add-new-label">Add New Game</span>
                </a>
            `;
            gameList.appendChild(addCard);
}

//Save current filter/sort state to the localStorage for a persistent UI
function saveState(){
    //create an empty object to store the state of checkboxes
    const checkboxStates = {};
    //loop through every checkbox
    filterCheckboxes.forEach(function(checkbox){
        //store whether the checkbox is checked or not
        checkboxStates[checkbox.value] = checkbox.checked;
    });
    localStorage.setItem('backlog-sort', sortSelect.value);
    localStorage.setItem('backlog-filter', JSON.stringify(checkboxStates));
}

//restore filter/sort state from local Storage
function restoreState(){
    const savedSort = localStorage.getItem('backlog-sort');
    if(savedSort){
        sortSelect.value = savedSort;
    }

    const savedFilters = localStorage.getItem('backlog-filter');
    if(savedFilters){
        const checkboxStates = JSON.parse(savedFilters);
        filterCheckboxes.forEach(function(checkbox){
            if(checkboxStates[checkbox.value] !== undefined){
                checkbox.checked = checkboxStates[checkbox.value];
            }
        });
    }
}

//When a checkbox changes, or sort is changed, save state and re-render games
filterCheckboxes.forEach(function(checkbox){
    checkbox.addEventListener('change', function(){
        saveState();
        renderGames();
    });
});

sortSelect.addEventListener('change', function(){
    saveState();
    renderGames();
});

//restore state and render games on pageload
restoreState();
renderGames();