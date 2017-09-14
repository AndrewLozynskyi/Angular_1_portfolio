/**
 * @author Oleg .
 *Total-finance table directive
 */

angular.module ( 'Dashboard.module' )

.directive ( 'totalFinanceTable', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            // data: '=',
            date: '='
        },
        templateUrl: '/views/dashboard/directives/total-finance-table.html',
        link: function ( scope, element, attrs ) {

            scope.$watchCollection( 'data' , function ( newValue ) {

                countTotal( newValue )

            });

            function countTotal ( data ) {

                scope.revenueTotal = 0;
                scope.humanCostTotal = 0;
                scope.HeadcountTotal = 0;

                for ( var i = 0; i < data.length; i++ ) {

                    scope.revenueTotal = scope.revenueTotal+data[i].revenue ;
                    scope.humanCostTotal = scope.humanCostTotal+data[i].humanCost;
                    scope.HeadcountTotal = scope.HeadcountTotal+data[i].headcount;

                }

            };

            scope.data = [
                {
                    country: 'Usa',
                    headcount: 33,
                    humanCost: 44,
                    revenue: 33
                },
                {
                    country: 'Usa',
                    headcount: 33,
                    humanCost: 44,
                    revenue: 33
                },
                {
                    country: 'Usa',
                    headcount: 33,
                    humanCost: 44,
                    revenue: 33
                }
            ];

            countTotal( scope.datas );

        }
    };

}])

.filter( 'percent', [ function () {

    return function ( data ) {

        return data + '%';

    };

}]);