(function() {
    var socket = io.connect();
    var messageForm = document.getElementById('message-form');
    var userForm = document.getElementById('user-form');
    var messageContainer = document.getElementsByClassName('message-container')[0];
    var userContainer = document.getElementsByClassName('user-container')[0];

    var form = document.getElementById('form');

    var userInput = document.getElementById('tweeter-list');

    var userValue;

    userInput.addEventListener('change', function(event) {
        console.log(userInput.value);
        userValue = userInput.value;

        event.preventDefault();
        if (userInput.value !== '') {
            var input = userInput.value;
        }
    });

    function saveConnection(conncetionId) {
        var id = conncetionId;

        return id;
    }

    socket.on('time', function(data) {

        try {

            var dataCheck = data.info.text;

            // var cutstring = data.info.tweet.split(': ');
            // console.log(data.info);
            sendData(data);

            var chatMessage = document.createElement('div');

            chatMessage.classList.add('user-message');

            // Console.log(cutstring[1]);

            function stringCheck() {

                if (cutstring[1] !== undefined) {

                    return cutstring[1];
                }

                return cutstring[0];
            }
            // tweets.push(data);


            var chat = document.getElementById('chat');

            // chatMessage.innerHTML = `<div class=${data.info.id} tweet><p>${stringCheck()}</p></div>`;

            // chat.appendChild(chatMessage);

        } catch (err) {
            console.log(err);
        }
    });


    function sendData(data) {

        function sendTweets() {

            var randomnumber = Math.floor(Math.random() * data.info.length);
            var i;
            var tweetbox = document.getElementById('tweet');
            var index = 0;

            tweetbox.innerHTML = data.info[index].tweet;

            return index++;
        }

        setInterval(sendTweets, 6000);

    }

    socket.on('user connectionId', function(data) {
        var test = [];
        var demoId = {};
        var connectionId = this.id;
        var dd = saveConnection(connectionId);

        demoId.id = connectionId;
        test.push(dd);

        function currentNews(news, index) {
            var lowerCaseName = news.description.toLowerCase();
            if (news.description !== '') {
                console.log(lowerCaseName);

                var result = lowerCaseName.match('shot', 'g', 'i');

                if (result !== null) {
                    return result.index >= 0;
                }
            }
        }
    });
    socket.on('friend', function(data) {
        var tweeterList = document.getElementById('tweeter-list');

        var randomnumber = Math.floor(Math.random() * data.names.length);

        data.names.splice(randomnumber, 0, { name: "Lene" });
        data.names.join();

        data.names.map(function(name) {

            tweeterList.options[tweeterList.options.length] = new Option(name.name, name.name);
        });
    });


})();
