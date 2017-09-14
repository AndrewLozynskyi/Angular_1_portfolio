/*
 * @author biven
 * Fullscreen btn controller
*/

angular.module( 'Dashboard.module' )

.controller( 'fullscreen.controller', [ '$scope', 'Fullscreen', function ( $scope, Fullscreen ) {

    $scope.goFullscreen = function () {

        if ( Fullscreen.isEnabled() ) {

            Fullscreen.cancel();

        } else {

            Fullscreen.all();

        }

    };

    $scope.isFullScreen = false;

    $scope.goFullScreenViaWatcher = function () {

        $scope.isFullScreen = ! $scope.isFullScreen;

    };

}]);
