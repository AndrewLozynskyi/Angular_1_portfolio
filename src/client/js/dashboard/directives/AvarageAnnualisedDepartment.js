/*
 * @author illya
 * Avarage salary chart directive
*/

angular.module( 'Dashboard.module' )

.directive( 'avarageAnnualisedDepartment', [ function () {

    return {
        restrict: 'E',
        scope: {
            setData: '='
        },
        templateUrl: 'dashboard/directives/avarage-annualised-department.html',
        controller: [ '$scope', '$mdDialog', function ( $scope, $mdDialog ) {

            var $this = this;

            $this.setCount = function ( data ) {

                $this.avarageData = data;
                $this.total = data[ data.length - 1 ];
                $this.avarageData.pop();

            };

            $scope.$watch ( 'setData', function ( data ) {

                $this.data = data;

                $this.setCount( data );

            })

        }],
        controllerAs: 'adc'
    };

}]);
