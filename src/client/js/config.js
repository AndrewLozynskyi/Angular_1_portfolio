/*
 * @author ohmed, vova, illya, markiyan
 * HR Tools app config file
*/

angular.module( 'hrTools' )

.config( [ '$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdIconProvider', '$locationProvider', function ( $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider, $locationProvider ) {

    $urlRouterProvider.otherwise('/dashboard');
    $urlRouterProvider.when('/dashboard', '/dashboard/home');
    $urlRouterProvider.when('/profile', '/profile/about');
    $urlRouterProvider.when('/admin', '/admin/home');

    //

    $stateProvider

    // Dashboard

    .state({
        name:           'dashboard',
        url:            '/dashboard',
        templateUrl:    '/views/dashboard/dashboard.html',
    })

    .state('dashboard.home', {
        controller:     'home.controller',
        controllerAs:   'hmc',
        url:            '/home',
        templateUrl:    '/views/dashboard/home.html',
    })

    .state('dashboard.headcount', {
        controller:     'headcount.controller',
        controllerAs:   'hc',
        url:            '/headcount',
        templateUrl:    '/views/dashboard/headcount.html',
    })

    .state('dashboard.attrition', {
        controller:     'attrition.controller',
        controllerAs:   'ac',
        url:            '/attrition',
        templateUrl:    '/views/dashboard/attrition.html'
    })

    .state('dashboard.workforce', {
        controller:     'workforce.controller',
        controllerAs:   'wc',
        url:            '/workforce',
        templateUrl:    '/views/dashboard/workforce.html',
    })

    .state('dashboard.finance', {
        controller:     'finance.controller',
        controllerAs:   'fc',
        url:            '/finance',
        templateUrl:    '/views/dashboard/finance.html',
    })

    .state('dashboard.absences', {
        controller:     'absences.controller',
        controllerAs:   'ab',
        url:            '/absences',
        templateUrl:    '/views/dashboard/absences.html',
    })

    .state('dashboard.resourcing', {
        controller:     'resourcing.controller',
        controllerAs:   'rs',
        url:            '/resourcing',
        templateUrl:    '/views/dashboard/resourcing.html',
    })

    .state('dashboard.salary', {
        controller:     'salary.controller',
        controllerAs:   'sl',
        url:            '/salary',
        templateUrl:    '/views/dashboard/salary.html',
    })

    .state('dashboard.eod', {
        controller:     'eod.controller',
        controllerAs:   'eod',
        url:            '/eod',
        templateUrl:    '/views/dashboard/eod.html',
    })

    // Contacts

    .state('contacts', {
        controller:     'contacts.controller',
        controllerAs:   'cc',
        url:            '/contacts',
        templateUrl:    '/views/contacts/contacts.html'
    })

    // Chats

    .state('chat', {
        url:            '/chat',
        templateUrl:    '/views/chat/chat.html'
    })

    // Boarding

    .state('boarding', {
        url:            '/boarding',
        templateUrl:    '/views/boarding/boarding.html'
    })

    // API

    .state('api', {
        url:            '/api',
        templateUrl:    '/views/api/api.html'
    })

    // Profile

    .state('profile', {
        controller:     'profile.controller',
        controllerAs:   'pf',
        url:            '/profile/:username',
        templateUrl:    '/views/profile/profile.html'
    })

    .state('profile.about', {
        controller:     'about.controller',
        controllerAs:   'ac',
        url:            '/about',
        templateUrl:    '/views/profile/about.html'
    })

    .state('profile.wall', {
        url:            '/wall',
        templateUrl:    '/views/profile/wall.html'
    })

    .state('profile.contacts', {
        controller:     'profileContacts.controller',
        controllerAs:   'pcc',
        url:            '/contacts',
        templateUrl:    '/views/profile/contacts.html'
    })

    .state('profile.teams', {
        controller:     'teams.controller',
        controllerAs:   'tc',
        url:            '/teams',
        templateUrl:    '/views/profile/teams.html'
    })

    .state('profile.details', {
        url:            '/details',
        templateUrl:    '/views/profile/details.html'
    })

    .state('usernotfound', {
        url:            '/usernotfound',
        templateUrl:    '/views/main/directives/error404.html'
    })

    // Admin

    .state({
        name:           'admin',
        url:            '/admin',
        templateUrl:    '/views/admin/admin.html',
    })

    .state('admin.home', {
        controller:     'adminHome.controller',
        controllerAs:   'home',
        url:            '/home',
        templateUrl:    '/views/admin/home.html'
    })

    .state('admin.roles', {
        controller:     'roles.controller',
        controllerAs:   'rc',
        url:            '/roles',
        templateUrl:    '/views/admin/roles.html'
    })

    .state('admin.users', {
        controller:     'user.controller',
        controllerAs:   'ua',
        url:            '/users',
        templateUrl:    '/views/admin/users.html'
    })

    .state('admin.permissions', {
        controller:     'permissions.controller',
        controllerAs:   'pc',
        url:            '/permissions',
        templateUrl:    '/views/admin/permissions.html'
    })

    .state('admin.activity', {
        url:            '/activity-on-server',
        templateUrl:    '/views/admin/activity-on-server.html'
    })

    .state('admin.notifications', {
        url:            '/alert-notifications',
        templateUrl:    '/views/admin/alert-notifications.html'
    })

    .state('admin.paymentslogs', {
        url:            '/payments-logs',
        templateUrl:    '/views/admin/payments-logs.html'
    })

    .state('admin.settings', {
        controller:     'settings.controller',
        controllerAs:   'sa',
        url:            '/settings',
        templateUrl:    '/views/admin/settings.html'
    });

    //

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    //

    $mdIconProvider.fontSet('md', 'material-icons');

    var customPrimary = $mdThemingProvider.extendPalette('blue', {
        '50': '#fff',
        '400': '#2fdcda',
        '500': '#17a9a8',
        'contrastDefaultColor': '50',
        'contrastLightColors': ['400', '500'],
    });
    $mdThemingProvider.definePalette('customPrimary', customPrimary);

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
    $mdThemingProvider.definePalette('customWarn', customWarn);
    $mdThemingProvider.definePalette('customBackground', customBackground);
    $mdThemingProvider.theme('default')
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

}]);
