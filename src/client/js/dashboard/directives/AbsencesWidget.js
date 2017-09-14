/**
 * @author Oleg .
 * absences widget
 */

angular.module ( 'Dashboard.module' )

    .directive ( 'absencesWidget', [ '$window', function ( $window ) {

        return {
            restrict: 'E',
            scope: {
                data: '=',
            },
            templateUrl: 'dashboard/directives/absences-widget.html',
            link: function ( scope, element, attrs ) {

                initGraph ( angular.copy ( scope.setData ) );

                scope.$watch ( 'data', function ( value ) {

                    initGraph ( angular.copy ( value ), scope.setDate );

                });

                function initGraph( data ) {

                    angular.element ( '.absences' )
                        .html ( '' );

                    var costOfAbsences = 75.5;
                    var sickDays = 184;
                    var emploeeAbsent = 140;
                    var daysLost = 10;
                    var totalDays = 1600;

                    var width = 85,
                        height = 75,
                        radius = Math.min ( width, height ) / 1.7;

                    var arc = d3.arc ()
                        .outerRadius ( radius - 18 )
                        .innerRadius ( radius - 30 );

                    var pie = d3.pie ()
                        .sort ( null )
                        .value ( function ( d ) {
                            return d
                        });

                    // first donut

                    var data = [ costOfAbsences, 100 - costOfAbsences ];

                    var color = d3.scaleOrdinal ()
                        .domain ( data )
                        .range ( [ '#ffb600', '#1f2227' ] );

                    var svg = d3.select ( '#cost-of-absences' )
                        .append ( 'svg' )
                        .attr ( 'width', width )
                        .attr ( 'height', height )
                        .append ( 'g' )
                        .attr ( 'transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                    var absences = d3.select ( '#cost-of-absences' );

                    var g = svg.selectAll ( '#absencesWidget .arc' )
                        .data ( pie ( data ) )
                        .enter ()
                        .append ( 'g' )
                        .attr ( 'class', 'arc' );

                    var circle = svg.append ( 'circle' )
                        .attr ( 'cx', 0 )
                        .attr ( 'cy', 0 )
                        .attr ( 'r', radius - 26 )
                        .style ( 'fill', '#292c33' )
                        .attr ( 'filter', 'url(#dropshadow)' );

                    /*filter*/

                    var defs = svg.append ( 'defs' );

                    var filter = defs.append ( 'filter' )
                        .attr ( 'id', 'dropshadow' );

                    filter.append ( 'feGaussianBlur' )
                        .attr ( 'in', 'SourceAlpha' )
                        .attr ( 'stdDeviation', 0.7 )
                        .attr ( 'result', 'blur' );

                    filter.append ( 'feOffset' )
                        .attr ( 'in', 'blur' )
                        .attr ( 'result', 'offsetBlur' );

                    filter.append ( 'feFlood' )
                        .attr ( 'in', 'offsetBlur' )
                        .attr ( 'flood-color', '#3e4b56' )
                        .attr ( 'flood-opacity', '0.8' )
                        .attr ( 'result', 'offsetColor' );

                    filter.append ( 'feComposite' )
                        .attr ( 'in', 'offsetColor' )
                        .attr ( 'in2', 'offsetBlur' )
                        .attr ( 'operator', 'in' )
                        .attr ( 'result', 'offsetBlur' );

                    var feMerge = filter.append ( 'feMerge' );

                    feMerge.append ( 'feMergeNode' )
                        .attr ( 'in', 'offsetBlur' );
                    feMerge.append ( 'feMergeNode' )
                        .attr ( 'in', 'SourceGraphic' );

                    /**/

                    g.append ( 'path' )
                        .attr ( 'd', arc )
                        .attr ( 'class', 'absence-path' )
                        .style ( 'fill', function ( d, i ) {
                            return color ( d.data )
                        });

                    d3.select ( '.absence-path' )
                        .on ( 'mouseleave', function () {
                            d3.selectAll ( '#absencesWidget .tooltip' ).remove ()
                        })
                        .on ( 'mouseenter', function () {

                            buildTooltip( '.cost-tooltip', 'Cost of Absences ', costOfAbsences )

                        })
                        .on ( ' mousemove', function () {

                            $this = this;
                            moveTooltip( '.cost-tooltip',d3.mouse( $this ))

                        });

                    svg.append ( 'text' )
                        .attr ( 'text-anchor', 'middle' )
                        .attr ( 'dy', '0.35em' )
                        .style ( 'fill', '#bfbfbf' )
                        .style ( 'z-index', 1000 )
                        .text ( costOfAbsences + '%' )
                        .style( "font-size", "12px" );

                    // seak-days

                    data = [ sickDays, totalDays - sickDays ];

                    color = d3.scaleOrdinal ()
                        .domain ( data )
                        .range ( [ '#17a9a8', '#1f2227' ] );

                    svg = d3.select ( '#seak-days' )
                        .append ( 'svg' )
                        .attr ( 'width', width )
                        .attr ( 'height', height )
                        .append ( 'g' )
                        .attr ( 'transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                    g = svg.selectAll ( '#absencesWidget .arc' )
                        .data ( pie ( data ) )
                        .enter ()
                        .append ( 'g' )
                        .attr ( 'class', 'arc' );

                    var circle = svg.append ( 'circle' )
                        .attr ( 'cx', 0 )
                        .attr ( 'cy', 0 )
                        .attr ( 'r', radius - 26 )
                        .style ( 'fill', '#292c33' )
                        .attr ( 'filter', 'url(#dropshadow)' );

                    g.append ( 'path' )
                        .attr ( 'd', arc )
                        .attr ( 'class', 'sick-path' )
                        .style ( 'fill', function ( d, i ) {
                            return color ( d.data )
                        } );

                    // var sickTooltip = d3.selectAll( '.sick-tooltip' );

                    d3.select ( '.sick-path' )
                        .on ( 'mouseleave', function () {
                            var tooltip = d3.selectAll ( '#absencesWidget .tooltip' )
                                .remove ();
                        })
                        .on ( 'mouseenter', function () {

                            buildTooltip( '.sick-tooltip', 'Sick Leave Days ', sickDays );

                        })
                        .on ( 'mousemove', function () {

                            $this = this;
                            moveTooltip( '.sick-tooltip',d3.mouse( $this ))

                        });

                    svg.append ( 'text' )
                        .attr ( 'text-anchor', 'middle' )
                        .attr ( 'dy', '0.35em' )
                        .style ( 'fill', '#bfbfbf' )
                        .text ( sickDays )
                        .style( "font-size", "12px" );


                    // emploee-absent

                    data = [ emploeeAbsent ];

                    color = d3.scaleOrdinal ()
                        .domain ( data )
                        .range ( [ '#c32300', '#1f2227' ] );

                    svg = d3.select ( '#emploee-absent' )
                        .append ( 'svg' )
                        .attr ( 'width', width )
                        .attr ( 'height', height )
                        .append ( 'g' )
                        .attr ( 'transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                    g = svg.selectAll ( '#absencesWidget .arc' )
                        .data ( pie ( data ) )
                        .enter ()
                        .append ( 'g' )
                        .attr ( 'class', 'arc' );

                    var circle = svg.append ( 'circle' )
                        .attr ( 'cx', 0 )
                        .attr ( 'cy', 0 )
                        .attr ( 'r', radius - 26 )
                        .style ( 'fill', '#292c33' )
                        .attr ( 'filter', 'url(#dropshadow)' );

                    g.append ( 'path' )
                        .attr ( 'd', arc )
                        .attr ( 'class', 'absent-path' )
                        .style ( 'fill', function ( d, i ) {
                            return color ( d.data )
                        });

                    d3.select ( '.absent-path' )
                        .on ( 'mouseleave', function () {
                            var tooltip = d3.selectAll ( '#absencesWidget .tooltip' )
                                .remove ()
                        })
                        .on ( 'mouseenter', function () {

                            buildTooltip( '.absent-tooltip', 'Emploee absent ', emploeeAbsent );

                        })
                        .on ( 'mousemove', function () {

                            $this = this;
                            moveTooltip( '.absent-tooltip',d3.mouse( $this ))

                        });

                    svg.append ( 'text' )
                        .attr ( 'text-anchor', 'middle' )
                        .attr ( 'dy', '0.35em' )
                        .style ( 'fill', '#bfbfbf' )
                        .text ( emploeeAbsent )
                        .style( "font-size", "12px" );


                    // days-lost

                    data = [ daysLost, 100 - daysLost ];

                    color = d3.scaleOrdinal ()
                        .domain ( data )
                        .range ( [ '#c40fbe', '#1f2227' ] );

                    svg = d3.select ( '#days-lost' )
                        .append ( 'svg' )
                        .attr ( 'width', width )
                        .attr ( 'height', height )
                        .append ( 'g' )
                        .attr ( 'transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                    g = svg.selectAll ( '#absencesWidget .arc' )
                        .data ( pie ( data ) )
                        .enter ()
                        .append ( 'g' )
                        .attr ( 'class', 'arc' );

                    var circle = svg.append ( 'circle' )
                        .attr ( 'cx', 0 )
                        .attr ( 'cy', 0 )
                        .attr ( 'r', radius - 26 )
                        .style ( 'fill', '#292c33' )
                        .attr ( 'filter', 'url(#dropshadow)' );

                    g.append ( 'path' )
                        .attr ( 'd', arc )
                        .style ( 'fill', function ( d, i ) {
                            return color ( d.data )
                        } )
                        .attr ( 'class', 'days-lost-path' );

                    d3.select ( '.days-lost-path' )
                        .on ( 'mouseleave', function () {
                            var tooltip = d3.selectAll ( '#absencesWidget .tooltip' )
                                .remove ()
                        })
                        .on ( 'mouseenter', function () {

                            buildTooltip( '.days-lost-tooltip', 'Days Lost per Emploee ', daysLost );

                        })
                        .on ( 'mousemove', function () {

                            $this = this;
                            moveTooltip( '.days-lost-tooltip',d3.mouse( $this ))

                        });

                    svg.append ( 'text' )
                        .attr ( 'text-anchor', 'middle' )
                        .attr ( 'dy', '0.35em' )
                        .style ( 'fill', '#bfbfbf' )
                        .text ( daysLost )
                        .style( "font-size", "12px" );


                    // total-days

                    data = [ totalDays ];

                    color = d3.scaleOrdinal ()
                        .domain ( data )
                        .range ( [ '#6e2b88' ] );

                    svg = d3.select ( '#total-days' )
                        .append ( 'svg' )
                        .attr ( 'width', width )
                        .attr ( 'height', height )
                        .append ( 'g' )
                        .attr ( 'transform', 'translate(' + width / 2 + ',' + height / 2 + ')' );

                    g = svg.selectAll ( '#absencesWidget .arc' )
                        .data ( pie ( data ) )
                        .enter ()
                        .append ( 'g' )
                        .attr ( 'class', 'arc' );

                    var circle = svg.append ( 'circle' )
                        .attr ( 'cx', 0 )
                        .attr ( 'cy', 0 )
                        .attr ( 'r', radius - 26 )
                        .style ( 'fill', '#292c33' )
                        .attr ( 'filter', 'url(#dropshadow)' );

                    g.append ( 'path' )
                        .attr ( 'd', arc )
                        .style ( 'fill', function ( d, i ) {
                            return color ( d.data )
                        })
                        .attr ( 'class', 'total-days-path' );

                    d3.select ( '.total-days-path' )
                        .on ( 'mouseleave', function () {
                            var tooltip = d3.selectAll ( '#absencesWidget .tooltip' )
                                .remove ()
                        })
                        .on ( 'mouseenter', function () {

                            buildTooltip( '.total-tooltip', 'Total Available Days', totalDays );

                        })
                        .on ( 'mousemove', function () {

                            $this = this;
                            moveTooltip( '.total-tooltip',d3.mouse( $this ))

                        });

                    svg.append ( 'text' )
                        .attr ( 'text-anchor', 'middle' )
                        .attr ( 'dy', '0.35em' )
                        .style ( 'fill', '#bfbfbf' )
                        .text ( totalDays )
                        .style( "font-size", "12px" );


                    function moveTooltip( buildClass, mouse ) {

                        scope.mouse = d3.mouse ( $this );
                        var positionY = mouse[ 0 ] - 55;
                        var positionX = mouse[ 1 ] - 55;
                        d3.selectAll ( buildClass+' .tooltip' )
                            .style ( 'top', ( positionX - 5 ) + 'px' )
                            .style ( 'left', positionY + 'px' )

                    }

                    function buildTooltip( buildClass,text,data ) {

                        d3.selectAll ( buildClass )
                            .append ( 'div' )
                            .attr ( 'class', 'tooltip' )
                            .style ( 'display', 'block' )
                            .style ( 'position', 'absolute' )
                            .html ( '<div class="header-tooltip">Absences</div>' +
                                    '<div class="tooltip-data">' + text+' ' + data + ' </div>' +
                                    '<div class="line-block">' +
                                    ' <div class="line"> </div><br>' +
                                    '<div class="dot"></div>'+
                                    '</div>'
                                    );

                    }
                };

            }

        }

    }]);
