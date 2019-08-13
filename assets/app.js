//create a login?
//click "play" loader "waiting for other players starts to load" to get players send them this link:x

//fun additional rules?

$(document).ready(function(){

//VARIABLE LIST

    var letterBank = ["Soup", "Fruit", "Onion", "Fish", "Strawberry", "Grape", "Carrot", "Apple", "Cake", "Steak", "Salad", "Chicken", "Potato", "Mango", "Chips", "Popcorn", "Peanuts", "Watermelon", "Water", "Cookie", "Brownie", "Bagel", "Pizza", "Salsa", "Cheese", "Eggs", "Bacon", "Candy", "Olive", "Cherry", "Tomato", "Bread", "Orange", "Lemon", "Mustard", "Coffee", "Milk", "Butter", "Pepper", "Pasta", "Rice", "Cereal", "Salt", "Honey", "Garlic", "Beans", "Sugar", "Lettuce", "Ham", "Pork", "Crab", "Shrimp", "Turkey", "Mushroom", "Celery", "Lime", "Nuts", "Pumpkin", "Pecans", "Lamb", "Cream", "Flour", "Granola", "Beef", "Jerky", "Seeds", "Spices", "Yogurt", "Berries", "Vegetable", "Peas", "Vinegar", "Ginger", "Chocolate", "Pastry", "Noodles", "Yeast", "Vanilla", "Dough", "Buttermilk", "Batter", "Rasin", "Caramel", "Cornmeal", "Crackers"]

    var chosenWord = "";
    var score = 0
    var winner = "Molly"



//GAME FUNCTION
$("#playModal").show()
$("#startBtn").on ("click", function(){
    loading()
})


//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////FUNCTIONS/////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
/////Gets timer for 60 seconds going
function playGame () {
    var gameTime = 60

    $("#userGuessBox").show()
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

/////////////////////////////////////////////////////////////
///ONCLICK EVENT THAT RECORDS SCORE
    $("#wordGuess").on("click", function () {
        var userGuess = $("#userGuess").val().trim().toLowerCase()
        var frm = document.getElementsByName('gameForm')[0];
        if (userGuess === chosenWord) {
            score++
            $("#score").empty()
            $("#score").append("Score: " + score)

            console.log(score)
            chooseWord()
            frm.reset()
        } else {
            frm.reset()
        }

    })

/////////////////////////////////////////////////////////////
////Chooses and scrambles a word from the word bank
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

/////////////////////////////////////////////////////////////
////Function that is triggered once the play button is clicked
    function loading() {
        $("#playModal").hide()
        var counter = 10
        $("#userGuessBox").hide()
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
/////////////////////////////////////////////////////////////
    ///Final results section and play again
    function showWinner() {
        modal = $("#myModal")
        message = $("#modalWinner")
        message.empty()
        message.append("We have a winner! Final Score: " + score)
        modal.show()
        $("#playAgain").on("click", function() {
            console.log("This button was clicked")
            modal.hide()
            location.reload()
        })

        $("#closeBtn").on("click", function(){
            console.log("I")
            modal.hide()
            location.reload()
        }) 
    }
    
})