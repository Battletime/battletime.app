var app = angular.module('battletime-app');

app.controller('portalCtrl', function ($scope, $cordovaCamera, authService, $ionicModal, 
    $http, $state, $timeout, config, $cordovaBarcodeScanner, $ionicLoading) {



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
        $scope.auth = authService;
    }

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
   
