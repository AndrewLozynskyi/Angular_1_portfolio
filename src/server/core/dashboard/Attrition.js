/*
 * @author ohmed
 * Attrition logic
*/

var AttritionSchema = require('./../../db/mongo/schemas/Attrition.js');
var AttritionModel = MongoDB.mongoose.model( 'Attrition', AttritionSchema );

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var Utils = require('./Utils.js');

//

var Attrition = {};

Attrition.getGeneralData = function ( params, callback ) {

    var year = params.date.year;
    var month = params.date.month;
    var day = params.date.day;
    var scopes = params.scopes;

    //

    AttritionModel
    .find({
        year:   year,
        month:  { '$lte': month }
    })
    .sort([
        [ 'year', 1 ],
        [ 'month', 1 ]
    ])
    .exec( function ( err, data ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var result = {
            countryList:        [],
            departmentList:     [],
            countryData:        {},
            linechartData:      {},
            trends:             { total: 0, year: 0, month: 0 }
        };

        if ( ! data.length ) {

            return callback( null, result );

        }

        var countries = data[ data.length - 1 ].countries;
        var departmentData = preprocessDepartmentData( params, data ).departmentsData;

        //

        result.countryList = preprocessDepartmentData( params, data ).countryList;
        result.departmentList = computeDepartmentList( params, countries );
        result.countryData = computeCountryData( params, countries );
        result.linechartData = computeLineChartData( params, departmentData );
        result.trends = {};

        //

        if ( scopes['no-restriction'] !== true ) {

            var resultByCD, resultByH;

            resultByCD = filterDataByCD( scopes, params, result );

            if ( scopes['hierarchy'] === true ) {

                resultByH = filterDataByHierarchy( scopes, params, result );
                result = merge( resultByCD, resultByH );

            } else {

                result = resultByCD;

            }

        }

        //

        return callback( null, postprocessData( params, result ) );

    });

};

Attrition.getEmployeesList = function ( params, callback ) {

    var year = params.date.year;
    var month = params.date.month;
    var day = params.date.day;
    var employeeType = params.employeeType;
    var scopes = params.scopes;

    //

    AttritionModel
    .findOne({
        year:   year,
        month:  month
    })
    .exec( function ( err, data ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var countries = data.countries;
        var eidList = [];

        //

        for ( var countryName in countries ) {

            if ( params.countries.length && params.countries.indexOf( countryName ) === -1 ) continue;

            for ( var departmentName in countries[ countryName ] ) {

                if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 ) continue;
                var employees = countries[ countryName ][ departmentName ].employees;

                for ( var i = 0, il = employees.length; i < il; i ++ ) {

                    employees[ i ].country = countryName;
                    employees[ i ].department = departmentName;

                    if ( day !== false ) {

                        if ( ! employees[ i ].jobEndDate || employees[ i ].jobEndDate > day ) continue;

                    } else {

                        if ( ! employees[ i ].jobEndDate ) continue;

                    }

                    if ( employeeType === 'all' || ( employeeType && employees[ i ].terminationType.toLowerCase() === employeeType.toLowerCase() ) ) {

                        eidList.push( employees[ i ] );

                    }

                }

            }

        }

        var eidListByCD = Utils.filterEmployeesByCD( scopes, eidList );
        var eidListByH = Utils.filterEmployeesByH( eidList, scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );
        eidList = Utils.mergeEmployeesLists( eidListByH, eidListByCD );

        //

        var resultEidList = [];

        for ( var i = Math.max( params.page * params.itemsPerPage, 0 ), il = Math.min( ( params.page + 1 ) * params.itemsPerPage, eidList.length ); i < il; i ++ ) {

            resultEidList.push( eidList[ i ].eid );

        }

        //

        UserModel
        .find({
            eid: {
                '$in':    resultEidList
            }
        })
        .populate('eLink')
        .exec( function ( err, users ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            return callback( null, {
                success: true,
                employees: {
                    list:           Utils.setupEmployeesData( users ),
                    itemsPerPage:   params.itemsPerPage,
                    total:          eidList.length
                }
            } );

        });

    });

};

Attrition.clear = function ( callback ) {

    AttritionModel
    .find({})
    .remove( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        return callback( null, { success: true } );

    });

};

Attrition.import = function ( data, callback ) {

    var bulkData = [];

    for ( var year in data ) {

        for ( var month in data[ year ] ) {

            bulkData.push({
                year:       + year,
                month:      + month,
                countries:  data[ year ][ month ]
            });

        }

    }

    //

    Attrition.clear( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        //

        AttritionModel.insertMany( bulkData, function ( err ) {

            if ( err ) {

                return callback( err );

            }

            //

            return callback( null, { message: 'success' } );

        });

    });

};

