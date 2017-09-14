/*
 * @author ohmed
 * Dashboard:Finance page controller
*/

angular.module( 'Dashboard.module' )

.controller( 'finance.controller', [ '$scope', function ( $scope ) {

    var $this = this;

    this.activeParams = { countries: [], departments: [] };
    $scope.activeParams = $this.activeParams;

    //

    // todo

}]);
