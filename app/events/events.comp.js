var app = angular.module('battletime-app');

app.controller('eventsCtrl', function ($scope, $ionicModal, $ionicPopover, $state, $timeout, authService, $http, config) {

    $scope.auth = authService;
    $scope.events = [];

    function init(){
        if($scope.auth.service){
            EventService.getMyEvents().then( (events) => $scope.events= events);
        }
    }

    $scope.getMyEvents = function(){
        $http.get('/users/' + auth.user._id + '/events')
            .then( (response) => {
                $scope.events = response.data;
            });
        
    }

    $scope.scanEventCode = function(){
        $cordovaBarcodeScanner.scan().then(function(result) {
            var eventSecret = result.text;
            $http.post(config.apiRoot + '/events/' + eventSecret + '/participants', { userId: 1})
                .success(function(event){
                    $state.go('event-confirm', {eventId: event._id });
                });
        });
    }

});
   
