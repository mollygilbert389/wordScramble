//create a login?
//click "play" loader "waiting for other players starts to load" to get players send them this link:x

//fun additional rules?

$(document).ready(function () {

    //VARIABLE LIST

    const letterBank = ["Soup", "Fruit", "Onion", "Fish", "Strawberry", "Grape", "Carrot", "Apple", "Cake", "Steak", "Salad", "Chicken", "Potato", "Mango", "Chips", "Popcorn", "Peanuts", "Watermelon", "Water", "Cookie", "Brownie", "Bagel", "Pizza", "Salsa", "Cheese", "Eggs", "Bacon", "Candy", "Olive", "Cherry", "Tomato", "Bread", "Orange", "Lemon", "Mustard", "Coffee", "Milk", "Butter", "Pepper", "Pasta", "Rice", "Cereal", "Salt", "Honey", "Garlic", "Beans", "Sugar", "Lettuce", "Ham", "Pork", "Crab", "Shrimp", "Turkey", "Mushroom", "Celery", "Lime", "Nuts", "Pumpkin", "Pecans", "Lamb", "Cream", "Flour", "Granola", "Beef", "Jerky", "Seeds", "Spices", "Yogurt", "Berries", "Vegetable", "Peas", "Vinegar", "Ginger", "Chocolate", "Pastry", "Noodles", "Yeast", "Vanilla", "Dough", "Buttermilk", "Batter", "Rasin", "Caramel", "Cornmeal", "Crackers"]

    let chosenWord = "";
    let score = 0;
    let playerA;
    let playerB;

    //DataBase
    const firebaseConfig = {
        apiKey: "AIzaSyBk-HzAE2olUa1KlLCywC131FRIqkU9Yjg",
        authDomain: "wordscramble-f6df6.firebaseapp.com",
        databaseURL: "https://wordscramble-f6df6.firebaseio.com",
        projectId: "wordscramble-f6df6",
        storageBucket: "wordscramble-f6df6.appspot.com",
        messagingSenderId: "283709291006",
        appId: "1:283709291006:web:87f55c8d8fb4284d"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    ref = database.ref("/play")

    //GAME FUNCTION
    $("#userNameModal").show();
    $("#userEnter").on("click", function () {
    myDisplayName = $("#userName").val().trim();
        if (myDisplayName != "") {
            $("#userNameModal").hide();
            $("#linkdiv").empty();
            createGame()
        }
        else {
            alert("Please enter a username to play");
        }

    });
    $("#playModal").show();



    //////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////FUNCTIONS/////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////

    function createGame() {
        $("#createGame").on("click", function(){
        let newGameButton = $("<button>");
        newGameButton.addClass("clickyGame")
        newGameButton.append(myDisplayName + "'s Game");
        $("#linkdiv").append(newGameButton);
        database.ref().push({
            myDisplayName: myDisplayName,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            compete: null
            });
        
        newGameButton.on("click", function(){ 
            console.log("I was clicked!")
            joinGame()
        }) 
    })
    }

    function joinGame() {
        compete = myDisplayName
        console.log(myDisplayName)
        database.ref().push({
            compete: myDisplayName
            });
    }

    function playGame() {
        let gameTime = 60;

        $("#userGuessBox").show();
        $("#directions").empty();
        $("#directions").append("GO!")
        console.log("It has been 10 seconds");
        chooseWord();
        console.log(chosenWord);
        $("#timer").html("Time Left in the Game: " + gameTime);
        newTimer = setInterval(gameCountdown, 1000);

        function gameCountdown() {
            gameTime--;
            $("#timer").html("Time Left in the Game: " + gameTime);
            if (gameTime <= 0) {
                clearInterval(newTimer);
                showWinner();
            };
        };

    };

    $("#wordGuess").on("click", function () {
        let userGuess = $("#userGuess").val().trim().toLowerCase();
        let frm = document.getElementsByName('gameForm')[0];
        if (userGuess === chosenWord) {
            score++;
            $("#score").empty();
            $("#score").append("Score: " + score);

            console.log(score);
            chooseWord();
            frm.reset();
        } else {
            frm.reset();
        };

    });

    function chooseWord() {
        chosenWord = letterBank[Math.floor(Math.random() * letterBank.length)]
        $("#displayBox").empty();
        chosenWord = chosenWord.toLowerCase();
        scrambledWord = chosenWord.split("");
        console.log(scrambledWord);
        scrambledWord = scrambledWord.sort(function () { return 0.5 - Math.random() }).join('');
        console.log(scrambledWord);
        $("#displayBox").append(scrambledWord);
    };

    function loading() {
        $("#playModal").hide();
        createGame()
        let counter = 10;
        $("#userGuessBox").hide();
        timer = setInterval(countDown, 1000);

        function countDown() {
            counter--;
            $("#timer").html("Time till start: " + counter);
            if (counter <= 0) {
                clearInterval(timer);
                playGame();
            };
        };

    };

    function showWinner() {
        modal = $("#myModal");
        message = $("#modalWinner");
        message.empty();
        message.append("We have a winner! Final Score: " + score);
        modal.show();
        $("#playAgain").on("click", function () {
            console.log("This button was clicked");
            modal.hide();
            location.reload();
        });

        $("#closeBtn").on("click", function () {
            console.log("I");
            modal.hide();
            location.reload();
        });
    };

});