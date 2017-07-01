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

            // Var cutstring = data.info.tweet.split(': ');
            // console.log(data.info);
            sendData(data);
            optionData(data);
            console.log(data.friends.length);
            var chatMessage = document.createElement('div');

            chatMessage.classList.add('user-message');

            // Console.log(cutstring[1]);

            function stringCheck() {
                if (cutstring[1] !== undefined) {
                    return cutstring[1];
                }

                return cutstring[0];
            }
            // Tweets.push(data);

            var chat = document.getElementById('chat');

            // ChatMessage.innerHTML = `<div class=${data.info.id} tweet><p>${stringCheck()}</p></div>`;

            // chat.appendChild(chatMessage);
        } catch (err) {
            console.log(err);
        }
    });

    function sendData(data) {
        var i;
        var tweetbox = document.getElementById('tweet');
        tweetbox.innerHTML = '';

        // function sendTweets() {
        // Var randomnumber = Math.floor(Math.random() * data.info.length);

        tweetbox.innerHTML = data.info.tweet;
        // Console.log(data);
        // }

        // setInterval(sendTweets, 6000);
    }

    function optionData(data) {
        // Console.log(data.friends);
        // console.log(data.friends.length);
        var tweeterList = document.getElementById('tweeter-list');
        var opt = document.createElement('option');
        opt.value = null;
        opt.innerHTML = null;

        data.friends.map(function(name) {
            tweeterList.options[tweeterList.options.length] = null;
            // Opt.value = '';
            // opt.innerHTML = '';

            // opt.value = name.name;
            // opt.text = name.name;

            opt.value = name.name;
            opt.innerHTML = name.name;
            tweeterList.appendChild(opt);

            // TweeterList.options[tweeterList.options.length] = Option(name.name, name.name);
        });
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
    // Socket.on('friend', function(data) {
    //     var tweeterList = document.getElementById('tweeter-list');

    //     var randomnumber = Math.floor(Math.random() * data.names.length);

    //     data.names.splice(randomnumber, 0, { name: "Lene" });
    //     data.names.join();

    //     data.names.map(function(name) {

    //         tweeterList.options[tweeterList.options.length] = new Option(name.name, name.name);
    //     });
    // });
})();
