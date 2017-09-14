/*
 * @author ohmed
 * Tables pagination directive
*/

angular.module( 'Dashboard.module' )

.directive( 'pagination', [ function () {

    return {
        restrict: 'EA',
        scope: {
            clPages:        '=',
            clAlign:        '@',
            clAlignModel:   '=',
            clPageChanged:  '&',
            clSteps:        '=',
            clCurrentPage:  '='
        },
        controllerAs: 'vm',
        templateUrl: 'dashboard/directives/pagination.html',
        controller: [ '$scope', function ( $scope ) {

            var vm = this;

            vm.first = '<<';
            vm.last = '>>';
            vm.index = 0;
            vm.clSteps = $scope.clSteps;

            vm['goto'] = function ( index ) {

                $scope.clCurrentPage = vm.page[ index ];

            };

            vm.gotoPrev = function () {

                $scope.clCurrentPage = vm.index;
                vm.index -= vm.clSteps;

            };

            vm.gotoNext = function () {

                vm.index += vm.clSteps;
                $scope.clCurrentPage = vm.index + 1;

            };

            vm.gotoFirst = function () {

                vm.index = 0;
                $scope.clCurrentPage = 1;

            };

            vm.gotoLast = function () {

                vm.index = parseInt( $scope.clPages / vm.clSteps ) * vm.clSteps;
                vm.index === $scope.clPages ? vm.index = vm.index - vm.clSteps : '';
                $scope.clCurrentPage = $scope.clPages;

            };

            $scope.$watch('clCurrentPage', function ( value ) {

                vm.index = parseInt( ( value - 1 ) / vm.clSteps ) * vm.clSteps;
                $scope.clPageChanged();

            });

            $scope.$watch('clPages', function () {

                vm.init();

            }, true );

            vm.init = function () {

                vm.stepInfo = function () {

                    for ( var result = [], i = 0; i < vm.clSteps; i ++ ) {

                        result.push( i + 1 );

                    }

                    return result;

                }();

                vm.page = function () {

                    for ( var result = [], i = 1; i <= $scope.clPages; i ++ ) {

                        result.push( i );

                    }

                    return result;

                }();

            };

            //

            vm.init();

        }]
    };

}]);
