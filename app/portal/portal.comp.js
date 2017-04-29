var app = angular.module('battletime-app');

app.controller('portalCtrl', function ($scope, $ionicModal, $window, $ionicPopover, $http, $state, $timeout, authService, config) {

    $scope.messages = [
        "matje uitrollen",
        "schoentjes poetsen",
        "lijpe breakbeats zoeken",
        "rek & strek",
        "Bragge en boaste",
        "Uprocke",
    ]

    $scope.battles;
    var counter = 0;
    var timeoutId;

    function init(){
        $scope.auth = authService;
        if(authService.user){
            $scope.getMyBattles();
        }
    }
 
    $scope.getRandomBattle = function(){
        counter = 0;
        $scope.randomChallanger = null;
        $scope.loading = true; 
        $scope.msgIndex = getRandomInt(0, $scope.messages.length-1);

          $http.post(config.apiRoot + '/battles/random/' + authService.user._id)
            .then((response) => {
                $scope.randomChallanger = response.data;             
            })

        timeoutId = $window.setInterval(() => {
            counter++;
            $scope.msgIndex = getRandomInt(0, $scope.messages.length-1);
            if(counter > 5 && $scope.randomChallanger){               
                window.clearTimeout(timeoutId);
                $scope.loading = false;           
            }
            $scope.$apply();
        }, 1000); 

      
    }

    $scope.addChallenger = function(){
        $scope.battles.push($scope.randomChallanger);
        $scope.randomChallanger = null;
    }

    $scope.getMyBattles = function(){
        $http.get(config.apiRoot + '/users/' + $scope.auth.user._id + '/battles')
            .then((response) => {
                $scope.battles = response.data;
                $scope.$broadcast('scroll.refreshComplete');
            })
    }

    function getRandomInt(min, max) {
         return Math.round(Math.random() * (max - min) + min);
    }

    init();

});
   
