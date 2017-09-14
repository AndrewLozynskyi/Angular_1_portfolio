/*
 * @author ohmed
 * Calendar directive
*/

angular.module( 'Dashboard.module' )

.directive( 'fullCalendar', [ function () {

    return {
        restrict: 'A',
        link: function ( scope, element ) {

            element.fullCalendar({
                contentHeight: 'auto',
                theme: true,
                header: {
                    right:      'nextYear',
                    center:     'prev, title, next',
                    left:       'prevYear'
                },
                defaultDate: new Date(),
                editable: false
            });

        }
    };

}]);
