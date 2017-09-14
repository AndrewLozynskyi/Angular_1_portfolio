/**
 * @author Oleg .
 * avarage annualized salary table directive
 */

angular.module( 'Dashboard.module' )

.directive( 'avarageAnnualizedSalaryTable', [ function () {

    return {
        restrict: 'E',
        scope: {
            setData: '=',
            getCountries: '='
        },
        controllerAs: 'aast',
        templateUrl: 'dashboard/directives/avarage-annualized-salary-table.html',
        link:function (  ) {

        },
        controller: [ '$scope', '$mdDialog', function ( $scope, $mdDialog ) {

            var $this = this;

            $this.setCount = function ( data ) {

                $this.avarageData = data;
                console.log(data);
                $this.total = data[ data.length - 1 ];
                $this.avarageData.pop();

            };

            $scope.$watch ( 'setData', function ( data ) {


                // data.pop()
                $this.setCount( data );

            });

        }],
    };

}]);
