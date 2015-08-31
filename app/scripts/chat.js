//This is the main css for the chat.html

  //var socket = io.connect('https://helpingchat.herokuapp.com:8080');
  var socket = io.connect('localhost:8080');
  //On connect it will start trying to set up a room for the user.
  socket.on('connect', function(){
    //This call the useruser function to work out if the user needs to wait for a room or
    //if a room will be free for the user.
    socket.emit('newuser');
  });
  //This is called when a user has left the room
  socket.on('userleft', function(){
    //This is display the user has left div
    $('#chat').addClass('hide');
    $('#prechat').addClass('hide');
    $('#afterchat').removeClass('hide');
  });
  //Used to display a message
  socket.on('message', function(data){
    //This will display a message from the other user and display it to the left of the chat screen.
     $('<li></li>').html(data).appendTo('#chat');
     //Makes sure the scroll keeps working.
     document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  });
  //Tell user about room being empty
  socket.on('roomempty', function(){
    //This will display a div to let the user know that they are still wanting for a user to join them.
    $('#chat').addClass('hide');
    $('#prechat').removeClass('hide');
    $('#afterchat').addClass('hide');
  });
  //Used when a new user joins the room so that the chat can be displayed
  socket.on('userjoin', function(){
    //This is start the whole chat up and will send the username to the other user.
    //1. Display the chat screen to the user.
    $('#chat').removeClass('hide');
    $('#prechat').addClass('hide');
    $('#afterchat').addClass('hide');
    //2. Send the username to another user
    var username = $('#username').text();
    var stringmessage = username + " has joined the room.";
    socket.emit('sendsystemmessage', stringmessage);

  });
  //Used for when the server wants to display to the user
  socket.on('systemmessage', function(message){
    //Will display the server message to the user.
    //Server messages are place in the middle of the chat.
    $('<li></li>').html(data).appendTo('#chat');
     //Makes sure the scroll keeps working.
     document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  });


  $(document).ready(function() {
 	var username = $("#username").html();

$('#messagetextbox').keypress(function(e) {
      if(e.which == 13) {
        $(this).blur();
        socket.emit('sendmessage',message);
        $(this).val('');
        $(this).focus();
      }
    });

});