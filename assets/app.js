//create a login?
//click "play" loader "waiting for other players starts to load" to get players send them this link:x
//once players are in there is a count down with instructions
//after 10 seconds are up scambled word appears
//player who enters the word in correctly first win 1 point
//new round starts
//after 1 min a winner is declared
//play again?

//fun additional rules?

//wordbank rules: 
//Words must be scrambled with with a minimum of  two vowels and two consonants each time.
//create an array with preset works already and JS scramble the words

$(document).ready(function(){

//VARIABLE LIST

    var letterBank = ["Soup", "Fruit", "Onion", "Fish", "Strawberry", "Grape", "Carrot", "Apple", "Cake", "Steak", "Salad", "Chicken", "Potato", "Mango", "Chips", "Popcorn", "Peanuts", "Watermelon", "Water", "Cookie", "Brownie", "Bagel", "Pizza", "Pie", "Salsa", "Cheese", "Egg", "Bacon", "Candy", "Olive", "Cherry", "Tomato", "Bread", "Orange", "Lemon", "Mustard", "Coffee", "Tea", "Milk", "Butter", "Pepper", "Pasta", "Rice", "Oil", "Cereal", "Salt", "Honey", "Garlic", "Beans", "Sugar", "Lettuce", "Ham", "Pork", "Crab", "Shrimp", "Turkey", "Mushroom", "Celery", "Lime", "Nuts", "Pumpkin", "Pecans", "Lamb", "Cream", "Flour"]

    var chosenWord = "";
    var playerOne = 0

//GAME FUNCTION
loading()

//FUNCTIONS
function playGame () {
    var gameTime = 60

    $("#directions").empty();
    $("#directions").append("GO!")
    console.log("It has been 10 seconds")
    chooseWord()
    console.log(chosenWord)
    $("#timer").html("Time Left in the Game: " + gameTime)
    newTimer = setInterval(gameCountdown,  1000);

    function gameCountdown() {
        gameTime--
        $("#timer").html("Time Left in the Game: " + gameTime)
        if (gameTime <= 0) {
            clearInterval(newTimer)
            showWinner()
        }
    }

}

    $("#wordGuess").on("click", function () {
        var userGuess = $("#userGuess").val().trim().toLowerCase()
        if (userGuess === chosenWord) {
            alert("Correct")
            playerOne++
            $("#userGuess").reset()
            console.log(playerOne)
            chooseWord()
        } else {
            alert("Try again!")
            $("#userGuess").reset()
        }

    })

    function chooseWord() {
        chosenWord = letterBank[Math.floor(Math.random() * letterBank.length)]
        $("#displayBox").empty()
        chosenWord = chosenWord.toLowerCase()
        scrambledWord = chosenWord.split("")
        console.log(scrambledWord)
        scrambledWord = scrambledWord.sort(function(){return 0.5-Math.random()}).join('')
        console.log(scrambledWord)
        $("#displayBox").append(scrambledWord)
    }

    function loading() {
        var counter = 10
        $("#directions").empty();
        $("#directions").append("You have entered the game! You will now have 10 seconds to prepare. Rules: you will be competing with another play to guess the correct word from the scrambled letters below. Once a player guesses the correct word a new word will appear. Good Luck!")

        timer = setInterval(countDown,  1000);
        
        function countDown() {
            counter--
            $("#timer").html("Time till start: " + counter)
            if (counter <= 0) {
                clearInterval(timer)
                playGame()
            }
        }

    }

    function showWinner() {
        console.log("Someone has won!")
    }
    
})