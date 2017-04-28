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
   
