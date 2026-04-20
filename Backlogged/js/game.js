//gets the value of the id
//example if we have /game?id=422, then we will get 422
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

//Parse the array "games"
const games = JSON.parse(localStorage.getItem('games'));
//Find the game with a matching id
const game = games.find(function(g){
    return g.id == id;
});
//if no game is found (wrong id in url) then add an error message
if(!game) {
    document.querySelector('main').innerHTML = '<p>Game not found.</p>'
}

//Always show these fields
document.getElementById('game-title').textContent = game.title;
document.getElementById('status-value').textContent = game.status;

//Hide all optional fields first
document.getElementById('display-rating').style.display = 'none';
document.getElementById('display-hours').style.display = 'none';
document.getElementById('display-review').style.display = 'none';
document.getElementById('display-drop-reason').style.display = 'none';
document.getElementById('display-excitement').style.display = 'none';
document.getElementById('display-expected-rating').style.display = 'none';

//then show relevant fields
if(game.status === 'Finished'){
    document.getElementById('display-rating').style.display = 'flex';
    document.getElementById('display-hours').style.display = 'flex';
    document.getElementById('display-review').style.display = 'flex';
    document.getElementById('rating-value').textContent = game.rating;
    document.getElementById('hours-value').textContent = game.hours;
    document.getElementById('review-value').textContent = game.review;
}
if(game.status === 'Dropped'){
    document.getElementById('display-rating').style.display = 'flex';
    document.getElementById('display-hours').style.display = 'flex';
    document.getElementById('display-review').style.display = 'flex';
    document.getElementById('display-drop-reason').style.display = 'flex';
    document.getElementById('rating-value').textContent = game.rating;
    document.getElementById('hours-value').textContent = game.hours;
    document.getElementById('drop-reason-value').textContent = game.dropReason;
    document.getElementById('review-value').textContent = game.review;
}
if(game.status === 'Wishlist' || game.status === 'Current'){
    document.getElementById('display-excitement').style.display = 'flex';
    document.getElementById('display-expected-rating').style.display = 'flex'; 
    document.getElementById('excitement-value').textContent = game.excitement;
    document.getElementById('expected-rating-value').textContent = game.expectedRating;
}

//edit button reference
const editButton = document.getElementById('edit-button');

//edit button function
editButton.addEventListener('click', function(){
    window.location.href= 'add.html?id=' +game.id;
});

//reference for delete button
const deleteButton = document.getElementById('delete-button');

//delete button function
deleteButton.addEventListener('click', function(){
    //ask for confirmation before deleting
    const confirmed = confirm('Are you sure you want to delete ' +game.title + '?');

    if(!confirmed) return;

    const games = JSON.parse(localStorage.getItem('games'));

    //filter out the game with matching id
    const updatedGames = games.filter(function(g){
        //make a new array with every game except the one were deleting
        return g.id != game.id;
    });

    //update games array to the new array
    localStorage.setItem('games', JSON.stringify(updatedGames));
    window.location.href = 'backlog.html';
});