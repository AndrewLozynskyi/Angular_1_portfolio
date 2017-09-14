/*
 * @author ohmed
 * 'Atrition donut chart' directive
*/

angular.module( 'Dashboard.module' )

.directive( 'attritionDonutCharts', [ function () {

    return {
        restrict: 'E',
        scope: {
            setData: '='
        },
        templateUrl: 'dashboard/directives/attrition-donut-charts.html',
        link: function ( scope, element, attrs ) {

            initGraph( angular.copy( scope.setData ) );

            scope.$watch('setData', function ( value ) {

                initGraph( angular.copy( value ), scope.setDate );

            });

            function initGraph ( data ) {

                if ( ! data ) {

                    return;

                }

                data.headcount = data.headcount || [0];
                data.attrition = data.attrition || [0];
                data.voluntary = data.voluntary || [0];
                data.involuntary = data.involuntary || [0];

                angular.element('.donut').html('');

                var headcount = data.headcount[ data.headcount.length - 1 ];
                var attrition = data.attrition[ data.attrition.length - 1 ];
                var voluntary = data.voluntary[ data.voluntary.length - 1 ];
                var involuntary = data.involuntary[ data.involuntary.length - 1 ];

                var width = 100,
                    height = 100,
                    radius = Math.min( width, height ) / 2;

                var arc = d3.arc()
                    .outerRadius( radius - 13 )
                    .innerRadius( radius - 25 );

                var pie = d3.pie()
                    .sort( null )
                    .value( function ( d ) { return d });

                // first donut

                var data = [ attrition, 100 - attrition ];

                var color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#fe8500', '#1f2227' ]);

                var svg = d3.select('#donut-chart-attrition').append('svg')
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
                    .style('fill', function ( d, i ) { return color( d.data ) });

                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .style('fill', '#bfbfbf')
                    .style('z-index', 1000)
                    .text( attrition + '%' );

                // second donut

                data = [ voluntary, 100 - voluntary ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#dcd800', '#1f2227' ]);

                svg = d3.select('#donut-chart-voluntary').append('svg')
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
                    .text( voluntary + '%');

                // third donut

                data = [ involuntary, 100 - involuntary ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#b89f00', '#1f2227' ]);

                svg = d3.select('#donut-chart-involuntary').append('svg')
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
                    .text( involuntary + '%' );

                // forth donut

                data = [ headcount ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#2fdcda' ]);

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
                    .text( headcount );

            };

        }
    };

}]);
