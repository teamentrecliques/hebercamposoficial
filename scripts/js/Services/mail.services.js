angular.module('hebercampos').factory('mailServces', function($http, external) {
    let sendMail = function(mailData) {
        return $http.post(external.mailService, mailData);
    };
});