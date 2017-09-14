/*
 * @author Illya
 * Field autofocus directive
*/

angular.module( 'Admin.module' )

.directive( 'autofocus', [ '$timeout', function ( $timeout ) {

    return function ( scope, element, attrs ) {

        scope.$watch( attrs.autofocus, function ( newValue ) {

            $timeout( function () {

                if ( newValue ) {

                    element.focus();

                }

            });

        }, true );

    };

}]);
