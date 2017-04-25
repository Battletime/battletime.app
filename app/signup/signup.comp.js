var app = angular.module('battletime-app');

app.controller('signupCtrl', function($scope, authService, $state){

    $scope.first = true;
    $scope.signup = {};
    $scope.login = {};

    $scope.sendSignup = function(){
        authService.Signup($scope.signup).then(
        (user) => {
             $state.go('app.portal');
        }, 
        (response) => {
            $scope.signup.errors = response.errors
        });

        //empty password fiels
        $scope.signup.password = null;
        $scope.signup.repeat = null; 
        
    }

    $scope.sendLogin = function(){
        authService.Login($scope.login).then(
        (user) => {
            $state.go('app.portal');
        }, 
        (response) => {
            $scope.login.errors = response.errors
        });

    }

});