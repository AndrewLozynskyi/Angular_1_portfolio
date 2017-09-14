/*
 * @author ohmed
 * Salary logic
*/

var SalarySchema = require('./../../db/mongo/schemas/Salary.js');
var SalaryModel = MongoDB.mongoose.model( 'Salary', SalarySchema );

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var Utils = require('./Utils.js');
var Currencies = require( './../utils/Currencies.js' );

//

var Salary = {};

Salary.getGeneralData = function ( params, callback ) {

    console.log( Currencies.get('EUR') );

    var year = params.date.year;
    var month = params.date.month;
    var day = params.date.day;
    var scopes = params.scopes;

    //

    SalaryModel
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
            departmentList:     {},
            countryData:        {},
            trends:             { total: 0, year: 0, month: 0 }
        };

        if ( ! data.length ) {

            return callback( null, result );

        }

        //

        var countries = data[ data.length - 1 ].countries;
        var processedData = preprocessData( params, data );

        //

        result.countryList = processedData.countryList;
        result.departmentList = processedData.departmentList;

        result.countryData = processedData.countryData;
        result.departmentData = processedData.departmentData;

        result.trends = {};

        //

        // if ( scopes['no-restriction'] !== true ) {

        //     var resultByCD, resultByH;

        //     resultByCD = filterDataByCD( scopes, params, result );

        //     if ( scopes['hierarchy'] === true ) {

        //         resultByH = filterDataByHierarchy( scopes, params, result );
        //         result = merge( resultByCD, resultByH );

        //     } else {

        //         result = resultByCD;

        //     }

        // }

        //

        return callback( null, postprocessData( params, result ) );

    });

};

Salary.getEmployeesList = function ( params, callback ) {

    var year = params.date.year;
    var month = params.date.month;
    var day = params.date.day;
    var scopes = params.scopes;

    //

    SalaryModel
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

                    eidList.push( employees[ i ].eid );

                }

            }

        }

        // var eidListByCD = Utils.filterEmployeesByCD( scopes, eidList );
        // var eidListByH = Utils.filterEmployeesByH( eidList, scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );
        // eidList = Utils.mergeEmployeesLists( eidListByH, eidListByCD );

        //

        var resultEidList = eidList;

        // for ( var i = Math.max( params.page * params.itemsPerPage, 0 ), il = Math.min( ( params.page + 1 ) * params.itemsPerPage, eidList.length ); i < il; i ++ ) {

        //     resultEidList.push( eidList[ i ].eid );

        // }

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
                    list:           Utils.setupEmployeesData( users, true ),
                    itemsPerPage:   params.itemsPerPage,
                    total:          eidList.length
                }
            } );

        });

    });

};

Salary.clear = function ( callback ) {

    SalaryModel
    .find({})
    .remove( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        return callback( null, { success: true } );

    });

};

Salary.import = function ( data, callback ) {

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

    Salary.clear( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        //

        SalaryModel.insertMany( bulkData, function ( err ) {

            if ( err ) {

                return callback( err );

            }

            //

            return callback( null, { message: 'success' } );

        });

    });

};

// Internal functions

function merge () {

    // todo

};

