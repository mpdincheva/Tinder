app.controller("accountController", function ($scope, $http, $location, $rootScope, $window) {
    $http({
        method: "GET",
        url: "/getInterests",
    }).then(function (response) {
        $scope.interests = response.data;
        $scope.$apply();
    });

    if ($location.$$path == "/home") {
        $scope.user = JSON.parse($window.localStorage.getItem("currentUser"));
        $scope.user["age"] = parseInt($scope.user["age"]);
        var profilePicture = $scope.user["profilePicture"];
        $scope.showCancelButton = true;
        $scope.cancel = function ($event) {
            $event.preventDefault();
            $(".modal-backdrop").remove();
            $rootScope.showSettings = false;
            $rootScope.$broadcast('showSettings');
        };

    } else {
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
            if (Array.isArray($scope.user[prop])) {
                formData.append(prop, JSON.stringify($scope.user[prop]));
            } else if (typeof $scope.user[prop] == "object") {
                formData.append(prop, JSON.stringify($scope.user[prop]));
            } else {
                formData.append(prop, $scope.user[prop]);
            }
        }

        if($scope.user["profilePicture"] == null){
            formData.append("profilePicture", profilePicture);
        }
        
        formData.append("allInterests", JSON.stringify($scope.interests));
        formData.append("image", file);
        $http.post("/updateAccountInfo", formData, {
            transformRequest: angular.identify,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            $window.localStorage.setItem('currentUser', JSON.stringify(response.data));
            $rootScope.$broadcast('userUpdated');

            socket = io.connect('http://localhost:3000');
            socket.emit('updateSocket', { user: response.data });
            $(".modal-backdrop").remove();
            if ($location.$$path == "/account") {
                $location.path("/home");
            } else {
                $rootScope.showSettings = false;
                $rootScope.$broadcast('showSettings');
            }
        });
    };

});
