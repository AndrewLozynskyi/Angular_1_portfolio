/*
 * @author illya
 * Avarage salary chart directive
*/

angular.module( 'Dashboard.module' )

.directive( 'avarageSalaryDepartments', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:    '='
        },
        templateUrl: 'dashboard/directives/avarage-salary-departments.html',
        link: function ( scope, element, attr ) {

            var chartWrap = element[ 0 ].getElementsByClassName( 'avarage-container-dep' )[ 0 ];

            scope.$watch('setData', function ( value ) {

                value.pop();

                initGraph( angular.copy( value ), scope.setDate );

            });

            $window.addEventListener('resize', function () {

                initGraph( angular.copy( scope.setData ) );

            });

            function initGraph ( data ) {

                var data = data;
                var onlyValues = data.map( function ( obj ) {

                    return obj.salary;

                });

                var colorBar = attr.colorBarDep;
                var barHover = attr.barHoverDep;
                var container = d3.select( chartWrap );
                var margin = { top: 20, right: 20, bottom: 30, left: 40 },
                    width = parseFloat( container.style( "width" ) ) - 70,
                    height = 27 * ( data.length ) + data.length * 20 ;

                var y = d3.scaleBand()
                            .range( [ height, 0 ] )
                            .padding( 0.1 );

                var x = d3.scaleLinear()
                            .range( [ 0, width - 120 ] );

                var svg = d3.select( '.avarage-salary-dep svg' );

                svg.selectAll( "*" ).remove();

                if ( svg.empty() ) {

                    svg = d3.select( '.avarage-salary-dep' ).append( "svg" );

                };

                svg
                    .attr( "width", width + margin.left + margin.right )
                    .attr( "height", height + margin.top + margin.bottom )
                    .append( "g" )
                    .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" )

                data.forEach( function ( d ) {

                    d.salary =  d.salary;

                });

                x.domain( [ 0, d3.max( data, function ( d ) { 

                        return  d.salary; 

                    }) 

                ]);
                y.domain( data.map( function ( d ) { return d.department; } ));

                // append the rectangles for the bar chart
                svg
                    .selectAll( ".bar-dep" )
                    .data( data )
                    .enter()
                    .append( "rect" )
                    .attr( "class", "bar-dep" )
                    .style( 'fill', colorBar )
                    .attr( "width", function( d ) {

                        return x( d.salary );

                    })
                    .attr( "y", function( d ) {

                        return y( d.department );

                    })

                    .attr( "height", y.bandwidth() );

                // add the x Axis

                svg
                    .append( "g" )
                    .attr( "class", "x axis" )
                    .attr( "transform", "translate(0," + height + " )")
                    .call( d3
                            .axisBottom( x )
                            .ticks( 7 )
                            .tickFormat( function ( d ) {

                                d = d / 1000 + "k " + '\u20AC';

                                return d;

                            })
                            .tickPadding( 10 )
                            .tickSizeOuter( 0 )
                            .tickSizeInner( [ - height ] )
                    );

                // add the y Axis

                svg
                    .append( "g" )
                    .attr( "class", "y ord" )
                    .call( d3.axisLeft( y )
                        .tickSizeOuter( 0 )
                     );

                //4

                var tooltip = d3.select( '.tooltip-salary-dep' );
                    tooltip.selectAll( "*" ).remove();

                    if ( tooltip.empty() ) {

                        tooltip = d3.select( chartWrap ).append( "div" );

                    };

                tooltip
                    .style( 'position', 'relative' )
                    .attr( 'class', 'tooltip-salary-dep md-whiteframe-24dp' )
                    .style( 'opacity', 0 )
                    .style( 'display', 'none' )
                    .style( 'top', '-10px' )
                    .style( 'position', 'absolute' );

                var tooltipHtml = '<table><tr class="row"><td class="name"></td></tr>'+
                                  '<tr class="row"><td></td></tr>'+
                                  '<tr class="rows"><td class="value"></td></tr>'+
                                  '<tr class="row1"><td class="total"></td></tr>'+
                                  '</table><div class="salary-dep-line"></div>';

                tooltip.html( tooltipHtml );
                tooltipHtml += '</table>';
                tooltip.html( tooltipHtml );

                var mouseG = svg.append( 'g' )
                    .attr( 'class', 'mouse-over-effects-dep' )

                mouseG
                    .append( 'path' )
                    .attr( 'class', 'mouse-line-dep' )
                    .style( 'stroke', '#17a9a8' )
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                mouseG
                    .append( 'path' )
                    .attr( 'class', 'mouse-line-tip-dep' )
                    .style( 'stroke', '#17a9a8' )
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                mouseG
                    .append( 'circle' )
                    .attr( 'class', 'mouse-circle-dep' )
                    .attr( 'r', 3.5 )
                    .style( 'fill','#17a9a8')
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                d3.selectAll( 'svg .bar-dep' )
                    .on( 'mouseenter', function ( d ) {

                        var lineWidth = x( d.salary )
                        var lineHeight = y( d.department );
                        var circleWidth = x( d.salary )
                        var circleHeight = y( d.department );
                        var mouse = d3.mouse( this );

                        svg
                            .select( '.mouse-line-dep' )
                            .attr( 'd', function () {

                                var d = 'M' + lineWidth + ',' + height;
                                d += ' ' + lineWidth + ',' + lineHeight;
                                return d;

                            });

                        svg
                            .select( '.mouse-circle-dep' )
                            .attr( 'cx', lineWidth )
                            .attr( 'cy', height );

                        var ypos = [];
                        var maxY = false;

                    })

                .on( 'mousemove', function ( d ) {

                    d3.select( '.mouse-line-dep' )
                        .style( 'opacity', '1' );

                    d3.select( '.mouse-line-tip-dep' )
                        .style( 'opacity', '0' );

                    d3.selectAll( '.mouse-circle-dep' )
                            .style( 'opacity', '1' );

                    d3.select( element[ 0 ] )
                        .select( '.tooltip-salary-dep' )
                        .style( 'opacity', 0.9 )
                        .style( 'display', 'block' );

                    var mouseTip = d3.mouse( this );

                    this.style.fill = barHover;

                    var lineHeight = y( d.department );
                    var tipHeight = lineHeight - 75;

                    svg
                        .select( '.mouse-line-tip-dep' )
                        .attr( 'd', function () {

                            var d = 'M' + mouseTip[ 0 ] + ',' + tipHeight;
                                d += ' ' + mouseTip[ 0 ] + ',' + lineHeight;
                                return d;

                        });

                    var currentY = (element[0].getElementsByClassName('mouse-line-tip-dep')[0]).getBoundingClientRect();

                    var flexY  = angular.element( d3.select(".dashboard")._groups[ 0 ] ).offset().top;

                    onmousemove = function ( e ) {

                        scope.mouseY = e.clientY;

                    };

                    var ypos = [];
                    var maxY = false;

                    tooltip
                        .style( 'left', ( mouseTip[ 0 ] + 72 ) + 'px' )
                        .style( 'top', ( scope.mouseY - flexY + 180 ) + 'px' );

                    var row = tooltip.select( '.row' );
                    var rows = tooltip.select( '.rows' );
                    var row1 = tooltip.select( '.row1' );

                    row.select( '.name' ).text( d.department );
                    rows.select( '.value' ).text( "Avarage Salary " + d.salary + '\u20AC' );
                    row1.select( '.total' ).text( "Total  Salary Will Changing " +  '940.507' + '\u20AC' );

                })

                .on( 'mouseout', function () {

                    d3.select( '.mouse-line-dep' ).style( 'opacity', '0' );
                    d3.select( '.mouse-line-tip-dep' ).style( 'opacity', '0' );
                    d3.selectAll( '.mouse-circle-dep' ).style( 'opacity', '0' );

                    this.style.fill = colorBar;

                    tooltip.style( 'opacity', 0 );

                });

            };

        }
    };

}]);
