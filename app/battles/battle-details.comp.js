var app = angular.module('battletime-app');

app.controller('battleDetailsCtrl', function ($scope, $http, config, $stateParams) {

    $scope.battleId;

    function init(){
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

    init();
});