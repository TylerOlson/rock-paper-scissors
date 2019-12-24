const PORT = process.env.PORT || 3000;
var globals = require('./globals.js')
var match = require('./match.js')
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var queue = [];
var matches = [];

http.listen(PORT, function() {
    console.log('socket.io:: Listening on port ' + PORT);
});

io.on('connection', function(socket){
    console.log("Client connected " + socket.id);

    socket.on('joinQueue', function(name) {
        queue.push({
            "id": socket.id,
            "name": name
        });
        console.log("Client joined queue " + socket.id)
        io.emit("updateQueue", queue);
        if (queue.length % 2 == 0) {
            matches.push(new match.Match(queue[0], queue[1]));
            console.log("Created match with " + queue[0].id + " and " + queue[1].id);
            io.to(queue[0].id).emit("joinedMatch", queue[1]);
            io.to(queue[1].id).emit("joinedMatch", queue[0]);
            queue.splice(0, 2);
            console.log("Current queue: " + queue);
        }
    });

    socket.on('playTurn', function(text) {
        console.log("Got turn " + text + " from " + socket.id)
    });

    socket.on('disconnect', function() {
        console.log("Client disconnected " + socket.id);
        for(i = 0; i < queue.length; i++) {
            if (queue[i].id == socket.id) {
                queue.splice(i, 1);
            }
        }
    });
});
