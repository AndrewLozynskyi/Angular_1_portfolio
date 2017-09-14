/*
 * @author ohmed
 * Team details directives
*/

angular.module( 'Profile.module' )

.directive( 'teamDetails', [ function () {

    return {
        restrict: 'E',
        scope: {
            teamData: '=',
            employeesData: '='
        },
        controllerAs: 'td',
        templateUrl: 'profile/directives/team-details.html',
        controller: [ '$scope', '$rootScope', '$cookies', 'teams.service', function ( $scope, $rootScope, $cookies, teamsService ) {

            var $this = this;

            $scope.$watch('teamData', function ( data ) {

                $this.teamData = data;

            });

            $scope.$watch('employeesData', function ( data ) {

                $this.employeesData = data;

            });



            //

            $this.back = function () {

                $scope.$emit( 'hideDetails' );

            };

        }]
    };

}]);
