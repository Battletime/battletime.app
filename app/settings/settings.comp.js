var app = angular.module('battletime-app');

app.controller('settingsCtrl', function ($scope, $ionicModal, $ionicPopover, $http, $state, $timeout, authService, config) {



    function init(){

    }

    $scope.logout = function(){
        authService.Logout();
        $state.go('login');
    }

    init();

});
   
