angular.module('battletime-app')
.service('config', function($http, $q){
    
    return self = {
        apiRoot: "https://battletime.herokuapp.com/api"
    };

});