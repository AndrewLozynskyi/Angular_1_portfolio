/*
 * @author ohmed
 * Workforce logic
*/

var WorkforceSchema = require('./../../db/mongo/schemas/Workforce.js');
var WorkforceModel = MongoDB.mongoose.model( 'Workforce', WorkforceSchema );

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var Utils = require('./Utils.js');

//

var Workforce = {};

Workforce.getGeneralData = function ( params, callback ) {

    var year = params.date.year;
    var month = params.date.month;
    var day = params.date.day;
    var scopes = params.scopes;

    //

    WorkforceModel
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
            linechartDataPType: {},
            dataByPersonType:   [],
            trends:             { total: 0, year: 0, month: 0 }
        };

        if ( ! data.length ) {

            return callback( null, result );

        }

        //

        var countries = data[ data.length - 1 ].countries;
        var departmentData = preprocessDepartmentData( params, data ).departmentsData;

        result.countryList = preprocessDepartmentData( params, data ).countryList;
        result.departmentList = computeDepartmentList( params, countries );
        result.countryData = computeCountryData( params, countries );
        result.linechartData = computeLineChartData( params, departmentData );
        result.linechartDataPType = computeLineChartDataPType( params, departmentData );
        result.dataByPersonType = computeDataByPersonType( params, countries );
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

Workforce.getEmployeesList = function ( params, callback ) {

    var year = params.date.year;
    var month = params.date.month;
    var day = params.date.day;
    var employeeType = params.employeeType;
    var scopes = params.scopes;

    //

    WorkforceModel
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

                    if ( employeeType === 'all' || employees[ i ].personType.toLowerCase() === employeeType.toLowerCase() ) {

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

//

Workforce.clear = function ( callback ) {

    WorkforceModel
    .find({})
    .remove( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        return callback( null, { success: true } );

    });

};

Workforce.import = function ( data, callback ) {

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

    Workforce.clear( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        //

        WorkforceModel.insertMany( bulkData, function ( err ) {

            if ( err ) {

                return callback( err );

            }

            //

            return callback( null, { message: 'success' } );

        });

    });

};

// internal functions

function merge ( data1, data2 ) {

    var result = {
        countryList:            [],
        departmentList:         {},
        countryData:            {},
        linechartData:          {},
        linechartDataPType:     {},
        dataByPersonType:       [],
        trends:                 {}
    };

    //

    result.countryData = Utils.mergeCountryData( data1.countryData, data2.countryData );
    result.countryList = Utils.mergeCountryList( data1.countryList, data2.countryList );
    result.departmentList = Utils.mergeDepartmentList( data1.departmentList, data2.departmentList );
    result.linechartData = Utils.mergeLinechartData( data1.linechartData, data2.linechartData );
    result.dataByPersonType = Utils.mergeDataByPersonTypeData( data1.dataByPersonType, data2.dataByPersonType );
    result.linechartDataPType = Utils.mergeLinechartData( data1.linechartDataPType, data2.linechartDataPType );

    //

    return result;

};

