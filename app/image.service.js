angular.module('battletime-app')
.service('imageService', function($http, $q, config, $cordovaImagePicker, $window, $cordovaCamera){

    var self = {};

    //wrapped in function because Camera is undefined in webbrowsers
    function getOptions(){ 
        return {
            //maximumImagesCount: 1, //for image picker only
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
    }

    /**
     * Name: GetCameraPicture
     * Params: []
     * Returns: imageData: Base64Striing
     */
    self.getCameraPicture = function(){
        return $cordovaCamera.getPicture(getOptions())
    }

    self.getGalleryPicture = function(){
        var deferred = $q.defer();
        $cordovaImagePicker.getPictures(getOptions()).then((results)  => {
          
             // Encode URI to Base64
            window.plugins.Base64.encodeFile(results[0], function(base64){
                deferred.resolve(base64);
            });
        
        }, (error) => deferred.reject(errror));
        return deferred.promise;
    }

    return self;



});