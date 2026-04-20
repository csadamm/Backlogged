//get references to add.html form elements
const form = document.getElementById('add-game-form');
const titleInput = document.getElementById('game-title');
const gameStatusSelect = document.getElementById('game-status');
const excitementInput = document.getElementById('excitement');
const expectedRatingInput = document.getElementById('expected-rating');
const hoursPlayedInput = document.getElementById('hours');
const ratingInput = document.getElementById('rating');
const dropReasonInput = document.getElementById('drop-reason');
const reviewInput = document.getElementById('review');
const searchResults = document.getElementById('search-results');
const RAWG_KEY = '7bb8466d0ba94f8192396db4562e3131';

//get parent div of each field so we can show or hide the div
const excitementDiv =excitementInput.parentElement;
const expectedRatingDiv =expectedRatingInput.parentElement;
const hoursDiv = hoursPlayedInput.parentElement;
const ratingDiv = ratingInput.parentElement;
const dropReasonDiv = dropReasonInput.parentElement;
const reviewDiv = reviewInput.parentElement;

//check if we are editing an existing game
const params = new URLSearchParams(window.location.search);
const editID = params.get('id');
//if editID is null, we are not editing a game, therefore set isEditing to false
const isEditing = editID !== null;

// Shows / hides fieds based on selected status
function updateFields(){
    const status = gameStatusSelect.value; 

    //first, hide all optional fields
    excitementDiv.style.display = 'none';
    expectedRatingDiv.style.display = 'none';
    hoursDiv.style.display = 'none';
    ratingDiv.style.display = 'none';
    dropReasonDiv.style.display = 'none';
    reviewDiv.style.display = 'none';

    //Show fields depending on status
    if(status === 'Wishlist' || status === 'Current'){
        excitementDiv.style.display = 'flex';
        expectedRatingDiv.style.display = 'flex';
    }


    if(status === 'Finished'){
        hoursDiv.style.display = 'flex';
        ratingDiv.style.display = 'flex';
        reviewDiv.style.display = 'flex';
    }

    if(status === 'Dropped'){
        hoursDiv.style.display = 'flex';
        ratingDiv.style.display = 'flex';
        reviewDiv.style.display = 'flex';
        dropReasonDiv.style.display = 'flex';
    }
}

// run when the status is changed 
gameStatusSelect.addEventListener('change', updateFields);

//run once so correct fields show on page load
updateFields();

//Now the js to actually save the game to the localStorage + validate the form
form.addEventListener('submit', function(event){
    event.preventDefault(); //stop page from refreshing

    //validate form
    if(!validateForm()){
        return;
    }
    
    //build a game object from the form values
    const game = {
        id: isEditing ? parseInt(editID) : Date.now(), 
        title: titleInput.value,
        cover: titleInput.dataset.cover || '',
        description: titleInput.dataset.description || '',
        released: titleInput.dataset.released || '',
        status: gameStatusSelect.value,
        excitement: excitementInput.value,
        expectedRating: expectedRatingInput.value,
        hours: hoursPlayedInput.value || 'N/A', 
        rating: ratingInput.value, 
        dropReason: dropReasonInput.value,
        review: reviewInput.value
    };

    const existing = localStorage.getItem('games');
    //if array already exists, then parse the existing games array, else start with an empty array
    //we do this because on the first time, if we did JSON.parse(null) , the program would crash
    let games = existing ? JSON.parse(existing) : [];

    if(isEditing){
        //find and relace the existing game
        const index = games.findIndex(function(g){
            return g.id == editID;
        });
        games[index] = game;
    }else{
        //add as new game to the array
            games.push(game);
    }

    //save in localStorage
    localStorage.setItem('games', JSON.stringify(games));

    //redirect to the edited game after saving, else redirect to backlog.html
    window.location.href =  isEditing ? 'game.html?id=' + editID : 'backlog.html';
});

