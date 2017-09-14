/*
 * @author Illya, ohmed, salat
 * Admin 'Settings' tab controller
*/

angular.module( 'Admin.module' )

.controller( 'settings.controller', [ '$scope', 'settings.service', function ( $scope, settingsService ) {

    var $this = this;

    $this.selectedRoles = [];
    $this.selectedRolesStarters = [];
    $this.readonly = false;

    //

    $scope.goToElement = function ( block ) {

        var app = document.querySelector( '.app-content' );
        $( app ).stop().animate( { scrollTop:$( '#' + block ).position().top + 170 }, 500 );

    };

    document.querySelector( '.app-content' ).addEventListener( 'scroll', function ( event ) {

        var appContent = $( document.querySelector( '.app-content' ) ).scrollTop();

        if ( appContent > -1 && appContent <= 498 ) {

            $( '.first-block' ).addClass( 'active' );

        } else {

            $( '.first-block' ).removeClass( 'active' );

        }

        if ( appContent > 499 && appContent <= 956 ) {

            $( '.second-block' ).addClass( 'active' );

        } else {

            $( '.second-block' ).removeClass( 'active' );

        }

        if ( appContent > 957  && appContent <= 1944 ) {

            $( '.third-block' ).addClass( 'active' );

        } else {

            $( '.third-block' ).removeClass( 'active' );

        }

        if ( appContent > 1944 && appContent <= 2200 ) {

            $( '.four-block' ).addClass( 'active' );

        } else {

            $( '.four-block' ).removeClass( 'active' );

        }

        if ( appContent > 2201 ) {

            $( '.five-block' ).addClass( 'active' );

        } else {

            $( '.five-block' ).removeClass( 'active' );

        }

    });

    //

    $this.save = function () {

        settingsService.setParams( $this.settings )

    };

    $this.init = function () {

        settingsService.getParams()
        .then ( function ( responce ) {

            $this.settings = responce.data.settings;

        });

    };

    //

    $this.init();

}]);