// Internal methods

function merge ( data1, data2 ) {

    var result = {
        countryList:            [],
        departmentList:         {},
        countryData:            {},
        linechartData:          {},
        trends:                 {}
    };

    result.countryData = Utils.mergeCountryData( data1.countryData, data2.countryData, true );
    result.countryList = Utils.mergeCountryList( data1.countryList, data2.countryList );
    result.departmentList = Utils.mergeDepartmentList( data1.departmentList, data2.departmentList );
    result.linechartData = Utils.mergeLinechartData( data1.linechartData, data2.linechartData );

    return result;

};

function filterDataByCD ( scopes, params, data ) {

    var filteredData = {
        countryList:            {},
        departmentList:         {},
        countryData:            {},
        linechartData:          {},
        trends:                 {}
    };

    // filter country list

    for ( var countryName in data.countryList ) {

        for ( var i = 0, il = data.countryList[ countryName ].length; i < il; i ++ ) {

            var employee = data.countryList[ countryName ][ i ];
            if ( Utils.isInScope( scopes, employee.country, employee.department ) === true ) {

                filteredData.countryList[ countryName ] = data.countryList[ countryName ];

            }

        }

    }

    // filter departments list

    for ( var departmentName in data.departmentList ) {

        for ( var i = 0, il = data.departmentList[ departmentName ].length; i < il; i ++ ) {

            var employee = data.departmentList[ departmentName ][ i ];

            if ( Utils.isInScope( scopes, employee.country, employee.department ) === true ) {

                filteredData.departmentList[ departmentName ] = filteredData.departmentList[ departmentName ] || [];
                filteredData.departmentList[ departmentName ].push( employee );

            }

        }

    }

    // fillter country data

    for ( var countryName in data.countryData ) {

        for ( var typeName in data.countryData[ countryName ] ) {

            var employees = data.countryData[ countryName ][ typeName ];

            for ( var i = 0, il = employees.length; i < il; i ++ ) {

                var employee = employees[ i ];

                if ( Utils.isInScope( scopes, employee.country, employee.department ) === true ) {

                    filteredData.countryData[ countryName ] = filteredData.countryData[ countryName ] || {};
                    filteredData.countryData[ countryName ][ typeName ] = filteredData.countryData[ countryName ][ typeName ] || [];
                    filteredData.countryData[ countryName ][ typeName ].push( employee );

                }

            }

        }

    }

    // filter linechart data

    var total = {
        headcount:      [],
        attrition:      [],
        voluntary:      [],
        involuntary:    []
    };

    for ( var departmentName in data.linechartData ) {

        if ( departmentName === 'total' ) continue;

        var department = data.linechartData[ departmentName ];

        if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 ) {

            continue;

        }

        for ( var item in department ) {

            for ( var i = 0, il = department[ item ].length; i < il; i ++ ) {

                filteredData.linechartData[ departmentName ] = filteredData.linechartData[ departmentName ] || {};
                filteredData.linechartData[ departmentName ][ item ] = filteredData.linechartData[ departmentName ][ item ] || [];
                filteredData.linechartData[ departmentName ][ item ][ i ] = filteredData.linechartData[ departmentName ][ item ][ i ] || [];
                total[ item ][ i ] = total[ item ][ i ] || [];

                for ( var j = 0, jl = department[ item ][ i ].length; j < jl; j ++ ) {

                    var employee = department[ item ][ i ][ j ];

                    if ( params.countries.length && params.countries.indexOf( employee.country ) === -1 ) continue;

                    if ( Utils.isInScope( scopes, employee.country, employee.department ) === true ) {

                        filteredData.linechartData[ departmentName ] = filteredData.linechartData[ departmentName ] || {};
                        filteredData.linechartData[ departmentName ][ item ] = filteredData.linechartData[ departmentName ][ item ] || [];
                        filteredData.linechartData[ departmentName ][ item ][ i ] = filteredData.linechartData[ departmentName ][ item ][ i ] || [];
                        filteredData.linechartData[ departmentName ][ item ][ i ].push( employee );

                        //

                        total[ item ][ i ] = total[ item ][ i ] || [];
                        total[ item ][ i ].push( employee );

                    }

                }

            }

        }

    }

    filteredData.linechartData['total'] = total;

    //

    return filteredData;

};

