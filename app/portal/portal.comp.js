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
   
