/*
 * @author ohmed
 * Attrition departments stats directive
*/

angular.module( 'hrTools' )

.directive( 'clientLogoPopup', [ function () {

    return {
        scope: {},
        controllerAs: 'E',
        templateUrl: 'main/directives/client-logo-popup.html',
        controller: [ '$scope', '$rootScope', '$mdDialog', '$http', 'Upload', 'users.service', '$timeout', function ( $scope, $rootScope, $mdDialog, $http, Upload, usersService, $timeout ) {

            var $this = this;

            $scope.file = {};
            $scope.file.showProgress = true;
            $scope.selectedAvatar = false;
            $scope.defaultAvatar = usersService.currentAvatar.src;
            $scope.username = angular.element('.profile-photo').attr('username');

            console.log('lol');

            $scope.close = function () {

                $mdDialog.cancel();

            }

            $scope.$watch( 'files', function () {

                if ( $scope.files !== undefined ) {

                    $scope.dragImage( $scope.files );

                }

                if ( $scope.defaultAvatar ) {

                    $scope.selectedAvatar = true;
                    $(".footer-second-container").show();

                }

            });

            $scope.dragImage = function ( file ) {

                $scope.selectedAvatar = true;
                $(".footer-second-container").show();
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
                        width: "100%",
                        height: "100%"
                    },
                    boundary: {
                        width: "100%",
                        height: "100%"
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

            $scope.clickUpload = function () {

                setTimeout( function () {

                    angular.element( '#file-input' ).trigger( 'click' );

                }, 0);

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


            $scope.closeWindowPopup = function ( event ) {

                if ( $scope.file.uploadProgress === 100 || ! $scope.selectedAvatar || ! $scope.files ) {

                    $scope.close();

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

                    $('.footer-second-container').show();

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

                            $scope.close();

                        } else {

                            console.log( $scope.file.uploadProgress );

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

            var saveImage = document.querySelector( '.save-image' );
            init();

        }],
        link: function ( scope, element, attrs ) {

            angular.element('.file-input').bind( 'change', scope.upload );

        },
    }

}]);