// Ionic Starter App
var app = angular.module('battletime-app', ['ionic', 'ionic-material', 'ngCordova', 'ui.select', 'ngSanitize']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

angular.module('battletime-app')
.service('authService', function($http, $q, config){
    
    var self = {};

    var savedUser = localStorage.getItem("user");
    self.user = savedUser ? JSON.parse(savedUser) : null;

    function saveUser(user){
        self.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("lastUsername", user.username);
    }

    self.getLastUsedUsername = function(){
        return localStorage.getItem("lastUsername");
    }

    self.Login = function(login){
        var deferred = $q.defer();

        $http.post(config.apiRoot + '/auth/login', login)
            .then((response) => {
                saveUser(response.data);
                deferred.resolve(response.data)
            },(response) =>{
                deferred.reject(response.data)
            });

        return deferred.promise;
    }
    
    self.Logout = function(){
        localStorage.removeItem("user", undefined);
        self.user = null;
    }

    self.Signup = function(signup){

        var deferred = $q.defer();

        if(signup.password != signup.repeat){
             deferred.reject({ errors: ["The passwords do not match"]});
             return deferred.promise;
        };

        $http.post(config.apiRoot + '/auth/signup', signup)
            .then((response) => {
                saveUser(response.data);
                deferred.resolve(response.data)
            },(response) =>{
                deferred.reject(response.data)
            });

        return deferred.promise;
    }

    return self;

})
angular.module('battletime-app')
.service('config', function($http, $q){
    
    return {
        apiRoot: "https://battletime.herokuapp.com/api",
        //apiRoot: "http://localhost:3000/api"
    }

});
angular.module('battletime-app')
.service('CachedHttp', function($q, $http){

  this.getResource = function(resource){

    var deferred = $q.defer();
    var cache = localStorage.getItem(resource);

    //ff cache verwijderen, werkt nog niet helemaal naar behoren
    // if(cache) {
    //   var cacheObject = 
    //   deferred.resolve(angular.fromJson(cache));
    //   return deferred.promise; //no need to continue
    // } 
    
    $http.get(resource).then((result) => {
      localStorage.setItem(resource, JSON.stringify(result.data));
      deferred.resolve(result.data);
    });
    
    return deferred.promise;
  }

})

.service('EventService', function(CachedHttp, config, $state, $http){

    // this.getMyEvents = function(c){
    //   $http.gget()
    //   var resource = '/users/'/events';  
    //   return CachedHttp.getResource(resource);
    // }

    // this.getDetails = function(eventId){
    //   var resource = '/events/' + eventId;  
    //   return CachedHttp.getResource(resource);
    // }

    // this.signUp = function(eventSecret){
      
    // }

})

app = angular.module('battletime-app');

//redirect to login if no token
app.run(function($rootScope, $state){
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) { 
        if(toState.name != "login" && !localStorage.getItem("user"))
        {
            event.preventDefault(); //stop navigating to new state
            toState = $state.go("login");
        }     
        if(toState.name == "login" && localStorage.getItem("user"))
        {
            event.preventDefault(); //stop navigating to new state
            toState = $state.go("app.portal");
        }     
    });
})

app.config(function ($stateProvider, $urlRouterProvider) {
    

function addAppState(name){
    $stateProvider.state('app.' + name, {
        url: '/' + name,     
        views: {
            'menuContent': {
                templateUrl: 'templates/'+name+'/'+ name +'.comp.html',
                controller: name + 'Ctrl'
            }
        }
    });
}

//default states
addAppState("portal");
addAppState("events");
addAppState("settings");
addAppState("battles");

$stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/signup/signup.comp.html',
        controller: 'signupCtrl'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app/app.comp.html',
        controller: 'appCtrl'
    })

    .state('challange', {
        url: '/app/challange',
        controller: 'challengeCtrl',
        templateUrl: 'templates/battles/add-battle.comp.html', 
    })

    .state('event-confirm', {
        url: '/app/event-confirm/:eventId',
        controller: 'eventConfirmCtrl',
        templateUrl: 'templates/events/event-confirm.comp.html', 
    })

    .state('app.battle-details', {
        url: '/details/:battleId',     
        views: {
            'menuContent': {
                templateUrl: 'templates/battles/battle-details.comp.html',
                controller: 'battleDetailsCtrl'
            }
        }
        
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/portal');
});

var app = angular.module('battletime-app');

app.controller('appCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    $scope.randomBattle = function(){
        
    }

    // var fab = document.getElementById('fab');
    // fab.addEventListener('click', function () {
    //     //location.href = 'https://twitter.com/satish_vr2011';
    //     window.open('https://twitter.com/satish_vr2011', '_blank');
    // });
    

    // .fromTemplate() method
    var template = '<ion-popover-view>' +
                    '   <ion-header-bar>' +
                    '       <h1 class="title">My Popover Title</h1>' +
                    '   </ion-header-bar>' +
                    '   <ion-content class="padding">' +
                    '       My Popover Contents' +
                    '   </ion-content>' +
                    '</ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
});
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
var app = angular.module('battletime-app');

app.directive('battleItem', function() {
    return {
      restrict: 'E',
      scope: {
        battle: '=input'
      },
      templateUrl: 'templates/battles/battle-item.dir.html'
    };
});
var app = angular.module('battletime-app');

app.controller('battlesCtrl', function ($scope, $ionicModal, $ionicPopover, $http, $state, $timeout, authService, config) {

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
   

var app = angular.module('battletime-app');

app.controller('eventConfirmCtrl', function ($scope, $stateParams, $ionicModal, $ionicPopover, $state, $timeout, authService, $http, config) {

    $scope.eventId;

    function init(){
        $scope.eventId = $stateParams.eventId
    }

    init();


});
var app = angular.module('battletime-app');

app.controller('eventsCtrl', function ($scope, $ionicModal, $cordovaBarcodeScanner, $state, $timeout, authService, $http, config) {

    $scope.auth;
    $scope.events = [];

    function init(){
        $scope.auth = authService;
        if($scope.auth.user){
            $scope.getMyEvents();
        }
    }

    $scope.getMyEvents = function(){
        $http.get(config.apiRoot + '/users/' + authService.user._id + '/events')
            .then( (response) => {
                $scope.events = response.data;
                $scope.$broadcast('scroll.refreshComplete');
            });
    }

    $scope.scanEventCode = function(){
        $cordovaBarcodeScanner.scan().then(function(result) {
            var eventSecret = result.text;
            $http.post(config.apiRoot + '/events/secret/' + eventSecret, { userId: authService.user._id})
                .success(function(event){
                    $state.go('event-confirm', {eventId: event._id });
                });
        });
    }

    init();

});
   

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
   

var app = angular.module('battletime-app');

app.controller('signupCtrl', function($scope, authService, $state, $ionicLoading){

  
    $scope.signup = {};
    $scope.login = {
        username: authService.getLastUsedUsername()
    };

    $scope.first = !($scope.login.username);

    $scope.sendSignup = function(){
        $ionicLoading.show();
        authService.Signup($scope.signup).then(
        (user) => {
            $ionicLoading.hide();
             $state.go('app.portal');
        }, 
        (response) => {
            $ionicLoading.hide();
            $scope.signup.errors = response.errors
        });

        //empty password fiels
        $scope.signup.password = null;
        $scope.signup.repeat = null; 
        
    }

    $scope.sendLogin = function(){
        $ionicLoading.show();
        authService.Login($scope.login).then(
        (user) => {
            $ionicLoading.hide();
            $state.go('app.portal');
        }, 
        (response) => {
            $ionicLoading.hide();
            $scope.login.errors = response.errors
        });

    }

});