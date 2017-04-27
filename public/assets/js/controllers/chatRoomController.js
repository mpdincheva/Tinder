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
    $rootScope.socket.emit('new-msg', { fromUser: $scope.currentUser._id, toUser: $rootScope.friendId, msg: message });
    $('#new-message').val('');
  })

  // socket.on('new-msg', function (msg) {
  //   console.log("Az sum klienta i poluchavam suobshtenieto!")
  //   $('#messages-area').append($('<li>').text(msg));
  // });


});