function filterDataByCD ( scopes, params, data ) {

    var filteredData = {
        countryList:        [],
        departmentList:     {},
        countryData:        {},
        linechartData:      {},
        linechartDataPType: {},
        dataByPersonType:   [],
        trends:             {}
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

        for ( var departmentName in data.countryData[ countryName ] ) {

            var department = data.countryData[ countryName ][ departmentName ];

            for ( var i = 0, il = department.length; i < il; i ++ ) {

                var employee = department[ i ];

                if ( Utils.isInScope( scopes, employee.country, employee.department ) === true ) {

                    filteredData.countryData[ countryName ] = filteredData.countryData[ countryName ] || {};
                    filteredData.countryData[ countryName ][ departmentName ] = filteredData.countryData[ countryName ][ departmentName ] || [];
                    filteredData.countryData[ countryName ][ departmentName ].push( employee );

                }

            }

        }

    }

    // filter person type data

    for ( var i = 0, il = data.dataByPersonType.length; i < il; i ++ ) {

        var personTypeData = {
            countries:      [],
            person_type:    data.dataByPersonType[ i ].person_type,
            total:          0
        };

        for ( var j = 0, jl = data.dataByPersonType[ i ].countries.length; j < jl; j ++ ) {

            if ( params.countries.length && params.countries.indexOf( data.dataByPersonType[ i ].countries[ j ].country ) === -1 ) continue;
            var employees = [];

            for ( var k = 0, kl = data.dataByPersonType[ i ].countries[ j ].count.length; k < kl; k ++ ) {

                var employee = data.dataByPersonType[ i ].countries[ j ].count[ k ];

                if ( employee.jobEndDate ) continue;
                if ( params.departments.length && params.departments.indexOf( employee.department ) === -1 ) continue;

                if ( Utils.isInScope( scopes, employee.country, employee.department ) === true ) {

                    employees.push( employee );

                }

            }

            if ( employees.length ) {

                personTypeData.countries.push({
                    country:    data.dataByPersonType[ i ].countries[ j ].country,
                    count:      employees
                });

                personTypeData.total += employees.length;

            }

        }

        if ( personTypeData.countries.length ) {

            filteredData.dataByPersonType.push( personTypeData );

        }

    }

    // filter linechart data

    var total = {
        starters:   [],
        leavers:    [],
        total:      []
    };

    for ( var departmentName in data.linechartData ) {

        if ( departmentName === 'total' ) continue;
        var department = data.linechartData[ departmentName ];

        if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 ) {

            continue;

        }

        for ( var item in department ) {

            for ( var i = 0, il = department[ item ].length; i < il; i ++ ) {

                filteredData.linechartData[ departmentName ] = filteredData.linechartData[ departmentName ] || { starters: [], leavers: [], total: [] };
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

    // filter by linechart person type data

    for ( var departmentName in data.linechartDataPType ) {

        var department = data.linechartDataPType[ departmentName ];

        if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 && departmentName !== 'total' ) {

            continue;

        }

        for ( var item in department ) {

            for ( var i = 0, il = department[ item ].length; i < il; i ++ ) {

                filteredData.linechartDataPType[ departmentName ] = filteredData.linechartDataPType[ departmentName ] || {};
                filteredData.linechartDataPType[ departmentName ][ item ] = filteredData.linechartDataPType[ departmentName ][ item ] || [];
                filteredData.linechartDataPType[ departmentName ][ item ][ i ] = filteredData.linechartDataPType[ departmentName ][ item ][ i ] || [];

                if ( ! department[ item ][ i ] ) continue;

                for ( var j = 0, jl = department[ item ][ i ].length; j < jl; j ++ ) {

                    var employee = department[ item ][ i ][ j ];

                    if ( params.departments.length && params.departments.indexOf( employee.department ) === -1 ) continue;
                    if ( params.countries.length && params.countries.indexOf( employee.country ) === -1 ) continue;

                    if ( Utils.isInScope( scopes, employee.country, employee.department ) === true ) {
                        filteredData.linechartDataPType[ departmentName ] = filteredData.linechartDataPType[ departmentName ] || {};
                        filteredData.linechartDataPType[ departmentName ][ item ] = filteredData.linechartDataPType[ departmentName ][ item ] || [];
                        filteredData.linechartDataPType[ departmentName ][ item ][ i ] = filteredData.linechartDataPType[ departmentName ][ item ][ i ] || [];
                        filteredData.linechartDataPType[ departmentName ][ item ][ i ].push( employee );

                    }

                }

            }

        }

    }

    //

    return filteredData;

};

function filterDataByHierarchy ( scopes, params, data ) {

    var filteredData = {
        countryList:            [],
        departmentList:         {},
        countryData:            {},
        dataByPersonType:       [],
        linechartData:          {},
        linechartDataPType:     {},
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

        for ( var departmentName in data.countryData[ countryName ] ) {

            var employees = Utils.filterEmployeesByH( data.countryData[ countryName ][ departmentName ], scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );

            if ( employees.length ) {

                filteredData.countryData[ countryName ] = filteredData.countryData[ countryName ] || {};
                filteredData.countryData[ countryName ][ departmentName ] = employees;

            }

        }

    }

    // filter dataByPersonType data

    for ( var i = 0, il = data.dataByPersonType.length; i < il; i ++ ) {

        var item = {
            countries:      [],
            person_type:    data.dataByPersonType[ i ].person_type,
            total:          0
        };

        var total = 0;
        var countries = data.dataByPersonType[ i ].countries;

        for ( var j = 0, jl = countries.length; j < jl; j ++ ) {

            var employees = Utils.filterEmployeesByH( countries[ j ].count, scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );

            if ( employees.length === 0 ) continue;

            item.countries.push({
                country:    countries[ j ].country,
                count:      employees
            });

            total += employees.length;

        }

        if ( total > 0 ) {

            item.total = total;
            filteredData.dataByPersonType.push( item );

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

    // filter linechartPType data

    for ( var departmentName in data.linechartDataPType ) {

        var total = 0;
        var department = data.linechartDataPType[ departmentName ];

        for ( var type in department ) {

            for ( var i = 0, il = department[ type ].length; i < il; i ++ ) {

                var employees = [];

                if ( department[ type ][ i ] ) {

                    employees = Utils.filterEmployeesByH( department[ type ][ i ], scopes.user.eLink.leftIndex, scopes.user.eLink.rightIndex );

                }

                filteredData.linechartDataPType[ departmentName ] = filteredData.linechartDataPType[ departmentName ] || {};
                filteredData.linechartDataPType[ departmentName ][ type ] = filteredData.linechartDataPType[ departmentName ][ type ] || [];
                filteredData.linechartDataPType[ departmentName ][ type ].push( employees );

                total += employees.length;

            }

        }

        if ( total === 0 ) {

            delete filteredData.linechartDataPType[ departmentName ];

        }

    }

    //

    return filteredData;

};

function filterEmployeeListByPersonType ( params, employeeList, country, department ) {

    var personTypes = {};

    //

    for ( var i = 0, il = employeeList.length; i < il; i ++ ) {

        personTypes[ employeeList[ i ].personType ] = personTypes[ employeeList[ i ].personType ] || [];

        if ( personTypes[ employeeList[ i ].personType ].indexOf( employeeList[ i ].eid ) === -1 ) {

            if ( params.countries.length && params.countries.indexOf( country ) === -1 ) {

                continue;

            }

            if ( params.departments.length && params.departments.indexOf( department ) === -1 ) {

                continue;

            }

            //

            personTypes[ employeeList[ i ].personType ].push({
                eid:            employeeList[ i ].eid,
                country:        country,
                department:     department,
                jobStartDate:   employeeList[ i ].jobStartDate,
                jobEndDate:     employeeList[ i ].jobEndDate,
                hierarchy:      employeeList[ i ].hierarchy
            });

        }

    }

    return personTypes;

};

function computeDataByPersonType ( params, countries ) {

    var dataByPersonType = [];
    var rawData = {};

    //

    for ( var countryName in countries ) {

        departments = countries[ countryName ];

        for ( var departmentName in departments ) {

            var personTypes = filterEmployeeListByPersonType( params, departments[ departmentName ].employees, countryName, departmentName );

            for ( var pType in personTypes ) {

                rawData[ pType ] = rawData[ pType ] || {
                    countries:      [],
                    person_type:    pType,
                    total:          0
                };

                var countryFound = false;
                for ( var i = 0, il = rawData[ pType ].countries.length; i < il; i ++ ) {

                    if ( rawData[ pType ].countries[ i ].country === countryName ) {

                        rawData[ pType ].countries[ i ].count = rawData[ pType ].countries[ i ].count.concat( personTypes[ pType ] );
                        countryFound = true;
                        break;

                    }

                }

                if ( ! countryFound ) {

                    rawData[ pType ].countries.push({ country: countryName, count: personTypes[ pType ] });

                }

            }

        }

    }

    //

    for ( var pType in rawData ) {

        dataByPersonType.push( rawData[ pType ] );

    }

    //

    return dataByPersonType;

};

function computeCountryData ( params, countries ) {

    var countryData = {};
    var departments;
    var employees;

    //

    for ( var countryName in countries ) {

        departments = countries[ countryName ];

        for ( var departmentName in departments ) {

            if ( params.departments.length && params.departments.indexOf( departmentName ) === -1 ) {

                continue;

            }

            countryData[ countryName ] = countryData[ countryName ] || { total: [] };
            employees = Utils.filterEmployeeListBySLT( params, countries[ countryName ][ departmentName ].employees );

            countryData[ countryName ][ departmentName ] = employees.total;

        }

    }

    //

    return countryData;

};

function computeLineChartDataPType ( params, departmentsData ) {

    var linechartDataPType = {};

    //

    for ( var departmentName in departmentsData ) {

        linechartDataPType[ departmentName ] = {
            total:      []
        };

        var data = false;
        var iter = 0;

        for ( var date in departmentsData[ departmentName ] ) {

            data = departmentsData[ departmentName ][ date ];

            for ( var i = 0, il = data.employees.length; i < il; i ++ ) {

                var employee = data.employees[ i ];
                employee.department = departmentName;

                if ( params.countries.length && params.countries.indexOf( employee.country ) === -1 ) {

                    continue;

                }

                if ( params.departments.length && params.departments.indexOf( employee.department ) === -1 ) {

                    continue;

                }

                linechartDataPType[ departmentName ][ employee.personType ] = linechartDataPType[ departmentName ][ employee.personType ] || [];
                linechartDataPType[ departmentName ][ employee.personType ][ iter ] = linechartDataPType[ departmentName ][ employee.personType ][ iter ] || [];
                linechartDataPType[ departmentName ][ employee.personType ][ iter ].push( employee );

                linechartDataPType[ departmentName ].total[ iter ] = linechartDataPType[ departmentName ].total[ iter ] || [];
                linechartDataPType[ departmentName ].total[ iter ].push( employee );

            }

            iter ++;

        }

    }

    //

    return linechartDataPType;

};

function computeLineChartData ( params, departmentsData ) {

    var linechartData = {
        total: {
            starters:   [],
            leavers:    [],
            total:      []
        }
    };

    //

    for ( var departmentName in departmentsData ) {

        linechartData[ departmentName ] = {
            starters:   [],
            leavers:    [],
            total:      []
        };

        var data = false;
        var iter = 0;

        for ( var date in departmentsData[ departmentName ] ) {

            data = departmentsData[ departmentName ][ date ];

            var employees = Utils.filterEmployeeListBySLT( params, data.employees, data.year, data.month, departmentName );
            var starters = employees.starters;
            var leavers = employees.leavers;
            var total = employees.total;

            //

            linechartData[ departmentName ].total[ iter ] = total;
            linechartData[ departmentName ].starters[ iter ] = starters;
            linechartData[ departmentName ].leavers[ iter ] = leavers;

            //

            linechartData.total['total'][ iter ] = linechartData.total['total'][ iter ] || [];
            linechartData.total['total'][ iter ] = linechartData.total['total'][ iter ].concat( total );

            linechartData.total['starters'][ iter ] = linechartData.total['starters'][ iter ] || [];
            linechartData.total['starters'][ iter ] = linechartData.total['starters'][ iter ].concat( starters );

            linechartData.total['leavers'][ iter ] = linechartData.total['leavers'][ iter ] || [];
            linechartData.total['leavers'][ iter ] = linechartData.total['leavers'][ iter ].concat( leavers );

            iter ++;

        }

    }

    //

    for ( var item in linechartData ) {

        for ( var i = 0, il = linechartData.total.total.length; i < il; i ++ ) {

            linechartData[ item ].total[ i ] = linechartData[ item ].total[ i ] || [];
            linechartData[ item ].starters[ i ] = linechartData[ item ].starters[ i ] || [];
            linechartData[ item ].leavers[ i ] = linechartData[ item ].leavers[ i ] || [];

        }

    }

    //

    return linechartData;

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

            employees = Utils.filterEmployeeListBySLT( params, departments[ departmentName ].employees, undefined, undefined, countryName, departmentName );

            departmentsList[ departmentName ] = departmentsList[ departmentName ] || [];
            departmentsList[ departmentName ] = departmentsList[ departmentName ].concat( employees.total );

        }

    }

    return departmentsList;

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

            if ( ! params.departments.length ) {

                countryList[ countryName ] = [];

            }

            for ( var departmentName in countriesList[ countryName ] ) {

                if ( params.departments.length && params.departments.indexOf( departmentName ) !== -1 ) {

                    countryList[ countryName ] = [];

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

                    countryList[ countryName ] = countryList[ countryName ] || [];
                    countryList[ countryName ].push( departmentData.employees[ j ] );

                }

                department = departmentsData[ departmentName ][ dateToken ];
                department.employees = department.employees.concat( departmentData.employees );

            }

        }

    }

    //

    return {
        departmentsData:    departmentsData,
        countryList:        countryList
    };

};

