//create a login?
//click "play" loader "waiting for other players starts to load" to get players send them this link:x

//fun additional rules?

$(document).ready(function () {

    //VARIABLE LIST

    var letterBank = ["Soup", "Fruit", "Onion", "Fish", "Strawberry", "Grape", "Carrot", "Apple", "Cake", "Steak", "Salad", "Chicken", "Potato", "Mango", "Chips", "Popcorn", "Peanuts", "Watermelon", "Water", "Cookie", "Brownie", "Bagel", "Pizza", "Salsa", "Cheese", "Eggs", "Bacon", "Candy", "Olive", "Cherry", "Tomato", "Bread", "Orange", "Lemon", "Mustard", "Coffee", "Milk", "Butter", "Pepper", "Pasta", "Rice", "Cereal", "Salt", "Honey", "Garlic", "Beans", "Sugar", "Lettuce", "Ham", "Pork", "Crab", "Shrimp", "Turkey", "Mushroom", "Celery", "Lime", "Nuts", "Pumpkin", "Pecans", "Lamb", "Cream", "Flour", "Granola", "Beef", "Jerky", "Seeds", "Spices", "Yogurt", "Berries", "Vegetable", "Peas", "Vinegar", "Ginger", "Chocolate", "Pastry", "Noodles", "Yeast", "Vanilla", "Dough", "Buttermilk", "Batter", "Rasin", "Caramel", "Cornmeal", "Crackers"]

    var chosenWord = "";
    var score = 0

    //DataBase
    var firebaseConfig = {
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
    var database = firebase.database()
    var connectionsRef = database.ref("/connections");
    var connectedRef = database.ref(".info/connected");

    var player = {
        myID: null,
        myDisplayName: null,
        opponentID: null,
        oppDisplayName: null,
        oppChoice: "",
        oppReady: false,
        myConnect: [],
        players: {},
        playerIDs: [],
        gameStatus: false,
        waiting: false, 
        choice: null,
    }

    //GAME FUNCTION
    $("#userNameModal").show()
    //get username to post to db
    //add enter game functionality once player is clicked
    $("#userEnter").on("click", function () {
    myDisplayName = $("#userName").val().trim()
        if (myDisplayName != "") {
            $("#userNameModal").hide()
            $("#linkdiv").empty()
            var initialRow = $("<tr>");
            var name = $("<th>").text("Player Name:" + myDisplayName)
            var status = $("<th>").text("Status:")
            initialRow.append(name, status)
            $("#linkdiv").append(initialRow)

            for (var i = 0; i < player.playerIDs.length; i++) {
                var newRow = $("<tr>");
                var name = $("<td>").text(player.players[player.playerIDs[i]].displayName);
                var status = $("<td>").text(player.players[game.playerIDs[i]].status);
                newRow.append(name, status);
                newRow.attr("id", player.playerIDs[i]);

                newRow.on("click", function () {
                    if (this.id != player.myID) {
                        player.opponentID = this.id
                        player.oppDisplayName = player.players[player.opponentID].displayName;
                        $("#challengename").text(player.players[player.opponentID].displayName);
                    }
                })
                $("#linkdiv").append(newRow);
            }
        }
        else {
            alert("Please enter a username to play")
        }

    })
    $("#playModal").show()
    $("#challenged").hide()
    $("#challenge").on("click", function () {
        loading()
    })

    connectedRef.on("value", function(snap) {
        if (snap.val()) {
            var playerID = assignPlayer();
            playerID.onDisconnect().remove();
        }
    });



    //////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////FUNCTIONS/////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////

    function playGame() {
        var gameTime = 60

        $("#userGuessBox").show()
        $("#directions").empty();
        $("#directions").append("GO!")
        console.log("It has been 10 seconds")
        chooseWord()
        console.log(chosenWord)
        $("#timer").html("Time Left in the Game: " + gameTime)
        newTimer = setInterval(gameCountdown, 1000);

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

    function chooseWord() {
        chosenWord = letterBank[Math.floor(Math.random() * letterBank.length)]
        $("#displayBox").empty()
        chosenWord = chosenWord.toLowerCase()
        scrambledWord = chosenWord.split("")
        console.log(scrambledWord)
        scrambledWord = scrambledWord.sort(function () { return 0.5 - Math.random() }).join('')
        console.log(scrambledWord)
        $("#displayBox").append(scrambledWord)
    }

    function loading() {
        $("#playModal").hide()
        var counter = 10
        $("#userGuessBox").hide()
        timer = setInterval(countDown, 1000);

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
        modal = $("#myModal")
        message = $("#modalWinner")
        message.empty()
        message.append("We have a winner! Final Score: " + score)
        modal.show()
        $("#playAgain").on("click", function () {
            console.log("This button was clicked")
            modal.hide()
            location.reload()
        })

        $("#closeBtn").on("click", function () {
            console.log("I")
            modal.hide()
            location.reload()
        })
    }

    function assignPlayer() {
        newplayer = {
            myDisplayName: player.myDisplayName,
            challenge: false,
            opponent: null,
            status: "Free",
            choice: null
        }
        console.log(newplayer)
        var playerId = database.ref("/players").push(newplayer)
        player.myID = playerId.path.pieces_[1];
        return playerId;
    }

    //TO CALL

    function checkAvailible() {
        if (player.players[player.myID].status == "Busy" && PaymentRequest.players[game.myID].opponent != null) {
            player.gameStatus = true;
            gameResponse()
        }
    }

    function gameResponse() {
        player.opponentID = player.players[player.myID].opponent
        var oppName = player.players[player.opponentID].displayName
        $("#challenger").text(oppname);
        $("#challenged").attr("style", "display: block;")
        ///
        // $("myModal").attr("style", "display: block;")


    }

})