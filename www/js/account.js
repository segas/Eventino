angular.module('account', [])

.controller('AppCtrl', function ($scope, $state, $ionicModal, $timeout, LoginService, RegistrationService, AccountService) {

    // Form data for the login modal
    $scope.loginData = {};
    $scope.userData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('modals/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.login_modal = modal;
    });

    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('modals/registration.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.registration_modal = modal;
    });

    // Open the login modal
    $scope.openLoginModal = function() {
      $scope.login_modal.show();
    };
    // Open the registration modal
    $scope.openRegistrationModal = function() {
      $scope.closeRegistrationModal();
      $scope.registration_modal.show();
    };
    // Perform the login action when the user submits the login form
    $scope.doLogin = function (userLogin) {
      LoginService.loginUser(userLogin)
      .then(function (data) {
          //log in successfull
          //window.alert("Login funktioniert")
          $scope.closeLoginModal();
          //window.alert(data);
          //$scope.checkLogin();
      }, function (data) {
          //log in failed
      });
    };
    // Perform the registration action when the user submits the registration form
    $scope.doRegistration = function (userData) {
      if(userData.password == userData.password2) {
        RegistrationService.registerUser(userData)
        .then(function (data) {
            //log in successfull
            $scope.closeRegistrationModal();
        }, function (data) {
            //log in failed
        });
      }else {
        var ps = document.getElementById('password2');
        ps.style.color = 'red';
      }

    };
    // Triggered in the login modal to close it
    $scope.closeLoginModal = function() {
      $scope.login_modal.hide();
    };
    // Triggered in the registration modal to close it
    $scope.closeRegistrationModal = function() {
      $scope.registration_modal.hide();
    };
    // Perform a logoff
    $scope.logoff = function() {
      // Close a Login Session
      localStorage.removeItem('loginstate');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('age');
      localStorage.removeItem('sex');
    };
    // Check Login state
    $scope.CheckLoginState = function() {
      if(AccountService.CheckLoginState != true){
        $scope.openLoginModal();
      }
    }
  })

.service('LoginService', function ($q, $http) {
      return {
          loginUser: function (loginData) {
              var deferred = $q.defer(),
                  promise = deferred.promise;
              $http({
                  url: 'http://segas.ch/eventino/php/login.php',
                  method: "POST",
                  data: loginData,
                  headers: { 'Content-Type': 'application/json' }
              })
                  .then(function (response) {
                      if (response.data.error.code === "000") {
                          console.log("User login successful: " + JSON.stringify(response.data));
                          // Start a Login Session, to store the Account information
                          localStorage.setItem('loginstate', response.data.userData.correct);
                          localStorage.setItem('username', response.data.userData.username);
                          localStorage.setItem('email', response.data.userData.email);
                          localStorage.setItem('age', response.data.userData.age);
                          localStorage.setItem('sex', response.data.userData.sex);

                          deferred.resolve(response.data);
                      } else {
                          console.log("User login failed: " + JSON.stringify(response.data.error));
                          deferred.reject(response.data);
                      }
                  }, function (error) {
                      console.log("Server Error on login: " + JSON.stringify(error));
                      deferred.reject(error);
                  });

              promise.success = function (fn) {
                  promise.then(fn);
                  return promise;
              };
              promise.error = function (fn) {
                  promise.then(null, fn);
                  return promise;
              };
              return promise;
          },
      };
    })

.service('RegistrationService', function ($q, $http) {
      return {
          registerUser: function (userData) {
              var deferred = $q.defer(),
                  promise = deferred.promise;
              $http({
                  url: 'http://segas.ch/eventino/php/registration.php',
                  method: "POST",
                  data: userData,
                  headers: { 'Content-Type': 'application/json' }
              })
                  .then(function (response) {
                      if (response.data.error.code === "000") {
                          console.log("User registration successful: " + JSON.stringify(response.data));
                          // Start a Login Session, to store the Account information
                          localStorage.setItem('loginstate', response.data.userData.correct);
                          localStorage.setItem('username', response.data.userData.username);
                          localStorage.setItem('email', response.data.userData.email);
                          localStorage.setItem('age', response.data.userData.age);
                          localStorage.setItem('sex', response.data.userData.sex);

                          deferred.resolve(response.data);
                      } else {
                          console.log("User registration failed: " + JSON.stringify(response.data.error));
                          deferred.reject(response.data);
                      }
                      deferred.resolve(response.data);
                  }, function (error) {
                      console.log("Server Error on login: " + JSON.stringify(error));
                      deferred.reject(error);
                  });

              promise.success = function (fn) {
                  promise.then(fn);
                  return promise;
              };
              promise.error = function (fn) {
                  promise.then(null, fn);
                  return promise;
              };
              return promise;
          },
      };
    })

.service('AccountService', function ($q, $http) {
    return {
        CheckLoginState: function () {
          var active = false;
          if(localStorage.getItem('loginstate') == "true"){
            active = true;
          }else {
            active = false;
          }
          return active;
        },
    };
});
