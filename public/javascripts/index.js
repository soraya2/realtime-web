(function() {
    var reconncect = true;
    var socket = io.connect({
        'reconnection': reconncect,
        'reconnectionDelay': 1000,
        'reconnectionDelayMax': 10000,
        'reconnectionAttempts': 5
    });

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
    var highscore = document.querySelector('.highscore > span');
    var birdLives = document.querySelectorAll('.lives > .bird-live');
    var birdList = document.querySelector('.lives');
    var tweetbox = document.getElementById('tweet');
    var counter = 0;
    var lives = 2;
    var tweet;


    if (score) {
        score.innerHTML = counter;
        // localStorage.highScore = '5';
        highscore.innerHTML = localStorage.highScore;
        // console.log(score);
    }

    var userValue;

    function saveConnection(conncetionId) {
        var id = conncetionId;

        return id;
    }


    socket.on('time', function(data) {
        try {
            console.log(data.info.name);

            // var dataCheck = data.info.text;
            // var chatMessage = document.createElement('div');
            // var chat = document.getElementById('chat');

            sendData(data);
            optionData(data);
            tweet = data.info.name;


            // chatMessage.classList.add('user-message');

            function stringCheck() {
                if (cutstring[1] !== undefined) {
                    return cutstring[1];
                }

                return cutstring[0];
            }


        } catch (err) {
            console.log(err);
        }
    });

    function sendData(data) {
        var i;
        tweetbox.innerHTML = '';
        tweetbox.innerHTML = data.info.tweet;

    }

    function optionData(data) {

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


    userInput.addEventListener('change', function(event) {
        // console.log(userInput.value);
        userValue = userInput.value;

        // event.preventDefault();
        if (userInput.value !== '') {

            checkAnswer(tweet, userValue);
            // data.info.name === userInput.value
            // var input = userInput.value;
            // console.log(data.info.name === userInput.value, data.info.name);
        }
    });

    function checkAnswer(userAnswer, tweetName) {

        localStorage.highScore = '5';
        if (userAnswer === tweetName) {

            counter++;
            console.log('good');
            score.innerHTML = counter;


        } else {
            console.log('fault');

            console.log(birdLives);
            if (lives !== -1) {
                birdList.removeChild(birdLives[lives]);
                lives--;

            } else {
                socket.removeAllListeners("time");
                tweetbox.innerHTML = 'GAME OVER!';

            }
        }
    }


    socket.on('connect', function(client) {

        console.log('socket connected');

        socket.emit('login', { userId: socket.id });
    });

    socket.on('disconnect', function() {

        console.log('disconnected');

        function reconnect(argument) {

            if (navigator.onLine) {
                window.location.reload();
            }

        }

        setTimeout(reconnect, 5000);
    });

    socket.on('error', function(e) {
        console.log('System', e ? e : 'A unknown error occurred');
    });

    socket.on('reconnect_attempt', function(e) {


        function reconnect(argument) {
            // socket.connect();

            if (navigator.onLine) {

                window.location.reload();
                console.log('online');

            } else {
                console.log('offline');
            }

            // console.log('reconnect');

        }

        setTimeout(reconnect, 4000);
        // console.log('System', e ? e : 'A unknown error occurred');
        console.log('reconnecting');
    });
    // socket.sockets.on('connection', function(socket) {
    //     console.log(socket);

    // });

    function testConnection() {
        reconncect = true;

    }

    window.addEventListener('load', function(e) {
        if (navigator.onLine) {
            console.log("online");
            // updateConnectionStatus('Online', true);
        } else {
            console.log("offline");
            // updateConnectionStatus('Offline', false);
        }
    }, false);

    window.addEventListener('online', function(e) {
        console.log("And we're back :)");

        message.classList.remove("hide");
        message.classList.add("online");
        messageText.innerHTML = 'Connected';
        if (highscore) {

            highscore.innerHTML = localStorage.highScore;
        }
        // message-text
        setTimeout(function() {
            message.classList.add("hide");
            message.parentElement.classList.remove("online");

        }, 3500);

    }, false);

    window.addEventListener('offline', function(e) {

        console.log("offline.");
        message.classList.remove("hide", "online");
        message.classList.add("alert");
        messageText.innerHTML = 'Disconnected';
        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            // localStorage.highScore = score.innerHTML;

            console.log(localStorage.highScore);
            console.log(score.innerHTML);
            socket.removeAllListeners("time");
        } else {
            // Sorry! No Web Storage support..
        }

    }, false);

    alertMessage.addEventListener('click', function(e) {
        this.parentElement.classList.toggle("hide");
        // this.parentElement.classList.remove("alert");
    });

    console.log(alertMessage);
})();

// socket.broadcast.emit('users_count', clients);
// io.sockets.on('users_count', function(client) {

// });
