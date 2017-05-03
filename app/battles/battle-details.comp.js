var app = angular.module('battletime-app');

app.controller('battleDetailsCtrl', function ($scope,authService, $http, config, $stateParams) {

    $scope.battleId;
    $scope.myVote = {

    }
  

    function init(){
        $scope.auth = authService;
        $scope.battleId = $stateParams.battleId;
        $scope.getBattle();
    }

    $scope.getBattle = function(){
        $http.get(config.apiRoot + '/battles/' + $scope.battleId)
            .then((response) => {
                $scope.battle = response.data;
                $scope.$broadcast('scroll.refreshComplete');
            })
    }

    $scope.vote = function(){
        debugger;
        $scope.battle.myVote = {
            user: $scope.selectedUser
        }
    }

    init();
});