angular.module('hebercampos').controller('homeController', function($scope, about, singles, discography) {
    $scope.about = about;
    $scope.data = discography;
    $scope.seeSingles = false;

    $scope.toggleContainers = function(status) {
        $scope.seeSingles = status;
        if (status) {
            $scope.data = singles;
        } else {
            $scope.data = discography;
        }
    };
});