angular.module('battletime-app')
.service('authService', function($http, $q){
    
    var apiRoot = "https://battletime.herokuapp.com/";

    var self = {};

    var savedUser = localStorage.getItem("user");
    self.user = savedUser ? JSON.parse(savedUser) : null;

    function saveUser(user){
        self.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("lastUsername", user.username);
    }

    self.getLastUsedUsername = function(){
        return localStorage.getItem("lastUsername");
    }

    self.Login = function(login){
        var deferred = $q.defer();

        $http.post(apiRoot + 'api/auth/login', login)
            .then((response) => {
                saveUser(response.data);
                deferred.resolve(response.data)
            },(response) =>{
                deferred.reject(response.data)
            });

        return deferred.promise;
    }
    
    self.Logout = function(){
        localStorage.removeItem("user", undefined);
        self.user = null;
    }

    self.Signup = function(signup){

        var deferred = $q.defer();

        if(signup.password != signup.repeat){
             deferred.reject({ errors: ["The passwords do not match"]});
             return deferred.promise;
        };

        $http.post(apiRoot + 'api/auth/signup', signup)
            .then((response) => {
                saveUser(response.data);
                deferred.resolve(response.data)
            },(response) =>{
                deferred.reject(response.data)
            });

        return deferred.promise;
    }

    return self;

})