app.controller("accountController", function ($scope, $http, $location, $window) {
    $scope.uploadFile = function (event) {
        var file = document.getElementById("file").files[0];

        var reader = new FileReader();

        reader.addEventListener("load", function (event) {
            $scope.$apply(function () {
                $scope.file = file;
                $scope.image.filename = reader.result;
            });
        });
        reader.readAsDataURL(file);
    };

    $scope.saveAccountSettings = function () {
        var formData = new FormData();
        var file = document.getElementById("file").files[0];

        for (prop in $scope.user) {
            formData.append(prop, $scope.user[prop]);
        }

        formData.append("image", file);

        $http.post("http://localhost:3000/updateAccountInfo", formData, {
            transformRequest: angular.identify,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            console.log("In account controller. Response is:");
            console.log(response); 
            window.localStorage.setItem('currentUser', JSON.stringify(response.data));

            socket = io.connect('http://localhost:3000');
            socket.emit('updateSocket', { user: response.data });
            $location.path("/home");
        });
    };
});
