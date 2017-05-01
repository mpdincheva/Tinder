app.controller("chatRoomController", function ($scope, $http, $window, $rootScope) {
  $("#markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");

  window.onresize = function (event) {
    $("#markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");
  }


  // objDiv.scrollTop = objDiv.scrollHeight;



  $scope.friendIsTyping = false;
  $rootScope.$on('friendUpdated', function () {
    $scope.user = $rootScope.friend;

    // Emit event for seeing messages
    socket.emit('seenAllMessages', { fromUser: $scope.currentUser, toUser: $scope.user });

    socket.on('allMessagesAreSeen', function (fromUser) {
      console.log("Receive that all my messages was seen")
      if ($scope.currentUser._id == fromUser._id) {
        if ($('.seenMessage').length == 0) {
          $('#message-container')
            .append($('<span>')
              .text('Видяно').addClass('seenMessage'))
        }
      }
    })



    // Sending new message
    $('#sendMessage').click(function (event) {
      event.preventDefault();
      var message = $('#new-message').val()
      if (message !== "") {
        console.log("The message that i send lokks like: ");
        console.log(message);
        socket.emit('new-msg', { fromUser: $scope.currentUser, toUser: $rootScope.friend, msg: message });
        $('#new-message').val('');
      }
    })



    // Receiving typing notification
    socket.on('sendTypingNotification', function (typingUser) {
      socket.emit('seenAllMessages', { fromUser: $scope.currentUser, toUser: $scope.user });

      console.log("This user is typing you message: ");
      console.log(typingUser);
      if (typingUser._id == $scope.user._id) {
        console.log("The users are equal..");
        if ($('.typing').length == 0) {
          $('#message-container')
            .append($('<span>').text('Потребителя пише съобщение').addClass('typing'));
          var chatBox = document.getElementById('message-container')
          chatBox.scrollTop = chatBox.scrollHeight;

          setTimeout(function () {
            $('.typing').remove();
          }, 2000)

        }
        setInterval(function () {
          $('.typing').fadeIn(300);
          $('.typing').fadeOut(300);
        }, 500)

      }
    })






    // $http.get('')
  });

  // $rootScope.$on('showme', function () {
  // $scope.showme = true;
  //   // $http.get('')
  // });
  // Styling more info container---->
  $("#markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");

  $("#message-container").css("height", ($window.innerHeight * 64 / 100) + "px");
  //var socket = io();
  console.log("From chat controller");
  console.log($scope.currentUser);




  // Receiving new message
  socket.on('new-msg', function (info) {
    // info is message object. Contains fromUserId and current message
    console.log("Message that I receive from the server are:")
    console.log(info);

    if (info.fromUserId == $scope.currentUser._id) {
      // This message was sent from me
      console.log("This message was sent from me.");
      if ($('.seenMessage').length >= 1) {
        $('.seenMessage').remove();
      }
      $('#message-container')
        .append($('<li>').addClass("message-from-me")
          .append($('<li>').addClass("text-message")
            .append($('<span>').text(info.message)))
          .append($('<li>').addClass("img-box")
            .append($('<img>').attr("src", $scope.currentUser.profilePicture))));

      // Scroll to btoom of the chat box
      var chatBox = document.getElementById('message-container')
      chatBox.scrollTop = chatBox.scrollHeight;

    } else if (info.fromUserId == $scope.user._id) {
      // This message was send from friend
      // Must set different style here
      console.log("This message was sent from my friend");

      if ($('.seenMessage').length >= 1) {
        $('.seenMessage').remove();
      }

      $('#message-container')
        .append($('<li>').addClass("message-from-friend")

          .append($('<li>').addClass("text-message")
            .append($('<img>').attr("src", $scope.friend.profilePicture)))
          .append($('<li>').addClass("img-box")
            .append($('<span>').text(info.message))));

      // Scroll to btoom of the chat box
      var chatBox = document.getElementById('message-container')
      chatBox.scrollTop = chatBox.scrollHeight;
      // $('#message-container').scrollTop = $('#message-container').scrollHeight;
    }
  });

  // Sending typing notification
  $('#new-message').on('input', function () {
    setTimeout(function () {
      socket.emit('sendTypingNotification', { fromUser: $scope.user._id, toUser: $scope.currentUser })
    }, 200);
  })






  // socket.on('updateOnlineUsers', function (data) {
  //   console.log("From the client. All online users are:");
  //   console.log(data);
  // })

  console.log("In chat room controller");
  console.log(socket);




  // When somebody came online
  socket.on('onlineFriend', function (user) {
    console.log("Somebody just came online:");
    console.log(user);
  });


})




//   socket.on('offlineFriend', function(user) {
//   console.log("Somebody exit the site:");
//   console.log(user);
// })
