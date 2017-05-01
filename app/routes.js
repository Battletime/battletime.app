app = angular.module('battletime-app');

//redirect to login if no token
app.run(function($rootScope, $state){
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) { 
        if(toState.name != "login" && !localStorage.getItem("user"))
        {
            event.preventDefault(); //stop navigating to new state
            toState = $state.go("login");
        }     
        if(toState.name == "login" && localStorage.getItem("user"))
        {
            event.preventDefault(); //stop navigating to new state
            toState = $state.go("app.portal");
        }     
    });
})

app.config(function ($stateProvider, $urlRouterProvider) {
    

function addAppState(name){
    $stateProvider.state('app.' + name, {
        url: '/' + name,     
        views: {
            'menuContent': {
                templateUrl: 'templates/'+name+'/'+ name +'.comp.html',
                controller: name + 'Ctrl'
            }
        }
    });
}

//default states
addAppState("portal");
addAppState("events");
addAppState("settings");
addAppState("battles");

$stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/signup/signup.comp.html',
        controller: 'signupCtrl'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app/app.comp.html',
        controller: 'appCtrl'
    })

    .state('challange', {
        url: '/app/challange',
        controller: 'challengeCtrl',
        templateUrl: 'templates/battles/add-battle.comp.html', 
    })

    .state('event-confirm', {
        url: '/app/event-confirm/:eventId',
        controller: 'eventConfirmCtrl',
        templateUrl: 'templates/events/event-confirm.comp.html', 
    })

    .state('app.battle-details', {
        url: '/details/:battleId',     
        views: {
            'menuContent': {
                templateUrl: 'templates/battles/battle-details.comp.html',
                controller: 'battleDetailsCtrl'
            }
        }
        
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/portal');
});