function filterDataByCD ( scopes, params, data ) {

    var filteredData = {
        countryList:        [],
        departmentList:     {},
        countryData:        {},
        trends:             {}
    };

    // filter country list

    for ( var i = 0, il = data.countryList.length; i < il; i ++ ) {

        var countryName = data.countryList[ i ];

        if ( scopes.countries[ countryName ] ) {

            filteredData.countryList.push( countryName );

        } else if ( scopes.countries['all'] ) {

            for ( var departmentName in ( scopes.countries['all'] !== 'all' ) ? scopes.countries['all'] : data.countryData[ countryName ] ) {

                if ( data.countryData[ countryName ][ departmentName ] && ( ! params.departments.length || params.departments.indexOf( departmentName ) !== -1 ) ) {

                    filteredData.countryList.push( countryName );
                    break;

                }

            }

        }

    }

    // filter departments list

    for ( var departmentName in data.departmentList ) {

        for ( var i = 0, il = data.departmentList[ departmentName ].length; i < il; i ++ ) {

            var employee = data.departmentList[ departmentName ][ i ];

            if ( ( scopes.countries[ employee.country ] && ( scopes.countries[ employee.country ] === 'all' || scopes.countries[ employee.country ][ departmentName ] ) ) ||
                ( scopes.countries['all'] && ( scopes.countries['all'][ departmentName ] || scopes.countries['all'] === 'all' ) ) ) {

                filteredData.departmentList[ departmentName ] = filteredData.departmentList[ departmentName ] || [];
                filteredData.departmentList[ departmentName ].push( employee );

            }

        }

    }

    // fillter country data

    for ( var countryName in data.countryData ) {

        for ( var departmentName in data.countryData[ countryName ] ) {

            var department = data.countryData[ countryName ][ departmentName ];

            for ( var i = 0, il = department.length; i < il; i ++ ) {

                var employee = department[ i ];

                if ( ( scopes.countries[ employee.country ] && ( scopes.countries[ employee.country ] === 'all' || scopes.countries[ employee.country ][ departmentName ] ) ) ||
                    ( scopes.countries['all'] && ( scopes.countries['all'][ departmentName ] || scopes.countries['all'] === 'all' ) ) ) {

                    filteredData.countryData[ countryName ] = filteredData.countryData[ countryName ] || {};
                    filteredData.countryData[ countryName ][ departmentName ] = filteredData.countryData[ countryName ][ departmentName ] || [];
                    filteredData.countryData[ countryName ][ departmentName ].push( employee );

                }

            }

        }

    }

    //

    return filteredData;

};

function filterDataByHierarchy ( scopes, params, data ) {

    var filteredData = data;

    // todo

    return filteredData;

};

function computeDepartmentList ( params, departments ) {

    var departmentsList = {};
    var departments;
    var employees;

    //

    for ( var departmentName in departments ) {

        if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 ) {

            continue;

        }

        departmentsList[ departmentName ] = departmentsList[ departmentName ] || [];

        for ( var date in departments[ departmentName ] ) {

            employees = departments[ departmentName ][ date ].employees;
            departmentsList[ departmentName ].push( employees );

        }

    }

    return departmentsList;

};

function preprocessData ( params, data ) {

    var rawDepData = {};
    var rawCountData = {};

    var countryData = {};
    var departmentData = {};

    var countryList = [];
    var departmentList = [];

    // prepare data

    for ( var i = 0, il = data.length; i < il; i ++ ) {

        var countriesList = data[ i ].countries;

        for ( var countryName in countriesList ) {

            for ( var departmentName in countriesList[ countryName ] ) {

                var dateToken = data[ i ].year + '-' + data[ i ].month;

                departmentData = data[ i ].countries[ countryName ][ departmentName ];

                for ( var j = 0, jl = departmentData.employees.length; j < jl; j ++ ) {

                    var employee = departmentData.employees[ j ];

                    employee.country = countryName;
                    employee.department = departmentName;

                    countryList[ countryName ] = countryList[ countryName ] || [];
                    countryList[ countryName ].push( employee );

                    if ( params.countries.length && params.countries.indexOf( countryName ) === -1 ) {

                        continue;

                    }

                    if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 ) {

                        continue;

                    }

                    if ( ! rawCountData[ countryName ] ) {

                        rawCountData[ countryName ] = {};

                        for ( var j = 0; j <= params.date.month; j ++ ) {

                            rawCountData[ countryName ][ params.date.year + '-' + j ] = { employees: [], year: params.date.year, month: j };

                        }

                    }

                    if ( ! rawDepData[ departmentName ] ) {

                        rawDepData[ departmentName ] = {};

                        for ( var j = 0; j <= params.date.month; j ++ ) {

                            rawDepData[ departmentName ][ params.date.year + '-' + j ] = { employees: [], year: params.date.year, month: j };

                        }

                    }

                    departmentList[ departmentName ] = departmentList[ departmentName ] || [];
                    departmentList[ departmentName ].push( employee );

                    rawCountData[ countryName ][ dateToken ].employees.push( employee );
                    rawDepData[ departmentName ][ dateToken ].employees.push( employee );

                }

            }

        }

    }

    // department data

    departmentData = {};

    for ( var departmentName in rawDepData ) {

        departmentData[ departmentName ] = departmentData[ departmentName ] || [];

        for ( var date in rawDepData[ departmentName ] ) {

            departmentData[ departmentName ].push( rawDepData[ departmentName ][ date ].employees );

        }

    }

    // country data

    countryData = {};

    for ( var countryName in rawCountData ) {

        countryData[ countryName ] = countryData[ countryName ] || [];

        for ( var date in rawCountData[ countryName ] ) {

            countryData[ countryName ].push( rawCountData[ countryName ][ date ].employees );

        }

    }

    //

    return {
        countryData:        countryData,
        departmentData:     departmentData,
        countryList:        countryList,
        departmentList:     departmentList
    };

};

