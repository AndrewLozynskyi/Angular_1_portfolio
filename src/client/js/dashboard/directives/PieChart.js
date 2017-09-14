/*
 * @author ohmed
 * Pie chard directive
*/

angular.module( 'Dashboard.module' )

.directive( 'pieChart', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData: '='
        },
        templateUrl: 'dashboard/directives/pie-chart.html',
        link: function ( scope, element, attrs ) {

            var wrapChart = element[0].getElementsByClassName('pie-chart')[0];

            $window.addEventListener( 'resize', function () {

                initGraph( angular.copy( scope.setData ) );

            });

            scope.$watch( 'setData', function ( value ) {

                initGraph( angular.copy( value ) );

            });

            function initGraph ( data ) {

                if ( ! data || ! data.length ) return;

                angular.element( wrapChart ).html('');

                var rangeColor = ['#6f2b89', '#d97e2e', '#3b7e11', '#17a9a8'];

                var sum = data.reduce( function ( a, b ) {

                    return a + b.total;

                }, 0 );

                data.sort( function ( a, b ) {

                    return (a.total > b.total) ? 1 : -1;

                });

                data = data.map( function ( e, i ) {

                    e.percentage = parseFloat( ( 100 / sum * e.total ).toFixed(1) );
                    e.id = i;
                    e.sort = i;
                    e.color = rangeColor[i];

                    return e;

                });

                scope.legend = data;

                var legend = angular.element( element[0].getElementsByClassName('legend')[0] );

                var width = 500;
                var height = 500;

                var radius = Math.min( width, height ) / 2 - 10;
                var innerRadius = 0.3 * radius;

                var pie = d3.pie()
                    .sort( function ( a, b ) {

                        return a.percentage - b.percentage;

                    })
                    .value( function ( d ) {

                        return d.percentage;

                    });

                var arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius( function ( d ) {

                        return ( radius - 100 ) * d.data.percentage / 100 + 100;

                    });

                var hover = d3.arc()
                    .innerRadius(0)
                    .outerRadius( function ( d ) {

                        return ( radius - 100 ) * d.data.percentage / 100 + 110;

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
                    .on( 'mouseenter', function ( d ) {

                        // Add data to the tooltip

                        tooltip.style( 'left', d3.event.layerX + 'px' )
                            .style( 'top', d3.event.layerY + 'px' )
                            .select('.title')
                            .text( d.data.title );

                        var row = tooltip.select('tr');

                        row.select('.name').text( d.data.person_type );
                        row.select('.value').text( d.data.total + '(' + d.data.percentage + '%)' );

                        tooltip.style( 'opacity', 1 );

                        // Add hover effect

                        d.sort = 100;

                        svg.selectAll('.slice').sort( function ( a ) {

                            return ( a.sort != d.sort ) ? -1 : 1;

                        });

                    })
                    .on( 'mousemove', function ( d ) {

                        tooltip.style( 'left', d3.event.layerX + 'px' )
                            .style( 'top', d3.event.layerY + 'px' )
                            .style( 'opacity', 1 );

                    })
                    .on( 'mouseleave', function ( d ) {

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
                    .attr( 'fill', function ( d, i ) {

                        return rangeColor[ i ];

                    })
                    .attr( 'class', 'solidArc' )
                    .attr( 'd', arc )
                    .on( 'mouseenter', function ( d ) {

                        var endAngle = d.endAngle + 0.03;
                        var startAngle = d.startAngle - 0.03;

                        var arcOver = d3.arc()
                            .innerRadius(0)
                            .outerRadius( function ( d ) {

                                return ( radius - 100 ) * d.data.percentage / 100 + 97;

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

                var tooltipHtml ='<div class="title"></div><table>';

                for ( var i = 0; i < countRows; i++ ) {

                    tooltipHtml += '<tr class="row' + i + '"><td class="name"></td><td class="value"></td></tr>';

                }

                tooltipHtml += '</table>';
                tooltip.html( tooltipHtml );

                return tooltip;

            };

        }
    };

}]);
