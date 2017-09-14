/*
 * @author ohmed
 * 'Add new course' directive
*/

angular.module( 'Profile.module' )

.directive( 'addNewCourse', [ function () {

    return {
        scope: {},
        controllerAs: 'anc',
        templateUrl: 'profile/directives/add-new-course.html',
        controller: [ '$mdDialog', 'users.service', '$cookies', '$scope', '$rootScope', function ( $mdDialog, usersService, $cookies, $scope, $rootScope ) {

            var $this = this;

            //

            $this.close = function () {

                $scope.$parent.addCourseshowDirective = false;
                $scope.$parent.addCourseshowAddOneButton = true;

            };

            $this.attachCertificate = function ( $event ) {

                $mdDialog.show({
                    parent: angular.element( document.body ),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    template: '<md-dialog class="uploadFiles" aria-label="Upload popup"><attach-popup></attach-popup></md-dialog>'
                });

            };

            $this.saveCource = function () {

                var uid = $cookies.get('uid');
                var session = $cookies.get('session');
                var courseName = $('.input-course-name').val();
                // var courseProvides = $('.input-course-provides').val();
                // var courseWebsite = $('.input-course-website').val();
                // var ctrlMyDate = $scope.ctrl.myDate;

                usersService.saveAddCourse( uid, session, courseName );

            };

            //

            $scope.$watch( 'isOpen', function ( newValue, oldValue ) {

                if ( ! newValue && oldValue ) {

                    document.querySelector('.md-datepicker-input').blur();

                }

            });

            var switchIcon = function () {

                switch ( $rootScope.userData.status ) {

                    case 'Online':

                        $scope.statusIconSrs = '/img/icons/online-icon.png';
                        $scope.status = 'Online';
                        break;

                    case 'Away':

                        $scope.statusIconSrs = '/img/icons/notavaliable-icon.png';
                        $scope.status = 'Away';
                        break;

                    case 'Do not Disturb':

                        $scope.statusIconSrs = '/img/icons/not-disturb-icon.png';
                        $scope.status = 'Do not Disturb';
                        break;

                    case 'Invisible':

                        $scope.statusIconSrs = '/img/icons/offline-icon.png';
                        $scope.status = 'Invisible';
                        break;

                    case 'Offline':

                        $scope.statusIconSrs = '/img/icons/offline-icon.png';
                        $scope.status = 'Offline';
                        break;

                }

            };

            $scope.setStatus = function ( status ) {

                // usersService.changeStatus( status, function () {

                    switchIcon();

                // });

            };

            switchIcon();


        }]
    };

}]);
