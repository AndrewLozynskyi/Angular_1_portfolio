/*
 * @author ohmed
 * Line chard directive
*/

angular.module( 'Dashboard.module' )

.directive( 'lineChart', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:    '=',
            setDate:    '=',
            titleChart: '@'
        },
        templateUrl: 'dashboard/directives/line-chart.html',
        link: function ( scope, element, attrs ) {

            var wrapChart = element[0].getElementsByClassName('line-chart')[0];
            initGraph( angular.copy( scope.setData ), scope.setDate );

            $('line-chart').resize( function () {

                initGraph( angular.copy( scope.setData ), angular.copy( scope.setDate ) );

            });

            $window.addEventListener('resize', function () {

                initGraph( angular.copy( scope.setData ), angular.copy( scope.setDate ) );

            });

            scope.$watch('setData', function ( value ) {

                initGraph( angular.copy( value ), scope.setDate );

            });

            //

            function formatingOnYear ( array, year ) {

                var lengthData = array.length;

                if ( 13 - lengthData > 0 ) {

                    for ( var i = lengthData; i < 13; i ++ ) {

                        var d = i + 1;

                        array.push({
                            date: ( d < 10 ? '0' + d : d.toString() ) + ' ' + year
                        });

                    }

                }

                return array;

            };

            function processData ( data, year ) {

                var lines = [];
                var lineChart = [];

                for ( var e in data ) {

                    lines.push( e );

                }

                if ( lines.length ) {

                    for ( var e in data[ lines[0] ] ) {

                        var obj = {
                            date: ( e < 9 ? '0' + ( + e + 1 ) : ( +e + 1 ).toString() ) + ' ' + year
                        };

                        for ( var i = 0; i < lines.length; i ++ ) {

                            obj[ lines[ i ] === 'total' ? 'headcount' : lines[ i ] ] = data[ lines[ i ] ][ e ];

                        }

                        lineChart.push( obj );

                    }

                    var lastObj = {};

                    for ( var key in obj ) {

                        lastObj[ key ] = obj[ key ];

                    }

                    lastObj.date = ( (+e + 1) < 9 ? '0' + ( + e + 2 ) : ( +e + 2 ).toString() ) + ' ' + year;

                    lineChart.push( lastObj );

                }

                lineChart = formatingOnYear( lineChart, year );

                return lineChart;

            };

            function initGraph ( data, date ) {

                if ( ! date ) return;

                data = processData( angular.copy( data ), date.getFullYear() );

                angular.element( wrapChart ).html('');

                var margin = { top: 20, right: 20, bottom: 30, left: 40 };
                var width = angular.element( element )[0].clientWidth - margin.left - margin.right;
                var height = 250 - margin.top - margin.bottom;

                var parseDate = d3.timeParse('%m %Y');
                var domainTitles = [];
                var rangeColor = ['#6be8e9', '#c3ee04' , '#ff8710', '#662d91'];

                if ( data.length ) {

                    for ( var e in data[0] ) {

                        if ( e != 'date' ) {

                            domainTitles.push( e );

                        }

                    }

                }

                var legend = angular.element( element[0].getElementsByClassName('legend')[0] );
                legend.html('');

                for ( var i = 0; i < domainTitles.length; i ++ ) {

                    var legendValue = '<span class="circle" style="background: ' + rangeColor[ i ] + '"></span> ' + domainTitles[ i ];
                    legend.append( legendValue );

                }

                var x = d3.scaleTime()
                    .range([ 0, width ]);

                var y = d3.scaleLinear()
                    .domain([ 0, 90 ])
                    .range([ height, 0 ]);

                var color = d3.scaleOrdinal()
                    .domain( domainTitles )
                    .range( rangeColor );

                var xAxis = d3.axisBottom( x )
                    .tickSizeInner( - height )
                    .tickSizeOuter( 0 )
                    .tickPadding( 10 )
                    .tickFormat( d3.timeFormat('%b') );

                var yAxis = d3.axisLeft( y )
                    .tickSizeInner( - width )
                    .tickSizeOuter( 0 )
                    .tickPadding( 10 )
                    .ticks( 7 )
                    .tickFormat( function ( d, i ) {

                        if ( i % 2 === 1 ) {

                            return new Intl.NumberFormat().format( d );

                        }

                    });

                var line = d3.line()
                    .x( function ( d ) {

                        return x( d.date );

                    })
                    .y( function ( d ) {

                        return y( d.count );

                    })
                    .defined( function ( d ) {

                        return ( d.count >= 0 );

                    });

                var svg = d3.select( wrapChart ).append('svg')
                    .attr( 'width', width + margin.left + margin.right )
                    .attr( 'height', height + margin.top + margin.bottom )
                    .append('g')
                    .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

                var tooltip = d3.select( wrapChart )
                    .style( 'position', 'relative' )
                    .append('div')
                    .attr( 'class', 'tooltip md-whiteframe-24dp' )
                    .style( 'opacity', 0 )
                    .style( 'display', 'none' )
                    .style( 'top', '-10px' )
                    .style( 'position', 'absolute' );

                //

                var tooltipHtml = '<div class="date"></div><table>';

                for ( var i = 0; i < domainTitles.length; i ++ ) {

                    tooltipHtml += '<tr><td><span class="circle" style="background: ' +
                        rangeColor[ i ] + '"></span></td><td>' + domainTitles[ i ] +
                        '</td><td class="text-right ' + domainTitles[ i ] + '"></td></tr>';

                }

                tooltipHtml += '</table>';
                tooltip.html( tooltipHtml );

                //

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
                                count: + d[ name ]
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

                            return Math.ceil( v.count / 10 ) * 10;

                        });

                    })
                ]);

                d3.selection.prototype.last = function () {

                    var last = this.size() - 1;
                    return d3.select(this._groups[0][last]);

                };

                svg.append( 'g' )
                    .attr( 'class', 'x axis' )
                    .attr( 'transform', 'translate(0,' + height + ')' )
                    .call( xAxis )
                    .selectAll('text')
                    .attr( 'transform', 'translate(' + width / 24 + ',0)' )
                    .last().remove();

                svg.append( 'g' )
                    .attr( 'class', 'y axis' )
                    .call( yAxis );

                var graph = svg.selectAll( '.graph' )
                    .data( graphs )
                    .enter().append( 'g' )
                    .attr( 'class', 'graph' );

                graph.append( 'path' )
                    .attr( 'class', 'line' )
                    .attr( 'd', function ( d ) {
                        return line( d.values );
                    })
                    .style( 'stroke', function ( d ) {
                        return color( d.name );
                    });

                var mouseG = svg.append( 'g' )
                    .attr( 'class', 'mouse-over-effects' );

                mouseG.append( 'path' ) // this is the black vertical line to follow mouse
                    .attr( 'class', 'mouse-line' )
                    .style( 'stroke', '#17a9a8' )
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                var lines = svg.selectAll( '.line' )._groups[0];

                var mousePerLine = mouseG.selectAll( '.mouse-per-line' )
                    .data( graphs )
                    .enter()
                    .append( 'g' )
                    .attr( 'class', 'mouse-per-line' );

                mousePerLine.append( 'circle' )
                    .attr( 'r', 3.5 )
                    .style( 'fill', function ( d ) {
                        return color( d.name );
                    })
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                mouseG.append( 'svg:rect' ) // append a rect to catch mouse movements on canvas
                    .attr( 'width', width ) // can't catch mouse events on a g element
                    .attr( 'height', height )
                    .attr( 'fill', 'none' )
                    .attr( 'pointer-events', 'all' )
                    .on( 'mouseout', function () { // on mouse out hide line, circles and text

                        d3.select('.mouse-line')
                            .style('opacity', '0');

                        d3.selectAll('.mouse-per-line circle')
                            .style('opacity', '0');

                        d3.selectAll('.mouse-per-line text')
                            .style('opacity', '0');

                        tooltip.transition()
                            .duration(500)
                            .style('opacity', 0);

                    })
                    .on('mousemove', function () { // mouse moving over canvas

                        var mouse = d3.mouse( this );

                        svg.select('.mouse-line')
                            .attr('d', function () {

                                var d = 'M' + mouse[0] + ',' + height;
                                d += ' ' + mouse[0] + ',' + 0;
                                return d;

                            });

                        var ypos = [];

                        svg.selectAll('.mouse-per-line')
                            .attr('transform', function ( d, i ) {

                                var xDate = x.invert( mouse[0] );
                                var bisect = d3.bisector( function ( d ) { return d.date; }).right;
                                var idx = bisect( d.values, xDate );
                                var dateFormat = d3.timeFormat("%d %B %Y");

                                if ( isNaN( d.values[ idx ].count ) ) {

                                    d3.select('.mouse-line')
                                        .style('opacity', '0');

                                    d3.selectAll('.mouse-per-line circle')
                                        .style('opacity', '0');

                                    d3.selectAll('.mouse-per-line text')
                                        .style('opacity', '0');

                                    d3.select(element[0]).select('.tooltip').style('opacity', 0);

                                    return;

                                } else {

                                    d3.select('.mouse-line')
                                        .style('opacity', '1');

                                    d3.selectAll('.mouse-per-line circle')
                                        .style('opacity', '1');

                                    d3.selectAll('.mouse-per-line text')
                                        .style('opacity', '1');

                                    d3.select(element[0]).select('.tooltip').style('opacity', 0.9).style( 'display', 'block' );

                                }

                                var beginning = 0,
                                    end = lines[i].getTotalLength(),
                                    target = null;

                                while ( true ) {

                                    target = Math.floor( ( beginning + end ) / 2 );
                                    var pos = lines[i].getPointAtLength( target );

                                    if ( ( target === end || target === beginning) && pos.x !== mouse[0] ) {

                                        break;

                                    }

                                    if ( pos.x > mouse[0] ) {

                                        end = target;

                                    } else if ( pos.x < mouse[0] ) {

                                        beginning = target;

                                    } else {

                                        break;

                                    }

                                }

                                d3.select(element[0]).select('.tooltip').select('.date')
                                    .text(dateFormat(xDate));
                                d3.select(element[0]).select('.tooltip').select('.'+ d.name)
                                    .text(d.values[idx] && d.values[idx].count && isNaN(d.values[idx].count) ?
                                        '' : new Intl.NumberFormat().format(y.invert(pos.y).toFixed()));

                                ypos.push({ ind: i, y: pos.y, off: 0 });

                                //

                                return 'translate(' + mouse[0] + ',' + pos.y +')';

                            })
                            .call( function ( sel ) {

                                ypos.sort( function ( a, b ) { return a.y - b.y; });
                                ypos.forEach( function ( p, i ) {

                                    if ( i > 0 ) {

                                        var last = ypos[i-1].y;
                                        ypos[ i ].off = Math.max( 0, ( last + 15 ) - ypos[ i ].y );
                                        ypos[ i ].y += ypos[ i ].off;

                                    }

                                });

                                ypos.sort( function ( a, b ) { return a.ind - b.ind; });

                            });

                        tooltip.style('left', mouse[0] - 20 + 'px');

                    });

            };

        }
    };

}]);
