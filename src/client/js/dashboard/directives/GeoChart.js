/*
 * @author ohmed, markiyan
 * Dashboard map directive
*/

angular.module( 'Dashboard.module' )

.directive( 'geoChart', [ '$window', 'headcount.service', function ( $window, headcountService ) {

    return {
        restrict: 'E',
        scope: {
            setData:        '=',
            activeParams:   '=',
            selectedDate:   '='
        },
        templateUrl: 'dashboard/directives/geo-chart.html',
        link: function ( scope, element, attrs ) {

            var chartWrap = element[0].getElementsByClassName('map_container')[0];
            var resizeTimeout = false;

            angular.element( element[0].getElementsByClassName('scale-body')[0] ).css({
                background: 'linear-gradient(to top, ' + attrs.colorRangeMin + ', '+ attrs.colorRangeMax + ')'
            });

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

                initGraph( angular.copy( value ) );

            });

            function initGraph ( series ) {

                angular.element( chartWrap ).html('<div flex class="map">Alternative content</div>');

                var areas = {};
                var onlyValues = series.map( function ( obj ) {

                    return obj.total;

                });

                var minValue = Math.min.apply( null, onlyValues );
                var maxValue = Math.max.apply( null, onlyValues );

                // histogram bar

                d3.select('.scale-label.max')
                    .text( isFinite( maxValue ) ? maxValue : '' );

                d3.select('.scale-label.min')
                    .text( isFinite( minValue ) ? minValue : '' );

                var arrowTooltip = d3.select('.arrow-tooltip');

                // create color palette function
                // color can be whatever you wish
                var paletteScale = d3.scaleLinear()
                    .domain([ minValue, maxValue ])
                    .range([ attrs.colorRangeMin, attrs.colorRangeMax ]);

                // config mapael map

                series.forEach( function ( item, i ) {

                    var color = paletteScale( item.total );
                    var origColor = color;

                    if ( scope.activeParams.countries.length && scope.activeParams.countries.indexOf( item.country ) === -1 ) {

                        var c = paletteScale( item.total ).split('(')[1];
                        color = 'rgb(' + ( +c.split(',')[0] / 3 ) + ', ' + ( +c.split(',')[1] / 3 ) + ', ' + ( +c.split(',')[2].split(')')[0] / 3 ) + ')';

                    }

                    areas[ item.short ] = {
                        attrs: {
                            fill: color
                        },
                        attrsHover: {
                            fill: origColor
                        },
                        text: {
                            name: item
                        },
                        eventHandlers: {
                            click: function ( e, id, mapElem, textElem ) {

                                var country = mapElem.tooltip.name;

                                var prevLength = scope.activeParams.countries.length;
                                scope.activeParams.countries = scope.activeParams.countries.filter( function ( value ) { return country !== value; } );

                                if ( prevLength === scope.activeParams.countries.length && scope.activeParams.countries.indexOf( country ) === -1 ) {

                                    scope.activeParams.countries.push( country );

                                }

                                headcountService.selectCountries( scope.activeParams.countries.filter( function ( value ) { return value !== 'all'; }) );
                                headcountService.selectDepartments( scope.activeParams.departments.filter( function ( value ) { return value !== 'all'; }) );

                            }
                        },
                        tooltip: {
                            name: item.country,
                            content: ['<div class="hoverinfo">',
                                '<div><strong>', item.country, '</strong></div>',
                                '<div><span style="float: left;">Total:</span><span style="float: right;">', item.total, '</span></div>',
                                '</div>'].join('')
                        }
                    };

                });

                $( chartWrap ).mapael({
                    map: {
                        name: 'world_countries_miller',
                        zoom: {
                            enabled: true,
                            maxLevel: 10,
                            mousewheel: false
                        },
                        defaultArea: {
                            attrs: {
                                fill: '#3f4248',
                                stroke: '#373a40',
                                'stroke-width': 0.3
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
                    areas: areas
                });

            };

        }
    };

}]);
