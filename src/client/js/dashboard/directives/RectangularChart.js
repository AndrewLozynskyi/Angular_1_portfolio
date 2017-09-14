/*
 * @author ohmed
 * Rectangular chart directive
*/

angular.module( 'Dashboard.module' )

.directive( 'rectangularChart', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            activeParams:   '=',
            setData:        '='
        },
        templateUrl: 'dashboard/directives/rectangular-chart.html',
        link: function ( scope, element, attrs ) {

          var chartWrap = element[ 0 ].getElementsByClassName( 'rect-container' )[ 0 ];

            scope.$watch( 'setData', function ( value ) {

                initGraph( angular.copy( value ));

            });

            $window.addEventListener('resize', function () {

                setTimeout( function () {

                    initGraph( angular.copy( scope.setData ) );

                    setTimeout( function () {

                        initGraph( angular.copy( scope.setData ) );

                        setTimeout( function () {

                            initGraph( angular.copy( scope.setData ) );

                        }, 1000 );

                    }, 700 );

                }, 300 );

            });

            function initGraph ( data ) {

                var container = d3.select( chartWrap );
                var width = parseFloat( container.style( "width" ) ) - 130;
                var height = parseFloat( container.style( "height" ) );
                var flare = { children: [] };
                var total = 0;
                var totalAttrition = 0;

                for ( var countryName in data ) {

                    if ( countryName === 'total' ) continue;
                    if ( scope.activeParams.countries.length && scope.activeParams.countries.indexOf( countryName ) === -1 ) continue;

                    flare.children.push({
                        name:       countryName,
                        size:       data[ countryName ].attrition,
                        attrition:  data[ countryName ].attrition,
                        involuntary:  data[ countryName ].involuntary,
                        voluntary:  data[ countryName ].voluntary,
                        headcount:  data[ countryName ].headcount
                    });

                };

                for ( var i = 0; i < flare.children.length; i ++ ) {

                    totalAttrition += flare.children[ i ].attrition;

                };

                if ( totalAttrition === 0 ) {

                    flare.children.length = 0;

                    for ( var countryName in data ) {

                        if ( scope.activeParams.countries.length && scope.activeParams.countries.indexOf( countryName ) === -1 ) continue;
                        if ( countryName === 'total' ) continue;

                        flare.children.push({
                            name:       countryName,
                            size:       data[ countryName ].headcount,
                            attrition:  data[ countryName ].attrition,
                            involuntary:  data[ countryName ].involuntary,
                            voluntary:  data[ countryName ].voluntary,
                            headcount:  data[ countryName ].headcount
                        });

                    }

                };

                var onlyValues = [];

                for ( var i = 0; i < flare.children.length; i ++ ) {

                    if ( flare.children[ i ].size > 0 ) {

                        onlyValues.push( flare.children[ i ].size )

                    }

                };

                onlyValues.sort( function ( a, b ) {

                    return a - b;

                });

                var count = function () {

                    for ( var i = 0; i < flare.children.length; i ++ ) {

                        total += flare.children[ i ].size;

                    }

                }();

                var minValue = Math.min.apply( null, onlyValues );
                var maxValue = Math.max.apply( null, onlyValues );
                var midValue = onlyValues[ Math.floor( (onlyValues.length - 1) / 2 ) ];

                var svg = d3.select( '.rectangular-chart svg' );
                svg.selectAll( "*" ).remove();

                if ( svg.empty() ) {

                    svg = d3.select( '.rectangular-chart' ).append( "svg" );

                };

                svg
                .attr( 'width', width )
                .attr( 'height', height )
                .attr('class', 'rect-svg')

                var x = d3.scaleLinear().range( [ 0, width ] );
                var y = d3.scaleLinear().range( [ 0, height ] );
                var node;
                var root;

                var paletteScale = d3.scaleLinear()
                    .domain( [ 0, midValue, maxValue ] )
                    .range( [ attrs.colorRangeMin, attrs.colorRangeMiddle, attrs.colorRangeMax ] );

                var fader = function ( color ) {

                    return d3.interpolateRgb( color, "#fff" )( 0.2 );

                };

                flare.children.forEach( function ( item, i ) {

                    var color = paletteScale( item.size )
                    item.color = color;

                });

                var format = d3.format( ",d" );

                var treemap = d3.treemap()
                .tile( d3.treemapResquarify )
                .size( [ width, height ] )
                .round( true )
                .paddingInner( 1 );

                // Filter property

                var defs = svg
                    .append( "defs" );

                var filter = defs
                    .append( "filter" )
                    .attr( "id", "drop-shadow" )
                    .attr( "height", "130%" );

                filter
                    .append( "feGaussianBlur" )
                    .attr( "in", "SourceAlpha" )
                    .attr( "stdDeviation", 5 )
                    .attr( "result", "blur" );

                filter
                    .append( "feOffset" )
                    .attr( "in", "blur" )
                    .attr( "dx", 0 )
                    .attr( "dy", 0 )
                    .attr( "result", "offsetBlur" );

                var feMerge = filter
                    .append( "feMerge" );

                feMerge
                    .append( "feMergeNode" )
                    .attr( "in", "offsetBlur" )
                feMerge
                    .append( "feMergeNode" )
                    .attr( "in", "SourceGraphic" );

                root = d3.hierarchy( flare )
                    .eachBefore( function ( d ) {} )
                    .sum( function ( d ) {

                        return d.size;

                    })
                    .sort( function ( a, b ) {

                        return b.height - a.height || b.value - a.value;

                    });

                //

                node = root;
                treemap( root );
                var cell = svg
                    .selectAll( "g" )
                    .data( root.leaves() )
                    .enter().append( "g" )
                    .attr( "class", "cell" )
                    .attr( "transform", function ( d ) {

                        return "translate( " + d.x0 + "," + d.y0 + " )";

                    });

                // Big rect

                cell
                    .append( "rect" )
                    .attr( "class", "cell" )
                    .attr( "id", function ( d ) {

                        return d.data.id;

                    })
                    .attr( "width", function ( d ) {

                        return d.x1 - d.x0;

                    })
                    .attr( "height", function ( d ) {

                        return d.y1 - d.y0;

                    })
                    .style( 'stroke', "black" )
                    .style( 'fill', function( d ) {

                        if ( totalAttrition === 0 ) {

                            d.data.color = '#2fdcda';

                        }

                        if ( onlyValues.length === 1 ) {

                            d.data.color = '#fe8500';

                        }

                        return d3.rgb( d.data.color );

                    });

                d3.selectAll( '.rect-svg g' )
                    .on( 'mouseenter', function( d ) {

                        d3.select( this )
                            .style( "filter", "url(#drop-shadow)" );

                        showTooltip( d );

                    });

                d3.selectAll( '.rect-svg g' )
                    .on( 'mousemove', function ( d ) {

                        d3.selectAll( '.rectangular-chart' )
                            .on( 'mousemove', function ( d ) {

                                scope.mouse = d3.mouse( this );

                    })
                    d3.select( this )
                        .style( "filter", "url(#drop-shadow)" );

                        showTooltip( d, scope.mouse );

                    });

                d3.selectAll( '.rect-svg g' )
                    .on( 'mouseout', function () {

                        d3.select( this )
                            .style( "filter", null );

                        tooltip
                            .style( 'opacity', 0 );

                    });

                // Small rect

                cell
                    .append( "rect" )
                    .attr( "id", function ( d ) {

                        return d.data.id;

                    })
                    .attr( "width", function ( d ) {

                        if ( d.data.involuntary === undefined || d.data.size === undefined ) return;

                        var res = d.data.involuntary * 100 / d.data.size;
                        var s1 = ( d.x1 - d.x0 ) * ( d.y1 - d.y0 );
                        var s2 = s1 * res / 100;
                        var coef = Math.sqrt( s1 / s2 );

                        var resX = ( d.x1 - d.x0 ) / coef;

                        if ( isNaN( resX ) ) return;

                        return resX;

                    })
                    .attr( "height", function ( d ) {

                        if ( d.data.involuntary === undefined || d.data.size === undefined ) return;

                        var res = d.data.involuntary * 100 / d.data.size;
                        var s1 = ( d.x1 - d.x0 ) * ( d.y1 - d.y0 );
                        var s2 = s1 * res / 100;
                        var coef = Math.sqrt( s1 / s2 );

                        var resY = ( d.y1 - d.y0 ) / coef;

                        if ( isNaN( resY ) ) return;

                        return resY;

                    })
                    .attr( "y", function ( d ) {

                        if ( d.data.involuntary === undefined || d.data.size === undefined ) return;

                        var res = d.data.involuntary * 100 / d.data.size;
                        var s1 = ( d.x1 - d.x0 ) * ( d.y1 - d.y0 );
                        var s2 = s1 * res / 100;
                        var coef = Math.sqrt( s1 / s2 );

                        var resY = ( d.y1 - d.y0 ) / coef;

                        if ( isNaN( ( d.y1 - d.y0 ) - resY ) ) return;

                        return ( d.y1 - d.y0 ) - resY;

                    })
                    .style('fill', function ( d ) {

                        return d3.rgb( d.data.color ) ;

                    })

                cell.append( "rect" )
                    .attr( "id", function( d ) {

                        return d.data.id;

                    })
                    .attr( "width", function( d ) {

                        if ( d.data.involuntary === undefined || d.data.size === undefined ) return;

                        var res = d.data.involuntary * 100 / d.data.size;
                        var s1 = ( d.x1 - d.x0 ) * ( d.y1 - d.y0 );
                        var s2 = s1 * res / 100;
                        var coef = Math.sqrt( s1 / s2 );

                        var resX = ( d.x1 - d.x0 ) / coef;

                        if ( isNaN( resX ) ) return;

                        return resX;

                    })
                    .attr( "height", function( d ) {

                        if ( d.data.involuntary === undefined || d.data.size === undefined ) return;

                        var res = d.data.involuntary * 100 / d.data.size;
                        var s1 = ( d.x1 - d.x0 ) * ( d.y1 - d.y0 );
                        var s2 = s1 * res / 100;
                        var coef = Math.sqrt( s1 / s2 );

                        var resY = ( d.y1 - d.y0 ) / coef;

                        if ( isNaN( resY ) ) return;

                        return resY;

                    })
                    .attr( "y", function( d ) {

                        if ( d.data.involuntary === undefined || d.data.size === undefined ) return;

                        var res = d.data.involuntary * 100 / d.data.size;
                        var s1 = ( d.x1 - d.x0 ) * ( d.y1 - d.y0 );
                        var s2 = s1 * res / 100;
                        var coef = Math.sqrt( s1 / s2 );

                        var resY = ( d.y1 - d.y0 ) / coef;

                        if ( isNaN( (d.y1 - d.y0) - resY ) ) return;
                        
                        return (d.y1 - d.y0) - resY;

                    })
                    .style( 'fill', "black" )
                    .style( 'opacity', "0.2" )

                // Text property

                cell
                    .append( "text" )
                    .attr( "x", 10 )
                    .attr( "y", 40 )

                    .style("font-size", function ( d ) {

                        var barWidth = d.x1 - d.x0;

                        if ( barWidth >= 130 ) {

                            return 14 + "px"

                        } else if ( barWidth < 130 && barWidth >= 90 ) {

                            return 12 + "px"

                        } else if ( barWidth < 90 && barWidth >= 80 ) {

                            return 10 + "px"

                        } else if ( barWidth < 80 ) {

                            return 9 + "px"

                        }

                    })
                    .style( "font-weight", "400" )
                    .style( "font-family", "Roboto" )
                    .text( function( d ) {

                        var barWidth = d.x1 - d.x0;
                        var barHeight = d.y1 - d.y0;

                        if ( barHeight < 45 || barWidth < 40 ) {

                            return " ";

                        } else if ( barWidth < 70 && barWidth >= 40 ) {

                            return "Hd " + d.data.headcount;

                        } else {

                            return "Headcount " + d.data.headcount;

                        }

                    });

                cell
                    .append( "text" )
                    .attr( "x", 10 )
                    .attr( "y", 20 )
                    .attr( "dy", ".35em" )
                    .style( "font-size", function ( d ) {

                        var barWidth = d.x1 - d.x0;

                        if ( barWidth >= 130 ) {

                            return 14 + "px"

                        } else if ( barWidth < 130 && barWidth >= 90 ) {

                            return 12 + "px"

                        } else if ( barWidth < 90 && barWidth >= 80 ) {

                            return 10 + "px"

                        } else if ( barWidth < 80 ) {

                            return 9 + "px"

                        }

                    })
                    .text( function ( d ) {

                        var barWidth = d.x1 - d.x0;
                        var barHeight = d.y1 - d.y0;

                        if ( barWidth < 40 || barHeight < 45 ) {

                            return " ";

                        } else {

                            return d.data.name;

                        }

                    });

                var tooltip = createTooltip(1);

                function createTooltip ( countRows ) {

                    var tooltip = d3.select( '.rectangular-chart .tooltipattr' );
                    tooltip.selectAll( "*" ).remove();

                    if ( tooltip.empty() ) {

                        tooltip = d3.select( '.rectangular-chart' ).append( "div" );

                    };
                    tooltip
                        .style( 'position', 'relative' )
                        .attr( 'class', 'tooltipattr' )
                        .style( 'opacity', 1 )
                        .style( 'left', '-200px' )
                        .attr("text-anchor", "middle")
                        .style( 'position', 'absolute' );

                    var tooltipHtml = '<table><tr class="row"><td class="name"></td></tr>'+
                                  '<tr class="rows"><td class="value"></td></tr>'+
                                  '<tr class="row1"><td class="inVol"></td></tr>'+
                                  '<tr class="row2"><td class="vol"></td></tr>'+
                                  '<tr class="row"><td></td></tr>'+
                                  '<tr class="row3"><td class="current"></td></tr>'+
                                  '<tr class="dep"><td class="value"></td></tr></table>';

                    tooltip.html( tooltipHtml );

                    return tooltip;

                };

                function showTooltip ( d , mouse ) {

                    if ( mouse === undefined || d === undefined ) return;

                    tooltip
                        .style( 'left', mouse[ 0 ] - 50 + 'px' )
                        .style( 'top', mouse[ 1 ] + 500 + 'px' )
                        .select('.title')
                        .text( d.data.name );

                        var row = tooltip.select( '.row' );
                        var rows = tooltip.select( '.rows' );
                        var row1 = tooltip.select( '.row1' );
                        var row2 = tooltip.select( '.row2' );
                        var row3 = tooltip.select( '.row3' );
                        var dep = tooltip.select( '.dep' );

                        row.select( '.name' ).text( d.data.name );
                        rows.select( '.value' ).text( "Total YDT Attrition " + d.data.attrition + "%" );
                        row1.select( '.inVol' ).text( "YDT Involuntary " + d.data.involuntary + "%" );
                        row2.select( '.vol' ).text( "YDT Voluntary "  + d.data.voluntary + "%" );
                        row3.select( '.current' ).text( "Current Headcount " + d.data.headcount );
                        tooltip.style( 'opacity', 1 );

                };

                // Chart size

                var svgGradient = d3.select( '#gradient-chart svg' );
                svgGradient.selectAll( "*" ).remove();

                if ( svgGradient.empty() ) {

                    svgGradient = d3.select( '#gradient-chart' ).append( "svg" );

                };

                svgGradient
                    .attr("width", '85' )
                    .attr("height", '330' );

                var gradient = svgGradient
                    .append( "svg:defs" )
                    .append( "svg:linearGradient" )
                    .attr( "id", "gradient" )
                    .attr( "x1", "0%" )
                    .attr( "y1", "0%" )
                    .attr( "x2", "0%" )
                    .attr( "y2", "100%" )
                    .attr( "spreadMethod", "pad" );

                gradient
                    .append( "svg:stop" )
                    .attr( "offset", "0%" )
                    .attr( "stop-color", "#ff8400" )
                    .attr( "stop-opacity", 1 );

                gradient
                    .append( "svg:stop" )
                    .attr( "offset", "50%" )
                    .attr( "stop-color", "#c3ee04" )
                    .attr( "stop-opacity", 1 );

                gradient
                    .append( "svg:stop" )
                    .attr( "offset", "100%" )
                    .attr( "stop-color", "#00fffc" )
                    .attr( "stop-opacity", 1 );

                svgGradient
                    .append( "g" )
                    .append( "rect" )
                    .attr( "x", 70 )
                    .attr( "y", 0 )
                    .attr( "width", "15" )
                    .attr( "height", "330" )
                    .style( "fill", "url(#gradient)" );

                // Transparent chart size

                var transporent = svgGradient
                    .append( "svg:defs" )
                    .append( "svg:linearGradient" )
                    .attr( "id", "transporent" )
                    .attr( "x1", "0%" )
                    .attr( "y1", "0%" )
                    .attr( "x2", "0%" )
                    .attr( "y2", "100%" )
                    .attr( "spreadMethod", "pad" );

                transporent
                    .append( "svg:stop" )
                    .attr( "offset", "100%" )
                    .attr( "stop-opacity", 0.3 )
                    .style( "fill", "rgba(0, 0, 0, 0.3)" );

                svgGradient
                    .append( "g" )
                    .append( "rect" )
                    .attr( "x", 62 )
                    .attr( "y", 220 )
                    .attr( "width", "15" )
                    .attr( "height", "110" )
                    .style( "fill", "url(#transporent)" );

                // Text size

                // Top indicator

                svgGradient
                    .append( "g" )
                    .append( "text" )
                    .attr( "x", 20 )
                    .attr( "y", 10 )
                    .text( maxValue + '%' )
                    .attr( "text-anchor", "start" )
                    .style( "fill", "#bfbfbf" );

                // Middle indicator

                svgGradient
                    .append( "g" )
                    .append( "text" )
                    .attr( "x", 0 )
                    .attr( "y", 225 )
                    .text( "Involuntary" )
                    .attr( "text-anchor", "start" )
                    .style( "fill", "#bfbfbf" );

                // Bottom indicator

                svgGradient
                    .append( "g" )
                    .append( "text" )
                    .attr( "x", 20 )
                    .attr( "y", "100%" )
                    .text( "0%" )
                    .attr( "text-anchor", "start" )
                    .style( "fill", "#bfbfbf" );

            };

        }
    };

}]);
