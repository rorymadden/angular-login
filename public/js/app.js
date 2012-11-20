'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      // registration routes
      .when('/register', {
        templateUrl: 'account/registerForm',
        controller: RegisterCtrl
      })
      .when('/terms', {
        templateUrl: 'modals/terms',
        controller: ModalCtrl
      })
      .when('/privacy', {
        templateUrl: 'modals/privacy',
        controller: ModalCtrl
      })
      .when('/activationSent', {
        templateUrl: 'account/registerSuccessMessage'
      })
      .when('/resendActivation', {
        templateUrl: 'account/resendActivationForm',
        controller: RegisterCtrl
      })
      .when('/activationResent', {
        templateUrl: 'account/activationResentMessage',
        controller: RegisterCtrl
      })
      .when('/activate/:activationKey', {
        templateUrl: 'account/activationResentMessage',
        controller: RegisterCtrl
      })

      // login routes
      .when('/login', {
        templateUrl: 'account/loginForm',
        controller: LoginCtrl
      })
      .otherwise({
        redirectTo: '/register'
      });
    $locationProvider.html5Mode(true);
  }]);