function filterDataByHierarchy ( scopes, params, data ) {

    var filteredData = {
        countryList:            [],
        departmentList:         {},
        countryData:            {},
        linechartData:          {},
        trends:                 {}
    };

    // filter country list

    for ( var countryName in data.countryList ) {

        filteredData.countryList[ countryName ] = Utils.filterEmployeesByH( data.countryList[ countryName ], scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );

    }

    // filter departments list

    for ( var departmentName in data.departmentList ) {

        filteredData.departmentList[ departmentName ] = Utils.filterEmployeesByH( data.departmentList[ departmentName ], scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );

    }

    // fillter country data

    for ( var countryName in data.countryData ) {

        for ( var item in data.countryData[ countryName ] ) {

            var employees = Utils.filterEmployeesByH( data.countryData[ countryName ][ item ], scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );

            filteredData.countryData[ countryName ] = filteredData.countryData[ countryName ] || {};
            filteredData.countryData[ countryName ][ item ] = employees;

        }

    }

    // filter linechart data

    for ( var departmentName in data.linechartData ) {

        var total = 0;

        for ( var item in data.linechartData[ departmentName ] ) {

            for ( var i = 0, il = data.linechartData[ departmentName ][ item ].length; i < il; i ++ ) {

                var employees = Utils.filterEmployeesByH( data.linechartData[ departmentName ][ item ][ i ], scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );
                filteredData.linechartData[ departmentName ] = filteredData.linechartData[ departmentName ] || [];
                filteredData.linechartData[ departmentName ][ item ] = filteredData.linechartData[ departmentName ][ item ] || [];
                filteredData.linechartData[ departmentName ][ item ].push( employees );

                total += employees.length;

            }

        }

        if ( total === 0 ) {

            delete filteredData.linechartData[ departmentName ];

        }

    }

    //

    return filteredData;

};

function preprocessDepartmentData ( params, data ) {

    // Combine year/month department data in one array

    var departmentData = {};
    var departmentsData = {};
    var department;

    var countryList = {};
    var departmentList = {};

    //

    for ( var i = 0, il = data.length; i < il; i ++ ) {

        var countriesList = data[ i ].countries;

        for ( var countryName in countriesList ) {

            countryList[ countryName ] = countryList[ countryName ] || [];

            for ( var departmentName in countriesList[ countryName ] ) {

                if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 ) {

                    continue;

                }

                var dateToken = data[ i ].year + '-' + data[ i ].month;

                if ( ! departmentsData[ departmentName ] ) {

                    departmentsData[ departmentName ] = {};

                    for ( var j = 0; j <= params.date.month; j ++ ) {

                        departmentsData[ departmentName ][ params.date.year + '-' + j ] = { employees: [], year: params.date.year, month: j };

                    }

                }

                departmentData = data[ i ].countries[ countryName ][ departmentName ];

                for ( var j = 0, jl = departmentData.employees.length; j < jl; j ++ ) {

                    departmentData.employees[ j ].country = countryName;
                    departmentData.employees[ j ].department = departmentName;
                    countryList[ countryName ].push( departmentData.employees[ j ] );

                }

                department = departmentsData[ departmentName ][ dateToken ];
                department.employees = department.employees.concat( departmentData.employees );

            }

            if ( countryList[ countryName ].length === 0 ) {

                delete countryList[ countryName ];

            }

        }

    }

    //

    return {
        departmentsData:    departmentsData,
        countryList:        countryList
    };

};

function computeLineChartData ( params, departmentsData ) {

    var linechartData = {
        total: {
            headcount:      [],
            attrition:      [],
            voluntary:      [],
            involuntary:    []
        }
    };

    //

    for ( var departmentName in departmentsData ) {

        linechartData[ departmentName ] = {
            attrition:      [],
            voluntary:      [],
            involuntary:    [],
            headcount:      []
        };

        var data = false;
        var iter = 0;

        for ( var date in departmentsData[ departmentName ] ) {

            data = departmentsData[ departmentName ][ date ];

            var employeesTypes = Utils.filterEmployeeListByAttritionType( params, data.employees, data.year, data.month );

            for ( var type in employeesTypes ) {

                var employees = employeesTypes[ type ];

                linechartData[ departmentName ][ type ][ iter ] = employees;
                linechartData.total[ type ][ iter ] = linechartData.total[ type ][ iter ] || [];
                linechartData.total[ type ][ iter ] = linechartData.total[ type ][ iter ].concat( employees );

            }

            iter ++;

        }

    }

    //

    return linechartData;

};

