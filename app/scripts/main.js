//This is the main css for the index.html
  var socket = io.connect(window.location.hostname);
  //var socket = io.connect('localhost:8080');
  //On connect it will start trying to set up a room for the user.
  socket.on('connect', function(){
	//Called when first gets contection to server
  });
  //This is called when a user has left the room
  socket.on('userleft', function(){
    //This is display the user has left div
    $('.chatfooter').fadeOut();
    $('#chat').fadeOut('slow', function() {
    	$('#afterchat').fadeIn();
    });
    $('#prechat').hide();
  });
  //Used to display a message
  socket.on('message', function(data){
    //This will display a message from the other user and display it to the left of the chat screen.
     var username = $('#username').text();
     $.titleAlert("New chat message!", {
	    requireBlur:false,
	    stopOnFocus:true,
	    duration:4000,
	    interval:700
	});
     $('<li class = "bubble them"></li>').html(data).appendTo('#chat');
     //Makes sure the scroll keeps working.
     document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  });
  //Tell user about room being empty
  socket.on('roomempty', function(){
    //This will display a div to let the user know that they are still wanting for a user to join them.
    console.log('room empty');
    $('#chat').hide();
    $('.chatfooter').hide();
    $('#prechat').show();
    $('#afterchat').hide();
  });
  //Used when a new user joins the room so that the chat can be displayed
  socket.on('userjoin', function(){
    //This is start the whole chat up and will send the username to the other user.
    //1. Display the chat screen to the user
    console.log('user joining');
    $('#prechat').fadeOut('slow', function() {
    	$('#chat').fadeIn();
    	$('.chatfooter').fadeIn();
    });
    $('#afterchat').hide();
    //2. Send the username to another user
    var username = $('#username').text();
    var stringmessage = username + " has joined the room.";
    socket.emit('sendsystemmessage', stringmessage);

  });
  //Used for when the server wants to display to the user
  socket.on('systemmessage', function(message){
    //Will display the server message to the user.
    //Server messages are place in the middle of the chat.
    $('<li class="helpbubble"></li>').html(message).appendTo('#chat');
     //Makes sure the scroll keeps working.
     document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  });


  $(document).ready(function() {
	$('#prechat').hide();
    $('#chat').show();
    $('.chatfooter').show();
    $('#afterchat').hide();

 	$('#startchatbutton').click(function(event) {
		//Will now display post infomation to the server
		socket.emit('newuser',$('#usernameinput').val());
		$('.indexcontainer').fadeOut(function(){
		$('.chatcontainer').fadeIn(); });
		$('#username').html($('#usernameinput').val());

	});
	$('#resetchatbutton').click(function(event) {
		//Will now display post infomation to the server
		$('#chat').fadeIn();
    	$('.chatfooter').fadeIn();
		$('#chat').empty();
	    $('#prechat').hide();
	    $('#afterchat').hide();
		socket.emit('newuser',$('#usernameinput').val());
	});
	$('#endchatbutton').click(function(event) {
		//Will now display post infomation to the server
		socket.emit('userleaving');
    $('.chatfooter').fadeOut();
	$('#chat').fadeOut('slow', function() {
    	$('#afterchat').fadeIn();
    });
    $('#prechat').hide();
	});


$('#messagetextbox').keypress(function(e) {
      if(e.which == 13) {
        $(this).blur();
        var message = $(this).val();
        socket.emit('sendmessage',message);
        $('<li class="bubble user"></li>').html(message).appendTo('#chat');
     	//Makes sure the scroll keeps working.
     	document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
        $(this).val('');
        $(this).focus();
      }
    });

});



