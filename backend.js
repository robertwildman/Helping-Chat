//This file will be the backend of the chat room
//It will be running on node js
var freerooms = [];
var takenrooms = [];
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;
console.log("Listening on port" + port);
server.listen(port);

// routing
app.set('views', './app');
app.set('view engine', 'jade');
app.use(express.static(__dirname +'/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
app.get('/chat', function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
// POST method route
app.post('/chat', function (req, res) {
  res.render('chat', { name: req.body.username });
});

//All socket.io infomation
io.sockets.on('connection', function (socket) {

	socket.on('newroom', function(username){
		//This is called when a user wants to join a new room
		//Setting up the values
		socket.username = username;

		//Checks the array to see if its empty
		if(freerooms.length = 0)
		{
			//No one is waiting
			socket.room = getrandomroom();
			freerooms.push(socket.room);
			socket.join('/'+socket.room);
			socket.emit('nouser');
		}
		else
		{
			//We have someone.
			socket.room = freerooms[0];
			freerooms.splice(0, 1);
			socket.join('/'+socket.room);
			takenrooms.push(socket.room);
			socket.broadcast.to(socket.room).emit('userjoined');
		}
	});
	socket.on('switchRoom', function(newroom,issue,roomstatus){
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// join new room, received as function parameter
		socket.join(newroom);
		socket.emit('helpingchatmessage', 'You have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('helpingchatmessage', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		if(roomstatus == false)
		{
			//This means that the user is alone in the room.
			socket.emit('helpingchatmessage', 'You are waiting for a user to join');
		}else{
			//This means the user is not alone in the room.
			socket.broadcast.to(socket.room).emit('helpingchatmessage', socket.username+' has joined this room');
			socket.broadcast.to(socket.room).emit('helpingchatmessage', 'Their issue is ' + issue);
			socket.broadcast.to(socket.room).emit('replytonewuser');
		}

	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// echo globally that this client has left
		socket.broadcast.to(socket.room).emit('helpingchatmessage', 'User has left.');
		socket.leave(socket.room);
		//Send a request to the server to delete the user from db
	});
});

function getrandomroom()
{
	var randomnumber = Math.floor(Math.random()*10000000);
	if(takenrooms.indexOf(randomnumber) > -1 ))
	{
		return getrandomroom();
	}
	else
	{
		return randomnumber;
	}
}