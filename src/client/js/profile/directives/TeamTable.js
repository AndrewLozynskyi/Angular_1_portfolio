/*
 * @author ohmed
 * Team table directive
*/

angular.module( 'Profile.module' )

.directive( 'teamTable', [ function () {

    return {
        restrict: 'E',
        scope: {
            showDet: '=',
        },
        controllerAs: 'tt',
        templateUrl: 'profile/directives/team-table.html',
        controller: [ '$scope', '$rootScope', 'teams.service', '$cookies', function ( $scope, $rootScope, teamsService, $cookies ) {

            var uid = $cookies.get('uid');
            var $this = this;
            $this.dataTable = [];

            //

            $this.setColor = function ( color ) {

                return { 'border-left': '3px solid rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')' };

            };

            $this.setTotalWidth = function ( currentWidth, totalWidth ) {

                return { 'width': '160px' };

            };

            $this.setCurrentWidth = function ( currentWidth, totalWidth, color ) {

                var currentMembers = currentWidth * 160 / totalWidth;

                return { "width": currentMembers + "px", "background": ' rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')' }

            };

            $this.showDetails = function ( item ) {

                angular.element( document )
                    .find('.teams-card')
                    .addClass('add-shadow-position')

                angular.element( document )
                    .find('#teams-card')
                    .addClass('add-shadow')
                    .removeClass('hide-shadow')

                angular.element( document )
                    .find('.app-content')
                    .addClass('add-shadow-scroll')

                $rootScope.showBackground = true;
                
                $scope.$emit( 'team', item );
                $scope.showDet = true;
                $this.name = item.name;

            };

            $this.getList = function () {

                teamsService.getList( uid )
                .then ( function ( res ) {

                    $this.dataTable = res.data.teams;

                })

            };

            $this.init = function () {

                $this.getList();

            }()

        }]
    };

}]);
