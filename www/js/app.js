// Ionic Starter App
var app = angular.module('battletime-app', ['ionic', 'ionic-material', 'ngCordova']);

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
.service('authService', function($http, $q){
    
    var apiRoot = "https://battletime.herokuapp.com/";

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

        $http.post(apiRoot + 'api/auth/login', login)
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

        $http.post(apiRoot + 'api/auth/signup', signup)
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

addAppState("portal");
addAppState("events");
addAppState("settings");

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

    .state('event-confirm', {
        url: '/app/event-confirm/:eventId',
        controller: 'eventConfirmCtrl',
        templateUrl: 'templates/events/event-confirm.comp.html', 
    })

    .state('app.lists', {
        url: '/lists',
        views: {
            'menuContent': {
                templateUrl: 'templates/lists.html',
                controller: 'ListsCtrl'
            }
        }
    })

    .state('app.ink', {
        url: '/ink',
        views: {
            'menuContent': {
                templateUrl: 'templates/ink.html',
                controller: 'InkCtrl'
            }
        }
    })

    .state('app.motion', {
        url: '/motion',
        views: {
            'menuContent': {
                templateUrl: 'templates/motion.html',
                controller: 'MotionCtrl'
            }
        }
    })

    .state('app.components', {
        url: '/components',
        views: {
            'menuContent': {
                templateUrl: 'templates/components.html',
                controller: 'ComponentsCtrl'
            }
        }
    })

    .state('app.extensions', {
        url: '/extensions',
        views: {
            'menuContent': {
                templateUrl: 'templates/extensions.html',
                controller: 'ExtensionsCtrl'
            }
        }
    })
    ;

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

app.controller('signupCtrl', function($scope, authService, $state){

    $scope.first = true;
    $scope.signup = {};
    $scope.login = {};

    $scope.sendSignup = function(){
        authService.Signup($scope.signup).then(
        (user) => {
             $state.go('app.portal');
        }, 
        (response) => {
            $scope.signup.errors = response.errors
        });

        //empty password fiels
        $scope.signup.password = null;
        $scope.signup.repeat = null; 
        
    }

    $scope.sendLogin = function(){
        authService.Login($scope.login).then(
        (user) => {
            $state.go('app.portal');
        }, 
        (response) => {
            $scope.login.errors = response.errors
        });

    }

});