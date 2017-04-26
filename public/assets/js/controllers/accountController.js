app.controller("accountController", function ($scope, $http, $location) {
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
            $location.path("/home");
        });
    };
});
