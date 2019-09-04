$(document).ready(function () {

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

    //VARIABLE LIST

    const letterBank = ["Soup", "Fruit", "Onion", "Fish", "Strawberry", "Grape", "Carrot", "Apple", "Cake", "Steak", "Salad", "Chicken", "Potato", "Mango", "Chips", "Popcorn", "Peanuts", "Watermelon", "Water", "Cookie", "Brownie", "Bagel", "Pizza", "Salsa", "Cheese", "Eggs", "Bacon", "Candy", "Olive", "Cherry", "Tomato", "Bread", "Orange", "Lemon", "Mustard", "Coffee", "Milk", "Butter", "Pepper", "Pasta", "Rice", "Cereal", "Salt", "Honey", "Garlic", "Beans", "Sugar", "Lettuce", "Ham", "Pork", "Crab", "Shrimp", "Turkey", "Mushroom", "Celery", "Lime", "Nuts", "Pumpkin", "Pecans", "Lamb", "Cream", "Flour", "Granola", "Beef", "Jerky", "Seeds", "Spices", "Yogurt", "Berries", "Vegetable", "Peas", "Vinegar", "Ginger", "Chocolate", "Pastry", "Noodles", "Yeast", "Vanilla", "Dough", "Buttermilk", "Batter", "Rasin", "Caramel", "Cornmeal", "Crackers"];

    let chosenWord = "";
    let playerAScore = 0;
    let playerBScore = 0;
    let playerA = "";
    let playerB = "";
    let playerAguess = "";
    let playerBguess = "";
    let playerNum =0;
    const database = firebase.database()

    // let players = {
    //     name: "",
    //     playerAscore: playerAScore,
    //     playerBScore: playerBScore,
    //     opponent: ""
    // }



    //GAME START
    $("#userNameModal").show();
    $("#userEnter").on("click", function () {
        myDisplayName = $("#userName").val().trim();
        if (myDisplayName != "") {
            $("#userNameModal").hide();
            $("#linkdiv").empty();
            createGame();
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
        $("#createGame").on("click", function () {
            database.ref().set({
                players : {
                name: myDisplayName,
                opponent: "empty",
                playerNum: "1"
                }
            });

            loading()
        });

        database.ref().on("value", function (snap) {
            $("#linkdiv").empty()
            $("#linkdiv").append("<button class='clickyGame' data-name='" + snap.val().players.name + "'" + ">" + snap.val().players.name + "'s Game " + "</button>");

            $(".clickyGame").on("click", function () {
                database.ref("/players").child("opponent").set(myDisplayName)
                database.ref("/players").child("playerNum").set("2")
                loading()
            });
        });
    };

    function playGame() {
        let gameTime = 60;
        $("#userGuessBox").show();
        $("#directions").empty();
        $("#directions").append("GO!");
        chooseWord();
        $("#timer").html("Time Left in the Game: " + gameTime);

        database.ref().child("score").set({
            playerAscore: 0,
            playerBscore: 0
        })

        newTimer = setInterval(gameCountdown, 1000);
        function gameCountdown() {
            gameTime--;
            $("#timer").html("Time Left in the Game: " + gameTime);
            if (gameTime <= 0) {
                clearInterval(newTimer);
                showWinner();
            };
        };

        $(".wordGuess").on("click", function () {   
            let playerAguess = $("#playerAGuess").val().trim().toLowerCase();
            let playerBguess = $("#playerBGuess").val().trim().toLowerCase();
            let frmA = document.getElementsByName('gameFormA')[0];
            let frmB = document.getElementsByName('gameFormB')[0];
          
            if (playerAguess === chosenWord) {
                playerAScore++
                chooseWord()
                database.ref("/score").child("playerAscore").set(playerAScore)
                checkScore()
                frmA.reset();
            } else {
                frmA.reset();
            };
    
            if (playerBguess === chosenWord) {
                playerBScore++
                chooseWord();
                database.ref("/score").child("playerBscore").set(playerBScore)
                checkScore()
                frmB.reset();
    
            } else {
                frmB.reset();
            };
    
        });

    };

    function checkScore() {
        database.ref("score").on("value", function(snap) {
            let ascore = snap.child("playerAScore").val();

            let bscore = snap.child("playerBScore").val()

            $("#playerAscore").empty();
            $("#playerAscore").append("Score: " + playeraScore);
            $("#playerBscore").empty();
            $("#playerBscore").append("Score: " + playerbScore);
        })
       
    }

    function chooseWord() {
        let chosenWord = letterBank[Math.floor(Math.random() * letterBank.length)];
        console.log(chosenWord)
        chosenWord = chosenWord.toLowerCase();
        scrambledWord = chosenWord.split("");
        scrambledWord = scrambledWord.sort(function () { return 0.5 - Math.random() }).join('');
        
        database.ref().child("chosenWord").set(scrambledWord)

        database.ref("chosenWord").on("value", function(snap) {
            $("#displayBox").empty();
            let chosenWord = snap.val()
            $("#displayBox").append(chosenWord);
            })
    };

    function loading() {
        database.ref("/players").on("value", function(snap) {
            let playerReady = snap.child("playerNum").val();
            let playerOneName = snap.child("name").val();
            let playerTwoName = snap.child("opponent").val();
        
            if (playerReady === "1") {
                $("#playModal").hide();
                $("#userGuessBox").hide();
                $("#timer").empty()
                $("#timer").append("Countdown will appear here. ")
                $("#directions").empty()
                $("#directions").append("Waiting for another player to join. Hold tight!")
                $("#playerANameBox").empty()
                $("#playerANameBox").append(playerOneName + "'s Guess Box");

            } else if (playerReady === "2") {
                $("#directions").empty()
                $("#playerANameBox").empty()
                $("#directions").append("You have entered the game! You will now have 10 seconds to prepare. Rules: you will be competing with another play to guess the correct word from the scrambled letters below. Once a player guesses the correct word a new word will appear. Good Luck!")
                $("#playerANameBox").append(playerOneName + "'s Guess Box");
                $("#playerBNameBox").empty()
                $("#playerBNameBox").append(playerTwoName + "'s Guess Box");
                $("#playModal").hide();
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
            }

        });

    };

    function showWinner() {
        modal = $("#myModal");
        message = $("#modalWinner");
        message.empty();

        if (playerAScore > playerBScore) {
            message.append("We have a winner!" + playerA + " Final Score: " + playerAScore);
        }
        if (playerBScore > playerAScore) {
            message.append("We have a winner!" + playerB + " Final Score: " + playerBScore);
        }
        if (playerBScore === playerAScore) {
            message.append("There was a tie!");
        }
        modal.show();
        $("#playAgain").on("click", function () {
            modal.hide();
            location.reload();
        });

        $("#closeBtn").on("click", function () {
            modal.hide();
            location.reload();
        });
    };

});