//The below javascript is used to validate the form, i.e ensure that certain fields are filled in before logging game
function validateForm(){
    const status = gameStatusSelect.value;
    const title = titleInput.value.trim(); //we trim to avoid the possibility of someone logging " " as a game
    const error = document.getElementById('form-error');

    //clear any previous error
    error.style.display = 'none';
    error.textContent = '';

    if(!title){
        error.textContent = 'Please enter a game title';
        error.style.display = 'block';
        return false;
    }

    if(status === 'Wishlist' || status === 'Current'){
        if(!excitementInput.value){
            error.textContent = 'Please enter an excitement rating';
            error.style.display = 'block';
            return false;
        }
    }

    if(status === 'Finished' || status === 'Dropped'){
        if(!ratingInput.value){
            error.textContent = 'Please enter a rating';
            error.style.display = 'block';
            return false;
        }
    }

    return true;
}

//prefill the form with saved data if we are editing
function prefillForm(){
    const games = JSON.parse(localStorage.getItem('games'));
    const game = games.find(function(g){
        return g.id == editID;
    });

    if(!game) return;

    //prefill all fields with existing values
    titleInput.value = game.title;
    gameStatusSelect.value = game.status;
    excitementInput.value = game.excitement;
    expectedRatingInput.value = game.expectedRating;
    hoursPlayedInput.value = game.hours === 'N/A' ? '' : game.hours;
    ratingInput.value = game.rating;
    dropReasonInput.value = game.dropReason;
    reviewInput.value = game.review;

    //update the page title and button text
    document.querySelector('.page-title').textContent = 'Edit Game';
    document.querySelector('button[type="submit"]').textContent = 'Save Changes';

    //update fields based on pre-filled status
    updateFields();
}

//run prefill if in edit mode
if(isEditing){
    prefillForm();
}

//Searches RAWG API for games matching the query
async function searchGames(query){
    //show loading state
    searchResults.style.display = 'block';
    searchResults.innerHTML = '<p style="padding: 12px">Searching...</p>';

    try{
        const respone = await fetch(
            `https://api.rawg.io/api/games?search=${query}&key=${RAWG_KEY}&page_size=5`
        );
        const data = await respone.json();

        displayResults(data.results);
    } catch (error){
        searchResults.innerHTML = '<p style="padding: 12px">Something went wrong. Try again.</p>'
    }
}

//display results from rawg api
function displayResults(results){
    searchResults.innerHTML = '';

    if(results.length === 0){
        searchResults.innerHTML = '<p style="padding: 12px">No games found.</p>';
        return;
    }

    results.forEach(function(game){
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <img src="${game.background_image || ''}" alt="${game.name}" />
            <span>${game.name} (${game.released ? game.released.slice(0,4) : 'TBA'})</span>
        `; //If game is released, display release year, else display TBA

        item.addEventListener('click', function(){
        selectGame(game); 
        });

        searchResults.appendChild(item);
    });
}

//fills form when game is selected
function selectGame(game){
    //fill in the title
    titleInput.value = game.name;

    //store cover image and description for saving later
    titleInput.dataset.cover = game.background_image || '';
    titleInput.dataset.description = game.description_raw || '';
    titleInput.dataset.released = game.released || '';
    
    //hide the dropdwon
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
}
//eventlistener that triggers the search
//waits 500ms after user stops typing before searching
let searchTimeout;
titleInput.addEventListener('input', function(){
    const query = titleInput.value.trim();

    //clear any pending search
    clearTimeout(searchTimeout);

    if (query.length < 2){
        searchResults.style.display = 'none';
        return;
    }

    //wait 500ms after user stops typing
    searchTimeout = setTimeout(function(){
       searchGames(query); 
    }, 500);
});

//hide results when clicking outside
document.addEventListener('click', function(e){
    if (!e.target.closest('#search-results') && e.target !== titleInput){
        searchResults.style.display = 'none';
    }
});