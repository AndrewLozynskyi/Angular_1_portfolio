/*
 * @author ohmed
 * Side navigation menu controller
*/

angular.module( 'hrTools' )

.controller( 'sidenav.controller', [ '$scope', '$timeout', '$mdSidenav', '$mdMedia', '$window', 'auth.service', 'settings.service', '$cookies', 'profileContacts.service','$mdDialog', function ( $scope, $timeout, $mdSidenav, $mdMedia, $window, authService, settingsService, $cookies, contactsProfileService, $mdDialog ) {

    var scope = this;
    this.open = true;

    //

    $scope.enableContactsProfileLeftMenu = contactsProfileService.slideLeftMenu;

    $scope.$watch( function () {

        return ! $mdMedia('gt-md');

    }, function ( value ) {

        $('line-chart').resize();

    });

    $scope.$watch( function () {

        return $mdMedia('gt-md');

    }, function ( value ) {

        $('line-chart').resize();

    });

    this.logout = function () {

        authService.logout( function () {

            $cookies.remove( 'session', { path: '/' } );
            window.location.reload();

        });

    };

    this.close = function () {

        if ( ! $mdMedia('gt-md') && this.open ) {

            this.toggle();

        }

    };

    this.toggle = function () {

        var sideMenu = angular.element( 'md-sidenav' );
        var arrow = angular.element( '.sidenav-arrow' );

        if ( ! $mdMedia('gt-md') ) {

            $mdSidenav('left').toggle();

            this.open = true;

            arrow.css('transform', 'rotate( 0deg)');
            sideMenu.css('width', ( this.open ? 190 : 90 ) );

        } else {

            arrow.css('transform', 'rotate(' + ( this.open ? 180 : 0 ) + 'deg)');
            sideMenu.css('width', ( this.open ? 90 : 190 ) );

            if ( this.open ) {

                this.open = ! this.open;

                $('geo-chart').resize();
                $('line-chart').resize();

            } else {

                $timeout( function () {

                    scope.open = ! scope.open;

                    $('geo-chart').resize();
                    $('line-chart').resize();

                }, 300 );

            }

        }

    };

    // Rigth sidenav

    this.showDetails = false;
    this.alerts = false;
    this.notifications = false;
    this.email = false;
    this.currency = false;
    this.warnings = false;
    this.maintenance  = false;

    this.toggleRight = buildToggler('right');

    this.data = {
        cb1: true,
        cb2: true
    };

    //

    this.isOpenRight = function () {

      return $mdSidenav( 'right' ).isOpen();

    };

    function buildToggler ( navID ) {

        return function () {

            $mdSidenav( navID ).toggle()

        };

    };

    this.openDetails = function ( query ) {

        this.showDetails = true;

        if ( query === 'alerts' ) {

            this.alerts = true;

        } else if ( query === 'notifications' ) {

            this.notifications = true;

        } else if ( query === 'email' ) {

            this.email  = true;

        }
        else if ( query === 'currency' ) {

            this.currency  = true;

        } else if ( query === 'maintenance' ) {

            this.maintenance  = true;

        } else {

            this.warnings = true;

        }

    };

    this.hideDetails = function () {

        this.showDetails = false;
        this.alerts = false;
        this.notifications = false;
        this.email = false;
        this.currency = false;
        this.warnings = false;
        this.maintenance  = false;

    };

    this.save = function () {

        settingsService.setParams( $scope.settings );

    };

    $scope.init = function () {

        settingsService
        .getParams()
        .then ( function ( responce ) {

            $scope.settings = responce.data.settings;

        });

        this.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        this.weekNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

        this.d = new Date();
        scope.day = this.d.getDate();
        scope.month = this.monthNames[this.d.getMonth()];
        scope.weekday = this.weekNames[this.d.getDay()];

        if ( scope.day >= 4 && scope.day <= 20 || scope.day >= 24 && scope.day <= 30 ) {

            scope.prefix = 'th';

        } else if ( scope.day === 1 || scope.day === 21 || scope.day === 31 ) {

            scope.prefix = 'st';

        } else if ( scope.day === 2 || scope.day === 22 ) {

            scope.prefix = 'nd';

        } else {

            scope.prefix = 'rd';

        }

    };

    $scope.openBirthdayWindow = function ( ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            template: '<md-dialog class="happy-birthday" aria-label="Happy Birthday"><happy-birthday></happy-birthday></md-dialog>',
            targetEvent: event,
            clickOutsideToClose: true,
            escapeToClose: true
        })

    };

    document.querySelector( '.app-content' ).addEventListener( 'scroll', function () {

        var appContent = $( document.querySelector( '.app-content' ) ).scrollTop();

        if ( appContent > 1 ) {

            $('.btn-scroll-top').css( {"display": "block"} );

        } else {

            $('.btn-scroll-top').css( {"display": "none"} );

        }

        clearTimeout($.data(this, 'scrollTimer'));

        $('.btn-scroll-top').css({"opacity": "1", "transition": "opacity .1s"});

        $.data(this, 'scrollTimer', setTimeout( function () {

            $('.btn-scroll-top').css({"opacity": "0.4", "transition": "opacity .3s"});

        }, 800 ) );

    });

    $scope.topFunction = function () {

        $( document.querySelector( '.app-content' ) ).animate({scrollTop: "0px"}, 900).scrollTop( 0 );

    };

    //

    $scope.init();

}]);
