if (document.cookie) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getAllInfoForMe', false);
    xhr.send(null);
    var currentUser = JSON.parse(xhr.response)
    window.localStorage.setItem('currentUser', xhr.response);

    // Socket events--->
    console.log("Create new socket");
    var socket = io.connect('http://localhost:3000');
    socket.emit('updateSocket', { user: currentUser });
    console.log(socket);
    console.log("end");
    // $rootScope.socket = socket;
}


