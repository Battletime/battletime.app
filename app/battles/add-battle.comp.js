var app = angular.module('battletime-app');

app.controller('challengeCtrl', function ($scope, $ionicModal, $ionicPopover, $http, $state, $timeout, authService, config) {

    $scope.battles;
    $scope.users;
    $scope.newBattle = {
        participants: []
    };

    function init(){
        $scope.auth = authService;
        if(authService.user){
            $scope.getMyBattles();
            $scope.getUsers();
        }
    }

    $scope.getMyBattles = function(){
        $http.get(config.apiRoot + '/users/' + $scope.auth.user._id + '/battles')
            .then((response) => {
                $scope.battles = response.data;
                $scope.$broadcast('scroll.refreshComplete');
            })
    }

    $scope.getUsers = function(){
         $http.get(config.apiRoot + '/users')
            .then((response) => {
                $scope.users = response.data;
            }, onError);
    }

    function onError(response){
        console.log(response.data);
    }


    init();

});
   
