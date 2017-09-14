/*
 * @author ohmed, biven
 * Dashboard csv sheets upload dirrective
*/

angular.module( 'Dashboard.module' )

.directive( 'uploadPopup', [ function () {

    return {
        restrict: 'E',
        scope: {
            urlToPass: '@'
        },
        controllerAs: 'up',
        templateUrl: 'dashboard/directives/upload-popup.html',
        controller: [ '$scope', '$mdDialog', 'Upload', '$timeout', function ( $scope, $mdDialog, Upload, $timeout ) {

            var $this = this;

            $scope.fileList = [];

            //

            $scope.cancel = function () {

                $mdDialog.cancel();

            };

            $scope.$watch( 'files', function () {

                $scope.upload( $scope.files );

            });

            $scope.$watch( 'file', function () {

                if ( $scope.file != null ) {

                    $scope.upload( [ $scope.file ] );

                }

            });

            $scope.upload = function ( files ) {

                if ( ! files || ! files[0] ) return;

                var fileObj = {
                    name:               files[0].name,
                    uploadProgress:     0
                };

                $scope.fileList.push( fileObj );

                Upload.upload({
                    url : $scope.urlToPass,
                    data: {
                        file:       files[0]
                    }
                })
                .then( function ( responce ) {

                    console.log( 'Success ' + responce.config.data.file.name + 'uploaded. Response: ' + responce.data );

                }, function ( responce ) {

                    console.log( 'Error status: ' + responce.status );

                }, function ( event ) {

                    var progressPercentage = parseInt( 100.0 * event.loaded / event.total );
                    fileObj.uploadProgress = progressPercentage;

                });

            };

        }],
        link: function ( scope, element, attrs ) {

            angular.element('.file-input').bind( 'change', scope.upload );

        }
    };

}]);
