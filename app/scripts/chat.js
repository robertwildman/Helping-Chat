//This is the main css for the chat.html

  //var socket = io.connect('https://helpingchat.herokuapp.com:8080');
  var socket = io.connect('localhost:8080');
  // on connection to server, ask for user's name with an anonymous callback
  socket.on('connect', function(){
    // call the server-side function 'adduser' and send one parameter (value of prompt)
     socket.emit('newuser');;
  });
   socket.on('replytonewuser', function(){
    //When a user joins a chat a need to reply
    socket.emit('replynewuser', $('#issue').text());
  });
  // listener, whenever the server emits 'updatechat', this updates the chat body
  socket.on('updatechat', function (username, data) {
     $('<li></li>').html(username + ": " + data).appendTo('#chat');
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
    });
  function switchRoom(room){
    socket.emit('switchRoom', room);
  }
  $(document).ready(function() {
 	var username = $("#username").html();

});