function computeCountryData ( params, countries ) {

    var countryData = {};
    var departments;
    var employees;

    //

    for ( var countryName in countries ) {

        departments = countries[ countryName ];

        for ( var departmentName in departments ) {

            countryData[ countryName ] = countryData[ countryName ] || { total: [] };
            employeeTypes = Utils.filterEmployeeListByAttritionType( params, countries[ countryName ][ departmentName ].employees, false, false, departmentName, true );

            countryData[ countryName ]['attrition'] = countryData[ countryName ]['attrition'] || [];
            countryData[ countryName ]['voluntary'] = countryData[ countryName ]['voluntary'] || [];
            countryData[ countryName ]['involuntary'] = countryData[ countryName ]['involuntary'] || [];
            countryData[ countryName ]['headcount'] = countryData[ countryName ]['headcount'] || [];

            for ( var type in employeeTypes ) {

                countryData[ countryName ][ type ] = countryData[ countryName ][ type ].concat( employeeTypes[ type ] );

            }

        }

    }

    //

    return countryData;

};

function computeDepartmentList ( params, countries ) {

    var departmentsList = {};
    var departments;
    var employees;

    //

    for ( var countryName in countries ) {

        if ( params.countries.length && params.countries.indexOf( countryName ) === -1 ) {

            continue;

        }

        departments = countries[ countryName ];

        for ( var departmentName in departments ) {

            employees = departments[ departmentName ].employees;

            departmentsList[ departmentName ] = departmentsList[ departmentName ] || [];
            departmentsList[ departmentName ] = departmentsList[ departmentName ].concat( employees );

        }

    }

    return departmentsList;

};

function postprocessData ( params, data ) {

    var processedData = {
        countryList:        [],
        departmentList:     {},
        countryData:        {},
        linechartData:      {},
        trends:             {}
    };

    // process country list

    for ( var countryName in data.countryList ) {

        if ( data.countryList[ countryName ].length > 0 ) {

            processedData.countryList.push( countryName );

        }

    }

    // process department list

    var newDepartmentList = {};

    for ( var departmentName in data.departmentList ) {

        if ( data.departmentList[ departmentName ].length > 0 ) {

            newDepartmentList[ departmentName ] = data.departmentList[ departmentName ].length;

        }

    }

    processedData.departmentList = newDepartmentList;

    // process country data

    var newCountryData = {};
    var total = {};

    for ( var countryName in data.countryData ) {

        for ( var type in data.countryData[ countryName ] ) {

            newCountryData[ countryName ] = newCountryData[ countryName ] || {};
            var headcount = data.countryData[ countryName ]['headcount'].length || 0;

            total[ type ] = total[ type ] || 0;
            total[ type ] += data.countryData[ countryName ][ type ].length;

            if ( type !== 'headcount' ) {

                if ( headcount !== 0 ) {

                    newCountryData[ countryName ][ type ] = Math.floor( 1000 * ( data.countryData[ countryName ][ type ].length / headcount ) ) / 10;

                } else {

                    newCountryData[ countryName ][ type ] = 0;

                }

            } else {

                newCountryData[ countryName ][ type ] = data.countryData[ countryName ]['headcount'].length || 0;

            }

        }

    }

    for ( var type in total ) {

        if ( type !== 'headcount' ) {

            total[ type ] = Math.floor( 1000 * ( total[ type ] / total['headcount'] ) ) / 10;

        }

    }

    newCountryData['total'] = total;
    processedData.countryData = newCountryData;

    // process linechart data

    var newLinechartData = {};

    for ( var departmentName in data.linechartData ) {

        if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 && departmentName !== 'total' ) {

            continue;

        }

        newLinechartData[ departmentName ] = {};

        for ( var item in data.linechartData[ departmentName ] ) {

            for ( var i = 0, il = params.date.month + 1; i < il; i ++ ) {

                var headcount = data.linechartData[ departmentName ]['headcount'][ i ].length || 0;
                newLinechartData[ departmentName ][ item ] = newLinechartData[ departmentName ][ item ] || [];
                var itemValue = ( data.linechartData[ departmentName ][ item ][ i ] ) ? data.linechartData[ departmentName ][ item ][ i ].length : 0;

                if ( item !== 'headcount' && headcount !== 0 ) {

                    itemValue = Math.floor( 1000 * ( itemValue / headcount ) ) / 10;

                }

                newLinechartData[ departmentName ][ item ].push( itemValue );

            }

        }

    }

    if ( Object.keys( newLinechartData ).length === 0 ) {

        newLinechartData[ 'total' ] = {
            attrition:      new Array( params.date.month + 1 ).fill( 0 ),
            headcount:      new Array( params.date.month + 1 ).fill( 0 ),
            voluntary:      new Array( params.date.month + 1 ).fill( 0 ),
            involuntary:    new Array( params.date.month + 1 ).fill( 0 )
        };

    }

    if ( newLinechartData['total'] ) {

        newLinechartData['total'].total = newLinechartData['total'].attrition;

    }

    processedData.linechartData = newLinechartData;

    // get trends

    processedData.trends = Utils.computeTrends( params, processedData.linechartData );

    //

    return processedData;

};

//

module.exports = Attrition;
