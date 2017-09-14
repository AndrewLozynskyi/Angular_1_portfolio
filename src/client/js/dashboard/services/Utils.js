/*
 * @author ohmed
 * Utils service
*/

angular.module( 'Dashboard.module' )

.service( 'utils.service', [ function () {

    var service = {};

    //

    this.formatingOnYear = function ( array, year ) {

        var lengthData = array.length;

        if ( 12 - lengthData > 0 ) {

            for ( var i = lengthData; i < 12; i ++ ) {

                var d = i + 1;

                array.push({
                    date: ( d < 10 ? '0' + d : d.toString() ) + ' ' + year
                });

            }

        }

        return array;

    };

    return service;

}]);
