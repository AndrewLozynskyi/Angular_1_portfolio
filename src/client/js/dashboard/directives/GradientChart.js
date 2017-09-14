/*
 * @author ohmed
 * Gradient chart directive
*/

angular.module( 'Dashboard.module' )

.directive( 'gradientChart', [ function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'dashboard/directives/gradient-chart.html',
        link: function ( scope, element, attrs ) {

            // Chart size

            var svg = d3.select('#gradient-chart').append("svg")
                .attr("width", '85')
                .attr("height", '330');

            var gradient = svg.append("svg:defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            gradient.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", "#ff8400")
                .attr("stop-opacity", 1);

            gradient.append("svg:stop")
                .attr("offset", "50%")
                .attr("stop-color", "#c3ee04")
                .attr("stop-opacity", 1);

            gradient.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", "#00fffc")
                .attr("stop-opacity", 1);

            svg.append("g")
                .append("rect")
                .attr("x", 70 )
                .attr("y", 0 )
                .attr("width", "15" )
                .attr("height", "330" )
                .style("fill", "url(#gradient)");

            // Transparent chart size

            var transporent = svg.append("svg:defs")
                .append("svg:linearGradient")
                .attr("id", "transporent")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            transporent.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-opacity", 0.3)
                .style("fill", "rgba(0, 0, 0, 0.3)");

            svg.append("g")
                .append("rect")
                .attr("x", 62 )
                .attr("y", 220 )
                .attr("width", "15" )
                .attr("height", "110" )
                .style("fill", "url(#transporent)");

            // Top indicator

            svg.append("g")
                .append("text")
              .attr("x", 20)
              .attr("y", 10 )
              .text( "170%" )
              .attr("text-anchor", "start")
              .style("fill", "#bfbfbf");

            // Middle indicator

            svg.append("g")
                .append("text")
              .attr("x", 0)
              .attr("y", 225 )
              .text( "Involuntary" )
              .attr("text-anchor", "start")
              .style("fill", "#bfbfbf");

                // Bottom indicator

            svg.append("g")
                .append("text")
              .attr("x", 20 )
              .attr("y", "100%" )
              .text( "0%" )
              .attr("text-anchor", "start")
              .style("fill", "#bfbfbf");

        }
    };

}]);
