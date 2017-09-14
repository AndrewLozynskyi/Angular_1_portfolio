/*
 * @author ohmed, oleg
 * Profile 'Teams' tab controller
*/

angular.module( 'Profile.module' )

.controller( 'teams.controller',  [ '$scope','$cookies', '$rootScope', '$mdDialog', 'teams.service', function ( $scope, $cookies, $rootScope, $mdDialog, teamsService ) {

    var uid = $cookies.get('uid');

    var $this = this;

    $this.showDet = false;
    $scope.showDet = $this.showDet;

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
    
    //

    $scope.$on( 'team', function ( event, data ) {

        if ( data.type === '' ) {

            data.type = 'all'

        }

        $this.getEmployees( uid, data.id );
        $this.getDetails( uid, data.id, data.type );

    });

    $this.getDetails = function( uid, teamId, type ) {

        teamsService.getDetails( uid, teamId, type )
        .then ( function ( res ) {

            $this.teamData = res.data.team;

        });

    };

    $this.getEmployees = function( uid, teamId ) {

        teamsService.getEmployees( uid, teamId )
        .then ( function ( res ) {

            $this.employeesData = res.data

        })

    };

    $scope.$on( 'hideDetails', function ( event, hideDetails ) {

        $this.showDet = false;

    });

}]);
