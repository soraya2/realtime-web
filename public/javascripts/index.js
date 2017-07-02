(function() {
    var socket = io.connect();
    var messageForm = document.getElementById('message-form');
    var userForm = document.getElementById('user-form');
    var messageContainer = document.getElementsByClassName('message-container')[0];
    var userContainer = document.getElementsByClassName('user-container')[0];
    var form = document.getElementById('form');
    var userInput = document.getElementById('tweeter-list');
    var score = document.querySelector('.score > span');
    var counter = 0;
    score.innerHTML = counter;
    console.log(score);

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
})();
