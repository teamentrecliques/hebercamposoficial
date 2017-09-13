angular.module('hebercampos').config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/pages/home.html',
            controller: 'homeController'
        });
});