/*
 * @author ohmed, markiyan
 * Dashboard top date slicer
 */

angular.module( 'Dashboard.module' )

.controller( 'slider.controller', [ '$scope', '$rootScope', 'filters.factory', '$filter', function ( $scope, $rootScope, filters, $filter ) {

    var selectedDate = filters.getDateFilter();

    changeSelectedDate();

    $scope.months = [];
    $scope.date = false;

    for ( var i = 0; i < 12; i ++ ) {

        $scope.months.push( $filter( 'date' )( new Date( selectedDate.year, i ), 'MMM' ) );

    }

    var selected;
    var selectedYear;

    $scope.years = [ 2015, 2016, 2017 ];

    var data = 'Jan';
    var lastActiveMonth = $scope.months[ selectedDate.month - 1 ];
    $scope.currentMonth = lastActiveMonth;

    $scope.minDate = new Date( $scope.years[ $scope.years.length - 1 ], selectedDate.month, 1 );
    $scope.maxDate = new Date( $scope.years[ $scope.years.length - 1 ], selectedDate.month + 1, 0 );

    //

    $scope.clickedYear = function ( year, event ) {

        selectedDate.year = year;

        if ( new Date().getFullYear() > year ) {

            $scope.currentMonth = $scope.months[ 11 ];

        } else {

            $scope.currentMonth = lastActiveMonth;
            selectedDate.month = 1;

            if ( selected ) {

                selected.parent()
                    .removeClass( 'selectedMonth' );
                selected.removeClass( 'selectedMonth' );

            }

        }

        if ( selectedYear ) {

            selectedYear.parent()
                .removeClass( 'active-year' );
            selectedYear.removeClass( 'active-year' );

        }

        selectedYear = angular.element( event.target );

        selectedYear.parent()
            .addClass( 'active-year' );
        selectedYear.addClass( 'active-year' );

        changeSelectedDate();

    };

    $scope.lastYear = function ( elem ) {

        if ( elem.$last ) {

            selectedYear = $( '.year-button:last' );

            selectedYear.parent()
                .addClass( 'active-year' );
            selectedYear.addClass( 'active-year' );

        }

    };

    $scope.refresh = function () {

        angular.element( document )
            .find('.dashboard-card')
            .addClass('add-shadow-position')

        angular.element( document )
            .find('#dashboard-card')
            .addClass('add-shadow')
            .removeClass('hide-shadow')

        angular.element( document )
            .find('.app-content')
            .addClass('add-shadow-scroll')

        $rootScope.showBackground = true;

        changeSelectedDate();
        filters.setDateFilter( selectedDate );

    };

    $scope.isActiveMonth = function ( month ) {

        return month === data;

    };

    $scope.clickedMonth = function ( month, event ) {

        if ( selectedDate.year >= new Date().getFullYear() && $scope.months.indexOf( month ) + 1 > new Date().getMonth() ) return;

        selectedDate.month = $scope.months.indexOf( month ) + 1;

        if ( selected ) {

            selected
                .parent()
                .removeClass( 'selectedMonth' );

            selected.removeClass( 'selectedMonth' );

        }

        selected = angular.element( event.target );

        selected
        .parent()
        .addClass( 'selectedMonth' );

        selected.addClass( 'selectedMonth' );

        changeSelectedDate();

    };

    $scope.$watch( 'date', function ( value ) {

        if ( ! value ) return;

        selectedDate.day = value.getDate();

    });

    function changeSelectedDate () {

        $scope.selectedDate = new Date( selectedDate.year, selectedDate.month - 1 );
        $scope.minDate = new Date( selectedDate.year, selectedDate.month - 1, 1 );
        $scope.maxDate = new Date( selectedDate.year, selectedDate.month, 0 );

    };

}]);
