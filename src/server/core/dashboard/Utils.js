/*
 * @author ohmed
 * Utils helper functions
*/

var Utils = {};

Utils.isInScope = function ( scopes, country, department ) {

    if ( scopes.countries[ country ] === 'all' ) {

        return true;

    }

    if ( scopes.countries[ country ] && scopes.countries[ country ][ department ] === true ) {

        return true;

    }

    if ( scopes.countries['all'] && scopes.countries['all'][ department ] === true ) {

        return true;

    }

    //

    return false;

};

Utils.isInParams = function ( params, country, department ) {

    // todo

};

Utils.mergeDataByPersonTypeData = function ( a, b ) {

    a = a || [];
    b = b || [];
    var result = [];

    //

    function findByPersonType ( list, personType ) {

        for ( var i = 0, il = list.length; i < il; i ++ ) {

            if ( list[ i ].person_type === personType ) {

                return list[ i ];

            }

        }

        return false;

    };

    function findByCountry ( list, countryName ) {

        for ( var i = 0, il = list.length; i < il; i ++ ) {

            if ( list[ i ].country === countryName ) {

                return list[ i ];

            }

        }

        return false;

    };

    function merge ( data ) {

        for ( var i = 0, il = data.length; i < il; i ++ ) {

            var personType = findByPersonType( result, data[ i ].person_type );

            if ( ! personType ) {

                result.push( data[ i ] );

            } else {

                for ( var k = 0, kl = data[ i ].countries.length; k < kl; k ++ ) {

                    var country = findByCountry( personType.countries, data[ i ].countries[ k ].country );

                    if ( country ) {

                        country.count = Utils.mergeEmployeesLists( country.count, data[ i ].countries[ k ].count );

                    } else {

                        personType.countries.push( data[ i ].countries[ k ] );

                    }

                }

            }

        }

    };

    //

    merge( a );
    merge( b );

    //

    return result;

};

Utils.mergeLinechartData = function ( a, b ) {

    var result = {};
    var list = Utils.mergeObjects( a, b );

    for ( var departmentName in list ) {

        var total = 0;

        a[ departmentName ] = a[ departmentName ] || {};
        b[ departmentName ] = b[ departmentName ] || {};

        for ( var item in a[ departmentName ] ) {

            b[ departmentName ][ item ] = b[ departmentName ][ item ] || [];

            for ( var i = 0, il = a[ departmentName ][ item ].length; i < il; i ++ ) {

                result[ departmentName ] = result[ departmentName ] || {};
                result[ departmentName ][ item ] = result[ departmentName ][ item ] || [];
                result[ departmentName ][ item ][ i ] = Utils.mergeEmployeesLists( a[ departmentName ][ item ][ i ], b[ departmentName ][ item ][ i ] );
                total += result[ departmentName ][ item ][ i ].length;

            }

        }

        for ( var item in b[ departmentName ] ) {

            a[ departmentName ][ item ] = a[ departmentName ][ item ] || [];

            for ( var i = 0, il = b[ departmentName ][ item ].length; i < il; i ++ ) {

                result[ departmentName ] = result[ departmentName ] || {};
                result[ departmentName ][ item ] = result[ departmentName ][ item ] || [];
                result[ departmentName ][ item ][ i ] = Utils.mergeEmployeesLists( a[ departmentName ][ item ][ i ], b[ departmentName ][ item ][ i ] );
                total += result[ departmentName ][ item ][ i ].length;

            }

        }

        if ( total === 0 ) {

            delete result[ departmentName ];

        }

    }

    return result;

};

Utils.mergeDepartmentList = function ( a, b ) {

    var result = {};
    var list = Utils.mergeObjects( a, b );
    var total = [];

    for ( var departmentName in list ) {

        result[ departmentName ] = Utils.mergeEmployeesLists( a[ departmentName ], b[ departmentName ] );
        total = total.concat( result[ departmentName ] );

    }

    result.total = total;

    return result;

};

Utils.mergeCountryList = function ( a, b ) {

    var result = {};
    var list = Utils.mergeObjects( a, b );

    for ( var countryName in list ) {

        result[ countryName ] = Utils.mergeEmployeesLists( a[ countryName ], b[ countryName ] );

    }

    return result;

};

