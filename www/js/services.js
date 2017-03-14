angular.module('starter.services', [])

.service('CachedHttp', function($q, $http){

  //var apiRoot = "http://localhost:3000"
  var apiRoot = "http://battletime.herokuapp.com"

  this.getResource = function(resource){
    var deferred = $q.defer();
    var cache = localStorage.getItem(resource);

    if(cache) {
      deferred.resolve(angular.fromJson(cache).data);
      return deferred.promise; //no need to continue
    } 
    
    $http.get(apiRoot + resource).then((event) => {
      localStorage.setItem(resource, JSON.stringify(event));
      deferred.resolve(event);
    });
    
    return deferred.promise;
  }

})

.service('EventService', function(CachedHttp, $state, $http){

    var apiRoot = "http://localhost:3000"

    this.getDetails = function(eventId){
      var resource = '/events/' + eventId;  
      return CachedHttp.getResource(resource);
    }

    this.signUp = function(eventSecret){
        $http.post(apiRoot + '/events/'+eventSecret+'/participants', { userId: 1})
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
  var chats = [];

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
