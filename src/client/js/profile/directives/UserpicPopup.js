/*
 * @author ohmed, vova, illya
 * Profile userpic change popup directive
*/

angular.module( 'Profile.module' )

.directive( 'userpicPopup', [ function () {

    return {
        restrict: 'EA',
        scope: {},
        controller: [ '$scope', '$rootScope', '$mdDialog', '$http', 'users.service', 'Upload', '$timeout', function ( $scope, $rootScope, $mdDialog, $http, usersService, Upload, $timeout )  {

            var $this = this;
            $scope.file = {};
            $scope.file.showProgress = true;
            $scope.selectedAvatar = false;
            $scope.defaultAvatar = usersService.currentAvatar.src;
            $scope.username = angular.element('.profile-photo').attr('username');

            //

            $scope.$watch( 'files', function () {

                if ( $scope.files !== undefined ) {

                    $scope.dragImage( $scope.files );

                }

                if ( $scope.defaultAvatar ) {

                    $scope.selectedAvatar = true;

                }

            });

            $scope.cancel = function () {

                $mdDialog.cancel();

            };

            $scope.clickUpload = function () {

                setTimeout( function () {

                    angular.element( '#file-input' ).trigger( 'click' );

                }, 0);

            };

            $scope.dropAvatar = function () {

                usersService.dropAvatar();

            };

            $scope.closeWindowPopup = function ( event ) {

                if ( $scope.file.uploadProgress === 100 || ! $scope.selectedAvatar || ! $scope.files ) {

                    $scope.cancel();

                } else {

                    $mdDialog.show({
                        multiple: true,
                        parent: angular.element( document.body ),
                        template: '<md-dialog class="close-window" aria-label="close"><close-avatar-popup></close-avatar-popup></md-dialog>',
                        targetEvent: event,
                        clickOutsideToClose: true
                    });

                }

            };

            $scope.dragImage = function ( file ) {

                $scope.selectedAvatar = true;
                var reader = new FileReader();

                //

                reader.onload = function ( evt ) {

                    resizeImage( evt.target.result, function ( result ) {

                        $scope.$apply( function ( $scope ) {

                            $scope.defaultAvatar = result;

                            var node = document.getElementById( 'cropper' );
                            var first = node.childNodes[ 0 ];
                            var second = node.childNodes[ 1 ];

                            node.removeChild( first );
                            node.removeChild( second );

                            $scope.cropImage();

                        });

                    });

                };

                reader.readAsDataURL( file );

            };

            $scope.cropImage = function () {

                var croppie = new Croppie( document.getElementById( 'cropper' ), {

                    viewport: {
                        width: 185,
                        height: 185
                    },
                    boundary: {
                        width: 185,
                        height: 185
                    },
                    enableOrientation: true,
                    zoomslider: false

                });

                croppie.bind({
                    url: $scope.defaultAvatar,
                    orientation: 1
                });

                saveImage.addEventListener( 'click', function () {

                    croppie.result( 'canvas' ).then( saveImg );

                });

            };

            $scope.removeImage = function () {

                usersService
                .removeUserpic( function ( response ) {

                    angular.element('app-header .avatar')[0].src = response.userpic;
                    usersService.currentAvatar.src = response.userpic;
                    $scope.defaultAvatar = response.userpic;

                    var node = document.getElementById( 'cropper' );
                    var first = node.childNodes[ 0 ];
                    var second = node.childNodes[ 1 ];

                    node.removeChild( first );
                    node.removeChild( second );

                    $scope.selectedAvatar = false;
                    $rootScope.userData.userpic = '';

                    $scope.cropImage();

                });

            };

            //

            var resizeImage = function ( source, callback ) {

                var img = new Image();

                img.onload = function () {

                    var canvas = document.createElement('canvas');

                    var MAX_WIDTH = 400;
                    var MAX_HEIGHT = 400;
                    var width = img.width;
                    var height = img.height;

                    //

                    if ( width > height ) {

                        if ( width > MAX_WIDTH ) {

                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;

                        }

                    } else {

                        if ( height > MAX_HEIGHT ) {

                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;

                        }

                    }

                    //

                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage( img, 0, 0, width, height );

                    var dataurl = canvas.toDataURL('image/png');
                    callback( dataurl );

                };

                img.src = source;

            };

            var handleFileSelect = function ( evt ) {

                var file = evt.currentTarget.files[ 0 ];
                var reader = new FileReader();

                //

                reader.onload = function ( evt ) {

                    $scope.selectedAvatar = true;

                    $scope.$apply( function ( $scope ) {

                        $scope.defaultAvatar = evt.target.result;

                        var node = document.getElementById( 'cropper' );
                        var first = node.childNodes[ 0 ];
                        var second = node.childNodes[ 1 ];

                        node.removeChild( first );
                        node.removeChild( second );

                        $scope.cropImage();

                    });

                };

                reader.readAsDataURL( file );

            };

            var saveImg = function ( result ) {

                var img = new Image;
                img.src = result;

                img.onload = function () {

                    $scope.file.showProgress = false;

                    $http({
                        method: 'POST',
                        url: '/api/users/setUserpic',
                        data: {
                            userpic: result
                        },
                        eventHandlers: {
                            progress: function ( c ) {
                            }
                        },
                        uploadEventHandlers: {
                            progress: function ( evt ) {

                                var progressPercentage = parseInt( 100.0 * event.loaded / event.total );
                                $scope.file.uploadProgress = progressPercentage;

                            }
                        }
                    })
                    .then( function ( response ) {

                        usersService.currentAvatar.src = '/usersData/' + response.data.uid + '/' + response.data.userpic;
                        angular.element( 'app-header .avatar')[ 0 ].src = '/usersData/' + response.data.uid + '/' + response.data.userpic;
                        $rootScope.userData.userpic = response.data.userpic;

                        if ( $scope.file.uploadProgress === 100 ) {

                            $scope.cancel();

                        }

                    });

                };

            };

            function init () {

                setTimeout( function () {

                   $scope.cropImage();

                }, 400 );

                angular.element( document.querySelector( '#file-input' ) ).on( 'change', handleFileSelect );

                $scope.$on('hidePopup', function ( event ) {

                    $mdDialog.hide();

                });

            };

            //

            var saveImage = document.querySelector( '.save-image' );
            init();

        }],
        link: function ( scope, element, attrs ) {

            angular.element('.file-input').bind( 'change', scope.upload );

        },
        controllerAs: 'upp',
        templateUrl: '/views/profile/directives/userpic-popup.html'
    };

}]);
