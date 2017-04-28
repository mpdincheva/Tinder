app.controller("chatRoomController", function ($scope, $http, $window, $rootScope) {

  $rootScope.$on('friendUpdated', function () {
    $scope.friendId = $rootScope.friendId;
    // $http.get('')
  });


  //var socket = io();
  console.log("From chat controller");
  console.log($scope.currentUser);




  $('#sendMessage').click(function (event) {
    event.preventDefault();
    var message = $('#new-message').val()
    socket.emit('new-msg', { fromUser: $scope.currentUser._id, toUser: $rootScope.friendId, msg: message });
    $('#new-message').val('');
  })

  // socket.on('updateOnlineUsers', function (data) {
  //   console.log("From the client. All online users are:");
  //   console.log(data);
  // })

  console.log("In chat room controlelr");
  console.log(socket);

  socket.on('new-msg', function (info) {
    // info is message object. Contains fromUserId and current message
    console.log(info);
    if (info.fromUserId == $scope.currentUser._id) {
      // This message was sent from me
      $('#messages-area').append($('<li>').text(info.message));
    } else {
      // This message was send from friend
      // Must set different style here
      $('#messages-area').append($('<li>').text(info.message));
    }
  });

  socket.on('onlineFriend', function (user) {
    console.log("Somebody just came online:");
    console.log(user);

  });
})
//   socket.on('offlineFriend', function(user) {
//   console.log("Somebody exit the site:");
//   console.log(user);
// })
