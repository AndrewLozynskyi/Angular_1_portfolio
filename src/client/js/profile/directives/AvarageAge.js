/*
 * @author ohmed, volmat
 * Profile avg age direction
*/

angular.module( 'Profile.module' )

.directive( 'avarageAge', [ '$window', function ( $window ) {

   return {
        restrict: 'E',
        scope: {
            teamAgeData: '='
        },
        controllerAs: 'aac',
        templateUrl: 'profile/directives/avarage-age.html',
        controller: [ '$scope', '$mdDialog', '$interval', function ( $scope, $mdDialog, $interval ) {

            var $this = this;

            $this.avarageAge = [];

            $scope.$watch( 'teamAgeData', function ( data ) {

                if ( data === undefined ) return;

                for ( var key in  data.totalAvarage.age ) {

                    $this.avarageAge.push({
                        diapazone: key,
                        total: data.totalAvarage.age[key]
                    });
                }

            });

            $this.setColor = function ( color ) {

                return { 'background-color': color };

            };

        }],
        link: function( scope, element, attrs ) {

            $('.review').resize( function () {

                initGraph( angular.copy ( scope.data ), scope.data );

            });

            $window.addEventListener( 'resize', function () {

                scope.data = [];

                if ( scope.teamAgeData === undefined ) return;

                for ( var key in  scope.teamAgeData.totalAvarage.age ) {

                    scope.data.push({
                        diapazone: key,
                        total: scope.teamAgeData.totalAvarage.age[ key ]
                    });
                }

                initGraph( angular.copy ( scope.data ), scope.data );

            });

            scope.$watch( 'teamAgeData', function ( data ) {

                scope.data = [];

                if ( data === undefined ) return;

                for ( var key in  data.totalAvarage.age ) {

                    scope.data.push({
                        diapazone: key,
                        total: data.totalAvarage.age[ key ]
                    });

                }

                initGraph( angular.copy ( scope.data ), scope.data );

            });

            var wrapChart = element[ 0 ].getElementsByClassName( 'pie-chart' )[ 0 ];

            //

            function initGraph ( data ) {

                if ( ! data.length ) return;

                angular.element( wrapChart ).html('');

                var rangeColor = [ '#28c98a', '#99c162', '#fac956', '#ce7182', '#942cab', '#780bbf' ];

                //

                var sum = data.reduce( function ( a, b ) {

                    return a + b.total;

                }, 0 );

                data = data.map( function ( e, i ) {

                    e.percentage = parseFloat( ( 100 / sum * e.total ).toFixed(1) );
                    e.id = i;
                    e.color = rangeColor[ i ];

                    return e;

                });

                scope.legend = data;

                //

                scope.setColor = function ( color ) {

                    return { 'background': color };

                };

                var legend = angular.element( element[0].getElementsByClassName('legend')[0] );
                var legendAge = angular.element( element[0].getElementsByClassName('legend-age')[0] );

                var width = angular.element( document.querySelector( '#customerBody' ) )[ 0 ].clientWidth / 4;

                var height = width;

                var radius = Math.min( width ) / 2;
                var innerRadius = 3 * radius;

                getMaxPie( data );

                var pie = d3.pie()
                    .value( function ( d ) {

                        return d.percentage;

                    });

                function getMaxPie ( data ) {

                    scope.maxPie = [];
                    scope.maxPiePers = [];

                    for ( var i = 0; i < data.length; i ++ ) {

                        var res = ( radius ) * data[ i ].percentage / 100;
                        var resPers = data[ i ].percentage;

                        scope.maxPiePers.push( resPers );
                        scope.maxPie.push( res );

                    }

                    scope.maxTop = scope.maxPie.reduce( function( a, b ) {

                        return Math.max( a, b ) + 10;

                    });

                    scope.maxPers = scope.maxPiePers.reduce( function( a, b ) {

                        return Math.max( a, b );

                    });

                };

                var arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius( function ( d ) {

                        scope.indx = 100 - scope.maxPers

                        return ( radius ) * ( d.data.percentage + scope.indx ) / 100

                    });
                

                

                var hover = d3.arc()
                    .innerRadius(0)
                    .outerRadius( function ( d ) {

                        return ( radius ) * ( d.data.percentage + scope.indx ) / 105

                    });

                var svg = d3.select( wrapChart ).append('svg')
                    .attr( 'width', width )
                    .attr( 'height', height )
                    .append('g')
                    .attr( 'transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                var defs = d3.select('svg > g').append('defs');

                var shadow = defs.append('filter').attr( 'id', 'shadow' )
                    .attr( 'filterUnits', 'userSpaceOnUse' )
                    .attr( 'x', -1 * ( width / 2 ) )
                    .attr( 'y', -1 * ( height / 2 ) )
                    .attr( 'width', width )
                    .attr( 'height', height );

                shadow.append('feGaussianBlur')
                    .attr( 'in', 'SourceAlpha' )
                    .attr( 'stdDeviation', 5 )
                    .attr( 'result', 'blur' );

                shadow.append('feOffset')
                    .attr( 'in', 'blur' )
                    .attr( 'dx', 0 )
                    .attr( 'dy', 0 )
                    .attr( 'result', 'offsetBlur') ;

                shadow.append('feBlend')
                    .attr( 'in', 'SourceGraphic' )
                    .attr( 'in2', 'offsetBlur' )
                    .attr( 'mode', 'normal' );

                var tooltip = createTooltip(1);

                var arcs = svg.selectAll('g.slice')
                    .data( pie( data ) )
                    .enter()
                    .append('g')
                    .attr( 'filter', 'url(#shadow)' )
                    .attr( 'class', 'slice' )
                    .on( 'mouseenter', function ( d, i ) {

                        d3.select( "#age-item" )
                            .selectAll( "md-list-item" )
                            .classed( "selected", function( e, j ) {

                                return j == i;

                            });

                        // Add data to the tooltip
                        tooltip
                            .select('.title')
                            .text( d.data.title );

                        var row = tooltip.select('.row');
                        var rows = tooltip.select('.rows');
                        var dep = tooltip.select('.dep');

                        row.select('.name').text( 'age ' +  d.data.diapazone );
                        rows.select('.value').text( d.data.total + ' employees' );
                        dep.select('.value').text( d.data.percentage + '% from all departments(159)' );

                        tooltip.style( 'opacity', 1 );

                        // Add hover effect
                        d.sort = 100;

                        svg.selectAll('.slice').sort( function ( a ) {

                            return ( a.sort != d.sort ) ? -1 : 1;

                        });

                    })
                    .on( 'mousemove', function ( d ) {

                        scope.mouse = d3.mouse( this )

                        tooltip
                            .style( 'left', ( scope.maxTop + scope.mouse[ 0 ] + 50 ) + 'px' )
                            .style( 'top', ( scope.maxTop + scope.mouse[ 1 ] - 50 ) + 'px' )
                            .style( 'opacity', 1 );

                    })
                    .on( 'mouseleave', function ( d, i ) {

                        d3.select( "#age-item" )
                            .selectAll( "md-list-item" )
                            .classed( "un-selected", function( e, j ) {

                                return j == i;

                            });

                        tooltip.style( 'opacity', 0 );
                        d.sort = d.id;

                        svg.selectAll('.slice').sort( function ( a, b ) {

                            return ( a.sort > b.sort ) ? 1 : -1;

                        });

                    });

                arcs.append('path')
                    .attr( 'class', 'hover' )
                    .attr( 'd', hover );

                arcs.append('path')
                    .attr( 'fill', function( d, i ) {

                        return rangeColor[i];

                    })
                    .attr( 'class', 'solidArc' )
                    .attr( 'd', arc )
                    .on( 'mouseenter', function ( d ) {

                        var endAngle = d.endAngle + 0.03;
                        var startAngle = d.startAngle - 0.03;

                        var arcOver = d3.arc()
                            .innerRadius(0)
                            .outerRadius( function ( d ) {

                                return ( radius ) * ( d.data.percentage + scope.indx ) / 105

                            })
                            .endAngle( endAngle )
                            .startAngle( startAngle );

                        d3.select( this )
                            .transition()
                            .duration(1000)
                            .attr( 'd', arcOver );

                    })
                    .on( 'mouseleave', function ( d ) {

                        d3.select( this )
                            .transition()
                            .attr( 'd', arc );

                    });

                arcs.filter( function ( d ) {

                    return ( d.endAngle - d.startAngle ) > 0.4;

                }).append('text')
                    .attr( 'dy', '.35em' )
                    .attr( 'text-anchor', 'middle' )
                    .attr( 'transform', function ( d ) {

                        //set the label's origin to the center of the arc
                        //we have to make sure to set these before calling arc.centroid

                        d.outerRadius = radius; // Set Outer Coordinate
                        d.innerRadius = radius / 8; // Set Inner Coordinate

                        return 'translate(' + arc.centroid( d ) + ')';

                    })
                    .style( 'fill', 'White' )
                    .style( 'font-size', '14px' )
                    .text( function ( d ) {

                        return d.data.percentage + '%';

                    });

            };

            function createTooltip ( countRows ) {

                var tooltip = d3.select( wrapChart )
                    .style( 'position', 'relative' )
                    .append('div')
                    .attr( 'class', 'tooltip' )
                    .style( 'opacity', 0 )
                    .style( 'top', '-10px' )
                    .style( 'position', 'absolute' );

                var tooltipHtml ='<table><tr class="row"><td class="name"></td></tr>'+
                                '<tr class="row"><td></td></tr>'+
                                '<tr class="rows"><td class="value"></td></tr>'+
                                '<tr class="dep"><td class="value"></td></tr></table>';

                tooltip.html( tooltipHtml );

                //

                return tooltip;

            };

            // initGraph( data );

        }
    };

}]);
