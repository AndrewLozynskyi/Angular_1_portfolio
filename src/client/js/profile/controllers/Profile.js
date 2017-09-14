/*
 * @author ohmed, iliya, volmat
 * Profile page main controller
*/

angular.module( 'Profile.module' )

.controller( 'profile.controller', [ '$scope', '$rootScope', 'users.service', 'contacts.service', '$mdDialog', '$stateParams', '$state', '$timeout', function ( $scope, $rootScope, usersService, contactsService, $mdDialog, $stateParams, $state, $timeout ) {

    var username = $stateParams.username;

    if ( $stateParams.username === '' ) {

        username = $rootScope.userData.username;

    }

    $scope.showFollowButtons = true;

    if ( username === $rootScope.userData.username ) {

        $scope.showFollowButtons = false;

    }

    $scope.followButtonTitle = 'Follow';
    $scope.contactButtonTitle = '+ Add Contact';
    $scope.avatarSrc = usersService.currentAvatar;
    $scope.showCaption = false;
    $scope.salaryData = [];
    $scope.editMode = false;

    //

    $scope.enableEditMode = function () {

        $scope.editMode = true;

    };

    $scope.follow = function () {

        if ( $scope.user.isInFollowing ) {

            contactsService.unfollowUsers( [ $scope.user.uid ], function ( response ) {

                $scope.followButtonTitle = 'Follow';
                $scope.user.isInFollowing = false;

            });

        } else {

            contactsService.followUsers( [ $scope.user.uid ], function ( response ) {

                $scope.followButtonTitle = 'Unfollow';
                $scope.user.isInFollowing = true;

            });

        }

    };

    $scope.addContact = function () {

        contactsService.addUsers( [ $scope.user.uid ], function ( response ) {

            $scope.contactButtonTitle = 'Send message';
            $scope.user.isInContacts = true;

        });

    };

    $scope.getDuration = function ( start, end ) {

        var result = '';

        start = ( start ) ? new Date( start ) : new Date();
        end = ( end ) ? new Date( end ) : new Date();

        var dYears = end.getFullYear() - start.getFullYear();
        var dMonth = end.getMonth() - start.getMonth();

        if ( dMonth < 0 ) {

            dYears -= 1;
            dMonth += 12;

        }

        //

        if ( dYears ) {

            result += dYears + ' years';

        }

        if ( dMonth ) {

            result += ' ' + dMonth + ' months';

        }

        //

        return result;

    };

    $scope.profilePhotoPopup = function ( event ) {

        $mdDialog.show({
            skipHide: true,
            parent: angular.element( document.body ),
            template: '<md-dialog username="' + username + '" class="profile-photo" aria-label="photo"><userpic-popup></userpic-popup></md-dialog>',
            targetEvent: event,
            clickOutsideToClose: true
        });

    };

    function prepareSalary ( user ) {

        $scope.salaryData = [];

        for ( var i = 0; i < user.history.length; i ++ ) {

            $scope.salaryData.push({
                count:      user.history[ i ].salary,
                currency:   user.history[ i ].currency,
                dateStart:  user.history[ i ].salaryFromDate,
                dateEnd:    user.history[ i ].salaryToDate,
                bonus:      user.history[ i ].bonus
            });

        }

    };

    //

    function init () {

        usersService.getUserInfo( 'MC4yMjU4OTY0ODUwNzg3ODg1NzE0OTM5NzY4MzI2ODg', username, function ( user ) {

            $scope.user = user.message;

            if ( user.message === 'User not found.' ) {

                $timeout( function() {

                    $state.go('usernotfound');

                });

                return;

            }

            if ( $scope.user.userpic ) {

                $scope.avatarSrc.src = '/usersData/' + $scope.user.uid + '/' + $scope.user.userpic;

            }

            if ( $scope.user.isInContacts ) {

                $scope.contactButtonTitle = 'Send message';

            }

            if ( $scope.user.isInFollowing ) {

                $scope.followButtonTitle = 'Unfollow';

            }

            prepareSalary( $scope.user );

        });

    };

    $scope.userNotFoundRedirect = function () {

        $state.go('usernotfound');

    };

    $scope.$on('$destroy', function () {

        usersService.destroyUser();

    });

    //

    init();

}]);
