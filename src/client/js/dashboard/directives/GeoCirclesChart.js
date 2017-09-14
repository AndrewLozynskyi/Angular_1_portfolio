/*
 * @author ohmed, markiyan
 * Map geo chart directive
*/

angular.module( 'Dashboard.module' )

.directive( 'geoCirclesChart', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData: '='
        },
        templateUrl: 'dashboard/directives/geo-circles-chart.html',
        link: function ( scope, element, attrs ) {

            var chartWrap = element[0].getElementsByClassName('map_container')[0];

            scope.$watch('setData', function ( value ) {

                if ( scope.$parent.$last ) {

                    resizeTimeout = setTimeout( function () {

                        initGraph( angular.copy( value ) );

                    }, 0 )

                } else {

                    initGraph( angular.copy( value ) );

                }

            });

            function initGraph ( series ) {

                angular.element( chartWrap ).html('<div flex class="map">Alternative content</div>');

                var plots = {};

                // We need to colorize every country based on "numberOfWhatever"
                // colors should be uniq for every value.
                // For this purpose we create palette(using min/max series-value)
                var onlyValues = series.countries.map( function ( d ) {

                    return d.count;

                });

                var minValue = Math.min.apply( null, onlyValues );
                var maxValue = Math.max.apply( null, onlyValues );

                d3.select('.scale-label.max')
                    .text( isFinite( maxValue ) ? maxValue : '' );

                d3.select('.scale-label.min')
                    .text( isFinite( minValue ) ? minValue : '' );

                var arrowTooltip = d3.select('.arrow-tooltip');

                // create color palette function
                // color can be whatever you wish
                var paletteScale = d3.scaleLinear()
                    .domain([ minValue,maxValue ])
                    .range([ attrs.colorRangeMin, attrs.colorRangeMax ]); // blue color

                // fill dataset in appropriate format
                series.countries.forEach( function ( d, i ) {

                    plots[ d.centered + '-background' ] = {
                        plotsOn: d.centered,
                        type: 'circle',
                        size: 30 * d.count / maxValue + 15,
                        attrs: {
                            fill: '#ffffff',
                            opacity: 0.6
                        },
                        text: {
                            content: d.country,
                            position: 'top',
                            attrs: {
                                'font-size': 14,
                                fill: '#ffffff',
                                opacity: 0.6,
                                cursor: 'pointer'
                            },
                            attrsHover: {
                                fill: '#ffffff',
                                opacity: 1,
                                cursor: 'pointer'
                            }
                        }
                    };

                    plots[ d.centered ] = {
                        plotsOn: d.centered,
                        type: 'circle',
                        size: 30 * d.count / maxValue + 10,
                        attrs: {
                            fill: series.color
                        },
                        text: {
                            content: d.count,
                            position: 'inner',
                            attrs: {
                                'font-size': 16,
                                fill: '#ffffff',
                                opacity: 1,
                                cursor: 'pointer'
                            },
                            attrsHover: {
                                fill: '#ffffff',
                                opacity: 1,
                                cursor: 'pointer'
                            }
                        }
                    };

                });

                $( chartWrap ).mapael({
                    map : {
                        name : "world_countries_miller",
                        zoom: {
                            enabled: true,
                            maxLevel: 10,
                            mousewheel: false
                        },
                        defaultArea: {
                            attrs: {
                                fill: '#3f4248',
                                stroke: '#373a40'
                            },
                            attrsHover: {
                                fill: '#3f4248'
                            },
                            text: {
                                attrs: {
                                    fill: '#505444'
                                },
                                attrsHover: {
                                    fill: '#000000'
                                }
                            }
                        }
                    },
                    plots: plots
                });

                var donut = angular.element( element ).find('.geo-circles-donut');

                donut.html('');

                scope.type = series.person_type;
                scope.total = series.total;

                var total = series.totalAll;
                var count = series.total;

                var width = 80,
                    height = 80,
                    radius = Math.min( width, height ) / 2;

                var arc = d3.arc()
                    .outerRadius( radius - 13 )
                    .innerRadius( radius - 20 );

                var pie = d3.pie()
                    .sort( null )
                    .value( function ( d ) { return d });

                var dataDonut = [ count, total - count ];

                var color = d3.scaleOrdinal()
                    .domain( dataDonut )
                    .range([ series.color, '#1f2227' ]);

                var svg = d3.select( donut[ 0 ] ).append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                var g = svg.selectAll('.arc')
                    .data( pie( dataDonut ) )
                    .enter().append('g')
                    .attr('class', 'arc');

                var circle = svg.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', radius - 20)
                    .style('fill', '#292c33')
                    .attr('filter', 'url(#dropshadow)');

                /*filter*/

                var defs = svg.append('defs');

                var filter = defs.append('filter')
                    .attr('id', 'dropshadow');

                filter.append('feGaussianBlur')
                    .attr('in', 'SourceAlpha')
                    .attr('stdDeviation', 1)
                    .attr('result', 'blur');

                filter.append('feOffset')
                  .attr('in', 'blur')
                  .attr('result', 'offsetBlur');

                filter.append("feFlood")
                  .attr("in", "offsetBlur")
                  .attr("flood-color",'black')
                  .attr("flood-opacity", "0.8")
                  .attr("result", "offsetColor");

                filter.append("feComposite")
                  .attr("in", "offsetColor")
                  .attr("in2", "offsetBlur")
                  .attr("operator", "in")
                  .attr("result", "offsetBlur");

                var feMerge = filter.append('feMerge');

                feMerge.append('feMergeNode')
                    .attr('in', 'offsetBlur')
                feMerge.append('feMergeNode')
                    .attr('in', 'SourceGraphic');

                /**/

                g.append('path')
                    .attr('d', arc)
                    .style('fill', function (d , i ) { return color( d.data ) });

                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .style('fill', '#bfbfbf')
                    .style('z-index', 1000)
                    .text( Math.round( count / total * 100 ) + '%' );

            };

        }
    };

}]);