function postprocessData ( params, data ) {

    var processedData = {
        countryList:        [],
        departmentList:     [],
        countryData:        {},
        trends:             { year: 0, month: 0, total: 0 }
    };

    // process country list

    for ( var countryName in data.countryList ) {

        if ( data.countryList[ countryName ].length > 0 ) {

            processedData.countryList.push( countryName );

        }

    }

    // process department list

    for ( var departmentName in data.departmentList ) {

        if ( data.departmentList[ departmentName ].length > 0 ) {

            processedData.departmentList.push( departmentName );

        }

    }

    // process department data

    var newDepartmentData = {};
    var item = false;
    var total = [];

    for ( var departmentName in data.departmentData ) {

        for ( var i = 0, il = data.departmentData[ departmentName ].length; i < il; i ++ ) {

            var totalSalary = 0;

            for ( var j = 0, jl = data.departmentData[ departmentName ][ i ].length; j < jl; j ++ ) {

                totalSalary += data.departmentData[ departmentName ][ i ][ j ].salary;

            }

            newDepartmentData[ departmentName ] = newDepartmentData[ departmentName ] || [];

            item = {
                totalSalary:        Math.floor( 100 * totalSalary ) / 100,
                avgSalary:          Math.floor( 100 * ( totalSalary / data.departmentData[ departmentName ][ i ].length ) ) / 100,
                headcount:          data.departmentData[ departmentName ][ i ].length,
                avgSalaryVsJan:     0,
                totalSalaryVsJan:   0,
                headcountVsJan:     0
            };

            if ( ! item.avgSalary ) item.avgSalary = 0;

            if ( i > 0 ) {

                item.headcountVsJan = ( newDepartmentData[ departmentName ][0].headcount !== 0 ) ? Math.floor( 10000 * ( item.headcount / newDepartmentData[ departmentName ][0].headcount - 1 ) ) / 100 : ( item.headcount === 0 ) ? 0 : 100;
                item.totalSalaryVsJan = ( newDepartmentData[ departmentName ][0].totalSalary !== 0 ) ? Math.floor( 10000 * ( item.totalSalary / newDepartmentData[ departmentName ][0].totalSalary - 1 ) ) / 100 : ( item.totalSalary === 0 ) ? 0 : 100;
                item.avgSalaryVsJan = ( newDepartmentData[ departmentName ][0].avgSalary !== 0 ) ? Math.floor( 10000 * ( item.avgSalary / newDepartmentData[ departmentName ][0].avgSalary - 1 ) ) / 100 : ( item.avgSalary === 0 ) ? 0 : 100;

            }

            total[ i ] = total[ i ] || { totalSalary: 0, avgSalary: 0, headcount: 0, avgSalaryVsJan: 0, totalSalaryVsJan: 0, headcountVsJan: 0 };
            total[ i ].headcount += item.headcount;
            total[ i ].totalSalary += item.totalSalary;

            newDepartmentData[ departmentName ].push( item );

        }

    }

    for ( var i = 0, il = total.length; i < il; i ++ ) {

        total[ i ].totalSalary = Math.floor( 100 * total[ i ].totalSalary ) / 100;
        total[ i ].avgSalary = Math.floor( 100 * ( total[ i ].totalSalary / total[ i ].headcount ) ) / 100;
        total[ i ].headcountVsJan = ( total[0].headcount !== 0 ) ? Math.floor( 10000 * ( total[ i ].headcount / total[0].headcount - 1 ) ) / 100 : ( total[ i ].headcount === 0 ) ? 0 : 100;
        total[ i ].totalSalaryVsJan = ( total[0].totalSalary !== 0 ) ? Math.floor( 10000 * ( total[ i ].totalSalary / total[0].totalSalary - 1 ) ) / 100 : ( total[ i ].totalSalary === 0 ) ? 0 : 100;
        total[ i ].avgSalaryVsJan = ( total[0].avgSalary !== 0 ) ? Math.floor( 10000 * ( total[ i ].avgSalary / total[0].avgSalary - 1 ) ) / 100 : ( total[ i ].avgSalary === 0 ) ? 0 : 100;

    }

    newDepartmentData.total = total;
    processedData.departmentData = newDepartmentData;

    // process country data

    var newCountryData = {};
    var item = false;
    var total = [];

    for ( var countryName in data.countryData ) {

        for ( var i = 0, il = data.countryData[ countryName ].length; i < il; i ++ ) {

            var totalSalary = 0;

            for ( var j = 0, jl = data.countryData[ countryName ][ i ].length; j < jl; j ++ ) {

                totalSalary += data.countryData[ countryName ][ i ][ j ].salary;

            }

            newCountryData[ countryName ] = newCountryData[ countryName ] || [];

            item = {
                totalSalary:        Math.floor( 100 * ( totalSalary ) ) / 100,
                avgSalary:          Math.floor( 100 * ( totalSalary / data.countryData[ countryName ][ i ].length ) ) / 100,
                headcount:          data.countryData[ countryName ][ i ].length,
                avgSalaryVsJan:     0,
                totalSalaryVsJan:   0,
                headcountVsJan:     0
            };

            if ( ! item.avgSalary ) item.avgSalary = 0;

            if ( i > 0 ) {

                item.headcountVsJan = ( newCountryData[ countryName ][0].headcount !== 0 ) ? Math.floor( 10000 * ( item.headcount / newCountryData[ countryName ][0].headcount - 1 ) ) / 100 : ( item.headcount === 0 ) ? 0 : 100;
                item.totalSalaryVsJan = ( newCountryData[ countryName ][0].totalSalary !== 0 ) ? Math.floor( 10000 * ( item.totalSalary / newCountryData[ countryName ][0].totalSalary - 1 ) ) / 100 : ( item.totalSalary === 0 ) ? 0 : 100;
                item.avgSalaryVsJan = ( newCountryData[ countryName ][0].avgSalary !== 0 ) ? Math.floor( 10000 * ( item.avgSalary / newCountryData[ countryName ][0].avgSalary - 1 ) ) / 100 : ( item.avgSalary === 0 ) ? 0 : 100;

            }

            total[ i ] = total[ i ] || { totalSalary: 0, avgSalary: 0, headcount: 0, avgSalaryVsJan: 0, totalSalaryVsJan: 0, headcountVsJan: 0 };
            total[ i ].headcount += item.headcount;
            total[ i ].totalSalary += item.totalSalary;

            newCountryData[ countryName ].push( item );

        }

    }

    for ( var i = 0, il = total.length; i < il; i ++ ) {

        total[ i ].totalSalary = Math.floor( 100 * total[ i ].totalSalary ) / 100;
        total[ i ].avgSalary = Math.floor( 100 * ( total[ i ].totalSalary / total[ i ].headcount ) ) / 100;
        total[ i ].headcountVsJan = ( total[0].headcount !== 0 ) ? Math.floor( 10000 * ( total[ i ].headcount / total[0].headcount - 1 ) ) / 100 : ( total[ i ].headcount === 0 ) ? 0 : 100;
        total[ i ].totalSalaryVsJan = ( total[0].totalSalary !== 0 ) ? Math.floor( 10000 * ( total[ i ].totalSalary / total[0].totalSalary - 1 ) ) / 100 : ( total[ i ].totalSalary === 0 ) ? 0 : 100;
        total[ i ].avgSalaryVsJan = ( total[0].avgSalary !== 0 ) ? Math.floor( 10000 * ( total[ i ].avgSalary / total[0].avgSalary - 1 ) ) / 100 : ( total[ i ].avgSalary === 0 ) ? 0 : 100;

    }

    newCountryData.total = total;
    processedData.countryData = newCountryData;

    // trends

    if ( total.length > 0 ) {
    
        processedData.trends.year = Math.floor( 100 * ( total[ total.length - 1 ].totalSalary / total[ 0 ].totalSalary - 1 ) );
        processedData.trends.month = Math.floor( 100 * ( total[ total.length - 1 ].totalSalary / total[ total.length - 2 ].totalSalary - 1 ) );
        processedData.trends.total = Math.floor( total[ total.length - 1 ].avgSalary / 12 );

    }

    //

    return processedData;

};

//

module.exports = Salary;
