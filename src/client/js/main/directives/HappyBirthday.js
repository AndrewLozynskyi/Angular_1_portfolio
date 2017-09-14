angular.module( 'Dashboard.module' )

.directive( 'happyBirthday', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'hp',
        templateUrl: 'main/directives/happy-birthday.html',
        controller: [ '$scope', '$mdDialog', '$element', function ( $scope, $mdDialog, $element ) {

        
        }]

    };

}]);