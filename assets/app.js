
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
    playerNum =0;
    // database = firebase.database()
    // gameData = database

    let players= {
        name: "",
        playerAscore: playerAScore,
        playerBScore: playerBScore,
        opponent: ""
    }



    //GAME FUNCTION
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
        let playerNum = 1;
        $("#createGame").on("click", function () {
            firebase.database().ref().push({
                players: {
                    name: myDisplayName,
                    playerAScore: 0,
                    playerBScore: 0,
                    opponent: "empty",
                    playerNum: 1
                }
            });
            loading()
        });

        firebase.database().ref().on("child_added", function (snap) {
            $("#linkdiv").append("<button class='clickyGame' data-name='" + snap.val().players.name + "'" + ">" + snap.val().players.name + "'s Game " + "</button>");


            $(".clickyGame").on("click", function () {
                joinGame();
            });
        });
    };

    function joinGame() {
        let playerNum = 2
        firebase.database().ref().on("child_added", function (snap) {
            let playerA = snap.val().players.name;
            let playerB = myDisplayName;
            firebase.database().ref().set({
                players: {
                    name: playerA,
                    playerAscore: 0,
                    playerBscore: 0,
                    opponent: playerB,
                    playerNum: 2
                }
            });

            $("#playerANameBox").empty()
            $("#playerBNameBox").empty()
            $("#playerANameBox").append(playerA + "'s Guess Box");
            $("#playerBNameBox").append(playerB + "'s Guess Box");


            if (playerA != playerB) {
                loading();
            } 
            
            else {
                alert("You cannot play your own game!");
            };

        });
    };

    function playGame() {
        let gameTime = 60;
        $("#userGuessBox").show();
        $("#directions").empty();
        $("#directions").append("GO!");
        chooseWord();
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


    $(".wordGuess").on("click", function () {
        let playerAguess = $("#playerAGuess").val().trim().toLowerCase();
        let playerBguess = $("#playerBGuess").val().trim().toLowerCase();
        let frmA = document.getElementsByName('gameFormA')[0];
        let frmB = document.getElementsByName('gameFormB')[0];
        if (playerAguess === chosenWord) {
            playerAScore++;
            $("#playerAscore").empty();
            $("#playerAscore").append(playerA + "Score: " + playerAScore);
            chooseWord();
            frmA.reset();
        } else {
            frmA.reset();
        };

        if (playerBguess === chosenWord) {
            playerBScore++;
            $("#playerBscore").empty();
            $("#playerBscore").append(playerB + "Score: " + playerBScore);
            chooseWord();
            frmB.reset();
        } else {
            frmB.rest();
        };
    });

    function chooseWord() {
        chosenWord = letterBank[Math.floor(Math.random() * letterBank.length)];
        $("#displayBox").empty();
        chosenWord = chosenWord.toLowerCase();
        scrambledWord = chosenWord.split("");
        console.log(scrambledWord);
        scrambledWord = scrambledWord.sort(function () { return 0.5 - Math.random() }).join('');
        console.log(scrambledWord);
        $("#displayBox").append(scrambledWord);
    };

    function loading() {

        firebase.database().ref().on("child_added", function(snap) {
            currentPlayers = snap.numChildren();
          
            playerOneExists = snapshot.child("1").exists();
          
        //     // Player data objects
        //     playerOneData = snapshot.child("1").val();
        //     playerTwoData = snapshot.child("2").val();
          

        //     if (playerOneExists) {
        //         let playerNum = 1
              
        //     } else {
        //       // If there is no player 1, clear win/loss data and show waiting
            
        //     }
          
        //     // If theres a player 2, fill in name and win/loss data
        //     if (playerTwoExists) {
        //       $("#player2-name").text(playerTwoData.name);
        //       $("#player2-wins").text("Wins: " + playerTwoData.wins);
        //       $("#player2-losses").text("Losses: " + playerTwoData.losses);
        //     } else {
        //       // If no player 2, clear win/loss and show waiting
        //       $("#player2-name").text("Waiting for Player 2");
        //       $("#player2-wins").empty();
        //       $("#player2-losses").empty();
        //     }
          });

      if (playerNum === 2) {  
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

    } else {
        console.log("only 1 player in the game")
        $("#playModal").hide();
        $("#userGuessBox").hide();
        $("#timer").empty()
        $("#timer").append("Countdown will appear here. ")
        $("#directions").empty()
        $("#directions").append("Waiting for another player to join. Hold tight!")
        // loading();
    }

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