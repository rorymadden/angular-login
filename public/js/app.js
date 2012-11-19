'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'account/loginForm',
        controller: LoginCtrl
      })
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
      .otherwise({
        redirectTo: '/register'
      });
    $locationProvider.html5Mode(true);
  }]);