/*
 * @author ohmed
 * Calendar directive
*/

angular.module( 'Dashboard.module' )

.controller( 'calendar.controller', [ '$mdDialog', function ( $mdDialog ) {

    function get_nth_suffix ( date ) {

        switch ( date ) {

            case 1:
            case 21:
            case 31:
                return 'st';
            case 2:
            case 22:
                return 'nd';
            case 3:
            case 23:
                return 'rd';
            default:
                return 'th';

        }

    };

    var $this = this;
    var date = new Date();
    var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

    $this.month = monthNames[ date.getMonth() ];
    $this.day = days[ date.getDay() ];
    $this.d = date.getDate();
    $this.sufix = get_nth_suffix( $this.d );

    $this.showAdvanced = function ( ev ) {

        $mdDialog.show({
            controller: 'eventCtrl',
            templateUrl: '/views/dashboard/eventWindow.html',
            parent: angular.element( document.body ),
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then( function ( answer ) {

            $this.status = 'You said the information was "' + answer + '".';

        }, function () {

            $this.status = 'You cancelled the dialog.';

        });

    };

}]);
