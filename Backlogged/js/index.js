//references to index.html
const gameList = document.getElementById('recent-activity');

// read games from localStorage
function getGames(){
    const existing = localStorage.getItem('games');
    return existing ? JSON.parse(existing) : [];
}


function renderGames(){
    //get last 4 items from array (4 most recent games)
    const games = getGames();
    const recent = games.slice(-4);
    const seeAllLink = document.querySelector('#recent a');

    gameList.innerHTML = ''; //clear existing content

    if (games.length === 0) {
        gameList.innerHTML = `
            <div class="empty-state">
                <p class="label-empty">No games logged yet.</p>
                <a href="add.html" class="btn-empty">+ Log your first game</a>
            </div>
        `;
        seeAllLink.style.display = 'none';
        return;
    }
    recent.forEach(function(game){  
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
        seeAllLink.style.display = 'inline-block';

}

//render games on page load
renderGames();

