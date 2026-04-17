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

//get parent div of each field so we can show or hide the div
const excitementDiv =excitementInput.parentElement;
const expectedRatingDiv =expectedRatingInput.parentElement;
const hoursDiv = hoursPlayedInput.parentElement;
const ratingDiv = ratingInput.parentElement;
const dropReasonDiv = dropReasonInput.parentElement;
const reviewDiv = reviewInput.parentElement;

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
    if(status === 'Wishlist'){
        excitementDiv.style.display = 'flex';
        expectedRatingDiv.style.display = 'flex';
    }

    if(status === 'Current'){
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
        id: Date.now(), title: titleInput.value, status: gameStatusSelect.value,
        excitement: excitementInput.value, expectedRating: expectedRatingInput.value,
        hours: hoursPlayedInput.value || 'N/A', rating: ratingInput.value, dropReason: dropReasonInput.value,
        review: reviewInput.value
    };

    const existing = localStorage.getItem('games');
    //if array already exists, then parse the existing games array, else start with an empty array
    //we do this because on the first time, if we did JSON.parse(null) , the program would crash
    const games = existing ? JSON.parse(existing) : [];

    //add new game to the array
    games.push(game);

    //save in localStorage
    localStorage.setItem('games', JSON.stringify(games));

    //redirect to backlog page after saving
    window.location.href = 'backlog.html';
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
