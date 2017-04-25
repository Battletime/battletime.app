var app = angular.module('battletime-app');

app.controller('eventsCtrl', function ($scope, $ionicModal, $ionicPopover, $state, $timeout, authService) {

    $scope.auth = authService;

    $scope.logout = function(){
        authService.Logout();
        $state.go('login');
    }

});
   
