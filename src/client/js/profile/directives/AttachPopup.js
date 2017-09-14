/*
 * @author ohmed
 * 'Attach certificate popup' directive
*/

angular.module( 'Profile.module' )

.directive( 'attachPopup', [ function () {

    return {
        scope: {
            urlToPass: '@'
        },
        controllerAs: 'ap',
        templateUrl: 'profile/directives/attach-certificate.html',
        controller: [ '$scope', '$mdDialog', 'Upload', '$timeout', '$http', 'users.service', function ( $scope, $mdDialog, Upload, $timeout, $http, usersService ) {

            var $this = this;
            $scope.fileList = [];

            //

            $scope.cancel = function () {

                $mdDialog.cancel();

            };

            $scope.upload = function ( files ) {

                if ( ! files || ! files[0] ) return;

                var reader = new FileReader();

                reader.onload = function ( evt ) {

                    $scope.$apply( function ( $scope ) {

                        var node = document.getElementById( 'cropper' );
                        var first = node.childNodes[ 0 ];
                        var second = node.childNodes[ 1 ];

                        $scope.showImage();

                    });

                };

                reader.readAsDataURL( files[0] );

            };

            $scope.showImage = function () {

                var croppie = new Croppie( document.getElementById( 'cropper' ), {

                    viewport: {
                        width: 185,
                        height: 185
                    },
                    boundary: {
                        width: 185,
                        height: 185
                    },
                    enableOrientation: true

                });

            };

            //

            $scope.$watch( 'files', function () {

                $scope.upload( $scope.files );

            });

            $scope.$watch( 'file', function () {

                if ( $scope.file != null ) {

                    $scope.upload( [ $scope.file ] );

                }

            });

        }],
        link: function ( scope, element, attrs ) {

            angular.element('.file-input').bind( 'change', scope.upload );

        }
    };

}]);
