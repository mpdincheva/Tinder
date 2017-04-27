if (document.cookie) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getAllInfoForMe', false);
    xhr.send(null);
    console.log("Make synchronous ajax here....");
    console.log(xhr.response);
    window.localStorage.setItem('currentUser', xhr.response);
    // Socket events--->
    var socket = io.connect('http://localhost:3000');
    socket.emit('updateSocket', { userId: JSON.parse($window.localStorage.getItem("currentUser")) });
    var socket = io.connect('http://localhost:3000');
    $rootScope.socket = socket;
    // Send user on socket ------->
    socket.emit('updateSocket', { userId: JSON.parse($window.localStorage.getItem("currentUser")) });

}