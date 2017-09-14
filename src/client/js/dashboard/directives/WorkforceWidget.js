/*
 * @author ohmed
 * Line chard directive
*/

angular.module( 'Dashboard.module' )

.directive( 'workforceWidget', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:    '=',
            setDate:    '=',

        },
        controllerAs: 'ww',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.generalInfo = {};

            $scope.$watch( 'setData', function ( value ) {

                if ( value === undefined ) return;

                    $this.generalInfo.workforceTrends = value.workforceWidgetData.trends;

                    var b = angular.element( document.querySelector( '#left-menu-bar' ) )[ 0 ].clientWidth;
                    
                if ( b <= 190 ) {

                }    

            });

            $this.setColor = function ( color ) {

                return { 'background-color': color };

            };

        }],
        templateUrl: 'dashboard/directives/workforce-widget.html',
        link: function ( scope, element, attrs ) {

            scope.generalInfo = [];

            $window.addEventListener( 'resize', function () {

                if ( scope.setData === undefined ) return;

                initGraph( scope.setData.workforceWidgetData.chart );

            });

            scope.$watch( 'setData', function ( value ) {

                if ( value === undefined ) return;

                value = value.workforceWidgetData.chart;

                initGraph( angular.copy ( value ), value );

            });

            //

            var wrapChart = element[ 0 ].getElementsByClassName( 'pie-chart' )[ 0 ];

            $('.pie-chart').resize( function () {

                if ( scope.setData === undefined ) return;

                scope.leftBar = angular.element( document.querySelector( '#left-menu-bar' ) )[ 0 ].clientWidth;

                initGraph( angular.copy( scope.setData.workforceWidgetData.chart ), scope.setData.workforceWidgetData.chart );

            });

            //

            function initGraph ( data ) {

                if ( ! data.length ) return;

                angular.element( wrapChart ).html( '' );

                var rangeColor = [ '#28c98a', '#99c162', '#fac956', '#ce7182', '#942cab', '#780bbf' ];

                //

                var sum = data.reduce( function ( a, b ) {

                    return a + b.value;

                }, 0 );

                data = data.map( function ( e, i ) {

                    e.percentage = parseFloat( ( 100 / sum * e.value ).toFixed( 1 ) );
                    e.id = i;
                    e.color = rangeColor[ i ];

                    return e;

                });

                scope.legend = data;

                //

                scope.setColor = function ( color ) {

                    return { 'background': color };

                };

                var legend = angular.element( element[ 0 ].getElementsByClassName( 'legend' )[ 0 ] );
                var legendAge = angular.element( element[ 0 ].getElementsByClassName( 'legend-age' )[ 0 ] );

                var titleHeight = (angular.element( document.querySelector( '#titleHeight' ) )[ 0 ].clientHeight );
                var width = angular.element( document.querySelector( '#workforceWidget' ) )[ 0 ].clientWidth / 2;
                var height = (angular.element( document.querySelector( '#workforceWidget' ) )[ 0 ].clientHeight - titleHeight);

                var radius = Math.min( width, height ) / 2 - 10;

                var innerRadius = 0.3 * radius;
                var pie = d3.pie()
                    .value( function ( d ) {
                        
                        return d.percentage;

                    });

                var arc = d3.arc()
                    .innerRadius( 0 )
                    .outerRadius( function ( d ) {
                        
                        scope.transfWidth = ( radius - 100 ) * d.data.percentage / 100 ;
                        return ( radius - 100 ) * d.data.percentage / 100 + 45;

                    });

                var hover = d3.arc()
                    .innerRadius( 0 )
                    .outerRadius( function ( d ) {

                        return ( radius - 100 ) * d.data.percentage / 100  + 50;

                    });

                var transfWidth = width / 4 - scope.transfWidth 
                
                var svg = d3.select( wrapChart ).append( 'svg' )
                    .attr( 'width', width )
                    .attr( 'height', height )
                    .append( 'g' )
                    .attr( 'transform', 'translate(' + (width - radius)   + ',' + height / 2 + ')' )
                    .attr( 'class', 'g-pos' )

                var defs = d3.select( 'svg > g' ).append( 'defs' );

                var shadow = defs.append( 'filter' ).attr( 'id', 'shadow' )
                    .attr( 'filterUnits', 'userSpaceOnUse' )
                    .attr( 'x', -1 * ( width / 2 ) )
                    .attr( 'y', -1 * ( height / 2 ) )
                    .attr( 'width', width )
                    .attr( 'height', height );

                shadow
                    .append( 'feGaussianBlur' )
                    .attr( 'in', 'SourceAlpha' )
                    .attr( 'stdDeviation', 5 )
                    .attr( 'result', 'blur' );

                shadow
                    .append( 'feOffset' )
                    .attr( 'in', 'blur' )
                    .attr( 'dx', 0 )
                    .attr( 'dy', 0 )
                    .attr( 'result', 'offsetBlur' ) ;

                shadow
                    .append( 'feBlend' )
                    .attr( 'in', 'SourceGraphic' )
                    .attr( 'in2', 'offsetBlur' )
                    .attr( 'mode', 'normal' );

                var tooltip = createTooltip( 1 );

                var arcs = svg.selectAll( '#workforceWidget g.slice' )
                    .data( pie( data ) )
                    .enter()
                    .append( 'g' )
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
                            .select( '.title' )
                            .text( d.data.name );

                        var row = tooltip.select( '.row' );
                        var rows = tooltip.select( '.rows' );
                        var dep = tooltip.select( '.dep' );

                        // row.select( '.name' ).text( 'age ' +  d.data.diapazone );
                        rows.select( '.value' ).text( d.data.value + ' employees' );
                        dep.select( '.value' ).text( d.data.percentage + '% from all departments(159)' );

                        tooltip.style( 'opacity', 1 );

                        // Add hover effect
                        d.sort = 100;

                        svg.selectAll( '.slice' ).sort( function ( a ) {

                            return ( a.sort != d.sort ) ? -1 : 1;

                        });

                    })
                    .on( 'mousemove', function ( d ) {

                        var widget = d3.select( ".flex-container #workforceWidget" )
                        var mouse = d3.mouse( this )

                        widget = angular.element( widget._groups[ 0 ] ).offset().top
                        var widgetY = d3.select("#workforceWidget");
                        var flexY  = angular.element( d3.select(".flex-container")._groups[ 0 ] ).offset().top
                        var currentWidgetY = angular.element( widgetY._groups[ 0 ] ).offset().left 
                        var currentWidgetX = angular.element( widgetY._groups[ 0 ] ).offset().top
                        var cursorX;
                        var cursorY;

                        document.onmousemove = function( e ) {

                            scope.cursorX = e.pageX;
                            scope.cursorY = e.pageY;

                        }

                        scope.leftBar = angular.element( document.querySelector( '#left-menu-bar' ) )[ 0 ].clientWidth;

                        var setLeftWidth = 0;

                        if ( scope.leftBar === 90 ) {

                            setLeftWidth = 90;

                        } else if (scope.leftBar === 190 ) {

                            setLeftWidth = 190;

                        }
                        
                        tooltip
                            .style( 'left', ( scope.cursorX - setLeftWidth - 30 ) + 'px' )
                            .style( 'top', ( scope.cursorY - flexY - 55 ) +  'px' )
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

                        svg.selectAll( '.slice' ).sort( function ( a, b ) {

                            return ( a.sort > b.sort ) ? 1 : -1;

                        });

                    });

                arcs.append( 'path' )
                    .attr( 'class', 'hover' )
                    .attr( 'd', hover );

                arcs.append( 'path' )
                    .attr( 'fill', function( d, i ) {
                        
                        return rangeColor[ i ];

                    })
                    .attr( 'class', 'solidArc' )
                    .attr( 'd', arc )
                    .on( 'mouseenter', function ( d ) {

                        var endAngle = d.endAngle + 0.03;
                        var startAngle = d.startAngle - 0.03;

                        var arcOver = d3.arc()
                            .innerRadius( 0 )
                            .outerRadius( function ( d ) {

                                return ( radius - 100 ) * d.data.percentage / 100 + 42;

                            })
                            .endAngle( endAngle )
                            .startAngle( startAngle );

                        d3.select( this )
                            .transition()
                            .duration( 1000 )
                            .attr( 'd', arcOver );

                    })
                    .on( 'mouseleave', function ( d ) {

                        d3.select( this )
                            .transition()
                            .attr( 'd', arc );

                    });

                arcs.filter( function ( d ) {

                    return ( d.endAngle - d.startAngle ) > 0.4;

                }).append( 'text' )
                    .attr( 'dy', '.35em' )
                    .attr( 'text-anchor', 'middle' )
                    .attr( 'transform', function ( d ) {

                        //set the label's origin to the center of the arc
                        //we have to make sure to set these before calling arc.centroid

                        d.outerRadius = radius; 
                        d.innerRadius = radius / 8; 

                        return 'translate(' + arc.centroid( d ) + ')';

                    })
                    .style( 'fill', 'White' )
                    .style( 'font-size', '14px' )

            };

            function createTooltip ( countRows ) {

                var tooltip = d3.select( wrapChart )
                    .append( 'div' )
                    .attr( 'class', 'tooltip-workf' )
                    .style( 'opacity', 0 )
                    .style( 'top', '-10px' )
                    .style( 'position', 'absolute' );

                var tooltipHtml ='<table><tr class="row"><td class="name"></td></tr>'+
                                '<tr class="row"><td></td></tr>'+
                                '<tr class="rows"><td class="value"></td></tr>'+
                                '<tr class="dep"><td class="value"></td></tr></table> <div class="line"></div><div class="dot"></div>';

                tooltip.html( tooltipHtml );

                //

                return tooltip;

            };

            initGraph( scope.generalInfo );

        }
    };

}]);
