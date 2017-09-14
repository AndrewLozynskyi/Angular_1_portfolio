/*
 * @author ohmed
 * Total linear directive
*/

angular.module( 'Profile.module' )

.directive( 'totalLinear', [ '$window', function ( $window ) {

   return {
        restrict: 'E',
        scope: {
            teamTotalData: '='
        },
        controllerAs: 'tlc',
        templateUrl: 'profile/directives/total-linear.html',
        controller: [ '$scope', '$mdDialog', '$interval',  function ( $scope, $mdDialog, $interval ) {

        	var $this = this;

        	$scope.$watch('teamTotalData', function ( data ) {

        		if ( data === undefined ) return;

                $this.teamData = data.totalAvarage;

            });

            $this.setTotalWidth = function ( currentWidth, totalWidth ) {

                return { 'width': '160px' };

            };

            $this.setCurrentWidth = function ( currentWidth, totalWidth ) {

                var currentMembers = currentWidth * 160 / totalWidth;
                var currentMembers = 60 * 160 / 78;

                return { "width": currentMembers + "px", "background-color": '#1c66ed' }

            };

        }],
        link: function( scope, element, attrs ) {

            var width = angular.element( document.querySelector( '#customerBody' ) )[ 0 ].clientWidth / 2;
            var legend = angular.element( element[ 0 ].getElementsByClassName( 'progress-data' ) );

            legend.css("width", ( width - 150 ) + "px");

            $window.addEventListener( 'resize', function () {

                var width = angular.element( document.querySelector( '#customerBody' ) )[ 0 ].clientWidth / 2;
                var legend = angular.element( element[ 0 ].getElementsByClassName( 'progress-data' ) );

                legend.css("width", ( width - 150 ) + "px");

            });
        }
    };

}]);
