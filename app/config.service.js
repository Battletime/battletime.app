angular.module('battletime-app')
.service('config', function($http, $q){
    
    //var serverRoot = "https://battletime.herokuapp.com";
    var serverRoot = "http://localhost:3000";

    return {
        serverRoot: serverRoot,
        apiRoot: serverRoot + "/api"
    }

});