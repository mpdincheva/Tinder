app.controller("accountController", function ($scope, $http) {
    $scope.uploadFile = function (elem) {
        var file = elem.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function (event) {
            $scope.$apply(function () {
                $scope.file = file;
                $scope.imageUrl = reader.result;
                $scope.imgUploated = true;
            });
        });
        reader.readAsDataURL(file);
    }

    // $http.post("http://localhost:3000/upload", fd, {
    //     transformRequest: angular.identity,
    //     headers: {
    //         'Content-Type': undefined
    //     },
    //     enctype: 'multipart/form-data'
    // })
    //     .success(function () {
    //         console.log("success");
    //     })
    //     .error(function () {
    //         console.log("fail");
    //     });
    //     $scope.$apply(function () {
    //         $scope.imgUploated = true;
    //         console.log($scope.file);
    //         // $scope.img = $scope.file;
    //         // console.log($scope.img);
    //     })
});