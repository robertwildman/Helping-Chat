//This file will be the backend of the chat room
//It will be running on node js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;
console.log("Listening on port" + port);
server.listen(port);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});




//ALl socket.io infomation
io.sockets.on('connection', function (socket) {

	socket.on('newuser', function() {
		console.log('userjoined room');
		socket.room = '/public';
		socket.join('/public');
	});
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(roomaddress,username,issue,roomstatus){
	socket.room = roomaddress;
	socket.username = username;
	socket.issue = issue;
	socket.join(roomaddress);
	if(roomstatus == false){
		//This means that the user is alone in the room.
		socket.emit('helpingchatmessage','You are waiting for a user to join');
	}else{
		//This means the user is not alone in the room.
		socket.broadcast.to(socket.room).emit('helpingchatmessage', socket.username+' has joined this room');
		socket.broadcast.to(socket.room).emit('helpingchatmessage', 'Their issue is ' + issue);
		socket.broadcast.to(socket.room).emit('replytonewuser');
	}
});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		console.log('Message being sent');
		// we tell the client to execute 'updatechat' with 2 parameters
		socket.emit('updatechat', 'nothing', data);
	});
	socket.on('updatename', function(newname)
	{
		socket.username = newname;
	});
	socket.on('updateissue', function(newissue)
	{
		socket.issue = newissue;
	});
	socket.on('replynewuser', function(issue)
	{
		socket.broadcast.to(socket.room).emit('helpingchatmessage', socket.username + ' has joined this room');
		socket.broadcast.to(socket.room).emit('helpingchatmessage', 'Their issue is ' + issue);
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