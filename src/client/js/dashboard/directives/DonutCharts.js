/*
 * @author ohmed, markiyan
 * Donut charts directive
*/

angular.module( 'Dashboard.module' )

.directive( 'donutCharts', [ function () {

    return {
        restrict: 'E',
        scope: {
            setData:        '=',
            popupTarget:    '='
        },
        templateUrl: 'dashboard/directives/donut-charts.html',
        link: function ( scope, element, attrs ) {

            initGraph( angular.copy( scope.setData ) );

            scope.$watch('setData', function ( value ) {

                initGraph( angular.copy( value ), scope.setDate );

            });

            function initGraph ( data ) {

                if ( ! data || ! data.leavers || ! data.leavers.length ) {

                    data.starters = [0];
                    data.leavers = [0];
                    data.total = [0];

                }

                angular.element('.donut').html('');

                var target = 80;
                var starters = data.starters[ data.starters.length - 1 ];
                var leavers = data.leavers[ data.leavers.length - 1 ];
                var headcount = data.total[ data.total.length - 1 ];

                var width = 100,
                    height = 100,
                    radius = Math.min( width, height ) / 2;

                var arc = d3.arc()
                    .outerRadius( radius - 13 )
                    .innerRadius( radius - 25 );

                var pie = d3.pie()
                    .sort(null)
                    .value( function (d) { return d });

                // first donut

                if ( target - headcount < 0 ) {

                    var data = [ headcount ];

                    var color = d3.scaleOrdinal()
                        .domain( data )
                        .range([ '#ed1c24' ]);

                } else {

                    var data = [ headcount, target - headcount ];

                    var color = d3.scaleOrdinal()
                        .domain( data )
                        .range([ '#2fdcda', '#1f2227' ]);

                }

                var svg = d3.select('#donut-chart-headcount').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                var g = svg.selectAll('.arc')
                    .data( pie( data ) )
                    .enter().append('g')
                    .attr('class', 'arc');

                var circle = svg.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', radius - 26)
                    .style('fill', '#292c33')
                    .attr('filter', 'url(#dropshadow)');

                /*filter*/

                var defs = svg.append('defs');

                var filter = defs.append('filter')
                    .attr('id', 'dropshadow');

                filter.append('feGaussianBlur')
                    .attr('in', 'SourceAlpha')
                    .attr('stdDeviation', 0.7)
                    .attr('result', 'blur');

                filter.append('feOffset')
                  .attr('in', 'blur')
                  .attr('result', 'offsetBlur');

                filter.append("feFlood")
                  .attr("in", "offsetBlur")
                  .attr("flood-color",'#3e4b56')
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
                    .text( headcount );

                // second donut

                data = [ starters, target - starters ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#c3ee04', '#1f2227' ]);

                svg = d3.select('#donut-chart-starters').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                g = svg.selectAll('.arc')
                    .data( pie( data ) )
                    .enter().append('g')
                    .attr('class', 'arc');

                var circle = svg.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', radius - 26)
                    .style('fill', '#292c33')
                    .attr('filter', 'url(#dropshadow)');

                g.append('path')
                    .attr('d', arc)
                    .style('fill', function (d , i ) { return color( d.data ) });

                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .style('fill', '#bfbfbf')
                    .text( starters );

                // third donut

                data = [ leavers, target - leavers ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#ff8710', '#1f2227' ]);

                svg = d3.select('#donut-chart-leavers').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                g = svg.selectAll('.arc')
                    .data( pie( data ) )
                    .enter().append('g')
                    .attr('class', 'arc');

                var circle = svg.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', radius - 26)
                    .style('fill', '#292c33')
                    .attr('filter', 'url(#dropshadow)');

                g.append('path')
                    .attr('d', arc)
                    .style('fill', function (d , i ) { return color( d.data ) });

                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .style('fill', '#bfbfbf')
                    .text( leavers );

                // forth donut

                data = [ target ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#662d91' ]);

                svg = d3.select('#donut-chart-target').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                g = svg.selectAll('.arc')
                    .data( pie( data ) )
                    .enter().append('g')
                    .attr('class', 'arc');

                var circle = svg.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', radius - 26)
                    .style('fill', '#292c33')
                    .attr('filter', 'url(#dropshadow)');

                g.append('path')
                    .attr('d', arc)
                    .style('fill', function (d , i ) { return color( d.data ) });

                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .style('fill', '#bfbfbf')
                    .text( target );

            };

        }
    };

}]);
