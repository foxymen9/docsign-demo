(function () {
    'use strict';

    angular
        .module('app')
        .controller('UpdateEmployeePropertyModalController', UpdateEmployeePropertyModalController)
        .controller('HomeController', Controller);

    function Controller(UserService, $rootScope, $uibModal) {
        var vm = this;

        vm.modalOpen = false;
        vm.employeeOptions = [];

        initController();

        function initController() {

            const options = [
                "Name as per passport",
                "Nationality",
                "Passport Number",
                "Passport Expiry",
                "Idbara No.",
                "Visa Number",
                "Visa Entry",
                "Country of Origin",
                "Date of Birth",
                "Mothers Maiden Name",
                "Marital Status",
                "Number of Dependants",
                "Education",
                "Personal reference in UAE",
                "Residence Building Name",
                "Residence Building Number",
                "Residence Street",
                "Residence Nearest Landmark",
                "Residence Emirate",
                "Home Tel No",
                "Mobile Number",
                "Company Name",
                "Designation",
                "Employed Since",
                "Company Building Name",
                "Company Building Number",
                "Company Street",
                "Company Nearest Landmark",
                "Company Emirate",
                "Company Phone Number",
                "PO Box Number",
                "email ID",
                "Trade Licence Number",
                "Trade licence issue date",
                "Trade licence expiry date",
                "Basic Salary",
                "Allowances",
                "Commission (Average)",
                "Accrued end of service benefits",
                "Other co.benefits - Car",
                "Other co.benefits - Childrens education",
                "Other co.benefits - House",
                "Other co.benefits - Bonus",
                "Other co.benefits - Medical Care",
                "Total Monthly Salary",
                "Bank with which the account number of the business along with account number",
                "Monthly Income of the Business",
                "Monthly expenses of the business",
                "Any Other Monthly Income",
                "ADCB Account type",
                "Account Number",
                "Credit Card Number if any",
                "Car Loan",
                "Other Loans if any",
                "Purpose of Loan",
                "Loan Amount",
                "Interest Rate",
                "No. of Instalments",
                "Loan start Date",
                "Mode of Payment",
                "Processing Fee",
                "Insurance Fee",
                "EMI / Month",
                "EMI End date"
            ];
            var employeeOptions = [];
            options.forEach(function(option) {
                var key = option.trim().replace(/[^a-zA-Z0-9]/g, "-").replace(/---/g, '-').replace(/--/g, '-').toLowerCase();

                if(option == "Name as per passport")
                    key = "name";
                
                employeeOptions.push({name: option, key: key});
            });
            vm.employeeOptions = employeeOptions;
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