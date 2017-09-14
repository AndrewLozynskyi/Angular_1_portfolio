/*
 * @author
 * HR-tool Login page
*/

angular.module( 'hrTools', [

    'ngMaterial',
    'ngAnimate',
    'ngCookies',
    'ngLetterAvatar'

])

.config( [ '$mdThemingProvider', '$mdIconProvider', '$locationProvider', function ( $mdThemingProvider, $mdIconProvider, $locationProvider ) {

        $mdIconProvider.fontSet('md', 'material-icons');

        var customPrimary = $mdThemingProvider.extendPalette('blue', {
            '50': '#fff',
            '400': '#2fdcda',
            '500': '#2fdcda',
            'contrastDefaultColor': '50',
            'contrastLightColors': ['400', '500'],
        });
        $mdThemingProvider.definePalette( 'customPrimary', customPrimary );

        var customBackground = {
            '50': '#20232a', // default background for md-sidenav
            '100': '#cc0000', // todo change color
            '200': '#292c33', // hover and active element in select
            '300': '#cc0000', // todo change color
            '400': '#cc0000', // todo change color
            '500': '#2fdcda', // hover color
            '600': '#cc0000', // todo change color
            '700': '#cc0000', // todo change color
            '800': '#20232a', // dark background for md-sidenav
            '900': '#ffffff', // dark color elements on content
            'A100': '#1d1f25', // dark background for an ui element
            'A200': '#bfbfbf', // font color for an ui element
            'A400': '#20232a', // dark background for md-content
            'A700': '#cc0000',  // todo change color

        };
        var customWarn = $mdThemingProvider.extendPalette('blue', {
            '500': '#ff0000',
            '600': '#06c502',
        });
        $mdThemingProvider.definePalette( 'customWarn', customWarn );
        $mdThemingProvider.definePalette( 'customBackground', customBackground );
        $mdThemingProvider.theme( 'default' )
            .primaryPalette('customPrimary', {
                'default': '500',
                'hue-1': '400',
                'hue-2': '600', // todo change color
                'hue-3': 'A100' // todo change color
            })
            .accentPalette('orange')
            .warnPalette('customWarn')
            .backgroundPalette('customBackground')
            .dark();

}])

.run([ '$rootScope', 'auth.service', function ( $rootScope, authService ) {

    $rootScope.checked = false;
    $rootScope.error = false;

    //

    $rootScope.login = function () {

        var login = angular.element('.user-email').val();
        var password = angular.element('.user-password').val();

        //

        authService.loginRequest({ email: login, password: password }, function ( response ) {

            if ( response.session ) {

                if ( ! $rootScope.checked ) {

                    setTimeout( function () {

                        window.location = '/';

                    }, 1500 );

                } else {

                    window.location = '/';

                }

                $rootScope.checked = true;

            } else {

                $rootScope.error = response.message;

            }

        });

    };

    $rootScope.ifUserExists = function () {

        var username = angular.element('.user-email').val();

        //

        authService.ifUserExists( username, function ( result ) {

            if ( result.user ) {

                if ( result.user.userpic ) {

                    $rootScope.loginAvatar = '/usersData/' + result.user.uid + '/' + result.user.userpic;

                }

                $rootScope.initials = result.user.initials;
                $rootScope.checked = true;

            }

        });

    };

    $rootScope.loginFB = function () {

        authService.loginFB( {}, function ( responce ) {

            // todo

        });

    };

    $rootScope.loginLI = function () {

        authService.loginLI( {}, function ( responce ) {

            // todo

        });

    };

    $rootScope.loginFF = function () {

        authService.loginGG( {}, function ( responce ) {

            // todo

        });

    };

    //

    angular.element('.login-container').css( 'opacity', 1 );

}]);
