/*
 * @author ohmed
 * Department dropdown direcive
*/

angular.module( 'Dashboard.module' )

.directive( 'departmentDropdown', [ function () {

    return {
        restrict: 'E',
        scope: {
            departmentList:     '=',
            activeParams:       '=',
            getDepartments:     '=',
            selectDepartments:  '='
        },
        controllerAs: 'dd',
        templateUrl: 'dashboard/directives/department-dropdown.html',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.readonly = false;
            $this.one = false;

            //

            $this.getSelectedChipIndex = function ( event ) {

                if ( event.length === 0 ) {

                    this.one = false;

                }

            };

            $this.change = function ( newValue, oldValue ) {

                if ( Math.abs( newValue.length - oldValue.length ) > 1 ) {

                    return;

                }

                angular.element('.md-select-menu-container').removeClass('hide-first');

                var changedValue = getArrayChangedValue( newValue, oldValue );

                if ( changedValue.value === 'all' ) {

                    if ( changedValue.action === 'added' ) {

                        this.one = true;

                        $scope.activeParams.departments = angular.copy( $scope.getDepartments() );
                        $scope.activeParams.departments.unshift('all');
                        angular.element('.md-select-menu-container').addClass('hide-first');

                    } else {

                        this.one = false;

                        $scope.activeParams.departments = [];

                    }

                } else {

                    if ( changedValue.action === 'added' ) {

                        this.one = true;

                        if ( $scope.activeParams.departments.length === $scope.getDepartments().length ) {

                            $scope.activeParams.departments.unshift('all');
                            angular.element('.md-select-menu-container').addClass('hide-first');

                        }

                    } else {

                        var newList = [];

                        for ( var i = 0, il = $scope.activeParams.departments.length; i < il; i ++ ) {

                            if ( $scope.activeParams.departments[ i ] === 'all' ) continue;
                            newList.push( $scope.activeParams.departments[ i ] );

                        }

                        if(newList.length === 0) {

                            this.one = false;

                        }

                        $scope.activeParams.departments = newList;

                    }

                }

                $scope.selectDepartments( $scope.activeParams.departments.filter( function ( value ) { return value !== 'all'; }) );

            };

            var getArrayChangedValue = function ( newValue, oldValue ) {

                for ( var i = 0, il = newValue.length; i < il; i ++ ) {

                    var present = false;

                    for ( var j = 0, jl = oldValue.length; j < jl; j ++ ) {

                        if ( oldValue[ j ] === newValue[ i ] ) {

                            present = true;
                            break;

                        }

                    }

                    if ( present === false ) {

                        return { value: newValue[ i ], action: 'added' };

                    }

                }

                for ( var i = 0, il = oldValue.length; i < il; i ++ ) {

                    var present = false;

                    for ( var j = 0, jl = newValue.length; j < jl; j ++ ) {

                        if ( newValue[ j ] === oldValue[ i ] ) {

                            present = true;
                            break;

                        }

                    }

                    if ( present === false ) {

                        return { value: oldValue[ i ], action: 'removed' };

                    }

                }

                return false;

            };

        }]
    };

}]);
