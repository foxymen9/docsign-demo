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

    function run($http, $rootScope, $window, UserService, BankService, EmployeeService) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });

        $rootScope.searchEmployee = '';
        $rootScope.partialCompletedCollapsed = true;
        $rootScope.pendingCollapsed = true;
        $rootScope.completedCollapsed = true;
        $rootScope.rejectedCollapsed = true;

        $rootScope.employees = [];
        EmployeeService.GetAll().then(function (employees) {
            $rootScope.employees = employees;
            $rootScope.selectedEmployee = employees[0];
        });
        
        $rootScope.selectEmployee = function(employee) {
            $rootScope.selectedEmployee = employee;
        }

        $rootScope.filterPending = function(employee) {
            return filterEmployee(employee, "");
        }
        $rootScope.filterPartialCompleted = function(employee) {
            return filterEmployee(employee, "partial-completed");
        }
        $rootScope.filterCompleted = function(employee) {
            return filterEmployee(employee, "completed");
        }
        $rootScope.filterRejected = function(employee) {
            return filterEmployee(employee, "rejected");
        }

        var filterEmployee = function(employee, status) {
            return (employee.status.toLowerCase() == status && employee.name.indexOf($rootScope.searchEmployee) !== -1);
        }

        $rootScope.banks = [];
        BankService.GetAll().then(function (banks) {
            $rootScope.banks = banks;
            $rootScope.selectedBank = banks[0];
        });
        
        $rootScope.selectBank = function(bank) {
            $rootScope.selectedBank = bank;
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