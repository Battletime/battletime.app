angular.module('battletime-app')
.service('config', function($http, $q){
    
    return {
        apiRoot: "https://battletime.herokuapp.com/api",
        //apiRoot: "http://localhost:3000/api"
    }

});