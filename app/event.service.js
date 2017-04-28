angular.module('battletime-app')
.service('CachedHttp', function($q, $http){

  this.getResource = function(resource){

    var deferred = $q.defer();
    var cache = localStorage.getItem(resource);

    //ff cache verwijderen, werkt nog niet helemaal naar behoren
    // if(cache) {
    //   var cacheObject = 
    //   deferred.resolve(angular.fromJson(cache));
    //   return deferred.promise; //no need to continue
    // } 
    
    $http.get(resource).then((result) => {
      localStorage.setItem(resource, JSON.stringify(result.data));
      deferred.resolve(result.data);
    });
    
    return deferred.promise;
  }

})

.service('EventService', function(CachedHttp, config, $state, $http){

    // this.getMyEvents = function(c){
    //   $http.gget()
    //   var resource = '/users/'/events';  
    //   return CachedHttp.getResource(resource);
    // }

    // this.getDetails = function(eventId){
    //   var resource = '/events/' + eventId;  
    //   return CachedHttp.getResource(resource);
    // }

    // this.signUp = function(eventSecret){
      
    // }

})
