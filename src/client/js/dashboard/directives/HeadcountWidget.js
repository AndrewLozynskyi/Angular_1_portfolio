/*
 * @author ohmed
 * Line chard directive
*/

angular.module( 'Dashboard.module' )

.directive( 'headcountWidget', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:    '=',
            setDate:    '=',
        },
        controllerAs: 'hw',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.generalInfo = {};

            $scope.$watch( 'setData', function ( data ) {
                
                $this.generalInfo = {};

                if ( data === undefined ) return;

                $this.generalInfo.headcountTrends = data.headcountWidgetData.trends;

            });

        }],
        templateUrl: 'dashboard/directives/headcount-widget.html',
        link: function ( scope, element, attrs ) {

            var wrapChart = element[ 0 ].getElementsByClassName( 'line-chart-mini' )[ 0 ];

            $('.line-chart-mini').resize( function () {

                initGraph( angular.copy( scope.setData ), scope.setData );

            });

            $window.addEventListener( 'resize', function () {

                if ( scope.setData === undefined ) return;

                initGraph( angular.copy( scope.setData ), scope.setData );

            });

            scope.$watch( 'setData', function ( value ) {

                if ( value === undefined ) return;

                initGraph( angular.copy( value ), value );

            });

            //

            function formatingOnYear ( array, year ) {

                var lengthData = array.length;

                if ( 12 - lengthData > 0 ) {

                    for ( var i = lengthData; i < 6; i ++ ) {

                        var d = i + 1;

                        array.push({
                            date: ( d < 10 ? '0' + d : d.toString() ) + ' ' + 2016
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

                    for ( var e in data[ lines[ 0 ] ] ) {

                        var obj = {
                            date: ( e < 9 ? '0' + ( + e + 1 ) : ( + e + 1 ).toString() ) + ' ' + 2016
                        };

                        for ( var i = 0; i < lines.length; i ++ ) {

                            obj[ lines[ i ] === 'headcount' ? 'headcount' : lines[ i ] ] = data[ lines[ i ] ][ e ];

                        }

                        lineChart.push( obj );

                    }

                }

                lineChart = formatingOnYear( lineChart, year );

                return lineChart;

            };

            function initGraph ( data ) {

                scope.generalInfo = {};
                scope.generalInfo.headcount = data.headcountWidgetData.chart
                data = scope.generalInfo;

                if ( ! data ) return;
                data = processData( angular.copy( data ) );

                angular.element( wrapChart ).html('');

                if ( scope.fullGraph ) {

                    var margin = { top: 0, right: 0, bottom: 0, left: 0 };
                    var height = 100 - margin.top - margin.bottom;

                } else {

                    var margin = { top: 0, right:  0, bottom: 0, left: 0 };
                    var height = 88

                }

                var width = angular.element( document.querySelector( '#headcountWidget' ) )[ 0 ].clientWidth - 10;
                var parseDate = d3.timeParse( '%m %Y' );
                var domainTitles = [];
                var rangeColor = [ '#23ad7c' ];

                if ( data.length ) {

                    for ( var e in data[ 0 ] ) {

                        if ( e != 'date' ) {

                            domainTitles.push( e );

                        }

                    }

                }

                //

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
                    .tickFormat( d3.timeFormat( '%b' ) );

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

                var area = d3.area()
                    .x( function ( d ) {

                        return x( d.date );

                    })
                    .y0( function ( d ) {

                        return y( 0 );

                    })
                    .y1( function ( d ) {

                        return y( d.count );

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

                var svg = d3.select( wrapChart )
                    .append( 'svg' )
                    .attr( 'width', width + margin.left + margin.right )
                    .attr( 'class', 'wow' )
                    .attr( 'height', height + margin.top + margin.bottom )
                    .append( 'g' )
                    .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

                var tooltip = d3.select( wrapChart )
                    .append( 'div' )
                    .attr( 'class', 'tooltip md-whiteframe-24dp' )
                    .style( 'opacity', 0 )
                    .style( 'display', 'none' )
                    .style( 'top', '-10px' )
                    .style( 'position', 'absolute' );

                //

                var tooltipHtml = '<div class="date"></div><table>';

                for ( var i = 0; i < domainTitles.length; i ++ ) {

                    tooltipHtml += '<tr><td>' + domainTitles[ i ] +
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
                                date:   d.date,
                                count:  + d[ name ]
                            };
                        })
                    };

                });

                x.domain( d3.extent ( data, function ( d ) {
                    return d.date;
                }));

                y.domain([
                    d3.min( graphs, function ( c ) {
                        return d3.min( c.values, function ( v ) {
                            return v.count;
                        }) / 1.5;
                    }),
                    d3.max( graphs, function ( c ) {
                        return d3.max( c.values, function ( v ) {
                            return v.count;
                        }) * 1.2;
                    })
                ]);

                d3.selection.prototype.last = function () {

                    var last = this.size() - 1;
                    return d3.select( this._groups[ 0 ][ last ] );

                };

                svg
                    .append( 'linearGradient' )
                    .attr( 'id', 'headcount-gradient' )
                    .attr( 'gradientUnits', 'userSpaceOnUse' )
                    .attr( 'x1', '0%' ).attr( 'y1', 0 )
                    .attr( 'x2', '100%' ).attr( 'y2', 0 )
                    .selectAll( 'stop' )
                    .data([
                        { offset: '0%',   color: 'rgba( 23, 169, 168, 0 )' },
                        { offset: '30%',  color: 'rgba( 23, 169, 168, 0.06 )' },
                        { offset: '45%',  color: 'rgba( 23, 169, 168, 0.09 )' },
                        { offset: '55%',  color: 'rgba( 23, 169, 168, 0.1 )' },
                        { offset: '60%',  color: 'rgba( 23, 169, 168, 0.12 )' },
                        { offset: '100%', color: 'rgba( 23, 169, 168, 0.2 )' }
                    ])
                    .enter()
                    .append( 'stop' )
                    .attr( 'offset', function ( d ) { 

                        return d.offset; 
                    })
                    .attr( 'stop-color', function ( d ) { 

                        return d.color; 
                    });

                svg
                    .append( 'linearGradient' )
                    .attr( 'id', 'bonus-gradient' )
                    .attr( 'gradientUnits', 'userSpaceOnUse' )
                    .attr( 'x1', '0%' ).attr( 'y1', 0 )
                    .attr( 'x2', '100%' ).attr( 'y2', 0 )
                    .selectAll( 'stop' )
                    .data([
                        { offset: '0%',   color: 'rgba( 40, 128, 112, 0 )' },
                        { offset: '30%',  color: 'rgba( 40, 128, 112, 0.06 )' },
                        { offset: '45%',  color: 'rgba( 40, 128, 112, 0.09 )' },
                        { offset: '55%',  color: 'rgba( 40, 128, 112, 0.1 )' },
                        { offset: '60%',  color: 'rgba( 40, 128, 112, 0.12 )' },
                        { offset: '100%', color: 'rgba( 40, 128, 112, 0.2 )' }
                    ])
                    .enter()
                    .append( 'stop' )
                    .attr( 'offset', function ( d ) { 

                        return d.offset; 

                    })
                    .attr( 'stop-color', function ( d ) { 

                        return d.color; 

                    });

                var graph = svg.selectAll(' .graph' )
                    .data( graphs )
                    .enter().append( 'g' )
                    .attr( 'class', 'graph' );

                graph
                    .append( 'path' )
                    .attr( 'class', 'line' )
                    .attr( 'd', function ( d ) { 

                        return line( d.values );

                    })
                    .style( 'stroke', '#17a9a8' )
                    

                graph
                    .append( 'path' )
                    .attr( 'class', 'area' )
                    .style( 'fill', function ( d ) {

                        return 'url(#' + d.name + '-gradient)';

                    })
                    .attr( 'd', function ( d ) {

                        return area( d.values );

                    });    

                var mouseG = svg.append( 'g' )
                    .attr( 'class', 'mouse-over-effects' );

                mouseG
                    .append( 'path' ) // this is the black vertical line to follow mouse
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

                mousePerLine
                    .append( 'circle' )
                    .attr( 'r', 3.5 )
                    .style( 'fill', ' #17a9a8')
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                mouseG
                    .append( 'svg:rect' ) 
                    .attr( 'width', width )
                    .attr( 'height', height )
                    .attr( 'fill', 'none' )
                    .attr( 'pointer-events', 'all' )
                    .on( 'mouseout', function () { 

                        d3.select( '.mouse-line')
                            .style( 'opacity', '0' );

                        d3.selectAll( '.mouse-per-line circle' )
                            .style( 'opacity', '0' );

                        d3.selectAll( '.mouse-per-line text' )
                            .style( 'opacity', '0' );

                        tooltip
                            .style( 'opacity', 0 );

                    })
                    .on( 'mousemove', function () { 

                        var mouse = d3.mouse( this );
                        var c = d3.select( "#headcountWidget .mouse-per-line" );

                        currentY = angular.element( c._groups[0] ).css('transform').toString()

                        if( currentY.length == 4 ) {

                            currentY = /^matrix\(([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+)\)$/
                            .exec( currentY )

                        } else {

                            currentY = /^matrix\(([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+)\)$/
                            .exec( currentY) .slice( 1 )

                            var currentY = currentY[ 5 ]

                        }

                        svg.select( '#headcountWidget .mouse-line' )
                            .attr( 'd', function () {

                                if ( currentY === null ) return;

                                var d = 'M' + mouse[ 0 ] + ',' + (currentY - 30) ;
                                d += ' ' + mouse[ 0 ] + ',' + currentY ;
                                
                                return d;

                            });

                        var ypos = [];

                        svg.selectAll( '#headcountWidget .mouse-per-line' )
                            .attr( 'transform', function ( d, i ) {

                                var xDate = x.invert( mouse[ 0 ] );
                                var bisect = d3.bisector( function ( d ) { 

                                    return d.date; 

                                }).right;
                                var idx = bisect( d.values, xDate );
                                var dateFormat = d3.timeFormat( "%d %B %Y" );

                                if ( isNaN( d.values[ idx ].count ) ) {

                                    d3.select( '.mouse-line' )
                                        .style( 'opacity', '0' );

                                    d3.selectAll( '.mouse-per-line circle' )
                                        .style( 'opacity', '0' );

                                    d3.selectAll( '.mouse-per-line text' )
                                        .style( 'opacity', '0' );

                                    d3.select(element[ 0 ])
                                        .select( '.tooltip' )
                                        .style( 'opacity', 0 );

                                    return;

                                } else {

                                    d3.select( '#headcountWidget .mouse-line' )
                                        .style( 'opacity', '1' );

                                    d3.selectAll( '#headcountWidget .mouse-per-line circle' )
                                        .style( 'opacity', '1' );

                                    d3.selectAll( '#headcountWidget .mouse-per-line text' )
                                        .style( 'opacity', '1' );

                                    d3.select(element[ 0 ])
                                        .select( '#headcountWidget .tooltip' )
                                        .style( 'opacity', 0.9 )
                                        .style( 'display', 'block' )
                                        .style( 'left', mouse[ 0 ] + 'px' )
                                        .style( 'top', ( currentY - 10 ) + 'px' )


                                }

                                var beginning = 0,
                                    end = lines[ i ].getTotalLength(),
                                    target = null;

                                while ( true ) {

                                    target = Math.floor( ( beginning + end ) / 2 );
                                    var pos = lines[i].getPointAtLength( target );

                                    if ( ( target === end || target === beginning ) && pos.x !== mouse[ 0 ] ) {

                                        break;

                                    }

                                    if ( pos.x > mouse[ 0 ] ) {

                                        end = target;

                                    } else if ( pos.x < mouse[ 0 ] ) {

                                        beginning = target;

                                    } else {

                                        break;

                                    }

                                }

                                d3.select( element[ 0 ] )
                                    .select( '.tooltip' )
                                    .select('.date')
                                    .text( dateFormat( xDate ) );
                                d3.select( element[ 0 ] )
                                    .select( '.tooltip' )
                                    .select( '.'+ d.name )
                                    .text( d.values[ idx ] && d.values[ idx ].count && isNaN( d.values[ idx ].count ) ?
                                        '' : new Intl.NumberFormat()
                                    .format( y.invert( pos.y )
                                    .toFixed() ) );

                                ypos.push({ ind: i, y: pos.y, off: 0 });

                                //

                                return 'translate(' + mouse[ 0 ] + ',' + pos.y +')';

                            })
                            .call( function ( sel ) {

                                ypos.sort( function ( a, b ) { 

                                    return a.y - b.y; 

                                });
                                ypos.forEach( function ( p, i ) {

                                    if ( i > 0 ) {

                                        var last = ypos[i-1].y;
                                        ypos[ i ].off = Math.max( 0, ( last + 15 ) - ypos[ i ].y );
                                        ypos[ i ].y += ypos[ i ].off;

                                    }

                                });

                                ypos.sort( function ( a, b ) { return a.ind - b.ind; });

                            });

                        tooltip
                            .style( 'left', mouse[ 0 ] - 65 + 'px' )

                    })
            };

        }
    };

}]);
