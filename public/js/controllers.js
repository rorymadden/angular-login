'use strict';

/* Controllers */

//an app controller is useful for providing default - e.g. AppName, Page Titles?
// function AppCtrl($scope, $http) {
  // $http.get('/api/name')
  //   .success(function(data, status, headers, config) {
  //     $scope.name = data.name;
  //   })
  //   .error(function(data, status, headers, config) {
  //     $scope.name = 'Error!';
  //   });
// }

function RegisterCtrl($scope, $location, $http) {
  $scope.form = {};
  $scope.registerUser = function () {
    $http.post('/account/register', $scope.form)
      .success(function(data) {
        $location.path('/activationSent');
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.error.message;
      });
  };
  $scope.resendActivation = function () {
    $http.post('/account/resendActivation', $scope.form)
      .success(function(data) {
        $location.path('/activationResent');
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.error.message;
      });
  };
  // $scope.terms = function() {
  //   $http.get('/modals/terms')
  //     .success(function(data, status, headers, config) {
  //       $scope.data = data;
  //     });
  // };
}
// RegisterCtrl.$inject = [];

function LoginCtrl($scope, $location, $http) {
  $scope.form = {};
  $scope.loginUser = function () {
    $http.post('/account/login', $scope.form)
      .success(function(data) {
        $location.path('/');
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.error.message;
        console.log(data.error.message);
      });
  };
}
// RegisterCtrl.$inject = [];

function ModalCtrl($scope) {
   this.setModel = function(data) {
      $scope.$apply( function() {
         $scope.data = data;
      });
   };
   $scope.setModel = this.setModel;
}

// function IndexCtrl($scope, $http) {
//   $http.get('/api/posts').
//     success(function(data, status, headers, config) {
//       $scope.posts = data.posts;
//     });
// }

// function AddPostCtrl($scope, $http, $location) {
//   $scope.form = {};
//   $scope.submitPost = function () {
//     $http.post('/api/post', $scope.form).
//       success(function(data) {
//         $location.path('/');
//       });
//   };
// }

// function ReadPostCtrl($scope, $http, $routeParams) {
//   $http.get('/api/post/' + $routeParams.id).
//     success(function(data) {
//       $scope.post = data.post;
//     });
// }

// function EditPostCtrl($scope, $http, $location, $routeParams) {
//   $scope.form = {};
//   $http.get('/api/post/' + $routeParams.id).
//     success(function(data) {
//       $scope.form = data.post;
//     });

//   $scope.editPost = function () {
//     $http.put('/api/post/' + $routeParams.id, $scope.form).
//       success(function(data) {
//         $location.url('/readPost/' + $routeParams.id);
//       });
//   };
// }

// function DeletePostCtrl($scope, $http, $location, $routeParams) {
//   $http.get('/api/post/' + $routeParams.id).
//     success(function(data) {
//       $scope.post = data.post;
//     });

//   $scope.deletePost = function () {
//     $http.delete('/api/post/' + $routeParams.id).
//       success(function(data) {
//         $location.url('/');
//       });
//   };

//   $scope.home = function () {
//     $location.url('/');
//   };
// }