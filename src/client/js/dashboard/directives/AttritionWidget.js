/*
 * @author ohmed
 * Line chard directive
*/

angular.module( 'Dashboard.module' )

.directive( 'attritionWidget', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData:    '=',
            setDate:    '=',

        },
        controllerAs: 'aw',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.avarageAge = [
                { diapazone: '15-20', title: 'some text', color: '#28c98a' },
                { diapazone: '20-30', title: 'some text', color: '#99c162' },
                { diapazone: '30-40', title: 'some text', color: '#fac956' },
                { diapazone: '40-50', title: 'some text', color: '#ce7182' },
                { diapazone: '50-60', title: 'some text', color: '#942cab' },
                { diapazone: '60-70', title: 'some text', color: '#780bbf' }

            ];

            $this.generalInfo = {
                attritionTrends: {
                    month: 6,
                    total: 86,
                    year: 94
                }
            }

            $this.setColor = function ( color ) {

                return { 'background-color': color };

            };

        }],
        templateUrl: 'dashboard/directives/attrition-widget.html',
        link: function ( scope, element, attrs ) {

            scope.generalInfo = [

                { diapazone: '15-20', title: 'Voluntary', color: '#ffb600', total: 15.8 },
                { diapazone: '20-30', title: 'Involuntary', color: '#7f5b00', total: 10.4 }

            ];

            var wrapChart = element[ 0 ].getElementsByClassName( 'finance-chart' )[ 0 ];

            //

            $window.addEventListener( 'resize', function () {

                initGraph( scope.generalInfo );

            });

            scope.$watch( 'setData', function ( value ) {

                initGraph( scope.generalInfo );

            });

            //

            function initGraph ( data ) {

                var rangeColor = [ '#ffb600', '#7f5b00' ];

                var sum = data.reduce( function ( a, b ) {

                    return a + b.total;

                }, 0 );

                dataTip = data.map( function ( e, i ) {

                    e.percentage = parseFloat( ( 100 / sum * e.total ).toFixed(1) );
                    e.id = i;
                    e.color = rangeColor[ i ];

                    return e;

                });

                scope.legend = data;

                angular.element( wrapChart ).html( '' );

                var voluntary = 15.8;
                var involuntary = 10.4;

                var legend = angular.element( element[ 0 ].getElementsByClassName( 'legend' )[ 0 ] );
                var legendAge = angular.element( element[ 0 ].getElementsByClassName( 'legend-age' )[ 0 ] );

                var titleHeight = (angular.element( document.querySelector( '#titleHeight' ) )[ 0 ].clientHeight );
                var width = angular.element( document.querySelector( '#workforceWidget' ) )[ 0 ].clientWidth / 2;
                var height = (angular.element( document.querySelector( '#workforceWidget' ) )[ 0 ].clientHeight - titleHeight );

                var radius = Math.min( width, height ) / 2 - 10;

                var arc = d3.arc()
                    .outerRadius( radius  )
                    .innerRadius( radius * 0.7 );

                var pie = d3.pie()
                    .sort(null)
                    .value( function ( d ) { return d });

                // first donut

                var data = [ voluntary, involuntary, 100 - voluntary - involuntary];

                var color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#ffb600', '#7f5b00', '#1f2227' ]);

                var svg = d3.select(wrapChart).append( 'svg' )
                    .attr( 'width', width)
                    .attr( 'height', height)
                    .append( 'g' )
                    .attr( 'transform', 'translate(' + ( width - (width - radius) + 10 ) + ',' + height / 2 + ')' )


                var g = svg.selectAll( '.arc' )
                    .data( pie( data ) )
                    .enter().append( 'g' )
                    .attr( 'class', 'arc' );

                var circle = svg.append( 'circle' )
                    .attr( 'cx', 0 )
                    .attr( 'cy', 0 )
                    .attr( 'r', radius * 0.7 )
                    .style( 'fill', '#292c33' )
                    .attr( 'filter', 'url(#dropshadow)' );

                /*filter*/

                var defs = svg.append( 'defs' )

                var filter = defs.append( 'filter' )
                    .attr( 'id', 'dropshadow' );

                filter
                    .append( 'feGaussianBlur' )
                    .attr( 'in', 'SourceAlpha' )
                    .attr( 'stdDeviation', 0.7)
                    .attr( 'result', 'blur' );

                filter
                    .append( 'feOffset' )
                    .attr( 'in', 'blur' )
                    .attr( 'result', 'offsetBlur' );

                filter
                    .append( "feFlood" )
                    .attr( "in", "offsetBlur" )
                    .attr( "flood-color",'#3e4b56' )
                    .attr( "flood-opacity", "0.8" )
                    .attr( "result", "offsetColor" );

                filter
                    .append( "feComposite" )
                    .attr( "in", "offsetColor" )
                    .attr( "in2", "offsetBlur" )
                    .attr( "operator", "in" )
                    .attr( "result", "offsetBlur" );

                var feMerge = filter.append( 'feMerge' );

                feMerge.append( 'feMergeNode' )
                    .attr( 'in', 'offsetBlur' )
                feMerge.append( 'feMergeNode' )
                    .attr( 'in', 'SourceGraphic' );

                /**/

                g.append( 'path' )
                    .attr( 'd', arc)
                    .style( 'fill', function ( d, i ) { return color( d.data ) });

                svg.append( 'text' )
                    .attr( 'text-anchor', 'middle' )
                    .attr( 'dy', '0.35em' )
                    .style( 'fill', '#bfbfbf' )
                    .style( 'z-index', 1000 )
                    .text( voluntary + '%' );

                var mouseG = svg.append( 'g' )
                    .attr( 'class', 'mouse-over-effects' );

                mouseG
                    .append( 'path' )
                    .attr( 'class', 'mouse-line' )
                    .style( 'stroke', '#17a9a8' )
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                var mousePerLine = mouseG.selectAll( '#attritionWidget .mouse-per-line' )
                    .data( data )
                    .enter()
                    .append( 'g' )
                    .attr( 'class', 'mouse-per-line' );

                mousePerLine
                    .append( 'circle' )
                    .attr( 'r', 3.5 )
                    .style( 'fill', ' #17a9a8' )
                    .style( 'stroke-width', '1px' )
                    .style( 'opacity', '0' );

                var tooltip = createTooltip(1);

                var arcs = svg.selectAll( '#attritionWidget .arc' )
                    .data( dataTip )
                    .on( 'mouseenter', function ( d, i ) {

                        // Add data to the tooltip
                        tooltip
                            .select( '.title' )
                            .text( d.title );

                        var row = tooltip.select( '.row' );
                        var rows = tooltip.select( '.rows' );
                        var dep = tooltip.select( '.dep' );

                        row.select( '.name' ).text( 'Attrition ' +  d.total + '%' );
                        rows.select( '.value' ).text( d.title + ' attrition' );

                        tooltip.style( 'opacity', 1 );


                    })
                    .on( 'mousemove', function ( d ) {

                        scope.mouse = d3.mouse( this );

                        var lineY = scope.mouse[ 0 ] - 10;
                        var posY = scope.mouse[ 1 ] - 5;

                        svg.select( '#attritionWidget .mouse-line' )
                            .attr( 'd', function () {

                                var d = 'M' + scope.mouse[ 0 ] + ',' + ( lineY - 100 ) ;
                                d += ' ' + scope.mouse[ 0 ] + ',' + ( scope.mouse[ 1 ] - 5 ) ;
                                return d;

                            })
                            .style( 'top', scope.mouse[ 1 ] - 80 + 'px' )
                            .style( 'opacity', 0);

                        svg.select( '#attritionWidget .mouse-per-line circle' )
                            .style( 'opacity', 1 )
                            .attr( 'transform', 'translate(' + scope.mouse[ 0 ] + ',' + posY  + ')' );

                        var c = svg.select( '#attritionWidget .mouse-per-line circle' )._groups[ 0 ];

                        currentY = angular.element( c )
                            .css( 'transform' )

                        var widthTip = angular.element( document.querySelector( '#attritionWidget svg ' ) )[ 0 ].clientWidth ;
                        document.onmousemove = function( e ) {

                            scope.cursorX = e.pageX;
                            scope.cursorY = e.pageY;

                        }
                        tooltip
                            .style( 'left', width - (width - radius) + scope.mouse[ 0 ] + 10 + 'px' )
                            .style( 'top', scope.mouse[ 1 ] + 12  + 'px' )
                            .style( 'opacity', 1 );

                    })
                    .on( 'mouseleave', function ( d, i ) {

                        tooltip.style( 'opacity', 0 );
                        d.sort = d.id;

                        svg.selectAll( '#attritionWidget .slice' ).sort( function ( a, b ) {

                            return ( a.sort > b.sort ) ? 1 : -1;

                        });
                        svg.select( '#attritionWidget .mouse-line' )
                            .style( 'opacity', 0 );

                        svg.select( '#attritionWidget .mouse-per-line circle' )
                            .style( 'opacity', 0 )

                    });

            };

            function createTooltip ( countRows ) {

                var tooltip = d3.select( wrapChart )
                    .style( 'position', 'relative' )
                    .append( 'div' )
                    .attr( 'class', 'tooltipa' )
                    .style( 'opacity', 0 )
                    .style( 'position', 'absolute' );

                var tooltipHtml ='<table><tr class="row"><td class="name"></td></tr>'+
                                '<tr class="row"><td></td></tr>'+
                                '<tr class="rows"><td class="value"></td></tr>'+
                                '</table><div class="line"></div>';

                tooltip.html( tooltipHtml );

                //

                return tooltip;

            };

        }
    };

}]);
