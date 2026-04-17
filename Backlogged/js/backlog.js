//get references to backlog.html 
const gameList = document.getElementById('game-list');
const filterSelect = document.getElementById('filter-status');
const sortSelect = document.getElementById('sort-order');

// read games from localStorage
function getGames(){
    const existing = localStorage.getItem('games');
    return existing ? JSON.parse(existing) : [];
}

function renderGames(){
    let games = getGames();

    //filter
    const filterValue = filterSelect.value;
    if (filterValue !== 'all'){
        games = games.filter(function(game){
            //create a new array which only contains items where the condition returns true
            // for example game.status === 'wishlist' only puts games set as 'wishlist'
            return game.status === filterValue;
        });
    }

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
        gameList.innerHTML = '<p>No games found</p>';
        return;
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

            card.innerHTML = `
                <img src="${game.cover}" alt="${game.title} cover"/>
                <h3>${game.title}</h3>
                <p>${game.status}</p>
                ${excitementHTML}
                ${ratingHTML}
                <p>Hours Played: ${game.hours}<p>
                <a href="game.html?id=${game.id}">View -></a>
                `;

            gameList.appendChild(card); //add card to the innerHTML 
    });
}

//re-render when dropdown changes
filterSelect.addEventListener('change', renderGames);
sortSelect.addEventListener('change', renderGames);

//call it on page load
renderGames();
