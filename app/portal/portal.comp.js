var app = angular.module('battletime-app');

app.controller('portalCtrl', function ($scope, $ionicModal, $ionicPopover, $state, $timeout, authService) {

    $scope.auth = authService;

    $scope.logout = function(){
        authService.Logout();
        $state.go('login');
    }

});
   
