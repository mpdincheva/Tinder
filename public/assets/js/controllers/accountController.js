app.controller("accountController", function ($scope, $http) {
    console.log("Dsdsdsdsd");
    $scope.uploadFile = function () {
        console.log("Ddsd");
        $http.post("http://localhost:3000/upload");
    //     $scope.$apply(function () {
    //         $scope.imgUploated = true;
    //         console.log($scope.file);
    //         // $scope.img = $scope.file;
    //         // console.log($scope.img);
    //     })
    };
});