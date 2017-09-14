/*
 * @author ohmed, markiyan
 * Salary graph directive
*/

angular.module( 'Profile.module' )

.directive( 'salaryGraph', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:    '='
        },
        templateUrl: 'profile/directives/salary-graph.html',
        link: function ( scope, element, attrs ) {

            var resizeTimeout;
            var wrapChart = element[0].getElementsByClassName('line-chart')[0];
            initGraph( angular.copy( scope.setData ) );

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

            function preprocessData ( data ) {

                var processedData = [];
                var items = {};
                var bonuses = {};

                var monthsList = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Now', 'Dec' ];

                //

                for ( var i = 0, il = data.length; i < il; i ++ ) {

                    data[ i ].bonus = data[ i ].bonus || [];
                    data[ i ].sort = new Date( data[ i ].dateStart );

                    for ( var j = 0, jl = data[ i ].bonus.length; j < jl; j ++ ) {

                        bonuses[ data[ i ].bonus[ j ].periodFor ] = data[ i ].bonus[ j ];

                    }

                }

                data.sort( function ( a, b ) { return ( a.sort > b.sort ) ? 1 : 0 } );

                //

                for ( var i = 0, il = data.length; i < il; i ++ ) {

                    if ( data[ i + 1 ] && data[ i ].dateStart === data[ i + 1 ].dateStart ) continue;

                    if ( items[ data[ i ].dateStart + data[ i ].dateEnd ] ) continue;
                    items[ data[ i ].dateStart + data[ i ].dateEnd ] = true;

                    var startDate = ( data[ i ].dateStart ) ? new Date( data[ i ].dateStart ) : new Date();
                    var endDate = ( data[ i ].dateEnd ) ? new Date( data[ i ].dateEnd ) : new Date();

                    var startYear = startDate.getFullYear();
                    var endYear = endDate.getFullYear();

                    for ( var year = startYear; year < ( ( startYear === endYear ) ? endYear : endYear + 1 ); year ++ ) {

                        var startMonth = ( year === startDate.getFullYear() ) ? startDate.getMonth() + 1 : 1;
                        var endMonth = ( year === endDate.getFullYear() ) ? endDate.getMonth() + 1 : 12;

                        for ( var month = startMonth - 1; month <= endMonth; month ++ ) {

                            var bonus = bonuses[ monthsList[ month ] + '-' + ( year % 100 ) ];
                            bonus = ( bonus ) ? + bonus.amount : 0;

                            var day = 1;
                            if ( year === startYear && month === startMonth ) day = startDate.getDay();

                            processedData.push({
                                salary:     Math.round( data[ i ].count / 12 ),
                                currency:   data[ i ].currency,
                                date:       new Date( year, month, day ),
                                bonus:      bonus
                            });

                            // small hack to remove vertical bonuse / salary spikes
                            var prev = processedData[ processedData.length - 2 ];
                            var cur = processedData[ processedData.length - 1 ];
                            if ( prev ) {

                                if ( cur.date.getFullYear() === prev.date.getFullYear() && cur.date.getMonth() === prev.date.getMonth() ) {

                                    if ( cur.date.getDay() - prev.date.getDay() < 2 ) {

                                        prev.bonus = cur.bonus;
                                        prev.salary = cur.salary;

                                    }

                                }

                            }

                        }

                    }

                }

                return processedData;

            };

            function initGraph ( data ) {

                if ( ! data || ! data.length ) {

                    return;

                }

                var currency = data[0].currency;
                if ( currency === 'USD' ) currency = '$';

                date = new Date();
                var origData = data;
                data = preprocessData( data );
                angular.element( wrapChart ).html('');

                var margin = { top: 20, right: 30, bottom: 50, left: 100 };
                var width = angular.element( element )[0].clientWidth - margin.left - margin.right;
                var height = 250 - margin.top - margin.bottom;

                var parseDate = d3.timeParse('%m %Y');
                var domainTitles = [ 'salary', 'bonus' ];
                var rangeColor = [ '#ee04e0', '#04ee93' ];

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

                //

                var dateArr = {};
                origData.map( function ( item ) {

                    var now = new Date().toISOString();
                    dateArr[ item.dateStart || now ] = 1;

                    if ( item === origData[ origData.length - 1 ] ) {

                        dateArr[ item.dateEnd || now ] = 1;

                    }

                } );

                dateArr = Object.keys( dateArr );
                dateArr = dateArr.map( function ( item ) { return new Date( item ); } );

                //

                var xAxis = d3.axisBottom( x )
                    .tickSizeInner( - height )
                    .tickSizeOuter( 0 )
                    .tickPadding( 10 )
                    .tickValues( dateArr )
                    .tickFormat( d3.timeFormat('%d %b %y') );

                var yAxis = d3.axisLeft( y )
                    .tickSizeInner( - width )
                    .tickSizeOuter( 0 )
                    .tickPadding( 10 )
                    .ticks( 7 )
                    .tickFormat( function ( d, i ) {

                        return ( currency + ' ' + ( d / 1000 ).toFixed(1) + 'k' ).replace(/\./, ',');

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

                    tooltipHtml += '<tr><td><span class="circle" style="background: ' + rangeColor[ i ] + '"></span></td><td></td><td class="' + domainTitles[ i ] + '"></td></tr>';

                }

                tooltipHtml += '</table>';
                tooltip.html( tooltipHtml );

                //

                color.domain( d3.keys( data[0] ).filter( function ( key ) {

                    return key === 'salary' || key === 'bonus';

                }));

                var graphs = color.domain().map( function ( name ) {

                    return {
                        name: name,
                        values: data.map( function ( item ) {
                            return {
                                date:   item.date,
                                count:  item[ name ]
                            };
                        })
                    };

                });

                x.domain([
                    d3.min( data, function ( d ) {

                        return d.date;

                    }),
                    d3.max( data, function ( d ) {

                        return d.date;

                    })
                ]);

                y.domain([ 0, d3.max( graphs, function ( c ) {

                    return d3.max( c.values, function ( v ) {

                        return Math.max( 6000, Math.ceil( 1.3 * v.count / 1000 ) * 1000 );

                    });

                })]);

                svg.append('linearGradient')
                    .attr('id', 'salary-gradient')
                    .attr('gradientUnits', 'userSpaceOnUse')
                    .attr('x1', '0%').attr('y1', 0)
                    .attr('x2', '100%').attr('y2', 0)
                    .selectAll('stop')
                    .data([
                        { offset: '0%',   color: 'rgba( 150, 25, 148, 0 )' },
                        { offset: '30%',  color: 'rgba( 150, 25, 148, 0.06 )' },
                        { offset: '45%',  color: 'rgba( 150, 25, 148, 0.09 )' },
                        { offset: '55%',  color: 'rgba( 150, 25, 148, 0.1 )' },
                        { offset: '60%',  color: 'rgba( 150, 25, 148, 0.12 )' },
                        { offset: '100%', color: 'rgba( 150, 25, 148, 0.2 )' }
                    ])
                    .enter().append('stop')
                    .attr('offset', function ( d ) { return d.offset; })
                    .attr('stop-color', function ( d ) { return d.color; });

                svg.append('linearGradient')
                    .attr('id', 'bonus-gradient')
                    .attr('gradientUnits', 'userSpaceOnUse')
                    .attr('x1', '0%').attr('y1', 0)
                    .attr('x2', '100%').attr('y2', 0)
                    .selectAll('stop')
                    .data([
                        { offset: '0%',   color: 'rgba( 40, 128, 112, 0 )' },
                        { offset: '30%',  color: 'rgba( 40, 128, 112, 0.06 )' },
                        { offset: '45%',  color: 'rgba( 40, 128, 112, 0.09 )' },
                        { offset: '55%',  color: 'rgba( 40, 128, 112, 0.1 )' },
                        { offset: '60%',  color: 'rgba( 40, 128, 112, 0.12 )' },
                        { offset: '100%', color: 'rgba( 40, 128, 112, 0.2 )' }
                    ])
                    .enter().append('stop')
                    .attr('offset', function ( d ) { return d.offset; })
                    .attr('stop-color', function ( d ) { return d.color; });

                svg.append( 'g' )
                    .attr( 'class', 'x axis' )
                    .attr( 'transform', 'translate(0,' + height + ')' )
                    .call( xAxis );

                svg.append( 'g' )
                    .attr( 'class', 'y axis' )
                    .call( yAxis );

                var graph = svg.selectAll( '.graph' )
                    .data( graphs )
                    .enter().append( 'g' )
                    .attr( 'class', 'graph' );

                graph.append('path')
                    .attr('class', 'area')
                    .style('fill', function ( d ) {

                        return 'url(#' + d.name + '-gradient)';

                    })
                    .attr( 'd', function ( d ) {
                        return area( d.values );
                    });

                graph.append( 'path' )
                    .attr( 'class', 'line' )
                    .attr( 'd', function ( d ) {
                        return line( d.values );
                    })
                    .style( 'stroke', function ( d ) {
                        return color( d.name );
                    });

                //

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
                    .on('mouseover', function () {

                        d3.select('.mouse-line')
                            .style('opacity', '1');

                        d3.selectAll('.mouse-per-line circle')
                            .style('opacity', '1');

                        d3.selectAll('.mouse-per-line text')
                            .style('opacity', '1');

                        d3.select(element[0]).select('.tooltip').style('opacity', 0.9).style( 'display', 'block' );

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
                        var maxY = false;

                        svg.selectAll('.mouse-per-line')
                        .attr('transform', function ( d, i ) {

                            if ( i > 1 ) return;

                            var xDate = x.invert( mouse[0] );
                            var dateFormat = d3.timeFormat('%d %B %Y');

                            var beginning = 0,
                                end = lines[ i ].getTotalLength(),
                                target = null;

                            //

                            if ( x.invert( lines[ i ].getPointAtLength( beginning ).x ) > xDate || x.invert( lines[ i ].getPointAtLength( end ).x ) <= xDate  ) {

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

                            //

                            while ( true ) {

                                target = Math.floor( ( beginning + end ) / 2 );
                                var pos = lines[ i ].getPointAtLength( target );

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

                            ypos.push({ ind: i, y: pos.y, off: 0 });

                            //

                            d3.select(element[0]).select('.tooltip').select('.date')
                                .text( dateFormat( xDate ) );

                            if ( d.name === 'salary' ) {

                                var salary = y.invert( pos.y ).toFixed();
                                d3.select( element[0] ).select('.tooltip').select( '.' + d.name )
                                    .text( salary + ',00 ' + currency );

                            }

                            if ( d.name === 'bonus' ) {

                                var bonus = y.invert( pos.y ).toFixed();

                                d3.select( element[0] ).select('.tooltip').select( '.' + d.name )
                                    .text( bonus + ',00 ' + currency );

                            }

                            if ( maxY === false || maxY > pos.y ) {

                                maxY = pos.y;
                                tooltip.style( 'top', ( pos.y - 20 ) + 'px' );

                            }

                            //

                            return 'translate(' + mouse[0] + ',' + pos.y +')';

                        })
                        .call( function ( sel ) {

                            ypos.sort( function ( a, b ) { return a.y - b.y; });
                            ypos.forEach( function ( p, i ) {

                                if ( i > 0 ) {

                                    var last = ypos[ i - 1 ].y;
                                    ypos[ i ].off = Math.max( 0, ( last + 15 ) - ypos[ i ].y );
                                    ypos[ i ].y += ypos[ i ].off;

                                }

                            });

                            ypos.sort( function ( a, b ) { return a.ind - b.ind; });

                        });

                        tooltip.style( 'left', ( mouse[0] + 19 ) + 'px' );

                    });

            };

            //

            $window.addEventListener('resize', function () {

                initGraph( angular.copy( scope.setData ) );

                //

                clearTimeout( resizeTimeout );
                resizeTimeout = setTimeout( function () {

                    initGraph( angular.copy( scope.setData ) );

                    clearTimeout( resizeTimeout );
                    resizeTimeout = setTimeout( function () {

                        initGraph( angular.copy( scope.setData ) );

                        clearTimeout( resizeTimeout );
                        resizeTimeout = setTimeout( function () {

                            initGraph( angular.copy( scope.setData ) );

                        }, 1000 );

                    }, 700 );

                }, 300 );

            });

            scope.$watch('setData', function ( value ) {
                console.log(value);
                initGraph( angular.copy( value ) );

            });

        }
    };

}]);
