/*
 * @author ohmed
 * Roles Details 'Scopes' tab directive
*/

angular.module( 'Admin.module' )

.directive( 'roleDetailsScope', [ function () {

    return {
        restrict: 'E',
        controllerAs: 'rds',
        templateUrl: 'admin/directives/role-details-scope.html',
        controller: [ '$scope', '$cookies', 'company.service', 'roles.service', function ( $scope, $cookies, companyService, rolesService ) {

            $this = this;

            $scope.countries = [];
            $scope.departments = [];

            $scope.selectedCountries = [];
            $scope.selectedDepartments = [];

            $scope.selectedItems = {};

            $scope.editMode = false;
            $this.role = false;

            $scope.basedOn = 'hierarchy';

            $scope.originalValues = {
                countries:      false,
                departments:    false,
                basedOn:        false
            };

            //

            $scope.changeBasedOn = function () {

                if ( ! $scope.editMode ) return;

                $scope.selectedCountries = [];
                $scope.selectedDepartments = [];
                $scope.departments = [];
                $scope.selectedItems = {};
                $scope.selectCountry();

            };

            $scope.selectCountry = function ( countries ) {

                countries = countries || {};
                if ( countries[0] === 'all' ) countries = [];

                var countryList = [];
                for ( var countryName in countries ) {

                    countryList.push( countryName );

                }

                companyService
                .getDepartmentList( countries )
                .then( function ( departments ) {

                    $scope.departments = departments;

                    for ( var countryName in $scope.selectedItems ) {

                        if ( countries.indexOf( countryName ) === -1 ) {

                            delete $scope.selectedItems[ countryName ];

                        }

                    }

                    for ( var i = 0, il = countries.length; i < il; i ++ ) {

                        $scope.selectedItems[ countries[ i ] ] = $scope.selectedItems[ countries[ i ] ] || {};

                        if ( $scope.basedOn === 'country-department' ) {

                            var departmentsObj = {};
                            var newDepartmentsList = [];

                            for ( var j = 0, jl = departments.length; j < jl; j ++ ) {

                                $scope.selectedItems[ countries[ i ] ][ departments[ j ].name ] = ( $scope.selectedItems[ countries[ i ] ][ departments[ j ].name ] !== undefined ) ? $scope.selectedItems[ countries[ i ] ][ departments[ j ].name ] : false;
                                departmentsObj[ departments[ j ].name ] = 1;

                            }

                            for ( var j = 0, jl = $scope.selectedDepartments.length; j < jl; j ++ ) {

                                if ( departmentsObj[ $scope.selectedDepartments[ j ] ] ) {

                                    newDepartmentsList.push( $scope.selectedDepartments[ j ] );

                                }

                            }

                            $scope.selectedDepartments = newDepartmentsList;

                        } else if ( $scope.basedOn === 'country' ) {

                            $scope.selectedItems[ countries[ i ] ] = 'all';
                            $scope.selectedItems = {};

                            for ( var i = 0, il = countries.length; i < il; i ++ ) {

                                $scope.selectedItems[ countries[ i ] ] = { 'all': true };

                            }


                        }

                    }

                });

            };

            $scope.selectDepartment = function ( departments ) {

                if ( $scope.basedOn === 'department' ) {

                    $scope.selectedItems[ 'all' ] = {};

                    for ( var i = 0, il = departments.length; i < il; i ++ ) {

                        $scope.selectedItems[ 'all' ][ departments[ i ] ] = true;

                    }

                }

            };

            $scope.save = function () {

                $this.role.scope.basedOn = $scope.basedOn;
                $this.role.scope.countries = $scope.selectedItems;

                //

                rolesService
                .updateScope( [ $this.role ] )
                .then( function () {

                    $scope.originalValues = $this.role.scope;
                    $scope.editMode = false;
                    $cookies.remove( 'rolePermissionsUpdateToken', { path: '/' } );

                });

            };

            $scope.cancel = function () {

                $scope.selectedCountries = $scope.originalValues.countries;
                $scope.selectedDepartments = $scope.originalValues.departments;
                $scope.basedOn = $scope.originalValues.basedOn;

                $scope.editMode = false;
                $cookies.remove( 'rolePermissionsUpdateToken', { path: '/' } );

            };

            //

            function init ( data ) {

                $this.role = data;

                $scope.originalValues = $this.role.scope;
                $scope.basedOn = $this.role.scope.basedOn;

                $scope.selectedCountries = [];
                $scope.selectedDepartments = [];
                $scope.selectedItems = {};

                for ( var countryName in $this.role.scope.countries ) {

                    $scope.selectedCountries.push( countryName );
                    $scope.selectedItems[ countryName ] = {};

                    for ( var departmentName in $this.role.scope.countries[ countryName ] ) {

                        if ( $this.role.scope.countries[ countryName ][ departmentName ] ) {

                            $scope.selectedDepartments.push( departmentName );

                        }

                        $scope.selectedItems[ countryName ][ departmentName ] = $this.role.scope.countries[ countryName ][ departmentName ];

                    }

                }

                //

                companyService
                .getCountryList()
                .then( function ( countries ) {

                    $scope.countries = countries;

                });

            };

            $scope.$watch( 'selectedDepartments', function ( value ) {

                $scope.selectDepartment( value );
                console.log( value);

            });

            $scope.$watch( 'selectedCountries', function ( value ) {

                $scope.selectCountry( value );

            });

            $scope.$on( 'roleData', function ( event, data ) {

                if ( ! data ) return;
                init( data );

            });

            $scope.$on( 'editMode', function ( event, value ) {

                $scope.editMode = value;

            });

        }]
    };

}]);
