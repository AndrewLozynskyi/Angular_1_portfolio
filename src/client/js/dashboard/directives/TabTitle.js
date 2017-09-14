/*
 * @author ohmed
 * Tab title directive
*/

angular.module( 'Dashboard.module' )

.directive( 'tabTitle', [ function () {

    return {
        restrict: 'E',
        scope: {
            activeParams:       '=',
            tabTitle:           '=',
            selectedDate:       '=',
            selectCountries:    '=',
            selectDepartments:  '=',
            getCountries:       '=',
            getDepartments:     '='
        },
        controllerAs: 'tt',
        templateUrl: 'dashboard/directives/tab-title.html',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.countriesEditMode = false;
            $this.departmentsEditMode = false;
            $this.inited = false;

            $this.updateCountryList = function () {

                var departments = $scope.getDepartments();
                var newDepartmentsList = [];

                for ( var i = 0, il = $scope.activeParams.departments.length; i < il; i ++ ) {

                    for ( var j = 0, jl = departments.length; j < jl; j ++ ) {

                        if ( $scope.activeParams.departments[ i ] === departments[ j ] ) {

                            newDepartmentsList.push( departments[ j ] );
                            break;

                        }

                    }

                }

                $scope.activeParams.departments = newDepartmentsList;

                //

                var countryList = '';

                for ( var i = 0, il = $scope.activeParams.countries.length; i < il; i ++ ) {

                    if ( $scope.activeParams.countries[ i ] === 'all' ) continue;
                    if ( countryList !== '' ) countryList += ', ';
                    countryList += $scope.activeParams.countries[ i ];

                }

                angular.element( '.country-list' ).html( countryList );

            };

            $this.enableCountryEditMode = function () {

                if ( $scope.activeParams.countries.length === 0 ) {

                    $this.disableCountryEditMode();
                    return;

                }

                setTimeout( function () { angular.element('body').click( $this.disableCountryEditMode ); }, 100 );

                $this.countriesEditMode = true;
                angular.element('.headcount-header .country-item').remove();
                angular.element( '.country-list' ).hide();

                for ( var i = $scope.activeParams.countries.length - 1; i >= 0; i -- ) {

                    if ( $scope.activeParams.countries[ i ] === 'all' ) continue;

                    angular.element('<div class="country-item" country="' + $scope.activeParams.countries[ i ] + '"><div class="wrapper">' + $scope.activeParams.countries[ i ] + '<span class="close-icon">clear</span></div></div>' ).insertAfter( '.title-cont-divider' );

                }

                angular.element('.country-item .close-icon').click( $this.removeCountryFromList );
                angular.element('.country-item .close-icon').click( function ( event ) { return false; });

            };

            $this.disableCountryEditMode = function () {

                if ( ! $this.countriesEditMode ) return false;

                $this.updateCountryList();
                $this.countriesEditMode = false;
                angular.element( '.country-list' ).show();
                angular.element('.headcount-header .country-item').remove();
                angular.element('body').off( 'click', $this.disableCountryEditMode );

            };

            $this.removeCountryFromList = function ( event ) {

                var country = event.currentTarget.parentNode.parentNode.getAttribute('country');

                $scope.activeParams.countries = $scope.activeParams.countries.filter( function ( value ) {

                    return ( value !== country && value !== 'all' );

                });

                $scope.$apply();
                $scope.selectCountries( $scope.activeParams.countries );
                $this.enableCountryEditMode();

            };

            //

            $this.updateDepartmentList = function () {

                var countries = $scope.getCountries();
                var newCountryList = [];

                for ( var i = 0, il = $scope.activeParams.countries.length; i < il; i ++ ) {

                    for ( var j = 0, jl = countries.length; j < jl; j ++ ) {

                        if ( $scope.activeParams.countries[ i ] === countries[ j ] ) {

                            newCountryList.push( countries[ j ] );
                            break;

                        }

                    }

                }

                $scope.activeParams.countries = newCountryList;

                //

                var departmentList = '';

                for ( var i = 0, il = $scope.activeParams.departments.length; i < il; i ++ ) {

                    if ( $scope.activeParams.departments[ i ] === 'all' || $scope.activeParams.departments[ i ] === 'Total' ) continue;
                    if ( departmentList !== '' ) departmentList += ', ';
                    departmentList += $scope.activeParams.departments[ i ];

                }

                angular.element( '.department-list' ).html( departmentList );

            };

            $this.enableDepartmentEditMode = function () {

                if ( $scope.activeParams.departments.length === 0 ) {

                    $this.disableDepartmentEditMode();
                    return;

                }

                setTimeout( function () { angular.element('body').click( $this.disableDepartmentEditMode ); }, 100 );

                $this.departmentsEditMode = true;
                angular.element('.headcount-header .department-item').remove();
                angular.element('.department-list').hide();

                for ( var i = $scope.activeParams.departments.length - 1; i >= 0; i -- ) {

                    if ( $scope.activeParams.departments[ i ] === 'all' || $scope.activeParams.departments[ i ] === 'Total' ) continue;

                    angular.element('<div class="department-item" department="' + $scope.activeParams.departments[ i ] + '"><div class="wrapper">' + $scope.activeParams.departments[ i ] + '<span class="close-icon">clear</span></div></div>' ).insertAfter( '.cont-dep-divider' );

                }

                angular.element('.department-item .close-icon').click( $this.removeDepartmentFromList );
                angular.element('.department-item .close-icon').click( function ( event ) { return false; });

            };

            $this.disableDepartmentEditMode = function () {

                if ( ! $this.departmentsEditMode ) return false;

                $this.updateDepartmentList();
                $this.departmentsEditMode = false;
                angular.element( '.department-list' ).show();
                angular.element('.headcount-header .department-item').remove();
                angular.element('body').off( 'click', $this.disableDepartmentEditMode );

            };

            $this.removeDepartmentFromList = function ( event ) {

                var department = event.currentTarget.parentNode.parentNode.getAttribute('department');
                $scope.activeParams.departments = $scope.activeParams.departments.filter( function ( value ) {

                    return ( value !== department && value !== 'all' );

                });

                $scope.$apply();
                $scope.selectDepartments( $scope.activeParams.departments );
                $this.enableDepartmentEditMode();

            };

            //

            $this.back = function () {

                if ( $scope.activeParams.countries.length && $scope.activeParams.departments.length ) {

                    $scope.activeParams.departments = [];
                    $scope.selectDepartments( $scope.activeParams.departments );

                } else if ( $scope.activeParams.countries.length ) {

                    $scope.activeParams.countries = [];
                    $scope.selectCountries( $scope.activeParams.countries );

                } else if ( $scope.activeParams.departments.length ) {

                    $scope.activeParams.departments = [];
                    $scope.selectDepartments( $scope.activeParams.departments );

                }

            };

            //

            $scope.$watchCollection( 'activeParams.countries', this.updateCountryList );
            $scope.$watchCollection( 'activeParams.departments', this.updateDepartmentList );

        }]
    };

}]);
