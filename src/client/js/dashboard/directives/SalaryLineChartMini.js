/*
 * @author ohmed
 * Line chart mini directive
*/

angular.module( 'Dashboard.module' )

.directive( 'salaryLineChartMini', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:    '=',
            titleChart: '@',
            fullGraph:  '='
        },
        templateUrl: 'dashboard/directives/salary-line-chart-mini.html',
        link: function ( scope, element, attrs ) {
            var wrapChart = element[0].getElementsByClassName('line-chart-mini')[0];

            $window.addEventListener('resize', function () {

                var newChartData = { 'headcount': scope.setData };

                setTimeout( function () {

                    initGraph( newChartData );

                    setTimeout( function () {

                        initGraph( newChartData );

                        setTimeout( function () {

                            initGraph( newChartData );

                        }, 1000 );

                    }, 700 );

                }, 300 );

            });

            scope.$watch('setData', function ( value ) {

               var newChartData = { 'headcount': scope.setData };

                setTimeout( function () {

                    initGraph( newChartData );

                    setTimeout( function () {

                        initGraph( newChartData );

                        setTimeout( function () {

                            initGraph( newChartData );

                        }, 1000 );

                    }, 700 );

                }, 300 );

            });

            //

            function formatingOnYear ( array, year ) {

                var lengthData = array.length;

                if ( 12 - lengthData > 0 ) {

                    for ( var i = lengthData; i < 12; i ++ ) {

                        var d = i + 1;

                        array.push({
                            date: ( d < 10 ? '0' + d : d.toString() ) + ' ' + 2016
                        });

                    }

                }

                return array;

            };

            function processData ( data, year ) {

                // var processedData = { total: [] };

                // for ( var i = 0, il = data.total.length; i < il; i ++ ) {

                //     processedData.total.push( data.total[ i ] );

                // }

                // data = processedData;

                //

                var lines = [];
                var lineChart = [];

                for ( var e in data ) {

                    lines.push( e );

                }

                if ( lines.length ) {

                    for ( var e in data[ lines[0] ] ) {

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

                if ( ! data ) return;
                data = processData( angular.copy( data ) );

                angular.element( wrapChart ).html('');

                if ( scope.fullGraph ) {

                    var margin = { top: 0, right: 0, bottom: 0, left: 0 };
                    var height = 100 - margin.top - margin.bottom;

                } else {

                    var margin = { top: 0, right:  0, bottom: 0, left: 0 };
                    var height = 25 - margin.top - margin.bottom;

                }

                var width = angular.element( document.querySelector( '#line-width' ) )[ 0 ].clientWidth;
                var parseDate = d3.timeParse('%m %Y');
                var domainTitles = [];
                var rangeColor = [ '#23ad7c' ];

                if ( data.length ) {

                    for ( var e in data[0] ) {

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

                if ( scope.fullGraph ) {

                    svg.append( 'g' )
                        .attr( 'class', 'x axis' )
                        .attr( 'transform', 'translate(0,' + height + ')' )
                        .call( xAxis );

                    svg.append( 'g' )
                        .attr( 'class', 'y axis' );

                } else {

                    svg.append( 'g' )
                        .attr( 'class', 'x axis' )
                        .attr( 'transform', 'translate(0,' + height + ')' );

                    svg.append( 'g' )
                        .attr( 'class', 'y axis' );

                }

                var graph = svg.selectAll(' .graph' )
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

            };

        }
    };

}]);
