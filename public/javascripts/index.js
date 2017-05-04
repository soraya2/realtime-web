(function () {
  var socket = io.connect();
  var messageForm = document.getElementById('message-form');
  var userForm = document.getElementById('user-form');
  var messageContainer = document.getElementsByClassName('message-container')[0];
  var userContainer = document.getElementsByClassName('user-container')[0];
  var userList = document.getElementById('user-list');
  var selectBox = document.getElementById('user-friends');

  // Var coloredButtons = document.querySelectorAll('button');
  // messageContainer.classList.add('hide');

  // userForm.addEventListener('submit', function (e) {
  //   e.preventDefault();
  //   var userNameValue = userName.value;
  //   console.log(userNameValue);
  //   socket.emit('new user', userNameValue, function (data) {
  //   // Looping over buttons to get value and add them to message that has the same user id that picked it

  //   // ColoredButtons.forEach(function (button) {
  //   //     button.addEventListener('click',function (e){
  //   //       console.log(button.value);
  //   //       // var userName = userName.value;
  //   //       var buttonValue = button.value;
  //   //       // console.log({userName:buttonValue});
  //   //     });
  //   // });

  //     if (data) {
  //       userContainer.classList.add('hide');
  //       messageContainer.classList.remove('hide');
  //     }
  //   });

  //   userName.value = '';
  // });

  function saveConnection(conncetionId) {
    var id = conncetionId;

    return id;
  }

  var tweets = [];

  socket.on('time', function (data) {
    console.log('data', 'data');
    var option = document.createElement('option');
    option.text = `${data.friends}`;
    selectBox.add(option);

    var chatMessage = document.createElement('div');

    tweets.push(data);
    console.log(tweets);
    chatMessage.classList.add('user-message');

 // Console.log( data.info.user.profile_image_url_https);
    var cutstring = data.info.text.split(': ');
    // Console.log(cutstring[1]);

    function stringCheck() {
      if (cutstring[1] !== undefined) {
        return cutstring[1];
      }
      return cutstring[0];
    }
    tweets.push(data);

    console.log(tweets);
    var chat = document.getElementById('chat');
    chatMessage.innerHTML = `<div class=${data.info.id} tweet><p>${stringCheck()}</p></div>`;

    chat.appendChild(chatMessage);
  });

  socket.on('user connectionId', function (data) {
    var test = [];
    var demoId = {};
    var connectionId = this.id;
    var dd = saveConnection(connectionId);

    demoId.id = connectionId;
    test.push(dd);

    // Data.data.map( function(news){

    //     console.log(today);

    // });
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

// Var filterdData = data.news.filter(currentNews);
  });
})();