Utils.mergeCountryData = function ( a, b, skipTotal ) {

    var result = {};
    var list = Utils.mergeObjects( a, b );

    //

    for ( var countryName in list ) {

        var total = [];

        for ( var departmentName in a[ countryName ] ) {

            b[ countryName ] = b[ countryName ] || [];

            result[ countryName ] = result[ countryName ] || {};
            result[ countryName ][ departmentName ] = Utils.mergeEmployeesLists( a[ countryName ][ departmentName ], b[ countryName ][ departmentName ] );

        }

        for ( var departmentName in b[ countryName ] ) {

            a[ countryName ] = a[ countryName ] || [];

            result[ countryName ] = result[ countryName ] || {};
            result[ countryName ][ departmentName ] = Utils.mergeEmployeesLists( a[ countryName ][ departmentName ], b[ countryName ][ departmentName ] );;

        }

        if ( ! skipTotal ) {

            for ( var departmentName in result[ countryName ] ) {

                total = total.concat( result[ countryName ][ departmentName ] );

            }

            result[ countryName ].total = total;

        }

    }

    return result;

};

Utils.mergeObjects = function ( a, b ) {

    var result = {};

    for ( var item in a ) {

        result[ item ] = a[ item ];

    }

    for ( var item in b ) {

        result[ item ] = b[ item ];

    }

    //

    return result;

};

Utils.mergeEmployeesLists = function ( a, b ) {

    a = a || [];
    b = b || [];

    var result = [];

    //

    function findEmployee ( arr, eid ) {

        for ( var i = 0, il = arr.length; i < il; i ++ ) {

            if ( arr[ i ].eid === eid ) {

                return arr[ i ];

            }

        }

        return false;

    };

    for ( var i = 0, il = a.length; i < il; i ++ ) {

        if ( ! a[ i ] ) continue;

        if ( findEmployee( a, a[ i ].eid ) !== -1 ) {

            result.push( a[ i ] );

        }

    }

    for ( var i = 0, il = b.length; i < il; i ++ ) {

        if ( ! b[ i ] ) continue;

        if ( findEmployee( b, b[ i ].eid ) !== -1 ) {

            result.push( b[ i ] );

        }

    }

    //

    return result;

};

Utils.filterEmployeesByH = function ( employees, leftIndex, rightIndex ) {

    var result = [];

    for ( var i = 0, il = employees.length; i < il; i ++ ) {

        var employee = employees[ i ];
        if ( ! employee.hierarchy ) continue;

        if ( employee.hierarchy.leftIndex >= leftIndex && employee.hierarchy.rightIndex <= rightIndex ) {

            result.push( employees[ i ] );

        }

    }

    return result;

};

Utils.filterEmployeesByCD = function ( scopes, employees ) {

    var newEmployeeList = [];

    for ( var i = 0, il = employees.length; i < il; i ++ ) {

        if ( Utils.isInScope( scopes, employees[ i ].country, employees[ i ].department ) === true ) {

            newEmployeeList.push( employees[ i ] );

        }

    }

    //

    return newEmployeeList;

};

Utils.filterEmployeeListBySLT = function ( params, employeeList, cYear, cMonth, country, department, skipParams ) {

    var slt = {
        starters:   [],
        leavers:    [],
        total:      []
    };

    //

    for ( var i = 0, il = employeeList.length; i < il; i ++ ) {

        var isStarter = false;
        var isLeaver = false;
        var employee = employeeList[ i ];
        employee.country = employee.country || country;
        employee.department = employee.department || department;

        if ( params.countries.length && params.countries.indexOf( employee.country ) === -1 && ! skipParams ) {

            continue;

        }

        if ( params.departments.length && params.departments.indexOf( employee.department ) === -1 && ! skipParams ) {

            continue;

        }

        //

        if ( params.date.day !== false && ( ! params.date.year || params.date.year === cYear ) && ( ! params.date.month || params.date.month === cMonth ) ) {

            if ( employee.jobEndDate ) {

                if ( employee.jobEndDate <= params.date.day ) {

                    isLeaver = true;
                    slt.leavers.push( employee );

                }

            }

            if ( employee.jobStartDate ) {

                if ( employee.jobStartDate <= params.date.day ) {

                    isStarter = true;
                    slt.starters.push( employee );

                }

            }

        } else {

            if ( employee.jobStartDate ) {

                isStarter = true;
                slt.starters.push( employee );

            }

            if ( employee.jobEndDate ) {

                isLeaver = true;
                slt.leavers.push( employee );

            }

        }

        //

        if ( ! isLeaver ) {

            slt.total.push( employee );

        }

    }

    //

    return slt;

};

