// Ionic Starter App
var app = angular.module('battletime-app', ['ionic', 'ionic-material']);

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

    var fab = document.getElementById('fab');
    fab.addEventListener('click', function () {
        //location.href = 'https://twitter.com/satish_vr2011';
        window.open('https://twitter.com/satish_vr2011', '_blank');
    });

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

app.controller('eventsCtrl', function ($scope, $ionicModal, $ionicPopover, $state, $timeout, authService) {

    $scope.auth = authService;

    $scope.logout = function(){
        authService.Logout();
        $state.go('login');
    }

});
   

var app = angular.module('battletime-app');

app.controller('portalCtrl', function ($scope, $ionicModal, $ionicPopover, $state, $timeout, authService) {

    $scope.auth = authService;

    $scope.logout = function(){
        authService.Logout();
        $state.go('login');
    }

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