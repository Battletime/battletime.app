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
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
