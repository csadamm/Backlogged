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
    const games = getGames();

    gameList.innerHTML = ''; //clear existing content
    games.forEach(function(game){  
        const card = document.createElement('div');
        card.className = 'game-card';

        //build rating line based on condition
        let ratingHTML = '';
        if(game.status === 'finished' || game.status === 'dropped'){
            ratingHTML = `<p>Rating: ${game.rating}/5</p>`
        }

        let excitementHTML = '';
        if(game.status === 'wishlist' || game.status === 'current'){
            ratingHTML = `<p>Excitement: ${game.excitement}/10</p>`
        }

            card.innerHTML = `
                <img src="${game.cover}" alt="${game.title} cover"/>
                <h3>${game.title}</h3>
                <p>${game.status}</p>
                ${excitementHTML}
                ${ratingHTML}
                <a href="game.html?id=${game.id}">View -></a>
                `;

            gameList.appendChild(card); //add card to the innerHTML 
    });
}

//call it on page load
renderGames();