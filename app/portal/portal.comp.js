var app = angular.module('battletime-app');

app.controller('portalCtrl', function ($scope, $ionicModal, $ionicPopover, $http, $state, $timeout, authService, config) {


    $scope.battles;

    function init(){
        $scope.auth = authService;
        if(authService.user){
            $scope.getMyBattles();
        }
    }

    $scope.getMyBattles = function(){
        $http.get(config.apiRoot + '/users/' + $scope.auth.user._id + '/battles')
            .then((response) => {
                $scope.battles = response.data;
                $scope.$broadcast('scroll.refreshComplete');
            })
    }

    init();

});
   