Utils.filterEmployeeListByAttritionType = function ( params, employeeList, cYear, cMonth, country, department, skipParams ) {

    var result = {
        headcount:      [],
        attrition:      [],
        voluntary:      [],
        involuntary:    []
    };

    for ( var i = 0, il = employeeList.length; i < il; i ++ ) {

        var employee = employeeList[ i ];
        employee.country = employee.country || country;
        employee.department = employee.department || department;

        if ( params.countries.length && params.countries.indexOf( employee.country ) === -1 && ! skipParams ) {

            continue;

        }

        if ( params.departments.length && params.departments.indexOf( employee.department ) === -1 && ! skipParams ) {

            continue;

        }

        if ( params.date.day !== false && ( ! params.date.year || params.date.year === cYear ) && ( ! params.date.month || params.date.month === cMonth ) ) {

            if ( employee.jobEndDate && employee.jobEndDate <= params.date.day ) {

                result.attrition.push( employee );

                if ( employee.terminationType === 'Voluntary' ) {

                    result.voluntary.push( employee );

                } else {

                    result.involuntary.push( employee );

                }

            } else {

                result.headcount.push( employee );

            }

        } else {

            if ( employee.jobEndDate ) {

                result.attrition.push( employee );

                if ( employee.terminationType === 'Voluntary' ) {

                    result.voluntary.push( employee );

                } else {

                    result.involuntary.push( employee );

                }

            } else {

                result.headcount.push( employee );

            }

        }

    }

    return result;

};

Utils.setupEmployeesData = function ( data, includeSalaryData ) {

    var result = [];
    var employee;
    var employeesObj = {};

    for ( var i = 0, il = data.length; i < il; i ++ ) {

        employee = data[ i ].eLink;

        var history = employee.history || [];
        var historyItem = history[ history.length - 1 ] || {};

        var dStart = new Date( historyItem.employmentDateStart );
        var dEnd = ( historyItem.terminationDate ) ? historyItem.terminationDate : new Date();
        var yearsDiff = dEnd.getYear() - dStart.getYear();
        var monthsDiff = dEnd.getMonth() - dStart.getMonth();

        var statusToSave = '';

        if ( monthsDiff < 0 ) {

            yearsDiff --;
            monthsDiff += 12;

        }

        if ( yearsDiff ) {

            yearsDiff += ' yrs.';

        } else {

            yearsDiff = '';

        }

        if ( monthsDiff ) {

            if ( yearsDiff ) yearsDiff += ' ';
            monthsDiff += ' mo.'

        }

        //

        result.push({
            name:           employee.firstName + ' ' + employee.lastName,
            companyName:    historyItem.company,
            country:        historyItem.country,
            department:     historyItem.department.replace( /"/g, '' ),
            jobTitle:       historyItem.jobTitle,
            managerName:    historyItem.supervisorName || '',
            dateDiff:       yearsDiff + monthsDiff,
            status:         employee.status
        });

        if ( includeSalaryData ) {

            result[ result.length - 1 ].salary = [];
            result[ result.length - 1 ].salaryVsJan = 0;

        }

    }

    //

    return result;

};

Utils.computeTrends = function ( params, linechartData ) {

    var trends = {};

    if ( linechartData.total && linechartData.total.total !== undefined ) {

        var total = linechartData.total.total;

        trends.total = total[ total.length - 1 ];
        trends.year = ( total[0] ) ? total[0] : 0;
        trends.month = total[ total.length - 1 ] - total[ total.length - 2 ];

    }

    //

    return trends;

};

//

module.exports = Utils;
