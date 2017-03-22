angular.module('starter.controllers', [])

// ### DASHBOARD CONTROLLER ### 
.controller('DashCtrl', function($scope, $cordovaBarcodeScanner, EventService) {

  $scope.events = [];

  EventService.get()
    .then( (events) => $scope.events= events);

  $scope.scanEventCode = function(){
    $cordovaBarcodeScanner.scan().then(function(result) {
        EventService.signUp(result.text);
    });
  }

})


// ### EVENT CONFIRM CONTROLLER ### 
.controller('EventConfirmCtrl', function($scope, $state, $stateParams, EventService){
  
  //construct
  EventService.getDetails($stateParams.eventId).then((event) => $scope.event = event);
  
  //methods
  $scope.back = () => { $state.go('tab.dash', null, { reload: false }); }

  $scope.continue = () => { $state.go('event-details', { eventId: $stateParams.eventId}, { reload: false }); }
  
})


// ### EVENT DETAILS CONTROLLER ### 
.controller('EventDetailsCtrl', function($scope, $state, $stateParams, EventService, $ionicNavBarDelegate){

  //construct
  EventService.getDetails($stateParams.eventId)
    .then((event) => $scope.event = event);

})

// ### BATTLES CONTROLLER ### 
.controller('BattlesCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();

})


// ###  BATTLE DETAILS CONTROLLER ### 
.controller('BattleDetailsCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.battleId);
})

// ### BATTLES CONTROLLER ### 
.controller('AccountCtrl', function($scope, $state) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.logout = function(){
      localStorage.setItem('jwt', undefined);//fake 
      $state.go('login');
  }
})

// ### Login CONTROLLER ### 
.controller('LoginController', function($rootScope, $cordovaInAppBrowser, $scope, $state){
    
    function checkAndParseUrl(url){
      if(url.indexOf("tokenProvider") != 0 ){
        alert("token found");
        var token = url.split('tokenProvider/')[1];
        alert(token);
        //localStorage.setItem('jwt', token);//fake 
        return token;
      }
    }

    $scope.login = function(){
       alert("test");
       //var authUrl = "http://localhost:3000/api/auth/google";
       var authUrl =  "http://battletime.herokuapp.com/api/auth/google"; 

       //in browser
        var win = window.open(authUrl, '_system', 'location=yes');
        win.addEventListener('loadstart', function (data) {
            alert("Loadstart event");
            if(checkAndParseUrl(data.url)){
              win.close();
              $state.go('tab.events');
            }
        });
    }
})

