app.controller("chatRoomController", function ($scope, $http, $window, $rootScope) {
 
  $("#message-container").css("height", ($window.innerHeight * 68 / 100) + "px");

  window.onresize = function (event) {
    $("#message-container").css("height", ($window.innerHeight * 68 / 100) + "px");
  }
  // objDiv.scrollTop = objDiv.scrollHeight;



  $scope.friendIsTyping = false;
  $rootScope.$on('friendUpdated', function () {
    $scope.user = $rootScope.friend;

    // Emit event for seeing messages
    socket.emit('seenAllMessages', { fromUser: $scope.currentUser, toUser: $scope.user });

    socket.on('allMessagesAreSeen', function (fromUser) {
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
        socket.emit('new-msg', { fromUser: $scope.currentUser, toUser: $rootScope.friend, msg: message });
        $('#new-message').val('');
      }
    })



    // Receiving typing notification
    socket.on('sendTypingNotification', function (typingUser) {
      socket.emit('seenAllMessages', { fromUser: $scope.currentUser, toUser: $scope.user });

      if (typingUser._id == $scope.user._id) {
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






  });


  // Styling more info container---->
  $(".markPerson").css("height", ($window.innerHeight * 70 / 100) + "px");

  $("#message-container").css("height", ($window.innerHeight * 64 / 100) + "px");



  // Receiving new message
  socket.on('new-msg', function (info) {
    // info is message object. Contains fromUserId and current message

    if (info.fromUserId == $scope.currentUser._id) {
      // This message was sent from me
      if ($('.seenMessage').length >= 1) {
        $('.seenMessage').remove();
      }
      $('#message-container')
        .append($('<li>').addClass("message-from-me")
            .append($('<span>').text(info.message))
            .append($('<img>').attr("src", $scope.currentUser.profilePicture)));

      // Scroll to btoom of the chat box
      var chatBox = document.getElementById('message-container')
      chatBox.scrollTop = chatBox.scrollHeight;

    } else if (info.fromUserId == $scope.user._id) {
      // This message was send from friend

      if ($('.seenMessage').length >= 1) {
        $('.seenMessage').remove();
      }

      $('#message-container')
        .append($('<li>').addClass("message-from-friend")
            .append($('<img>').attr("src", $scope.friend.profilePicture))
            .append($('<span>').text(info.message)));

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

  // When somebody came online
  // socket.on('onlineFriend', function (user) {
  //   console.log("Somebody just came online:");
  //   console.log(user);
  // });


})




//   socket.on('offlineFriend', function(user) {
//   console.log("Somebody exit the site:");
//   console.log(user);
// })
