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
    var counter = 0;

    if (score) {
        score.innerHTML = counter;
        console.log(score);
    }

    var userValue;

    function saveConnection(conncetionId) {
        var id = conncetionId;

        return id;
    }

    socket.on('time', function(data) {
        try {
            console.log(data.info.name);

            userInput.addEventListener('change', function(event) {
                // console.log(userInput.value);
                userValue = userInput.value;

                // event.preventDefault();
                if (userInput.value !== '') {

                    checkAnswer(data.info.name, userValue);
                    // data.info.name === userInput.value
                    // var input = userInput.value;
                    // console.log(data.info.name === userInput.value, data.info.name);
                }
            });
            // var dataCheck = data.info.text;
            // var chatMessage = document.createElement('div');
            // var chat = document.getElementById('chat');

            sendData(data);
            optionData(data);


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
        var tweetbox = document.getElementById('tweet');
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


    function checkAnswer(userAnswer, tweetName) {
        // console.log(userAnswer, tweetName);
        console.log(typeof counter);

        if (userAnswer === tweetName) {

            // console.log('good');
            // score.innerHTML
            score.innerHTML = counter++;

        } else {
            console.log('fault');
        }
    }

    // socket.on('connection', function(data) {
    //     console.log('hello');

    // });

    // socket.on('connection', function(client) {
    //     client.send("hello");
    //     console.log("hello", client);
    // });


    socket.on('connect', function(client) {

        console.log('sjsjsj');
        window.stop();
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
})();
