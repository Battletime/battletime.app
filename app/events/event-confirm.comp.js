var app = angular.module('battletime-app');

app.controller('eventConfirmCtrl', function ($scope, $stateParams, $ionicModal, $ionicPopover, $state, $timeout, authService, $http, config) {

    $scope.eventId;

    function init(){
        $scope.eventId = $stateParams.eventId
    }

    init();


});