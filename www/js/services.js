angular.module('starter.services', [])

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

.service('EventService', function(CachedHttp, $state, $http){

    this.get = function(){
      var resource = '/events';  
      return CachedHttp.getResource(resource);
    }

    this.getDetails = function(eventId){
      var resource = '/events/' + eventId;  
      return CachedHttp.getResource(resource);
    }

    this.signUp = function(eventSecret){
        $http.post('/events/'+eventSecret+'/participants', { userId: 1})
          .success(function(event){
              localStorage.setItem('/events/' + event._id, JSON.stringify(event));
              $state.go('event-confirm', {eventId: event._id });
          });
    }

})

.factory('Battles', function(){
  

})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 1,
    title: "someting"
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
