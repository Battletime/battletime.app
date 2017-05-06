var app = angular.module('battletime-app');

app.controller('signupCtrl', function($scope, authService, $state, $ionicLoading){

  
    $scope.signup = {};
    $scope.login = {
        username: authService.getLastUsedUsername()
    };

    $scope.page = 'start';

    $scope.sendSignup = function(){
        $ionicLoading.show();
        authService.Signup($scope.signup).then(
        (user) => {
            $ionicLoading.hide();
             $state.go('app.portal');
            //empty password fiels
            $scope.signup.password = null;
            $scope.signup.repeat = null; 
        }, 
        (response) => {
            $ionicLoading.hide();
            $scope.signup.errors = response.errors
            //empty password fiels
            $scope.signup.password = null;
            $scope.signup.repeat = null; 
        });
    }

    $scope.sendLogin = function(){
        $ionicLoading.show();
        authService.Login($scope.login).then(
        (user) => {
            $ionicLoading.hide();
            $state.go('app.portal');
        }, 
        (response) => {
            $ionicLoading.hide();
            $scope.login.errors = response.errors
        });

    }

});