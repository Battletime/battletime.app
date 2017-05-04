var app = angular.module('battletime-app');

app.controller('settingsCtrl', function ($scope,$state, $http, authService, $ionicLoading, $cordovaCamera, config, onError) {



    function init(){
        $scope.auth = authService;
    }

    $scope.logout = function(){
        authService.Logout();
        $state.go('login');
    }

    $scope.test = function(){
           $ionicLoading.show();
            var url = config.apiRoot + '/users/' + authService.user._id + '/avatar';
            $http.post(url, { baseString: document.getElementById('temp').value })
                .then((response) => {
                    authService.updateUser(response.data);
                    authService.user.imageUri += ('?decache=' + Math.random());
                    $ionicLoading.hide();
                    
                }, onError);          
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
   

  
