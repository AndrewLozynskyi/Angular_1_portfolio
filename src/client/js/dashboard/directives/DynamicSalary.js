/**
 * @author Oleg .
 * dynamic of salary table
 */

angular.module( 'Dashboard.module' )

.directive( 'dynamicSalaryTable', [ function () {
    return {
        restrict: 'E',
        scope: {
            setData: '='
        },
        templateUrl: 'dashboard/directives/dynamic-salary-table.html',
        link: function ( scope, element, attrs ) {

        },
        controller: [ '$scope', '$mdDialog', function ( $scope, $mdDialog ) {

            var $this = this;

            // $this.data = [

            //     { img :'/img/profile-pics/image.png' , name:'Name Surname', from:20, salary:435.6, data:{salary:[2,2,2,7,3,2,2,2]} ,date:'4 yrs, 5mth' },
            //     { img :'/img/profile-pics/image.png' , name:'Name Surname', from:-20, salary:435.6, data:{salary:[2,32,2,3,4,3,4,5]} ,date:'4 yrs, 5mth' },
            //     { img :'/img/profile-pics/image.png' , name:'Name Surname', from:20, salary:435.6, data:{salary:[2,3,4,5,6,7,3,4,5]} ,date:'4 yrs, 5mth' },
            //     { img :'/img/profile-pics/image.png' , name:'Name Surname', from:-20, salary:435.6, data:{salary:[2,4,5,6,73,7,3,3,3]} ,date:'4 yrs, 5mth' },
            //     { img :'/img/profile-pics/image.png' , name:'Name Surname', from:20, salary:435.6, data:{salary:[2,21,2,12,3,2,21,2]} ,date:'4 yrs, 5mth' },
            //     { img :'/img/profile-pics/image.png' , name:'Name Surname', from:20, salary:435.6, data:{salary:[2,3,4,5,6,7,3,4,5]} ,date:'4 yrs, 5mth' },

            // ];

            $this.setCount = function ( data ) {

                $this.employees = data;

                for ( var i = 0; i < $this.employees.list.length; i ++ ) {

                    $this.employees.list[ i ].salary = { salary: [ 2, 2, 3, 4, 2, 6, 7, 5 ] }

                }

            };

            $scope.$watch ( 'setData', function ( data ) {
                
                $this.employees = data;

                $this.setCount( data );

            });

        }],
        controllerAs: 'dst'
    };

}]);