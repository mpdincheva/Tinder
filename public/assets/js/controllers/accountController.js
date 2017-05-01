app.controller("accountController", function ($scope, $http, $location, $rootScope, $window) {
    $http({
        method: "GET",
        url: "/getInterests",
    }).then(function (response) {
        $scope.interests = response.data;
        $scope.$apply();
    });

    if ($location.$$path == "/home") {
        console.log("In home");
        $scope.user = JSON.parse($window.localStorage.getItem("currentUser"));
        $scope.user["age"] = parseInt($scope.user["age"]);
        $scope.regUser = true;
        $scope.showCancelButton = true;
        $scope.cancel = function () {
            $(".modal-backdrop").remove();
            $rootScope.showSettings = false;
            $rootScope.$broadcast('showSettings');
        };
        console.log($scope.user);

    } else {
        console.log("In /account");
        $scope.user = {
            profilePicture: 'assets/images/profilePhotos/default.svg'
        }
    }

    $scope.uploadFile = function (event) {
        var file = document.getElementById("file").files[0];

        var reader = new FileReader();

        reader.addEventListener("load", function (event) {
            $scope.$apply(function () {
                $scope.file = file;
                $scope.user["profilePicture"] = reader.result;
            });
        });
        reader.readAsDataURL(file);
    };

    $scope.saveAccountSettings = function () {
        var formData = new FormData();
        var file = document.getElementById("file").files[0];

        for (prop in $scope.user) {
            console.log(prop)
            console.log($scope.user[prop]);
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
            $window.localStorage.setItem('currentUser', JSON.stringify(response.data));

            socket = io.connect('http://localhost:3000');
            socket.emit('updateSocket', { user: response.data });
            $(".modal-backdrop").remove();
            if ($location.$$path == "/account") {
                $location.path("/home");
            } else {
                $rootScope.showSettings = false;
                $rootScope.$broadcast('showSettings');
                $rootScope.$broadcast('userUpdated');
            }
        });
    };

});
