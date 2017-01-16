(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddDocCommentModalController', AddDocCommentModalController)
        .controller('DocumentsController', Controller);

    function Controller(UserService, DocumentService, $rootScope, $uibModal) {
        var vm = this;

        vm.documents = [];
        vm.modalOpen = false;

        initController();

        function initController() {
            DocumentService.GetAll().then(function (documents) {
                vm.documents = documents;
            });
        }

        vm.accept = function(documentId) {
            vm.documents[documentId].status = 'success';
        }

        vm.reject = function(documentId) {
            vm.documents[documentId].status = 'fail';
        }       

        vm.addComment = function(documentId) {
            if(vm.modalOpen) return;

            var modalInstance = $uibModal.open({
                templateUrl: 'partials/addDocCommentModal.html',
                animation: true,
                controller: 'AddDocCommentModalController',
                controllerAs: 'vm',
                resolve: {
                    selectedDocument: function () {
                        return vm.documents[documentId];
                    }
                }
            });

            vm.modalOpen = true;

            modalInstance.result.then(function (result) {
                vm.modalOpen = false;
            }, function () {
                vm.modalOpen = false;
            });
        };
    }

    function AddDocCommentModalController($uibModalInstance, selectedDocument) {
        var vm = this;

        vm.selectedDocument = selectedDocument;
        vm.message = '';

        vm.submit = function () {
            $uibModalInstance.close({selectedDocument: vm.selectedDocument, message: vm.message});
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }

})();