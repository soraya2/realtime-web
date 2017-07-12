(function() {
    var messageForm = document.getElementById('message-form');
    var userForm = document.getElementById('user-form');
    var messageContainer = document.getElementsByClassName('message-container')[0];
    var userContainer = document.getElementsByClassName('user-container')[0];
    var form = document.getElementById('form');
    var userInput = document.getElementById('tweeter-list');
    var score = document.querySelector('.score > span');
    var alertMessage = document.querySelector('.closebtn');
    var message = document.querySelector('#message');
    var messageText = document.querySelector('.message-text');
    var highScore = document.querySelector('.highscore > span');
    var birdLives = document.querySelectorAll('.lives > .bird-live');
    var birdList = document.querySelector('.lives');
    var tweetbox = document.getElementById('tweet');
    var newHighScore = document.querySelector('.new-highscore');
    var restartGame = document.querySelector('.restart-btn');
    var highScoreOthers = document.querySelector('.highscore-other-users');
    var name = document.querySelector('.name > span');
    var reconncect = true;
    var counter = 0;
    var lives = 2;
    var tweet;
    var userValue;
    var usernames;
    var connectedUsers = {};

    var socketIo = io.connect({
        'reconnection': reconncect,
        'reconnectionDelay': 1000,
        'reconnectionDelayMax': 10000,
        'reconnectionAttempts': 5
    });


    function init() {

        if (score) {
            score.innerHTML = counter;

        }

        if (localStorage.highScore) {
            highScore.innerHTML = localStorage.highScore;

        } else {
            localStorage.highScore = 0;

        }

        if (navigator.onLine) {

            console.log("online");

        } else {

            console.log("offline");
        }
        socketIo.on('send username', function(data) {
            usernames = data.name;

        });
        // localStorage.removeItem("highScore");
    }

    // function saveConnection(conncetionId) {
    //     var id = conncetionId;

    //     return id;
    // }

    socketIo.on('message', function(argument) {

        console.log(argument);

    });

    socketIo.on('new user', function(data) {
        // console.log(data.userId in connectedUsers);
        io.userId = data.userId;

        if (!(data.userId in connectedUsers)) {
            //using the nickname as key and save the io
            connectedUsers[io.userId] = io;
            // console.log(connectedUsers[io.userId]);

        }


        // io.emit('send id', connectedUsers);
    });



    socketIo.on('message', function(data) {
        io.userId = data;
        var name;

        if (!(data in connectedUsers)) {
            //using the nickname as key and save the io
            connectedUsers[io.userId] = io;
            // console.log(connectedUsers[io.userId]);

        } else {

            for (name in connectedUsers) {

            }

            console.log(data);
        }

        // console.log('Incoming message:', data);
    });

    socketIo.on('start', function(data) {

        var userData = [];

        userData.push(data);


        try {
            console.log(data.info.name);

            if (name.innerHTML === data.username) {
                sendData(data);
                optionData(data);
            }

            tweet = data.info.name;

        } catch (err) {
            console.log(err);
        }
    });

    socketIo.on('final data', function(data) {

        if (data.username in connectedUsers) {
            sendData(data);
            optionData(data);
        }
    });

    socketIo.on('stop', function(data) {
        usernames.map(function(argument) {
            if (data.username in connectedUsers) {

                tweetbox.innerHTML = "You're out of tweets from your friends ask your friends to send some more tweets!";

            }
        });
    });

    socketIo.on('tweets', function(data) {
        console.log('Incoming message:', data);
    });

    socketIo.on('highscore', function(data) {
        console.log(data, 'DATAAAAA');
        highScoreOthers.classList.remove('hide');

        highScoreOthers.innerHTML = `${data.username} just has a new high score of ${data.highScore} points`;
        setTimeout(function() {
            highScoreOthers.classList.add("hide");
            highScoreOthers.innerHTML = '';

        }, 3500);

    });

    socketIo.on('get high score', function(data) {

        highScore.innerHTML = data.gameHighscore;

    });

    function sendData(data) {

        tweetbox.innerHTML = '';

        usernames.map(function(argument) {
            if (data) {

                if (argument === data.username) {

                    tweetbox.innerHTML = data.info.tweet;
                }
            }
        });
    }

    function optionData(data) {
        usernames.map(function(argument) {
            if (argument === data.username) {

                var tweeterList = document.getElementById('tweeter-list');
                var opt = document.createElement('option');
                opt.value = null;
                opt.innerHTML = null;

                for (i = 0; i < tweeterList.options.length; i++) {
                    tweeterList.options[i] = null;
                }

                data.friends.forEach(function(name, index) {

                    tweeterList.options[index] = new Option(data.friends[index], data.friends[index]);

                });
            }
        });
    }

    userInput.addEventListener('change', function(event) {

        // event.preventDefault();
        userValue = userInput.value;

        if (userInput.value !== '') {

            checkAnswer(tweet, userValue);

        }
    });

    function checkAnswer(userAnswer, tweetName) {

        if (userAnswer === tweetName) {

            counter++;

            console.log('good');
            score.innerHTML = counter;
            if (counter > Number(localStorage.highScore) && localStorage.highScore !== undefined) {
                localStorage.highScore = counter; 
                highScore.innerHTML = counter; 
                newHighScore.classList.remove('hide');

            }

        } else {
            console.log('fault');

            socketIo.emit('new highScore', { highScore: counter });
            // console.log(birdLives);
            if (lives !== -1) {
                birdList.removeChild(birdLives[lives]);
                lives--;

            } else {
                tweetbox.classList.add('game-over');
                socketIo.removeAllListeners("time");
                tweetbox.innerHTML = 'GAME OVER!';
                socketIo.emit('end game', { test: 'haalooo' });
                restartGame.classList.remove('hide');
                if (counter > Number(localStorage.highScore) && localStorage.highScore !== undefined) {
                    // localStorage.highScore = score.innerHTML; 
                    // highScore.innerHTML = localStorage.highScore; 
                    // console.log(localStorage.highScore, "end");
                    // console.log(counter, "counter", "end");
                    newHighScore.classList.remove('hide');

                    localStorage.score = "";
                }
            }
        }
    }

    socketIo.on('connect', function(socket) {

        socketIo.emit('room', name.innerHTML);

    });

    socketIo.on('disconnect', function() {

        console.log('disconnected');

        function reconnect(argument) {

            if (navigator.onLine) {
                window.location.reload();
            }
        }

        setTimeout(reconnect, 5000);
    });

    socketIo.on('error', function(e) {
        console.log('System', e ? e : 'A unknown error occurred');
    });

    socketIo.on('reconnect_attempt', function(e) {

        function reconnect(argument) {

            if (navigator.onLine) {

                window.location.reload();
                console.log('online');

            } else {
                console.log('offline');
            }
        }

        setTimeout(reconnect, 4000);

        console.log('reconnecting');
    });

    function testConnection() {
        reconncect = true;
    }

    window.addEventListener('load', function(e) {

    }, false);

    restartGame.addEventListener('click', function(e) {
        e.preventDefault();

        window.location.reload();

    });

    window.addEventListener('online', function(e) {
        console.log("And we're back :)");

        message.classList.remove("hide");
        message.classList.add("online");
        messageText.innerHTML = 'Connected';
        localStorage.score = score.innerHTML; 
        score.innerHTML = score.innerHTML;

        if (navigator.onLine) {
            window.location.reload();
        }

        highScore.innerHTML = localStorage.highScore;

        setTimeout(function() {
            message.classList.add("hide");
            message.parentElement.classList.remove("online");

        }, 3500);

    }, false);

    window.addEventListener('offline', function(e) {
        console.log("offline.");

        message.classList.remove("hide");
        message.classList.add("alert");
        messageText.innerHTML = 'Disconnected';

        localStorage.score = score.innerHTML; 

        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            console.log(Number(score.innerHTML) > Number(localStorage.highScore));

            if (Number(score.innerHTML) > Number(localStorage.highScore) && localStorage.highScore !== undefined) {

                localStorage.highScore = score.innerHTML; 
            } else if (localStorage.highScore === undefined) {
                localStorage.highScore = 0;

            }

            io.removeAllListeners("time");
        } else {

        }

    }, false);

    alertMessage.addEventListener('click', function(e) {
        this.parentElement.classList.add("hide");
        // this.parentElement.classList.remove("alert");
    });

    init();
})();
