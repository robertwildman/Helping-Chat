//This file will be the backend of the chat room
//It will be running on node js
var freerooms = [];
var takenrooms = [];
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;
console.log("Listening on port " + process.env.PORT || 8080);
server.listen(process.env.PORT || 8080);

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

	//When user joins and wants a room.
	socket.on('newuser', function(username){
		//This is called when a user wants to join a new room
		//Setting up the values
		console.log('user called newuser');
		//Checks the array to see if its empty
		if(freerooms.length == 0)
		{
			//No one is waiting
			socket.room = getrandomroom();
			freerooms.push(socket.room);
			socket.join(socket.room);
			console.log('user is waiting in room: ' + socket.room);
			io.sockets.in(socket.room).emit('roomempty');
		}
		else
		{
			//We have someone.
			socket.room = freerooms[0];
			freerooms.splice(0, 1);
			socket.join(socket.room);
			takenrooms.push(socket.room);
			console.log('user has found someone in room: ' + socket.room);
			socket.broadcast.to(socket.room).emit('userjoin');
    		var stringmessage = username + " has joined the room.";
			socket.broadcast.to(socket.room).emit('systemmessage',stringmessage);
		}
	});
	//When the user is leaving a room.
	socket.on('userleaving', function(){
		//Tells old user that this user has left and then emits leaving function
		socket.broadcast.to(socket.room).emit('systemmessage', 'User has left.');
		socket.broadcast.to(socket.room).emit('userleft');
		socket.leave(socket.room);
		//Removes the room from the taken list.
		var index = takenrooms.indexOf(socket.room);
		if (index > -1) {
		    takenrooms.splice(index, 1);
		}
	});
	//When the user disconnects
	socket.on('disconnect', function(){
		//Tells old user that this user has left and then emits leaving function
		socket.broadcast.to(socket.room).emit('systemmessage', 'User has left.');
		socket.broadcast.to(socket.room).emit('userleft');
		socket.leave(socket.room);
		//Removes the room from the taken list.
		var index = takenrooms.indexOf(socket.room);
		if (index > -1) {
		    takenrooms.splice(index, 1);
		}
	});
	socket.on('sendsystemmessage', function(message)
	{
		socket.broadcast.to(socket.room).emit('systemmessage',message);
	});
	socket.on('sendmessage', function(message)
	{
		socket.broadcast.to(socket.room).emit('message',message);
	});



});

function getrandomroom()
{
	var randomnumber = Math.floor(Math.random()*10000000);
	if(takenrooms.indexOf(randomnumber) > -1 )
	{
		return getrandomroom();
	}
	else
	{
		return randomnumber;
	}
}