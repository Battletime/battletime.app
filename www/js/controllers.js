angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaBarcodeScanner, EventService) {


  $scope.scanEventCode = function(){
    $cordovaBarcodeScanner.scan().then(function(eventSecret) {
        EventService.signUp(eventSecret);
    });
  }

})

.controller('EventConfirmCtrl', function($scope, $state, $stateParams, EventService){

  EventService.getDetails($stateParams.eventId).then((event) => $scope.event = event);
  $scope.back = () => { $state.go('tab.dash'); }
})

.controller('BattlesCtrl', function($scope, Battles) {
   $scope.battles = Battles.all();
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
