var app = angular.module('battletime-app');

app.controller('portalCtrl', function ($scope, $ionicModal, $window, $ionicPopover, $http, $state, $timeout, authService, config) {

    $scope.messages = [
        "Rolling out the floor",
        "Putting on some new nikies",
        "Tying shoelaces",
        "Finding the best break-beats",
        "Wrack and Strack",
        "Bragge and boasting",
        "Uprocking",
        "Stretching",
        "Meditating",
        "de-Cyphering enemy moves",
        "Nothing... just nothing",
        "Charging energy bom",
        "Relaxing soul",
        "Throwing some flares",
        "Taunting enemy",
        "Eating a sandwich",
        "Throwing some flipo's",
        "Discovering a new pokemon",
        "Wait, is this breakdance GO?",
        "Controlling nerves",
        "Vommoting on sweater already",
        "Eating mom's spagetti",
        "Breaking the sweet",
        "Practice what you preach",
        "Breaking the habbit",
        "Breaking the hobbit",
        "Checking out the air track" 
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
            var nextIndex = getRandomInt(0, $scope.messages.length-2);
            $scope.msgIndex = nextIndex == $scope.msgIndex ? nextIndex + 1 : nextIndex;
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
   
