// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

//redirect to login if no token
.run(function($rootScope, $state){
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) { 
        if(toState.name != "login" && !localStorage.getItem("jwt"))
        {
            event.preventDefault(); //stop navigating to new state
            toState = $state.go("login");
        }     
    });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  //intercept and prefix
  $httpProvider.interceptors.push(function ($q) {
      return {
          'request': function (config) {
            // ignore template requests
            if (config.url.substr(config.url.length - 5) == '.html') {
              return config || $q.when(config);
            }

            //config.url = 'http://localhost:3000/api' + config.url;
            config.url = 'http://battletime.herokuapp.com/api' + config.url;
            return config || $q.when(config);
          }
      }
    });

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  })

  .state('event-confirm', {
    url: '/event-confirm/:eventId',
    templateUrl: 'templates/event-confirm.html',
    controller: 'EventConfirmCtrl'
  })



  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.events', {  //EVENTS
    url: '/events',
    views: {
      'tab-events': {
        templateUrl: 'templates/tab-events.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.event-details', { //EVENTS/:ID
    url: '/events/:eventId',
    views: {
      'tab-events': {
          templateUrl: 'templates/event-details.html',
          controller: 'EventDetailsCtrl'
      }
    }
  })


  //BATTLES
  .state('tab.battles', {
      url: '/battles',
      views: {
        'tab-battles': {
          templateUrl: 'templates/tab-battles.html',
          controller: 'BattlesCtrl'
        }
      }
    })
    .state('tab.battle-details', {
      url: '/battles/:battleId',
      views: {
        'tab-battles': {
          templateUrl: 'templates/battle-detail.html',
          controller: 'BattleDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');

});
