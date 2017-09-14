/*
 * @author ohmed
 * Filters factory
 */

angular.module( 'Dashboard.module' )

.factory( 'filters.factory', [ function () {

    var refreshButton = document.getElementById( 'dashboard-button-refresh' );

    var d = new Date();
    var updateCallback;

    var dateFilter = {
        year:   d.getFullYear(),
        month:  d.getMonth(),
        day:    false
    };

    var filters = {};

    //

    filters.setDateFilter = function ( date ) {

        dateFilter = date;
        setDateFilter( dateFilter );

    };

    filters.getDateFilter = function () {

        return dateFilter;

    };

    filters.setUpdateCallback = function ( callback ) {

        updateCallback = callback;

    };

    function setDateFilter ( dateFilter ) {

        if ( typeof updateCallback === 'function' ) {

            updateCallback( dateFilter );

        }

    };

    //

    return filters;

}]);
