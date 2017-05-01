var app = angular.module('battletime-app');

app.directive('battleItem', function() {
    return {
      restrict: 'E',
      scope: {
        battle: '=input'
      },
      templateUrl: 'templates/battles/battle-item.dir.html'
    };
});