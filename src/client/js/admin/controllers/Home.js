/*
 * @author ohmed, biven
 * Admin 'Home' tab controller
*/

angular.module( 'Admin.module' )

.controller( 'adminHome.controller', [ 'admin.service', '$scope', function ( adminService, $scope ) {

    $scope.widgetData = {};

    //

    function resizeCards () {

        $('.sectionCard').height( $( '.sectionCard' ).width() * 0.85 );
        var marginTop = $('.sectionCard').height() / 2.5 - $('.sectionCard md-card-title').height();
        $('.sectionCard md-card-title').css( 'margin-top', marginTop );

    };

    //

    adminService.getWidgetData( function ( err, result ) {

        $scope.widgetData = result.stats;

    });

    window.addEventListener( 'resize', resizeCards );
    resizeCards();

}]);
