(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddSignatureModalController', AddSignatureModalController)
        .controller('SignatureController', Controller);

    function Controller(UserService, DocumentService, FlashService, $rootScope, $window, $uibModal) {
        var vm = this;

        vm.signatureUrl = '';
        vm.errors = [];

        initController();

        function initController() {
        }

        vm.upload = function(file) {
            console.log(file);
        }

        vm.submit = function() {
            var hasError = true;

            // if(!vm.comment) {
            //     FlashService.Error('Please input comment.');
            //     hasError = false;
            // }
            // else 
            if(vm.signatureUrl == '') {
                FlashService.Error('Please add signature.');
                hasError = false;
            }

            if(hasError) {
                DocumentService.AddSignature(vm.signatureUrl, $rootScope.selectedEmployee.name)
                .then(function (result) {
                    if(result) {
                        $window.open(result, "_blank");
                    }
                })
                .catch(function (error) {
                    console.error(error);
                    FlashService.Error("Failed to request.");
                });
            }

        }

        vm.openModal = function (option) {
            if(vm.modalOpen) return;

            var modalInstance = $uibModal.open({
                templateUrl: 'partials/addSignatureModal.html',
                animation: true,
                controller: 'AddSignatureModalController',
                controllerAs: 'vm',
                resolve: {
                    
                }
            });

            vm.modalOpen = true;

            modalInstance.result.then(function (signatureUrl) {
                vm.modalOpen = false;
                vm.signatureUrl = signatureUrl;
            }, function () {
                vm.modalOpen = false;
            });
        };
    }

    function AddSignatureModalController($uibModalInstance) {
        var vm = this;

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.done = function (signature) {
            if (signature.isEmpty) {
                $uibModalInstance.dismiss();
            } else {
                $uibModalInstance.close(signature.dataUrl);
            }
        };
    }

})();