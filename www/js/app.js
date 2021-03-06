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

app.filter('image', function(config){
    return function(input){
        if(input && input.indexOf("imgur") == -1)
            return config.serverRoot + input;
        else{
            return input;
        }
    }
});

app.service('onError', function($ionicPopup, $ionicLoading){
    return function(response){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Ow noes!',
            template: 'Something broke :('
        });
    }
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

    self.updateUser = function(user){
        saveUser(user);
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
    
    var serverRoot = "https://battletime.herokuapp.com";
    //var serverRoot = "http://localhost:3000";

    return {
        serverRoot: serverRoot,
        apiRoot: serverRoot + "/api"
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

angular.module('battletime-app')
.service('imageService', function($http, $q, config, $cordovaImagePicker, $window, $cordovaCamera){

    var self = {};

    //wrapped in function because Camera is undefined in webbrowsers
    function getOptions(){ 
        return {
            //maximumImagesCount: 1, //for image picker only
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 400,
            targetHeight: 400,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
        };
    }

    /**
     * Name: GetCameraPicture
     * Params: []
     * Returns: imageData: Base64Striing
     */
    self.getCameraPicture = function(){
        return $cordovaCamera.getPicture(getOptions())
    }

    self.getGalleryPicture = function(){
        var deferred = $q.defer();
        $cordovaImagePicker.getPictures(getOptions()).then((results)  => {
          
             // Encode URI to Base64
            window.plugins.Base64.encodeFile(results[0], function(base64){
                deferred.resolve(base64);
            });
        
        }, (error) => deferred.reject(errror));
        return deferred.promise;
    }

    return self;



});
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

app.controller('appCtrl', function ($scope, $ionicModal, authService, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    $scope.auth = authService;

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

app.controller('portalCtrl', function ($scope, authService, $ionicModal, onError,
    $http, $state, config, $cordovaBarcodeScanner, $ionicLoading, imageService) {

    $scope.scanEventCode = function(){
        $cordovaBarcodeScanner.scan().then(function(result) {
            var eventSecret = result.text;
            $http.post(config.apiRoot + '/events/secret/' + eventSecret, { userId: authService.user._id})
                .success(function(event){
                    $state.go('event-confirm', {eventId: event._id });
                }); 
        });
    }

    function init(){
        $scope.error =  window.plugins;
        $scope.auth = authService;
        $scope.modal = $ionicModal.fromTemplate(`
                <ion-modal-view>
                    <ion-header-bar>
                    <h1 class="title">Choose source</h1>
                    </ion-header-bar>
                    <ion-content>
                        <button ng-click="getCameraPicture()" class="button button-block button-default">Camera</button>
                        <button ng-click="getGalleryPicture()" class="button button-block button-default">Gallery</button>
                        <button ng-click="closeModal()" class="button button-block button-assertive">Cancel</button> 
                    </ion-content>
                </ion-modal-view>  
            `, {
            scope: $scope,
            animation: 'slide-in-up'
        });
    }


    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.editPicture = function(){
       $scope.getCameraPicture();
    }

    $scope.getGalleryPicture = function(){
         $scope.modal.hide();
        imageService.getGalleryPicture().then(UploadImage, (error) => {
            $scope.error = error;
        });      
    }

    $scope.getCameraPicture = function(){
         $scope.modal.hide();
        imageService.getCameraPicture().then(UploadImage, onError);      
    }

    //private function
    function UploadImage(imageData){
         $ionicLoading.show();
        var url = config.apiRoot + '/users/' + authService.user._id + '/avatar';
        $http.post(url, { baseString: imageData}).then((response) => {
            authService.updateUser(response.data);
            authService.user.imageUri += ('?decache=' + Math.random());
            $ionicLoading.hide();
        }, onError);          
    }





    init();

});
   

var app = angular.module('battletime-app');

app.controller('settingsCtrl', function ($scope,$state, $http, authService, $ionicLoading, $cordovaCamera, config, onError) {



    function init(){
        $scope.auth = authService;
    }

    $scope.logout = function(){
        authService.Logout();
        $state.go('login');
    }

    // $scope.test = function(){
    //        $ionicLoading.show();
    //         var url = config.apiRoot + '/users/' + authService.user._id + '/avatar';
    //         $http.post(url, { baseString: document.getElementById('temp').value })
    //             .then((response) => {
    //                 authService.updateUser(response.data);
    //                 authService.user.imageUri += ('?decache=' + Math.random());
    //                 $ionicLoading.hide();
                    
    //             }, onError);          
    // }

    $scope.editPicture = function(){

        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 400,
            targetHeight: 400,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
        };

        $cordovaCamera.getPicture(options)
            .then(function(imageData) {
                $ionicLoading.show();
                var url = config.apiRoot + '/users/' + authService.user._id + '/avatar';
                $http.post(url, { baseString: imageData})
                    .then((response) => {
                         authService.updateUser(response.data);
                         authService.user.imageUri += ('?decache=' + Math.random());
                         $ionicLoading.hide();
                    }, onError);          
            }, onError);
    }


    init();

});
   

  

var app = angular.module('battletime-app');

app.controller('signupCtrl', function($scope, authService, $state, $ionicLoading){

  
    $scope.signup = {};
    $scope.login = {
        username: authService.getLastUsedUsername()
    };

    $scope.page = 'start';

    $scope.sendSignup = function(){
        $ionicLoading.show();
        authService.Signup($scope.signup).then(
        (user) => {
            $ionicLoading.hide();
             $state.go('app.portal');
            //empty password fiels
            $scope.signup.password = null;
            $scope.signup.repeat = null; 
        }, 
        (response) => {
            $ionicLoading.hide();
            $scope.signup.errors = response.errors
            //empty password fiels
            $scope.signup.password = null;
            $scope.signup.repeat = null; 
        });
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