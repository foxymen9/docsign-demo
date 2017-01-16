(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ui.bootstrap', 'ngFileUpload', 'signature'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'views/account.html',
                controller: 'AccountController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('documents', {
                url: '/documents',
                templateUrl: 'views/documents.html',
                controller: 'DocumentsController',
                controllerAs: 'vm',
                data: { activeTab: 'documents' }
            })
            .state('signature', {
                url: '/signature',
                templateUrl: 'views/signature.html',
                controller: 'SignatureController',
                controllerAs: 'vm',
                data: { activeTab: 'signature' }
            });
    }

    function run($http, $rootScope, $window, UserService) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });

        let empoyeeOptions = {
            joinDate: new Date(),
            designation: '',
            department: '',
            address: '',
            permanentAddress: '',
            phoneNumber: '012-3456-7890',
            salary: '',
            number: 100000,
            loanType: '',
            loanAmount: ''
        };

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
            "Street",
            "Nearest Landmark",
            "Emirate",
            "Home Tel No",
            "Mobile Number",
            "Company Name",
            "Designation",
            "Employed Since",
            "Company Building Name",
            "Company Building Number",
            "Street",
            "Nearest Landmark",
            "Emirate",
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
        $rootScope.employeeOptions = options;

        const names = ["Srirama Murthy", "Lakshman Rao", "Bharat Hegde", "Shatrugna Singh", "Ghouse Basha", "Antony Gonsalves", "David Crowe", "Donald Duck"];

        $rootScope.searchEmployee = '';
        $rootScope.partialCompletedCollapsed = true;
        $rootScope.pendingCollapsed = true;
        $rootScope.completedCollapsed = true;
        $rootScope.rejectedCollapsed = true;

        $rootScope.employees = [];
        for(var i=1; i<9; i++) {
            $rootScope.employees.push(Object.assign({}, empoyeeOptions, {id: i, name: names[i-1], number: empoyeeOptions.number + i}));
        }
        $rootScope.selectedEmployee = $rootScope.employees[0];
        
        $rootScope.selectEmployee = function(employee) {
            $rootScope.selectedEmployee = employee;
            // $window.location = '/#';
        }

        $rootScope.filterPending = function(employee) {
            return filterEmployee(employee, 0);
        }
        $rootScope.filterPartialCompleted = function(employee) {
            return filterEmployee(employee, 1);
        }
        $rootScope.filterCompleted = function(employee) {
            return filterEmployee(employee, 2);
        }
        $rootScope.filterRejected = function(employee) {
            return filterEmployee(employee, 3);
        }

        var filterEmployee = function(employee, status) {
            return (employee.name.indexOf($rootScope.searchEmployee) !== -1 && employee.id % 4 == status);
        }

        $rootScope.banks = [
            { name: 'AAA Bank', logo: 'http://placehold.it/50/FFA534/fff?text=AAA+Bank', color: '#c64714' },
            { name: 'XYZ Bank', logo: 'http://placehold.it/50/9c27b0/fff?text=XYZ+Bank', color: '#9368E9' }
        ];
        $rootScope.selectedBank = $rootScope.banks[0];

        $rootScope.selectBank = function(bank) {
            $rootScope.selectedBank = bank;
            // $window.location = '/#';
        }

        $rootScope.currentUser = null;
        UserService.GetCurrent().then(function (user) {
            $rootScope.currentUser = user;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();