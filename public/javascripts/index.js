(function () {
  var socket = io.connect();
  var messageForm = document.getElementById('message-form');
  var userForm = document.getElementById('user-form');
  var messageContainer = document.getElementsByClassName('message-container')[0];
  var userContainer = document.getElementsByClassName('user-container')[0];
  var userList = document.getElementById('user-list');
  // Var coloredButtons = document.querySelectorAll('button');
  var userName = document.getElementById('user-name');
  messageContainer.classList.add('hide');

  messageForm.addEventListener('submit', function (e) {
    var message = document.getElementById('message');
    e.preventDefault();
    socket.emit('send message', message.value);
    message.value = '';
  });

  userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var userNameValue = userName.value;
    console.log(userNameValue);
    socket.emit('new user', userNameValue, function (data) {
    // Looping over buttons to get value and add them to message that has the same user id that picked it

    // ColoredButtons.forEach(function (button) {
    //     button.addEventListener('click',function (e){
    //       console.log(button.value);
    //       // var userName = userName.value;
    //       var buttonValue = button.value;
    //       // console.log({userName:buttonValue});
    //     });
    // });

      if (data) {
        userContainer.classList.add('hide');
        messageContainer.classList.remove('hide');
      }
    });

    userName.value = '';
  });

  function saveConnection(conncetionId) {
    console.log(conncetionId);
    var id = conncetionId;

    return id;
  }

  var demoId = {};

  var test = [];
  socket.on('user connectionId', function () {
    var connectionId = this.id;

    var dd = saveConnection(connectionId);

    demoId.id = connectionId;
    test.push(dd);
  });
  socket.on('new message', function (data) {
    var chatMessage = document.createElement('div');
    chatMessage.classList.add('user-message');

    chatMessage.innerHTML = `<p class="${data.id} message"><strong>${data.user}:</strong> ${data.msg}</p>`;

    var chat = document.getElementById('chat');
    chat.appendChild(chatMessage);

    var messageColor = [].slice.call(document.querySelectorAll('.user-message p'));

    function colors(messages) {
      console.log(messages.classList[0]);

      if (demoId.id === messages.classList[0]) {
        messages.parentNode.style.cssText = 'justify-content: flex-end; ';

        messages.style.cssText = 'background-color:#00B2A3; align-self: flex-end;  margin: 0.3rem;';
        return true;
      }
      messages.style.cssText = 'background-color:#FF6419; margin-top: 0.5rem;';

      return false;
    }
    messageColor.filter(colors);
  });

  socket.on('get users', function (data) {
    var i;
    var html = '';

    for (i = 0; i < data.user.length; i++) {
      html += `<li> ${data.user[i]} </li>`;
    }

    userList.innerHTML = html;
  });
})();