function postprocessData ( params, data ) {

    var processedData = {
        countryList:        [],
        departmentList:     {},
        countryData:        {},
        linechartData:      {},
        linechartDataPType: {},
        dataByPersonType:   data.dataByPersonType,
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

        if ( data.departmentList[ departmentName ].length > 0 || params.countries.length === 0 ) {

            newDepartmentList[ departmentName ] = data.departmentList[ departmentName ].length;

        }

    }

    processedData.departmentList = newDepartmentList;

    // process person type data

    for ( var i = 0, il = processedData.dataByPersonType.length; i < il; i ++ ) {

        var total = 0;

        for ( var j = 0, jl = processedData.dataByPersonType[ i ].countries.length; j < jl; j ++ ) {

            processedData.dataByPersonType[ i ].countries[ j ].count = processedData.dataByPersonType[ i ].countries[ j ].count.length;
            total += processedData.dataByPersonType[ i ].countries[ j ].count;

        }

        processedData.dataByPersonType[ i ].total = total;

    }

    // process country data

    var newCountryData = {};

    for ( var countryName in data.countryData ) {

        for ( var departmentName in data.countryData[ countryName ] ) {

            newCountryData[ countryName ] = newCountryData[ countryName ] || {};
            newCountryData[ countryName ][ departmentName ] = newCountryData[ countryName ][ departmentName ] || {};
            newCountryData[ countryName ][ departmentName ] = data.countryData[ countryName ][ departmentName ].length;

        }

    }

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

                newLinechartData[ departmentName ][ item ] = newLinechartData[ departmentName ][ item ] || [];
                var itemValue = ( data.linechartData[ departmentName ][ item ][ i ] ) ? data.linechartData[ departmentName ][ item ][ i ].length : 0;
                newLinechartData[ departmentName ][ item ].push( itemValue );

            }

        }

    }

    processedData.linechartData = newLinechartData;

    // process linechart per person type data

    var newLinechartPTypeData = { total: {} };

    for ( var departmentName in data.linechartDataPType ) {

        newLinechartPTypeData[ departmentName ] = {};

        for ( var item in data.linechartDataPType[ departmentName ] ) {

            newLinechartPTypeData['total'][ item ] = newLinechartPTypeData['total'][ item ] || [];

            for ( var i = 0, il = params.date.month + 1; i < il; i ++ ) {

                newLinechartPTypeData[ departmentName ][ item ] = newLinechartPTypeData[ departmentName ][ item ] || [];
                var itemValue = ( data.linechartDataPType[ departmentName ][ item ][ i ] ) ? data.linechartDataPType[ departmentName ][ item ][ i ].length : 0;
                newLinechartPTypeData[ departmentName ][ item ].push( itemValue );

                newLinechartPTypeData['total'][ item ][ i ] = newLinechartPTypeData['total'][ item ][ i ] || 0;
                newLinechartPTypeData['total'][ item ][ i ] += itemValue;

            }

        }

    }

    processedData.linechartDataPType = newLinechartPTypeData;

    // get trends

    processedData.trends = Utils.computeTrends( params, processedData.linechartData );

    //

    return processedData;

};

//

module.exports = Workforce;
