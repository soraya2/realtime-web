io.sockets.on('connection', function(socket) {

    socket.on('room', function(room) {

        socket.join(room, function() {
            console.log(room + " now in rooms ", socket.rooms);

            socket.nsp.to(room).emit('message', 'what is going on, party people?' + room);
            // socket.in(room).emit('message', 'what is going on, party people?' + room);
            console.log(usernames[0]);

            promises(usernames[0], callback);

            function callback(socketPromise) {


                socket.nsp.to(room).emit('message', 'what is going on, party people?' + username);

            }

        });


        var usernameIndex = usernames.indexOf(room);

        if (usernameIndex === -1) {
            usernames.push(room);

        }

        console.log(usernames);

        // io.sockets.in('room').emit('message', 'bar');
    });

    socket.on('reset', function(reset) {
        // reser.data
        number = 0;

    });


    socket.on('disconnect', function(data) {
        delete users[socket.userId];

        // socket.leave(room, function() {
        //     console.log(room + " now in rooms ", socket.rooms);
        // });
    });
});



function promises(promiseObject, cb) {

    var promise = new Promise(function(resolve) {

        if (promiseObject) {
            resolve(promiseObject);
        }
    });

    promise.then(function(result) {
        console.log('promise result');
        // console.log(result);

        cb(result);

    }, function(err) {
        console.log(err); // Error: "It broke"
    });
}
