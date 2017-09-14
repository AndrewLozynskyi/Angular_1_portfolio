/*
 * @author ohmed
 * Team user table directive
*/

angular.module( 'Profile.module' )

.directive( 'teamUsersTable', [ '$window', function ( $window ) {

   return {
        restrict: 'E',
        scope: {
            employeesTable: '='
        },
        controllerAs: 'tuc',
        templateUrl: 'profile/directives/team-users-table.html',
        controller: [ '$scope', '$mdDialog', function ( $scope, $mdDialog ) {

            var $this = this;

            $this.setSidebarData = [
                { "name": "Startes", "total": 24 },
                { "name": "Leavers", "total": 4 },
                { "name": "Transfers", "total": 1 },
                { "name": "All", "total": 29 }
            ];

            $this.lineChart = {
                "teamHeadcount": {
                    "transfers": [ 1, 2, 3, 3, 2 ],
                    "leavers":   [ 1, 2, 3, 6, 2 ],
                    "startes":   [ 1, 2, 3, 3, 2 ],
                    "total":     [ 11, 12, 13, 15, 12 ]
                },
                "department": {
                    "transfers": [ 2, 3, 4, 6, 3 ],
                    "leavers":   [ 2, 3, 4, 4, 3 ],
                    "startes":   [ 2, 3, 2, 5, 3 ],
                    "total":     [ 17, 19, 18, 26, 23 ]
                }
            }

            $scope.$watch('employeesTable', function ( data ) {

                if( data === undefined ) return ;

                $this.employeesData = data;

                for ( var i = 0; i < $this.employeesData.employees.length; i ++ ) {

                    $this.employeesData.employees[ i ].userName = $this.employeesData.employees[ i ].firstName.charAt(0) + $this.employeesData.employees[ i ].lastName.charAt(0)

                }

            });


        }]
    };

}]);
