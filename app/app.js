// Ionic Starter App
var app = angular.module('battletime-app', ['ionic', 'ionic-material', 'ngCordova', 'ui.select', 'ngSanitize']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

app.filter('image', function(config){
    return function(input){
        if(input.indexOf("imgur") == -1)
            return config.serverRoot + input;
        else{
            return input;
        }
    }
});

app.service('onError', function($ionicPopup, $ionicLoading){
    return function(response){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Ow noes!',
            template: 'Something broke :('
        });
    }
})


