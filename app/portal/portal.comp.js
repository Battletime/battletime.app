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

    //     $scope.messages = [
    //     "Rolling out the floor",
    //     "Putting on some new nikies",
    //     "Tying shoelaces",
    //     "Finding the best break-beats",
    //     "Wrack and Strack",
    //     "Bragge and boasting",
    //     "Uprocking",
    //     "Stretching",
    //     "Meditating",
    //     "de-Cyphering enemy moves",
    //     "Nothing... just nothing",
    //     "Charging energy bom",
    //     "Relaxing soul",
    //     "Throwing some flares",
    //     "Taunting enemy",
    //     "Eating a sandwich",
    //     "Throwing some flipo's",
    //     "Discovering a new pokemon",
    //     "Wait, is this breakdance GO?",
    //     "Controlling nerves",
    //     "Vommoting on sweater already",
    //     "Eating mom's spagetti",
    //     "Breaking the sweet",
    //     "Practice what you preach",
    //     "Breaking the habbit",
    //     "Breaking the hobbit",
    //     "Checking out the air track" 
    // ]

 
    // $scope.getRandomBattle = function(){
    //     counter = 0;
    //     $scope.callout = null;
    //     $scope.loading = true; 
    //     $scope.msgIndex = getRandomInt(0, $scope.messages.length-1);

    //       $http.post(config.apiRoot + '/battles/random/' + authService.user._id)
    //         .then((response) => {
    //             $scope.callout = response.data;             
    //         })

    //     timeoutId = $window.setInterval(() => {
    //         counter++;
    //         var nextIndex = getRandomInt(0, $scope.messages.length-2);
    //         $scope.msgIndex = nextIndex == $scope.msgIndex ? nextIndex + 1 : nextIndex;
    //         if(counter > 5 && $scope.callout){               
    //             window.clearTimeout(timeoutId);
    //             $scope.loading = false;           
    //         }
    //         $scope.$apply();
    //     }, 1000); 

      
    // }

    // $scope.addChallenger = function(){
    //     $scope.battles.push($scope.callout);
    //     $scope.callout = null;
    // }

    // $scope.getMyBattles = function(){
    //     $http.get(config.apiRoot + '/users/' + $scope.auth.user._id + '/battles')
    //         .then((response) => {
    //             $scope.battles = response.data;
    //             $scope.$broadcast('scroll.refreshComplete');
    //         })
    // }

    // function getRandomInt(min, max) {
    //      return Math.round(Math.random() * (max - min) + min);
    // }

    init();

});
   
