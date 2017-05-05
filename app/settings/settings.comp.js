var app = angular.module('battletime-app');

app.controller('settingsCtrl', function ($scope,$state, $http, authService, $ionicLoading, $cordovaCamera, config, onError) {



    function init(){
        $scope.auth = authService;
    }

    $scope.logout = function(){
        authService.Logout();
        $state.go('login');
    }

    init();

});
   

  
