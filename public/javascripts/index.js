( function() {
  var socket = io.connect();
  var messageForm = document.getElementById( 'message-form' );
  var userForm = document.getElementById( 'user-form' );
  var messageContainer = document.getElementsByClassName( 'message-container' )[ 0 ];
  var userContainer = document.getElementsByClassName( 'user-container' )[ 0 ];
  var userList = document.getElementById('user-list');

  messageContainer.classList.add( 'hide' );

  messageForm.addEventListener( 'submit', function( e ) {
    var message = document.getElementById( 'message' );
    e.preventDefault();
    socket.emit( 'send message', message.value );
    message.value = '';
  } );

  userForm.addEventListener( 'submit', function( e ) {
    e.preventDefault();
    var userName = document.getElementById( 'user-name' );
    socket.emit( 'new user', userName.value, function (data) {
      console.log(userName.value);

      if(data){
         userContainer.classList.add( 'hide' );
         messageContainer.classList.remove( 'hide' );

      }
    } );

    userName.value = '';
  } );

  socket.on( 'new message', function( data ) {

    var chatMessage = document.createElement( 'div' );
    chatMessage.classList.add( 'user-message' );
    chatMessage.innerHTML = `<p class="user-list"><strong>${data.user}:</strong> ${data.msg}<p>`;
    var chat = document.getElementById( 'chat' );
    chat.appendChild( chatMessage );
  });

   socket.on('get users', function( data ) {
    console.log(data, 'data');
    var i;
    var html = '';


    for ( i = 0; i < data.length; i++) {
     html+= `<li class="user-list">${data[i]}<li>`;

    }

     userList.innerHTML = html;
   });
}() );
