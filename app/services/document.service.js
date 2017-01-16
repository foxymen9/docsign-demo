(function () {
    'use strict';

    angular
        .module('app')
        .factory('DocumentService', Service);

    function Service($http, $q) {
        var service = {};

        service.AddSignature = AddSignature;
        service.GetAll = GetAll;
        
        return service;

        function GetAll() {
            return $http.get('/api/documents').then(handleSuccess, handleError);
        }

        function AddSignature(signature) {
            return $http.post('/api/documents/signature', {signature: signature}).then(handleSuccess, handleError);
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
