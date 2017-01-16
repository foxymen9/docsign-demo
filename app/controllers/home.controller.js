(function () {
    'use strict';

    angular
        .module('app')
        .controller('UpdateEmployeePropertyModalController', UpdateEmployeePropertyModalController)
        .controller('HomeController', Controller);

    function Controller(UserService, $rootScope, $uibModal) {
        var vm = this;

        vm.modalOpen = false;

        initController();

        function initController() {
        }

        vm.openModal = function (option) {
            if(vm.modalOpen) return;

            var modalInstance = $uibModal.open({
                templateUrl: 'partials/updateEmployeePropModal.html',
                animation: true,
                controller: 'UpdateEmployeePropertyModalController',
                controllerAs: 'vm',
                resolve: {
                    selectedOption: function () {
                        return option;
                    }
                }
            });

            vm.modalOpen = true;

            modalInstance.result.then(function (result) {
                console.log('Option changed', result.selectedOption, result.message);
                vm.modalOpen = false;
            }, function () {
                vm.modalOpen = false;
                console.log('modal-component dismissed');
            });
        };
    }

    function UpdateEmployeePropertyModalController($uibModalInstance, selectedOption) {
        var vm = this;

        vm.selectedOption = selectedOption;
        vm.message = '';

        vm.submit = function () {
            $uibModalInstance.close({selectedOption: vm.selectedOption, message: vm.message});
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
        
})();