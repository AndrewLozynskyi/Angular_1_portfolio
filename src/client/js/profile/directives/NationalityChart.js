/*
 * @author ohmed
 * Nationality chart directive
*/

angular.module( 'Profile.module' )

.directive( 'nationalityChart', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData: '=',
            teamNationality: '='
        },
        templateUrl: 'profile/directives/nationality-chart.html',
        link: function ( scope, element, attrs ) {

            var chartWrap = element[0].getElementsByClassName('map_container')[0];

            scope.nationality = {};

            scope.$watch('teamNationality', function ( data ) {

                scope.nationality.countries = [];

                if ( data === undefined ) return;

                for ( var key in  data.totalAvarage.nationality ) {

                    if ( key === 'country' ) {

                        scope.countyKey = key;

                    } else {

                        scope.isoKey = key;
                        
                    }

                    scope.nationality.countries.push({
                        country:  scope.countyKey,
                        count: data.totalAvarage.nationality[key],
                        centered: scope.isoKey
                    })

                };

                initGraph( angular.copy( scope.nationality ) );

            });

            $window.addEventListener( 'resize', function () {

                scope.nationality.countries = [];

                if ( scope.teamNationality === undefined ) return;

                for ( var key in  scope.teamNationality.totalAvarage.nationality ) {

                    scope.nationality.countries.push({
                        country:  key,
                        count:scope.teamNationality.totalAvarage.nationality[key],
                        centered: key
                    });
                }

                initGraph( angular.copy ( scope.nationality ), scope.nationality );

            });

            $('.review').resize( function () {
                
                scope.nationality.countries = [];

                if ( scope.teamNationality === undefined ) return;

                for ( var key in  scope.teamNationality.totalAvarage.nationality ) {

                    scope.nationality.countries.push({
                        country:  key,
                        count:scope.teamNationality.totalAvarage.nationality[key],
                        centered: key
                    });
                }

                initGraph( angular.copy ( scope.nationality ), scope.nationality );

            });

            function initGraph ( nationality ) {

                angular.element( chartWrap ).html('<div flex class="map">Alternative content</div>');

                var width = angular.element( document.querySelector( '#customerBody' ) )[ 0 ].clientWidth ;
                var legend = angular.element( element[ 0 ].getElementsByClassName( 'team-map' ) );
                var legendMap = angular.element( element[ 0 ].getElementsByClassName( 'geo-circles-chart' ) );
                var mapWidth = angular.element( element[ 0 ].getElementsByClassName( 'map_container' ) );
                legend.css("width", ( width / 3 ) + "px");
                legendMap.css("width", ( width / 3 ) + "px");
                mapWidth.css("max-width", ( width / 3 ) + "px");

                var plots = {};

                var onlyValues = nationality.countries.map( function ( d ) {

                    return d.count;

                });

                var minValue = Math.min.apply( null, onlyValues );
                var maxValue = Math.max.apply( null, onlyValues );

                d3.select('.scale-label.max')
                    .text( isFinite( maxValue ) ? maxValue : '' );

                d3.select('.scale-label.min')
                    .text( isFinite( minValue ) ? minValue : '' );

                var arrowTooltip = d3.select('.arrow-tooltip');

                var paletteScale = d3.scaleLinear()
                    .domain([ minValue,maxValue ])
                    .range([ attrs.colorRangeMin, attrs.colorRangeMax ]); // blue color

                nationality.countries.forEach( function ( d, i ) {

                    plots[ d.centered + '-background' ] = {
                        plotsOn: d.centered,
                        type: 'circle',
                        size: 30 * d.count / maxValue + 15,
                        attrs: {
                            fill: '#942cab',
                            opacity: 0.2
                        },
                        attrsHover: {
                            fill: '#942cab',
                            opacity: 0.2,
                            cursor: 'pointer'
                        },
                        text: {
                            content: d.country,
                            position: 'top',
                            attrs: {
                                'font-size': 14,
                                fill: '#ffffff',
                                opacity: 0.2,
                                cursor: 'pointer'
                            },
                            attrsHover: {
                                fill: '#ffffff',
                                opacity: 0.3,
                                cursor: 'pointer'
                            }
                        }
                    }

                    plots[ d.centered ] = {
                        plotsOn: d.centered,
                        type: 'circle',
                        size: 30 * d.count / maxValue + 15,
                        attrs: {
                            fill: '#942cab',
                            opacity: 0.2
                        },
                        attrsHover: {
                            fill: '#942cab',
                            opacity: 1,
                            cursor: 'pointer'
                        },
                        text: {
                            content: d.count,
                            position: 'inner',
                            attrs: {
                                'font-size': 14,
                                fill: '#ffffff',
                                opacity: 0.2,
                                cursor: 'pointer'
                            },
                            attrsHover: {
                                fill: '#ffffff',
                                opacity: 1,
                                cursor: 'pointer'
                            }
                        }
                    }

                });

                $( chartWrap ).mapael({
                    map : {
                        name : "world_countries_miller",
                        zoom: {
                            enabled: false,
                            maxLevel: 10,
                            mousewheel: false
                        },
                        defaultArea: {
                            attrs: {
                                fill: '#3f4248',
                                stroke: '#373a40'
                            },
                            attrsHover: {
                                fill: '#F5F5F5'
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

                scope.type = nationality.person_type;
                scope.total = nationality.total;

                var total = nationality.totalAll;
                var count = nationality.total;

                var width = 80,
                    height = 80,
                    radius = Math.min( width, height ) / 2;

                var arc = d3.arc()
                    .outerRadius( radius - 13 )
                    .innerRadius( radius - 20 );

                var pie = d3.pie()
                    .sort(null)
                    .value( function (d) { return d });

                var dataDonut = [ count, total - count ];

                var color = d3.scaleOrdinal()
                    .domain( dataDonut )
                    .range([ '#942cab', '#1f2227' ]);

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

                //

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
