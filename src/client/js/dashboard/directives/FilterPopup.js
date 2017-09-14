/*
 * @author ohmed
 * Dashboard filter popup dirrective
*/

angular.module( 'Dashboard.module' )

.directive( 'filterPopup', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'up',
        templateUrl: 'dashboard/directives/filter-popup.html',
        controller: [ '$scope', '$mdDialog', function ( $scope, $mdDialog ) {

            var $this = this;

            //

            $this.cancel = function () {

                $mdDialog.cancel();

            };

            $this.refresh = function () {

                var result = $('#builder').queryBuilder('getSQL');

                $('#builder-formula').html( result.sql );

            };

            //

            $('#builder').queryBuilder({
                filters: [{
                    id: 'name',
                    label: 'Name',
                    type: 'string'
                }]
            });

        }]
    };

}]);
