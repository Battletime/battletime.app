var app = angular.module('battletime-app');

app.controller('battleDetailsCtrl', function ($scope,authService, $http, config, $stateParams, $ionicLoading, onError) {

    $scope.battleId;
    $scope.auth;
  
    function init(){
        $scope.auth = authService;
        $scope.battleId = $stateParams.battleId;
        $scope.getBattle();
    }

    $scope.getBattle = function(){
        $ionicLoading.show();
        $http.get(config.apiRoot + '/battles/' + $scope.battleId)
            .then((response) => {
                $scope.battle = response.data;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            }, onError)       
    }

    $scope.canVote = function(){
        if($scope.battle){
            var canVote = true;
            $scope.battle.votes.forEach((vote) => {
                if(vote.byUserId == authService.user._id){
                    canVote = false;
                }
            }); 
            return canVote;
        }
       
    }

    $scope.vote = function(selectedUser){
        $ionicLoading.show();
        var vote = {
            byUserId: authService.user._id,
            forUserId: selectedUser._id
        };

        $http.post(config.apiRoot + '/battles/' + $scope.battleId + '/votes', vote)
            .then((response) => {
                $scope.battle = response.data;
                $ionicLoading.hide();
            }, onError)  
    }

    init();
});