/*
 * @author ohmed
 * Radial chart directive
*/

angular.module ( 'Dashboard.module' )

.directive ( 'radialChart', [ '$window', function ( $window ) {

    return {
        restrict: 'E',
        scope: {
            setData: '='
        },
        templateUrl: '/views/dashboard/directives/radialChart.html',
        link: function ( scope, element, attrs ) {
            initGraph( angular.copy( scope.setData ) );

            scope.$watch('setData', function ( value ) {

                initGraph( angular.copy( value ), scope.setDate );

            });

            function initGraph ( data ) {

                console.log( data )

                // if ( ! data ) {

                //     return;

                // }

                // data.headcount = data.headcount || [0];
                // data.attrition = data.attrition || [0];
                // data.voluntary = data.voluntary || [0];
                // data.involuntary = data.involuntary || [0];

                angular.element('.donut').html('');

                // var headcount = data.headcount[ data.headcount.length - 1 ];
                // var attrition = data.attrition[ data.attrition.length - 1 ];
                // var voluntary = data.voluntary[ data.voluntary.length - 1 ];
                // var involuntary = data.involuntary[ data.involuntary.length - 1 ];

                var revenue = 23.8;
                var human = 10;
                var headcount = 813;
                var targetRevenue = 21.2;
                var targetHuman = 70;

                var width = 100,
                    height = 100,
                    radius = Math.min( width, height ) / 2;

                var arc = d3.arc()
                    .outerRadius( radius - 13 )
                    .innerRadius( radius - 25 );

                var pie = d3.pie()
                    .sort(null)
                    .value( function ( d ) { return d });

                // first donut

                var data = [ revenue, 100 - revenue ];

                var color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#00cc99', '#1f2227' ]);

                var svg = d3.select('#donut-chart-revenue').append('svg')
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
                    .text( revenue + '%' );

                // second donut

                data = [ human, targetHuman - human ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#ee04e0', '#1f2227' ]);

                svg = d3.select('#donut-chart-human').append('svg')
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
                    .text( '\u20AC ' + human);

                // third donut

                data = [ headcount ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#008afd', '#1f2227' ]);

                svg = d3.select('#donut-chart-headcount').append('svg')
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

                // forth donut

                data = [ targetRevenue, 100 - targetRevenue ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#038351', '#1f2227' ]);

                svg = d3.select('#donut-chart-targetRevenue').append('svg')
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
                    .text( targetRevenue, + '%' );

                // fifth donut

                data = [ targetHuman ];

                color = d3.scaleOrdinal()
                    .domain( data )
                    .range([ '#4e33b4' ]);

                svg = d3.select('#donut-chart-targetHuman').append('svg')
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
                    .text( '\u20AC ' + targetHuman );

            };

        }
    };

}]);
