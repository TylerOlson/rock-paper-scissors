const PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(PORT, function() {
    console.log('socket.io:: Listening on port ' + PORT);
});

io.on('connection', function(socket){
    console.log("Client connected");

    socket.on('playTurn', function(text) {
        console.log("Got turn " + text)
    });

    socket.on('disconnect', function() {
        console.log("Client disconnected");
    });
});
