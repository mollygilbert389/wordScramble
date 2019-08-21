//create a login?
//click "play" loader "waiting for other players starts to load" to get players send them this link:x

//fun additional rules?

$(document).ready(function () {

    //VARIABLE LIST

    const letterBank = ["Soup", "Fruit", "Onion", "Fish", "Strawberry", "Grape", "Carrot", "Apple", "Cake", "Steak", "Salad", "Chicken", "Potato", "Mango", "Chips", "Popcorn", "Peanuts", "Watermelon", "Water", "Cookie", "Brownie", "Bagel", "Pizza", "Salsa", "Cheese", "Eggs", "Bacon", "Candy", "Olive", "Cherry", "Tomato", "Bread", "Orange", "Lemon", "Mustard", "Coffee", "Milk", "Butter", "Pepper", "Pasta", "Rice", "Cereal", "Salt", "Honey", "Garlic", "Beans", "Sugar", "Lettuce", "Ham", "Pork", "Crab", "Shrimp", "Turkey", "Mushroom", "Celery", "Lime", "Nuts", "Pumpkin", "Pecans", "Lamb", "Cream", "Flour", "Granola", "Beef", "Jerky", "Seeds", "Spices", "Yogurt", "Berries", "Vegetable", "Peas", "Vinegar", "Ginger", "Chocolate", "Pastry", "Noodles", "Yeast", "Vanilla", "Dough", "Buttermilk", "Batter", "Rasin", "Caramel", "Cornmeal", "Crackers"]

    let chosenWord = "";
    let playerAScore = 0;
    let playerBScore = 0;
    let players = [];

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
    // const database = firebase.database();
    // ref = database.ref("/play")

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
        players = [];
        $("#createGame").on("click", function(){
        firebase.database().ref().push({
            myDisplayName: myDisplayName,
            opponent: "Nothing Yet",
            playerAScore: playerAScore,
            playerBScore: playerBScore
            });
    })
    firebase.database().ref().on("child_added", function(childsnapshot){
        $("#linkdiv").append("<button class='clickyGame' data-name='" + childsnapshot.val().myDisplayName + "'" + ">" + childsnapshot.val().myDisplayName + "'s Game " + "</button>")
        console.log(childsnapshot.val().myDisplayName)
        //figure out why undefined buttons are appearing
        $(".clickyGame").on("click", function(){
        name = $(this).data("name")
        players.push(name)
        joinGame()
        })
    })

    }

    function joinGame() {
        let playerA = players[0]
        let playerB = myDisplayName
        if (playerA != playerB) {
            firebase.database().ref().set({
            myDisplayName: playerA,
            opponent: playerB,
            playerAScore: playerAScore,
            playerBScore: playerBScore
        });
            loading();
        } else {
            alert("You can't play yourself!")
        }
    } 

    function playGame() {
        let gameTime = 60;
        $("#userGuessBox").show();
        $("#directions").empty();
        $("#directions").append("GO!")
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

    $("#wordGuess").on("click", function () {
        // let playerAguess = $("#userGuess").val().trim().toLowerCase();
        // let playerBguess = $("#userGuess").val().trim().toLowerCase();
        // let frm = document.getElementsByName('gameForm')[0];
        // if (playerAguess === chosenWord) {
        //     playerAScore++
        //     $("#playerAscore").append(playerA + ": " + playerAScore);
        //     chooseWord();
        //     frm.reset();
        //     database.ref().set({
        //         playerAScore: playerAScore,
        //         playerBScore: playerBScore
        //         })
        // } else if (playerBguess === chosenWord) {
        //     playerBScore++
        //     $("#playerBscore").append(playerB + ": " + playerBScore);
        //     chooseWord();
        //     frm.reset();
        //     database.ref().set({
        //         playerAScore: playerAScore,
        //         playerBScore: playerBScore
        //     })
        // } else {
        //     frm.reset();
        // };
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

        if (playerAScore > playerBScore) {
        message.append("We have a winner!" + playerA + "Final Score: " + playerAScore);
        }
        if (playerBScore > playerAScore) {
            message.append("We have a winner!" + playerB + "Final Score: " + playerBScore);
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