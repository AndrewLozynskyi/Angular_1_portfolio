/*
 * @author ohmed
 * 'Gender' directive
*/

angular.module( 'Profile.module' )

.directive( 'gender', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            genderData: '='
        },
        controllerAs: 'gc',
        templateUrl: 'profile/directives/gender.html',
        link: function ( scope, element, attrs ) {

            var wrapChart = element[0].getElementsByClassName('gender-chart')[0];

            scope.data = [];

            scope.$watch( 'genderData', function ( data ) {

                if ( data === undefined ) return;

                for ( var key in  data.totalAvarage.gender ) {

                    scope.data.push({
                        name: key,
                        total: data.totalAvarage.gender[key]
                    });

                }

                initGraph( angular.copy ( scope.data ), scope.data );

            });

            $window.addEventListener( 'resize', function () {

                scope.data = [];

                if ( scope.genderData === undefined ) return;

                for ( var key in  scope.genderData.totalAvarage.gender ) {

                    scope.data.push({
                        name: key,
                        total: scope.genderData.totalAvarage.gender[ key ]
                    });
                }

                initGraph( angular.copy ( scope.data ), scope.data );

            });

            $('.review').resize( function () {
                
                scope.data = [];

                if ( scope.genderData === undefined ) return;

                for ( var key in  scope.genderData.totalAvarage.gender ) {

                    scope.data.push({
                        name: key,
                        total: scope.genderData.totalAvarage.gender[ key ]
                    });
                }

                initGraph( angular.copy ( scope.data ), scope.data );

            });

            //

            function initGraph ( data ) {

                angular.element( wrapChart ).html('');

                var width = angular.element( document.querySelector( '#customerBody' ) )[ 0 ].clientWidth;
                var legend = angular.element( element[ 0 ].getElementsByClassName( 'gender-title' ) );
                var legendBody = angular.element( element[ 0 ].getElementsByClassName( 'gender' ) );
                var chartDiv = angular.element( element[ 0 ].getElementsByClassName( 'gender-div' ) );

                legend.css("width", ( width / 3 + 30 ) + "px");
                legendBody.css("width", ( width / 3 + 30 ) + "px");
                chartDiv.css("width", ( width / 3 + 15 ) + "px");


                
                var conteinerWidth = angular.element( element[ 0 ].getElementsByClassName( 'gender-chart-body' ) )[ 0 ].clientWidth;
                var textWidth = conteinerWidth - width / 3 + 30;
                conteinerWidth = conteinerWidth - textWidth;

                legend.css("width", ( conteinerWidth - 25 - 89 ) + "px");
                legendBody.css("width", ( conteinerWidth - 25 - 89 ) + "px");
                chartDiv.css("width", ( conteinerWidth - 25 - 89 ) + "px");

                var onlyTotal = [];
                var values = [];

                for ( var i = 0; i < data.length; i++ ) {

                    onlyTotal.push( data[ i ].total )
                    values.push( data[ i ].name )

                }

                var x = d3.scaleLinear()
                    .domain( [ 0, d3.max( onlyTotal ) ] )
                    .range( [ 0, conteinerWidth - textWidth + 40 ] );

                var g = d3.select( '.gender-chart' )
                    .selectAll( 'div' )
                    .data( data )
                    .enter().append( 'div' )
                    .attr('class', 'gender-div')
                    .style( 'max-width', function ( d ) {

                        return x( d.total ) + 'px';

                    })

                d3.select( '.gender-chart' )
                    .selectAll( 'div' )
                    .data( data )
                    .attr('class', 'gender-div')
                    .style( 'max-width', function ( d ) {

                        return x( d.total ) + 'px';

                    })    

                g.append( "p" )
                .style( "display", "flex" )
                .text( function ( d ) {

                    return d.total;

                });
                g.append( "span" )
                .style( "display", "flex" )
                .style( "float", "right" )
                .style( "margin-top", "-33px" )
                .style( 'margin-right', function ( d ) {

                        return x( d.total ) + 25 + 'px';

                    })
                .text( function ( d ) {

                    return d.name;

                });

                d3.select( '.gender-chart' )
                    .selectAll( 'span' )
                    .data( data )
                    .style( "display", "flex" )
                    .style( "float", "right" )
                    .style( "margin-top", "-33px" )
                    .style( 'margin-right', function ( d ) {

                            return x( d.total ) + 25 + 'px';

                    })
                    .text( function ( d ) {

                        return d.name;

                    });

            };

        }

    };

}]);
