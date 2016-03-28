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
      $scope.registration_modal.show();
    };
    // Perform the login action when the user submits the login form
    $scope.doLogin = function (userLogin) {
      LoginService.loginUser(userLogin)
      .then(function (data) {
          //log in successfull
          $scope.closeLoginModal();
      }, function (data) {
          //log in failed
      });
    };
    // Perform the registration action when the user submits the registration form
    $scope.doRegistration = function (userData) {
      if($scope.CheckInputs() == true) {
        RegistrationService.registerUser(userData)
        .then(function (data) {
            //log in successfull
            $scope.closeRegistrationModal();
        }, function (data) {
            //log in failed
        });
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
    };

    $scope.CheckInputs = function() {
      //Über die DOM-Methode document.getElementById wird der Wert aus dem Eingabefeld geholt
      //und der Variablen val zugewiesen.
      var passwd1val = document.getElementById('password').value;
      var passwd2val = document.getElementById('password2').value;
      var password = document.getElementById('password');
      var password2 = document.getElementById('password2');
      var emailval = document.getElementById('email').value;
      var email = document.getElementById('email');

      //Ab hier beginnt die Prüfung.
      //Das Passwort ist entweder zu kurz, unsicher, sicher oder sehr sicher
      if(passwd1val.length > 6 && passwd1val.match(/[a-z]/) && passwd1val.match(/[A-Z]/) && passwd1val.match(/.[,!,@,#,$,%,^,&,*,?,_,~,-,(,)]/) && passwd1val.match(/[0-9]/)){
        password.style.color="#428c0d";
        if(password.value == password2.value){
          password2.style.color="#428c0d";
          if(emailval.match(/[@]/) && emailval.match(/[.]/)){
            email.style.color = "#428c0d";
            return true;
          }else{
            email.style.color = "red";
            return false;
          }
        }else{
          password2.style.color="red";
          if(emailval.match(/[@]/) && emailval.match(/[.]/)){
            email.style.color = "#428c0d";
          }else{
            email.style.color = "red";
          }
          return false;
        }
      }else{
        password.style.color="red";
        if(password.value == password2.value){
          password2.style.color="#428c0d";
        }else{
          password2.style.color="red";
        }
        if(emailval.match(/[@]/) && emailval.match(/[.]/)){
          email.style.color = "#428c0d";
        }else{
          email.style.color = "red";
        }
        return false;
      }

    };
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
                      } else if(response.data.error.code === "001") {
                        console.log("Emailaddress or username in use");
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
