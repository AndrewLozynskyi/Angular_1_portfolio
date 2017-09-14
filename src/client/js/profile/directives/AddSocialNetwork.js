/*
 * @author oleg, ohmed
 * Profile 'Add new social network' directive
*/

angular.module( 'Profile.module' )

.directive( 'addSocialNetworks', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'nsn',
        templateUrl: '/views/profile/directives/add-social-network.html',
        controller: [ '$scope' , 'users.service', '$cookies', function ( $scope, usersService, $cookies ) {

            var $this = this;

            $this.networks = [
                { name: 'Twitter', icon: 'fa fa-twitter fa-lg' },
                { name: 'Telegram', icon: 'fa fa-telegram fa-lg' },
                { name: 'Facebook', icon: 'fa fa-facebook fa-lg' },
                { name: 'Skype', icon: 'fa fa-skype fa-lg' },
                { name: 'LinkedIn', icon: 'fa fa-linkedin-square fa-lg' },
                { name: 'Medium', icon: 'fa fa-medium fa-lg' },
                { name: 'Google+', icon: 'fa fa-google-plus fa-lg' }
            ];

            $this.showInput = false;
            $this.selecteditem = {};
            // add name and icon to userSocialLink
            $this.socialLinks = usersService.user.message.socialLinks;
            $this.socialLinks[ 'facebook' ].name = 'Facebook';
            $this.socialLinks[ 'facebook' ].icon = 'fa fa-facebook fa-lg';
            $this.socialLinks[ 'googlePlus' ].name = 'Google+';
            $this.socialLinks[ 'googlePlus' ].icon = 'fa fa-google-plus fa-lg';
            $this.socialLinks[ 'linkedin' ].name = 'LinkedIn';
            $this.socialLinks[ 'linkedin' ].icon = 'fa fa-linkedin-square fa-lg';
            $this.socialLinks[ 'medium' ].name = 'Medium';
            $this.socialLinks[ 'medium' ].icon = 'fa fa-medium fa-lg';
            $this.socialLinks[ 'skype' ].name = 'Skype';
            $this.socialLinks[ 'skype' ].icon = 'fa fa-skype fa-lg';
            $this.socialLinks[ 'telegram' ].name = 'Telegram';
            $this.socialLinks[ 'telegram' ].icon = 'fa fa-telegram fa-lg';
            $this.socialLinks[ 'twitter' ].name = 'Twitter';
            $this.socialLinks[ 'twitter' ].icon = 'fa fa-twitter fa-lg';

            //

            $this.setItem = function ( key ) {

                $this.showInput = true;
                $this.selecteditem = $this.socialLinks[ key ];

            };

            $this.close = function () {

                $this.showInput = false;
                $scope.$parent.addingNewSocialLink = false;

            };

            $this.save = function () {

                $this.showInput = false;

                $this.selecteditem.enable = true;
                $this.selecteditem.link = $('.inputNewItem').val();

                var uid = $cookies.get('uid');
                var session = $cookies.get('session');

                var socialLinksArray = [];

                for ( var key in $this.socialLinks ) {

                    $this.socialLinks[ key ].sn = key;
                    var profileSocialLink = $this.socialLinks[ key ];

                    socialLinksArray.push(profileSocialLink);
                }

                usersService
                .saveAddSocialNetwork( uid, session, socialLinksArray );

                $this.close();

            };

        }]
    };

}]);
