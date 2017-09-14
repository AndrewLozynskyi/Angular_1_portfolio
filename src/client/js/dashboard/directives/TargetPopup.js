/*
 * @author ohmed
 * Dashboard target popup dirrective
*/

angular.module( 'Dashboard.module' )

.directive( 'targetPopup', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'tp',
        templateUrl: 'dashboard/directives/target-popup.html',
        controller: [ '$mdDialog', function ( $mdDialog ) {

            var $this = this;
            var wrapElem = angular.element('target-popup');

            $this.years = [ 2015, 2016, 2017 ];
            $this.months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Now', 'Dec' ];

            //

            $this.cancel = function () {

                $mdDialog.cancel();

            };

            $this.selectYear = function ( $event ) {

                wrapElem.find('.active').removeClass('active');
                $( $event.currentTarget ).addClass('active');

            };

        }]
    };

}]);
