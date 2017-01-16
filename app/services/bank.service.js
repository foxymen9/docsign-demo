(function () {
    'use strict';

    angular
        .module('app')
        .factory('BankService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetAll = GetAll;
        
        return service;

        function GetAll() {
            return $http.get('/api/banks').then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
