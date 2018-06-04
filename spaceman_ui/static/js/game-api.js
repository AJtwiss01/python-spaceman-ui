var gameState = {
    game_id: '',
    is_game_over: false
}

service_host = 'http://localhost:3000'
service_path = '/spaceman/api/game/'
service_url = service_host + service_path
assets_path = '/static/assets/'

function hideWinLossMessages() {
    document.getElementById('win-msg').hidden = true
    document.getElementById('lose-msg').hidden = true
    document.getElementById('solution').textContent = ''
}

function startNewGame() {
    hideWinLossMessages()

    window.superagent
        .post( service_url )
        .then( function( response ) {
            gameState.game_id = response.body.id
            gameState.is_game_over = response.body.is_game_over

            resetLetterButtons()
            createWordLetterElements( response.body.guessed_word_state )
            updateGameState( response.body )
        }).catch( function( err ) {
            console.log( err )
        });
}

function showSolution() {
    window.superagent
        .get(service_url + gameState.game_id + '/solution')
        .then( function( response ) {
            document.getElementById('solution').textContent = response.body.solution
        }).catch( function( err ) {
            console.log( err )
        });
}

function resetLetterButtons() {
    for( let element of document.getElementsByClassName('letter-btn') ) {
        element.disabled = false;
    }    
}

function createWordLetterElements( arrayOfSpaces ) {
    var wordLettersList = document.getElementById('guessed-letters-list')
    // Clear out the old letters
    while( wordLettersList.firstChild ) {
        wordLettersList.removeChild( wordLettersList.firstChild )
    }

    // Create list items for the new letters
    for( var index = 0; index < arrayOfSpaces.length; index++ ) {
        var listItem = document.createElement( 'li' )
        listItem.setAttribute('id', 'letter-in-word-' + index )
        listItem.setAttribute('class', 'list-inline-item letter-in-word')

        wordLettersList.appendChild(listItem)
    }
}

function disableGuessedLetterButtons( letters_guessed ) {
    for( let letter of letters_guessed ) {
        document.getElementById('letter-btn-' + letter ).disabled = true
    }
}

function updateCorrectlyGuessedLetters( guessed_word_state ){
    for(var index = 0; index < guessed_word_state.length; index++) {
        var listItemForLetter = document.getElementById('letter-in-word-' + index )
        listItemForLetter.textContent = guessed_word_state[index] || '_'
    }
}

function updateGuessesLeft( guesses_left ) {
    document.getElementById('guesses-left').innerText = guesses_left
}

function updateIsGameOver( is_game_over, guesses_left ) {
    gameState.is_game_over = is_game_over
    if( gameState.is_game_over ) {
        if( guesses_left > 0 ) {
            document.getElementById('win-msg').hidden = false
        } else {
            document.getElementById('lose-msg').hidden = false
        }
    }
}

function updateGameState( msg ) {
    disableGuessedLetterButtons( msg.letters_guessed )
    updateCorrectlyGuessedLetters( msg.guessed_word_state )
    
    var guessesLeft = parseInt(msg.guesses_allowed) - parseInt(msg.guesses_taken)
    updateGuessesLeft( guessesLeft )
    updateSpaceshipImage( msg.guesses_taken )
    updateIsGameOver( msg.is_game_over, guessesLeft )
}

function updateSpaceshipImage( guesses_taken ) {
    document.getElementById('spaceship-image').src = assets_path + 'guess_' + guesses_taken + '.jpg'
}

function handleLetterButtonClick( event ) {
    if( !gameState.is_game_over ) {
        var guessedLetter = event.target.dataset.letter

        window.superagent
            .put(service_url + gameState.game_id + '/')
            .send( {letters_guessed: [guessedLetter]})
            .then( function( response ) {
                updateGameState( response.body )
            }).catch( function( err ) {
                console.log( err )
            });
    }
}

function bindLetterButtons() {
    for( let element of document.getElementsByClassName('letter-btn') ) {
        element.addEventListener('click', handleLetterButtonClick )
    }
}

function bindNewGameLinks() {
    for( let element of document.getElementsByClassName('play-again-link') ) {
        element.addEventListener('click', startNewGame )
    }
}

function bindShowSolution() {
    for( let element of document.getElementsByClassName('show-solution-link') ) {
        element.addEventListener('click', showSolution )
    }
}

bindLetterButtons();
bindNewGameLinks();
bindShowSolution();
startNewGame();