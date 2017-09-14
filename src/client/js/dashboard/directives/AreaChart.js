/*
 * @author ohmed
 * Area chart directive
*/

angular.module( 'Dashboard.module' )

.directive( 'areaChart', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:        '=',
            titleChart:     '@'
        },
        templateUrl: 'dashboard/directives/line-chart.html',
        link: function ( scope, element, attrs ) {

            var wrapChart = element[0].getElementsByClassName('line-chart')[0];

            $window.addEventListener('resize', function () {

                initGraph( angular.copy( scope.setData ) );

            });

            scope.$watch('setData', function ( value ) {

                initGraph( angular.copy( value ) );

            });

            function initGraph ( data ) {

                if ( !data.length ) return;

                angular.element( wrapChart ).html('');

                var margin = { top: 30, right: 70, bottom: 30, left: 100 };
                var width = angular.element( element )[0].clientWidth - margin.left - margin.right;
                var height = 300 - margin.top - margin.bottom;

                var parseDate = d3.time.format('%m %Y').parse;
                var domainTitles = [];
                var rangeColor = [ attrs.colorArea ];

                if ( data.length ) {

                    for ( var e in data[0] ) {

                        if ( e != 'date' ) domainTitles.push( e );

                    }

                }

                var x = d3.time.scale()
                    .range([ 0, width ]);

                var y = d3.scale.linear()
                    .range([ height, 0 ]);

                var color = d3.scale.ordinal()
                    .domain( domainTitles )
                    .range( rangeColor );

                var xAxis = d3.svg.axis()
                    .scale( x )
                    .orient('bottom')
                    .innerTickSize( -height )
                    .outerTickSize(0)
                    .tickPadding(10)
                    .tickFormat( d3.time.format('%b') );

                var yAxis = d3.svg.axis()
                    .scale( y )
                    .orient('left')
                    .innerTickSize( -width )
                    .outerTickSize(0)
                    .tickPadding(10)
                    .ticks(6)
                    .tickFormat( function ( d ) {

                        var tick = d;

                        if( attrs.unitPositionLeft ) {

                            tick = attrs.unit + tick;

                        } else {

                            tick = tick + attrs.unit;

                        }

                        return tick;

                    });

                var area = d3.svg.area()
                    .x( function ( d ) {

                        return x( d.date );

                    })
                    .y0( height )
                    .y1( function ( d ) {

                        return y( d.count );

                    })
                    .defined( function ( d ) {

                        return d.count;

                    });

                var line = d3.svg.line()
                    .x( function ( d ) {

                        return x( d.date );

                    })
                    .y( function ( d ) {

                        return y( d.count );

                    })
                    .defined( function ( d ) {

                        return d.count;

                    });

                var dateFormatParse = d3.time.format("%m");
                var dataTrend = data.reduce( function ( array, current ) {

                    var newData = array ? angular.copy( array ) : [];

                    if ( current.target ) newData.push( current );

                    return newData;

                }, 0 );

                var yval = dataTrend.map( function ( d ) {

                    return parseInt( dateFormatParse( parseDate( d.date ) ) );

                });

                var xval = dataTrend.map( function ( d ) {

                    return parseFloat( d.target );

                });

                var lr = linearRegression( yval,xval );

                var svg = d3.select( wrapChart ).append('svg')
                    .attr( 'width', width + margin.left + margin.right )
                    .attr( 'height', height + margin.top + margin.bottom )
                    .append('g')
                    .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

                var tooltip = d3.select( wrapChart )
                    .style('position', 'relative')
                    .append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0)
                    .style('top', '-10px')
                    .style('position', 'absolute');

                var tooltipHtml ='<table>';

                for ( var i = 0; i < domainTitles.length; i++ ) {

                    tooltipHtml += '<tr><td>Jan</td><td class="text-right ' + domainTitles[i] + '"></td></tr>';

                }

                tooltipHtml += '</table>';

                tooltip.html( tooltipHtml );

                color.domain( d3.keys( data[0] ).filter( function ( key ) {

                    return key !== 'date';

                }));

                data.forEach( function ( d ) {

                    d.date = parseDate( d.date );

                });

                var graphs = color.domain().map( function ( name ) {

                    return {
                        name: name,
                        values: data.map( function ( d ) {

                            return {
                                date: d.date,
                                count: +d[ name ]
                            };

                        })
                    };

                });

                x.domain( d3.extent( data, function ( d ) {

                    return d.date;

                }));

                y.domain([
                    d3.min( graphs, function ( c ) {

                        return d3.min( c.values, function ( v ) {

                            return v.count;

                        });

                    }),
                    d3.max( graphs, function ( c ) {

                        return d3.max( c.values, function ( v ) {

                            return v.count;

                        });

                    })
                ]);

                svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call( xAxis );

                svg.append('g')
                    .attr('class', 'y axis')
                    .call( yAxis );

                var graph = svg.selectAll('.graph')
                    .data( graphs )
                    .enter()
                    .append('g')
                    .attr('class', 'graph');
                // Add gradient
                var gradient = graph.append('linearGradient')
                    .attr('id', 'g660');

                gradient.append('stop')
                    .attr('offset', '10%')
                    .attr('stop-opacity', '0.01')
                    .style('stop-color', function ( d ) {

                        return color( d.name );

                    });

                gradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-opacity', '0.2')
                    .style('stop-color', function ( d ) {

                        return color( d.name );

                    });

                // Add area
                graph.append('path')
                    .attr('class', 'area')
                    .attr('d', function ( d ) {

                        return area( d.values );

                    })
                    .style('fill', 'url(#g660)');

                // Add line
                graph.append('path')
                    .attr('class', 'line')
                    .attr('d', function ( d ) {

                        return line( d.values );

                    })
                    .style('stroke', function ( d ) {

                        return color (d.name );

                    });

                // add trend line
                var max = data[ data.length -1 ].date;

                graph.append("svg:line")
                    .attr('stroke-dasharray', '10, 5')
                    .attr("x1", 0)
                    .attr( "y1", y( lr.intercept ) )
                    .attr( "x2", x( max ) )
                    .attr( "y2", y( ( parseInt( dateFormatParse( max ) ) * lr.slope ) + lr.intercept ) )
                    .style("stroke", "#0c72c9");

                // Add dots
                var dotColor;

                graph.selectAll('circle')
                    .data( function ( d ) {

                        dotColor = color( d.name );
                        return d.values;

                    })
                    .enter()
                    .append('circle')
                    .style( 'fill', dotColor )
                    .attr('cx', function ( d ) {

                        if ( isNaN( d.count ) ) return;

                        return x( d.date );

                    })
                    .attr('cy', function ( d ) {

                        if ( isNaN( d.count ) ) return;

                        return y( d.count );

                    })
                    .attr('r', function ( d ) {

                        if ( isNaN( d.count ) ) return;

                        return 4;

                    });

                // Add text
                graph.selectAll('text').data( function ( d ) {

                        return d.values;

                    })
                    .enter()
                    .append('text')
                    .text( function ( d ) {

                        if ( isNaN( d.count ) ) return;

                        var tick = d.count.toFixed(1);

                        if ( attrs.unitPositionLeft ) {

                            tick = attrs.unit + tick;

                        } else {

                            tick = tick + attrs.unit;

                        }

                        return tick;

                    })
                    .attr("index", function ( d, i ) {

                        return i;

                    })
                    .attr('class', 'marker')
                    .attr('transform', function ( d ) {

                        if ( isNaN( d.count ) ) return;

                        return 'translate (' + ( x( d.date ) - 12 ) + ',' + ( y( d.count ) - 15 ) + ')';

                    });

                var mouseG = svg.append('g')
                    .attr('class', 'mouse-over-effects');

                mouseG.append('path') // this is the black vertical line to follow mouse
                    .attr('class', 'mouse-horizontal-line')
                    .style('stroke', '#17a9a8')
                    .style('stroke-width', '1px')
                    .style('opacity', '0');

                mouseG.append('path') // this is the black vertical line to follow mouse
                    .attr('class', 'mouse-vertical-line')
                    .style('stroke', '#17a9a8')
                    .style('stroke-width', '1px')
                    .style('opacity', '0');

                var lines = document.getElementsByClassName('line');

                var mousePerLine = mouseG.selectAll('.mouse-per-line')
                    .data( graphs )
                    .enter()
                    .append('g')
                    .attr('class', 'mouse-per-line');

                mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
                    .attr( 'width', width ) // can't catch mouse events on a g element
                    .attr( 'height', height )
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')

                    .on('mouseout', function () { // on mouse out hide line, circles and text

                        svg.select('.mouse-vertical-line')
                            .style('opacity', '0');

                        svg.select('.mouse-horizontal-line')
                            .style('opacity', '0');

                        graph.selectAll('.marker')
                            .attr('opacity', 1);

                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })

                    .on('mouseover', function () { // on mouse in show line, circles and text

                        svg.select('.mouse-vertical-line')
                            .style('opacity', '1');

                        svg.select('.mouse-horizontal-line')
                            .style('opacity', '1');

                    })

                    .on('mousemove', function () { // mouse moving over canvas

                        var mouse = d3.mouse( this );

                        svg.selectAll('.mouse-per-line')
                            .attr('transform', function ( d, i ) {

                                var xDate = x.invert( mouse[0] ),
                                    bisect = d3.bisector( function ( d ) {

                                        return d.date;

                                    }).right;

                                var idx = bisect( d.values, xDate );

                                if( isNaN( d.values[ idx ].count ) ) return;

                                var dateFormat = d3.time.format("%B");

                                var pos = {
                                    x: x( d.values[ idx ].date ),
                                    y: y( d.values[ idx ].count )
                                };

                                var prevX = x( d.values[ idx - 1 ].date );
                                var yValue = d.values[ idx ].count;

                                if ( ( pos.x + prevX ) / 2 > mouse[0] ) {

                                    pos.x = prevX;
                                    idx -= 1;
                                    pos.y = y( d.values[ idx ].count );
                                    yValue = d.values[ idx ].count;

                                }

                                svg.select('.mouse-vertical-line')
                                    .attr('d', function () {

                                        var d = 'M' + pos.x + ',' + pos.y;
                                        d += ' ' + pos.x + ',' + height;

                                        return d;

                                    });

                                svg.select('.mouse-horizontal-line')
                                    .attr('d', function () {

                                        var d = 'M' + 0 + ',' + 0;
                                        d += ' ' + pos.x + ',' + 0;

                                        return d;

                                    })
                                    .attr('transform', function () {

                                        return 'translate (0,' + pos.y + ')';

                                    });

                                tooltip.select('td')
                                    .text( dateFormat( d.values[ idx ].date ) );

                                var text = yValue.toFixed(1);

                                if ( attrs.unitPositionLeft ) {

                                    text = attrs.unit + text;

                                } else {

                                    text = text + attrs.unit;

                                }

                                tooltip.select( '.'+ d.name )
                                    .text( text );

                                graph.selectAll('.marker')
                                    .attr('opacity', 1);

                                graph.select('.marker[index="' + idx + '"]')
                                    .attr('opacity', 0);

                                tooltip.style('left', pos.x + 20 + 'px');
                                tooltip.style('top', pos.y + 'px');

                                tooltip.transition()
                                    .duration(200)
                                    .style('opacity', .9);

                                return 'translate(' + pos.x + ',' + (pos.y + 15) +')';

                            });

                    });

            };

            function linearRegression ( y, x ) {

                var lr = {};
                var n = y.length;
                var sum_x = 0;
                var sum_y = 0;
                var sum_xy = 0;
                var sum_xx = 0;
                var sum_yy = 0;

                for ( var i = 0; i < y.length; i++ ) {

                    sum_x += x[ i ];
                    sum_y += y[ i ];
                    sum_xy += ( x[ i ] * y[ i ] );
                    sum_xx += ( x[ i ] * x[ i ] );
                    sum_yy += ( y[ i ] * y[ i ] );

                }

                lr['slope'] = ( n * sum_xy - sum_x * sum_y ) / ( n * sum_xx - sum_x * sum_x );
                lr['intercept'] = ( sum_y - lr.slope * sum_x ) / n;
                lr['r2'] = Math.pow( ( n * sum_xy - sum_x * sum_y ) / Math.sqrt( ( n * sum_xx - sum_x * sum_x ) * ( n * sum_yy - sum_y * sum_y ) ), 2 );

                return lr;

            };

        }

    }

}]);
