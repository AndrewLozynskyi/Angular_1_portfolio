/*
 * @author ohmed
 * Line chard directive
*/

angular.module( 'Dashboard.module' )

.directive( 'financeWidget', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:    '=',
            setDate:    '=',

        },
        controllerAs: 'fw',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.generalInfo = {
                revenue: [ 10, 25, 15, 40, 20, 250 ],
                headcountTrends: {
                    month: 6,
                    total: 86,
                    year: 79
                }
            };

        }],
        templateUrl: 'dashboard/directives/finance-widget.html',
        link: function ( scope, element, attrs ) {

            scope.generalInfo = {

                revenue: [ 10, 25, 15, 40, 20, 80 ],
                humanCost: [ 5, 20, 10, 35, 15, 40 ]

            };

            var wrapChart = element[ 0 ].getElementsByClassName( 'fin-line-chart-mini' )[ 0 ];

            //

            $('.fin-line-chart-mini').resize( function () {
                
                scope.leftBar = angular.element( document.querySelector( '#left-menu-bar' ) )[ 0 ].clientWidth;

                initGraph( angular.copy( scope.generalInfo ), scope.generalInfo );

            });

            $window.addEventListener( 'resize', function () {

                initGraph( angular.copy( scope.generalInfo ), scope.generalInfo );

            });

            scope.$watch( 'setData', function ( value ) {
               
                initGraph( angular.copy( scope.generalInfo ), scope.generalInfo );

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

                            obj[ lines[ i ] === 'humanCost' ? 'humanCost' : lines[ i ] ] = data[ lines[ i ] ][ e ];

                        }

                        lineChart.push( obj );

                    }

                }

                lineChart = formatingOnYear( lineChart, year );

                return lineChart;

            };

            function initGraph ( data ) {

                if ( ! data ) return;
                data = processData( angular.copy( data ) );

                angular.element( wrapChart ).html( '' );

                if ( scope.fullGraph ) {

                    var margin = { top: 0, right: 0, bottom: 0, left: 0 };
                    var height = 100 - margin.top - margin.bottom;

                } else {

                    var margin = { top: 0, right:  0, bottom: 0, left: 0 };
                    var height = 88

                }

                var width = angular.element( document.querySelector( '#financeWidget' ) )[ 0 ].clientWidth - 10;

                var parseDate = d3.timeParse( '%m %Y' );
                var domainTitles = [];
                var rangeColor = [ '#a0a2a3', '#ee04e0' ];

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

                color.domain( d3.keys( data[ 0 ] ).filter( function ( key ) {

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
                    .attr( 'id', 'revenue-gradient' )
                    .attr( 'gradientUnits', 'userSpaceOnUse' )
                    .attr( 'x1', '0%' ).attr( 'y1', 0 )
                    .attr( 'x2', '100%' ).attr( 'y2', 0 )
                    .selectAll( 'stop' )
                    .data([
                        { offset: '0%',   color: 'rgba( 150, 25, 148, 0 )' },
                        { offset: '30%',  color: 'rgba( 150, 25, 148, 0.06 )' },
                        { offset: '45%',  color: 'rgba( 150, 25, 148, 0.09 )' },
                        { offset: '55%',  color: 'rgba( 150, 25, 148, 0.1 )' },
                        { offset: '60%',  color: 'rgba( 150, 25, 148, 0.12 )' },
                        { offset: '100%', color: 'rgba( 150, 25, 148, 0.2 )' }
                    ])
                    .enter().append( 'stop' )
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



                svg
                    .append( 'g' )
                    .attr( 'class', 'x axis' )
                    .attr( 'transform', 'translate(0,' + height + ' )' )
                    .call( xAxis )
                    .selectAll( 'text' )
                    .attr( 'transform', 'translate( ' + width / 24 + ',0 )' )
                    .last()
                    .remove();

                svg
                    .append( 'g' )
                    .attr( 'class', 'y axis' )
                    .call( yAxis );

                var graph = svg.selectAll( '#financeWidget .graph' )
                    .data( graphs )
                    .enter()
                    .append( 'g' )
                    .attr( 'class', 'graph' );

                graph
                    .append( 'path' )
                    .attr( 'class', 'line' )
                    .attr( 'd', function ( d ) {

                        return line( d.values );

                    })
                    .style( 'stroke', function ( d ) {

                        return color( d.name );

                    });
                    

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
                    .append( 'path' )
                    .attr( 'class', 'mouse-line' )
                    .style( 'stroke', '#17a9a8' )
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                var lines = svg.selectAll( '#financeWidget .line' )._groups[ 0 ];

                var mousePerLine = mouseG.selectAll( '#financeWidget .mouse-per-line' )
                    .data( graphs )
                    .enter()
                    .append( 'g' )
                    .attr( 'class', 'mouse-per-line' );

                mousePerLine
                    .append( 'circle' )
                    .attr( 'r', 3.5 )
                    .style( 'fill', ' #17a9a8' )
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                mouseG
                    .append( 'svg:rect' ) 
                    .attr( 'width', width )
                    .attr( 'height', height )
                    .attr( 'fill', 'none' )
                    .attr( 'pointer-events', 'all' )
                    .on( 'mouseout', function () { 

                        d3.select( '#financeWidget .mouse-line' )
                            .style( 'opacity', '0' );

                        d3.selectAll( '#financeWidget .mouse-per-line circle' )
                            .style( 'opacity', '0' );

                        d3.selectAll( '#financeWidget .mouse-per-line text' )
                            .style( 'opacity', '0' );

                        tooltip
                            .style( 'opacity', 0 );

                    })
                    .on( 'mousemove', function () { 

                        scope.mouse = d3.mouse( this );

                        var f = d3.select(".fin-line-chart-mini .mouse-per-line");
                        currentY = angular.element( f._groups[ 0 ] ).css( 'transform' ).toString()

                        var widgetY = d3.select(".fin-line-chart-mini");
                        var currentWidgetY = angular.element( f._groups[ 0 ] ).offset().left
                        var currentWidgetX = angular.element( f._groups[ 0 ] ).offset().top

                        if( currentY.length == 4 ) {

                            currentY = /^matrix\(([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+)\)$/
                            .exec( currentY )

                        } else {

                            currentY = /^matrix\(([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+)\)$/
                            .exec( currentY ).slice( 1 )

                            var currentY = currentY[ 5 ]

                        }

                        svg.select( '#financeWidget .mouse-line' )
                            .attr( 'd', function () {

                                var d = 'M' + scope.mouse[ 0 ] + ',' + height;
                                d += ' ' + scope.mouse[ 0 ] + ',' + (currentY - 80 ) ;
                                return d;

                            });

                        var ypos = [];

                        svg.selectAll( '#financeWidget .mouse-per-line' )
                            .attr( 'transform', function ( d, i ) {

                                var xDate = x.invert( scope.mouse[ 0 ] );
                                var bisect = d3.bisector( function ( d ) { 

                                    return d.date; 

                                }).right;
                                var idx = bisect( d.values, xDate );
                                var dateFormat = d3.timeFormat( "%d %B %Y" );

                                if ( isNaN( d.values[ idx ].count ) ) {

                                    d3.select( '#financeWidget .mouse-line' )
                                        .style( 'opacity', '0' );

                                    d3.selectAll( '#financeWidget .mouse-per-line circle' )
                                        .style( 'opacity', '0' );

                                    d3.selectAll( '#financeWidget .mouse-per-line text' )
                                        .style( 'opacity', '0' );

                                    d3.select(element[ 0 ])
                                        .select( '#financeWidget .tooltip' )
                                        .style( 'opacity', 0 );

                                    return;

                                } else {

                                    d3.select( '#financeWidget .mouse-line' )
                                        .style( 'opacity', '1' );

                                    d3.selectAll( '#financeWidget .mouse-per-line circle' )
                                        .style( 'opacity', '1' );

                                    d3.selectAll( '#financeWidget .mouse-per-line text' )
                                        .style( 'opacity', '1' );

                                    d3.select(element[ 0 ])
                                        .select( '#financeWidget .tooltip' )
                                        .style( 'opacity', 0.9)
                                        .style( 'display', 'block' )

                                }

                                var beginning = 0,
                                    end = lines[ i ].getTotalLength(),
                                    target = null;

                                while ( true ) {

                                    target = Math.floor( ( beginning + end ) / 2 );
                                    var pos = lines[i].getPointAtLength( target );

                                    if ( ( target === end || target === beginning) && pos.x !== scope.mouse[ 0 ] ) {

                                        break;

                                    }

                                    if ( pos.x > scope.mouse[ 0 ] ) {

                                        end = target;

                                    } else if ( pos.x < scope.mouse[ 0 ] ) {

                                        beginning = target;

                                    } else {

                                        break;

                                    }

                                }

                                d3.select(element[ 0 ])
                                    .select( '#financeWidget .tooltip' )
                                    .select( '.date' )
                                    .text(dateFormat(xDate));
                                d3.select(element[ 0 ])
                                    .select( '#financeWidget .tooltip' )
                                    .select( '.'+ d.name)
                                    .text(d.values[ idx ] && d.values[ idx ].count && isNaN( d.values[ idx ].count ) ?
                                        '' : new Intl.NumberFormat()
                                    .format( y.invert( pos.y )
                                    .toFixed() ) );

                                ypos.push({ ind: i, y: pos.y, off: 0 });

                                //

                                return 'translate( ' + scope.mouse[ 0 ] + ',' + pos.y +' )';

                            })
                            .call( function ( sel ) {

                                ypos.sort( function ( a, b ) { 

                                    return a.y - b.y; 

                                });
                                ypos.forEach( function ( p, i ) {

                                    if ( i > 0 ) {

                                        var last = ypos[ i-1 ].y;
                                        ypos[ i ].off = Math.max( 0, ( last + 15 ) - ypos[ i ].y );
                                        ypos[ i ].y += ypos[ i ].off;

                                    }

                                });

                                ypos.sort( function ( a, b ) { 

                                    return a.ind - b.ind; 

                                });

                            });

                        var flexY  = angular.element( d3.select( ".flex-container" )._groups[ 0 ] ).offset().top

                        var cursorX;
                        var cursorY;

                        document.onmousemove = function( e ) {

                            scope.cursorX = e.pageX;
                            scope.cursorY = e.pageY;

                        }

                        var setLeftWidth = 0;

                        if ( scope.leftBar === 90 ) {

                            setLeftWidth = 90;

                        } else if (scope.leftBar === 190 ) {

                            setLeftWidth = 190;

                        }

                        tooltip
                            .style( 'left', (scope.cursorX - setLeftWidth - 95 ) + 'px' )
                            .style( 'top', (  currentWidgetX - flexY - 93 ) + 'px' )

                    })
            };

        }
    };

}]);
