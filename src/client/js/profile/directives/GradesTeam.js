/*
 * @author ohmed
 * 'Grades team' directive
*/

angular.module( 'Profile.module' )

.directive( 'gradesTeam', [ '$window', function ( $window ) {

   return {
        restrict: 'E',
        scope: {
            gradesData: '='
        },
        controllerAs: 'gtc',
        templateUrl: 'profile/directives/grades-team.html',
        controller: [ '$scope', '$mdDialog', function ( $scope, $mdDialog ) {

            var $this = this;

            $this.totalTeam = 0;

            $scope.$watch( 'gradesData', function ( data ) {

                if ( data === undefined ) return;

                $this.teamData = data.totalAvarage.payStructure;

                $this.init()

            });


            //

            $this.setCount = function () {

                for ( var i = 0; i < $this.teamData.length; i ++ ) {

                    $this.teamData[ i ].count = i + 1;
                    $this.totalTeam += $this.teamData[ i ].median;

                }

            };

            $this.setAvarage = function () {

                for ( var i = 0; i < $this.teamData.length; i ++ ) {

                    $this.teamData[ i ].avarage = Math.round( $this.teamData[ i ].median * 100 / $this.totalTeam );

                }

            };

            $this.init = function () {

                $this.setCount();
                $this.setAvarage();

            };

        }]
    };

}]);
