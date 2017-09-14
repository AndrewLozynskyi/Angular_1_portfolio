/*
 * @author ohmed
 * Company management sys
 */

var SSF = require('xlsx').SSF;

var Employees = require('./../employees/Employees.js');
var Headcount = require('./../dashboard/Headcount.js');
var Workforce = require('./../dashboard/Workforce.js');
var Attrition = require('./../dashboard/Attrition.js');
var Salary = require('./../dashboard/Salary.js');

var Countries = require('./Countries.js');
var Departments = require('./Departments.js');

var Users = require('./../users/Users.js');
var Teams = require('./../teams/Teams.js');

//

var Company = {};

Company.uploadDashboardCover = function ( cover, callback ) {

    // todo
    return callback( null, { success: true } );

};

Company.uploadLogo = function ( logo, callback ) {

    // todo
    return callback( null, { success: true } );

};

Company.importMainDataset = function ( data, callback ) {

    var rawEmployeeData = [];

    var employeesData = [];
    var headcountData = [];
    var workforceData = [];
    var attritionData = [];
    var salaryData = [];

    var fullDateList;
    var employee;
    var eid;
    var isNewEmployeerecord;

    var countryList = {};

    //

    for ( var i = 0; i < data.length; i ++ ) {

        // employee data

        employee = parseEmployeeData( data[ i ] );
        eid = employee.general.eid;

        isNewEmployeerecord = false;

        if ( ! rawEmployeeData[ eid ] ) {

            isNewEmployeerecord = true;

        }

        rawEmployeeData[ eid ] = rawEmployeeData[ eid ] || employee.general;
        rawEmployeeData[ eid ].history.push( employee.history );

        countryList[ employee.history.country ] = countryList[ employee.history.country ] || {};
        countryList[ employee.history.country ][ employee.history.department ] = countryList[ employee.history.country ][ employee.history.department ] || 1;

        if ( isNewEmployeerecord ) {

            employeesData.push( rawEmployeeData[ eid ] );

        }

        //

        fullDateList = populateEmployeeDataByMonth( employee.history );

        // headcount & workforce data

        for ( var j = 0, jl = fullDateList.length; j < jl; j ++ ) {

            var date = fullDateList[ j ];
            var country = employee.history.country;
            var department = employee.history.department;
            var currentJobItem = ( employee.history ) ? employee.history : {};

            // Prepare headcount data item

            headcountData[ date.year ] = headcountData[ date.year ] || {};
            headcountData[ date.year ][ date.month ] = headcountData[ date.year ][ date.month ] || {};

            headcountData[ date.year ][ date.month ][ country ] = headcountData[ date.year ][ date.month ][ country ] || {}
            headcountData[ date.year ][ date.month ][ country ][ department ] = headcountData[ date.year ][ date.month ][ country ][ department ] || { employees: [] };

            // Prepare workforce data item

            workforceData[ date.year ] = workforceData[ date.year ] || {};
            workforceData[ date.year ][ date.month ] = workforceData[ date.year ][ date.month ] || {};

            workforceData[ date.year ][ date.month ][ country ] = workforceData[ date.year ][ date.month ][ country ] || {}
            workforceData[ date.year ][ date.month ][ country ][ department ] = workforceData[ date.year ][ date.month ][ country ][ department ] || { employees: [] };

            // Prepare attrition data item

            attritionData[ date.year ] = attritionData[ date.year ] || {};
            attritionData[ date.year ][ date.month ] = attritionData[ date.year ][ date.month ] || {};

            attritionData[ date.year ][ date.month ][ country ] = attritionData[ date.year ][ date.month ][ country ] || {}
            attritionData[ date.year ][ date.month ][ country ][ department ] = attritionData[ date.year ][ date.month ][ country ][ department ] || { employees: [] };

            // Prepare salary data item

            salaryData[ date.year ] = salaryData[ date.year ] || {};
            salaryData[ date.year ][ date.month ] = salaryData[ date.year ][ date.month ] || {};

            salaryData[ date.year ][ date.month ][ country ] = salaryData[ date.year ][ date.month ][ country ] || {}
            salaryData[ date.year ][ date.month ][ country ][ department ] = salaryData[ date.year ][ date.month ][ country ][ department ] || { employees: [] };

            //

            var isEmployeeInHeadcountList = false;
            var isEmployeeInWorkforceList = false;
            var isEmployeeInAttritionList = false;
            var isEmployeeInSalaryList = false;
            var jobStartDate = currentJobItem.jobStartDate;
            var jobEndDate = currentJobItem.jobEndDate;

            if ( jobStartDate === null || jobStartDate.getFullYear() !== date.year || jobStartDate.getMonth() !== date.month ) jobStartDate = null;
            if ( jobEndDate === null || jobEndDate.getFullYear() !== date.year || jobEndDate.getMonth() !== date.month ) jobEndDate = null;

            //

            for ( var k = 0, kl = headcountData[ date.year ][ date.month ][ country ][ department ].employees.length; k < kl; k ++ ) {

                if ( headcountData[ date.year ][ date.month ][ country ][ department ].employees[ k ].eid === eid ) {

                    isEmployeeInHeadcountList = k;
                    break;

                }

            }

            for ( var k = 0, kl = workforceData[ date.year ][ date.month ][ country ][ department ].employees.length; k < kl; k ++ ) {

                if ( workforceData[ date.year ][ date.month ][ country ][ department ].employees[ k ].eid === eid ) {

                    isEmployeeInWorkforceList = k;
                    break;

                }

            }

            for ( var k = 0, kl = attritionData[ date.year ][ date.month ][ country ][ department ].employees.length; k < kl; k ++ ) {

                if ( attritionData[ date.year ][ date.month ][ country ][ department ].employees[ k ].eid === eid ) {

                    isEmployeeInAttritionList = k;
                    break;

                }

            }

            for ( var k = 0, kl = salaryData[ date.year ][ date.month ][ country ][ department ].employees.length; k < kl; k ++ ) {

                if ( salaryData[ date.year ][ date.month ][ country ][ department ].employees[ k ].eid === eid ) {

                    isEmployeeInSalaryList = k;
                    break;

                }

            }

            if ( isEmployeeInHeadcountList === false ) {

                if ( currentJobItem.perType === 'Employee / Permanent' ) {

                    headcountData[ date.year ][ date.month ][ country ][ department ].employees.push({
                        eid:            eid,
                        jobStartDate:   ( jobStartDate ) ? jobStartDate.getDate() : null,
                        jobEndDate:     ( jobEndDate ) ? jobEndDate.getDate() : null
                    });

                }

            } else {

                var headcountEmployee = headcountData[ date.year ][ date.month ][ country ][ department ].employees[ isEmployeeInHeadcountList ];
                headcountEmployee.jobStartDate = ( jobStartDate ) ? jobStartDate.getDate() : null;
                headcountEmployee.jobEndDate = ( jobEndDate ) ? jobEndDate.getDate() : null;

            }

            if ( isEmployeeInWorkforceList === false ) {

                workforceData[ date.year ][ date.month ][ country ][ department ].employees.push({
                    eid:            eid,
                    jobStartDate:   ( jobStartDate ) ? jobStartDate.getDate() : null,
                    jobEndDate:     ( jobEndDate ) ? jobEndDate.getDate() : null,
                    personType:     currentJobItem.personType,
                    perm:           currentJobItem.perm
                });

            } else {

                var workforceEmployee = workforceData[ date.year ][ date.month ][ country ][ department ].employees[ isEmployeeInWorkforceList ];

                workforceEmployee.jobStartDate = ( jobStartDate ) ? jobStartDate.getDate() : null;
                workforceEmployee.jobEndDate = ( jobEndDate ) ? jobEndDate.getDate() : null;
                workforceEmployee.personType = currentJobItem.personType;
                workforceEmployee.perm = currentJobItem.perm;

            }

            if ( isEmployeeInAttritionList === false ) {

                if ( currentJobItem.perType === 'Employee / Permanent' ) {

                    attritionData[ date.year ][ date.month ][ country ][ department ].employees.push({
                        eid:                    eid,
                        jobStartDate:           ( jobStartDate ) ? jobStartDate.getDate() : null,
                        jobEndDate:             ( jobEndDate ) ? jobEndDate.getDate() : null,
                        terminationType:        currentJobItem.terminationType,
                        terminationReason:      currentJobItem.terminationReason
                    });

                }

            } else {

                var attritionEmployee = attritionData[ date.year ][ date.month ][ country ][ department ].employees[ isEmployeeInAttritionList ];

                attritionEmployee.jobStartDate = ( jobStartDate ) ? jobStartDate.getDate() : null;
                attritionEmployee.jobEndDate = ( jobEndDate ) ? jobEndDate.getDate() : null;
                attritionEmployee.terminationType = currentJobItem.terminationType;
                attritionEmployee.terminationReason = currentJobItem.terminationReason;

            }

            if ( isEmployeeInSalaryList === false ) {

                salaryData[ date.year ][ date.month ][ country ][ department ].employees.push({
                    eid:                    eid,
                    jobStartDate:           ( jobStartDate ) ? jobStartDate.getDate() : null,
                    jobEndDate:             ( jobEndDate ) ? jobEndDate.getDate() : null,
                    salary:                 currentJobItem.salary
                });

            } else {

                var salaryEmployee = salaryData[ date.year ][ date.month ][ country ][ department ].employees[ isEmployeeInSalaryList ];

                salaryEmployee.jobStartDate = ( jobStartDate ) ? jobStartDate.getDate() : null;
                salaryEmployee.jobEndDate = ( jobEndDate ) ? jobEndDate.getDate() : null;
                salaryEmployee.salary = currentJobItem.salary;

            }

        }

    }

    //

    for ( var i = 0, il = employeesData.length; i < il; i ++ ) {

        processEmployeeHistory( employeesData[ i ] );

    }

    employeesData = Employees.generateHierarchyIndex( employeesData );

    //

    function getEmployee ( eid ) {

        for ( var i = 0, il = employeesData.length; i < il; i ++ ) {

            if ( employeesData[ i ].eid === eid ) {

                return employeesData[ i ];

            }

        }

        return false;

    };

    // headcount

    for ( var year in headcountData ) {

        for ( var month in headcountData[ year ] ) {

            for ( var country in headcountData[ year ][ month ] ) {

                for ( var department in headcountData[ year ][ month ][ country ] ) {

                    for ( var i = 0, il = headcountData[ year ][ month ][ country ][ department ].employees.length; i < il; i ++ ) {

                        var eid = headcountData[ year ][ month ][ country ][ department ].employees[ i ].eid;
                        var employee = getEmployee( eid );

                        headcountData[ year ][ month ][ country ][ department ].employees[ i ].hierarchy = {
                            leftIndex: employee.leftIndex,
                            rightIndex: employee.rightIndex
                        };

                    }

                }

            }

        }

    }

    // workforce

    for ( var year in workforceData ) {

        for ( var month in workforceData[ year ] ) {

            for ( var country in workforceData[ year ][ month ] ) {

                for ( var department in workforceData[ year ][ month ][ country ] ) {

                    for ( var i = 0, il = workforceData[ year ][ month ][ country ][ department ].employees.length; i < il; i ++ ) {

                        var eid = workforceData[ year ][ month ][ country ][ department ].employees[ i ].eid;
                        var employee = getEmployee( eid );

                        workforceData[ year ][ month ][ country ][ department ].employees[ i ].hierarchy = {
                            leftIndex: employee.leftIndex,
                            rightIndex: employee.rightIndex
                        };

                    }

                }

            }

        }

    }

    // attrition

    for ( var year in attritionData ) {

        for ( var month in attritionData[ year ] ) {

            for ( var country in attritionData[ year ][ month ] ) {

                for ( var department in attritionData[ year ][ month ][ country ] ) {

                    for ( var i = 0, il = attritionData[ year ][ month ][ country ][ department ].employees.length; i < il; i ++ ) {

                        var eid = attritionData[ year ][ month ][ country ][ department ].employees[ i ].eid;
                        var employee = getEmployee( eid );

                        attritionData[ year ][ month ][ country ][ department ].employees[ i ].hierarchy = {
                            leftIndex: employee.leftIndex,
                            rightIndex: employee.rightIndex
                        };

                    }

                }

            }

        }

    }

    // salary

    for ( var year in salaryData ) {

        for ( var month in salaryData[ year ] ) {

            for ( var country in salaryData[ year ][ month ] ) {

                for ( var department in salaryData[ year ][ month ][ country ] ) {

                    for ( var i = 0, il = salaryData[ year ][ month ][ country ][ department ].employees.length; i < il; i ++ ) {

                        var eid = salaryData[ year ][ month ][ country ][ department ].employees[ i ].eid;
                        var employee = getEmployee( eid );

                        salaryData[ year ][ month ][ country ][ department ].employees[ i ].hierarchy = {
                            leftIndex: employee.leftIndex,
                            rightIndex: employee.rightIndex
                        };

                    }

                }

            }

        }

    }

    //

    function addCountryToDB ( name, countryData ) {

        Countries.create( name, function ( err, country ) {
            console.log(country);
            if ( err ) return;

            for ( var departmentName in countryData ) {
console.log(countryData);
                Departments.create( departmentName, country.countryId, country.name, function ( err ) {} );

            }

        });

    };

    Countries.clear( function ( err ) {

        if ( err ) {

            return;

        }

        //

        for ( var countryName in countryList ) {

            addCountryToDB( countryName, countryList[ countryName ] );

        }

    });

    //

    Employees.import( employeesData, function ( err, result ) {

        if ( err ) {

            return callback( err );

        }

        Headcount.import( headcountData, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            Workforce.import( workforceData, function ( err, result ) {

                if ( err ) {

                    return callback( err );

                }

                Attrition.import( attritionData, function ( err, result ) {

                    if ( err ) {

                        return callback( err );

                    }

                    Salary.import( salaryData, function ( err, result ) {

                        if ( err ) {

                            return callback( err );

                        }

                        Users.updateSupervisorsRoles( function ( err ) {

                            if ( err ) {

                                return callback( err );

                            }

                            Users.updateTeamMembers( function ( err ) {

                                if ( err ) {

                                    return callback( err );

                                }

                                Teams.createFromEmployees( function ( err, result ) {

                                    if ( err ) {

                                        return callback( err );

                                    }

                                    return callback( null, { success: true } );

                                });

                            });

                        });

                    });

                });

            });

        });

    });

};

//

function generateId () {

    return new Buffer( '' + Math.random() + Date.now() ).toString('base64').replace( /=/g, '' );

};

function processEmployeeHistory ( employee ) {

    var historyItems = {};

    //

    for ( var i = 0, il = employee.history.length; i < il; i ++ ) {

        var job = employee.history[ i ];

        historyItems[ job.country + '-' + job.company + '-' + job.jobTitle + '-' + job.employmentDateStart ] = historyItems[ job.country + '-' + job.company + '-' + job.jobTitle + '-' + job.employmentDateStart ] || generateId();
        job.jobId = historyItems[ job.country + '-' + job.company + '-' + job.jobTitle + '-' + job.employmentDateStart ];

    }

};

function parseEmployeeData ( data ) {

    var employee = {};

    employee.eid = data['Employee_number'];
    employee.username = data['Username'];
    employee.country = data['Country'];
    employee.department = data['Department'];
    employee.firstName = data['First_Name'];
    employee.lastName = data['Last_Name'];
    employee.dateOfBirth = convertDate( data['Date of Birth'] );
    employee.maritalStatus = data['Marital Status'];
    employee.nationality = data['Nationality'];
    employee.ethnicOrigin = data['Ethnic Origin'];
    employee.gender = data['Gender'];

    //

    employee.contactInfo = {

        workEmail:          data['Work_Email'],
        personalEmail:      data['personal email'],
        workPhonePrefix:    false,
        workPhone:          data['Work phone'],
        homePhonePrefix:    false,
        homePhone:          data['Home phone'],
        mobilePhonePrefix:  false,
        mobilePhone:        data['Mobile Phone'],

        country:            data['country'],
        city:               data['city'],
        zipCode:            data['zip code'],
        address:            []

    };

    var workPhonePrefix = data['Work Phone Prefix'];
    while ( workPhonePrefix && workPhonePrefix[0] === '0' ) workPhonePrefix = workPhonePrefix.slice( 1 );
    workPhonePrefix = '+' + workPhonePrefix;
    employee.contactInfo.workPhonePrefix = workPhonePrefix;

    var homePhonePrefix = data['Home Phone prefix'];
    while ( homePhonePrefix && homePhonePrefix[0] === '0' ) homePhonePrefix = homePhonePrefix.slice( 1 );
    homePhonePrefix = '+' + homePhonePrefix;
    employee.contactInfo.homePhonePrefix = homePhonePrefix;

    var mobilePhonePrefix = data['Mobile Phone Prefix'];
    while ( mobilePhonePrefix && mobilePhonePrefix[0] === '0' ) mobilePhonePrefix = mobilePhonePrefix.slice( 1 );
    mobilePhonePrefix = '+' + mobilePhonePrefix;
    employee.contactInfo.mobilePhonePrefix = mobilePhonePrefix;

    //

    employee.userData = {
        username:       data['Username'],
        disabled:       data['Disabled_YN'] === 'Y'
    };

    employee.history = [];
    employee.groups = [];
    employee.roles = [];

    employee.summury = '';
    employee.courses = [];

    //

    var historyItem = {

        eid:                    data['Employee_number'],

        company:                data['Company'],
        department:             data['Department'],
        title:                  data['Title'],

        employmentDateStart:    convertDate( data['Employment_Date_Start'] ),
        terminationDate:        convertDate( data['termination date'] ),
        terminationType:        data['Termination Type'],
        terminationReason:      data['termination_reason'],
        transferDate:           convertDate( data['Transfer_date'] ),
        transferType:           data['Transfer Type'],
        transferredFrom:        data['Transferred_From'],
        transferredTo:          data['Transferred_To'],

        jobTitle:               data['Job Title'],
        jobStartDate:           convertDate( data['Job Start date'] ),
        jobEndDate:             convertDate( data['Job End date'] ),
        jobReason:              data['Job Reason'],

        grade:                  data['Grade'],
        salary:                 + data['Salary'].replace( '$', '' ),
        salaryReason:           data['Salary Reason'],
        currency:               data.Currency,
        salaryFromDate:         convertDate( data['Salary from date'] ),
        salaryToDate:           convertDate( data['Salary to date'] ),

        bonus:                  [],
        bonusPercentage:        data['Bonus_percentage'],

        personType:             data['Person_Type'],
        perType:                data['per_type'],
        perm:                   data['Perm'],

        supervisorNumber:       data['Supervisor number'],
        supervisorName:         data['Supervisor Name'],
        managerStartDate:       convertDate( data['Manager Start date'] ),
        managerEndDate:         convertDate( data['Manager end date'] ),
        managerFeedback:        data['manager_feedback'] || '',

        agileJobTitle:          data['Agile job title'],
        skills:                 [],

        country:                data['country'],
        city:                   data['city'],
        zipCode:                data['zip code'],
        address:                [],

        officeName:             data['Office Name'],
        officeAddress:          [],
        officeLocationCode:     data['Office_Location_Code'],

        absenceReason:          data['absence reason'],
        absenceFrom:            convertDate( data['absence from'] ),
        absenceTo:              convertDate( data['absence to'] )

    };

    //

    for ( var i = 1; i < 5; i ++ ) {

        if ( data[ 'Bonus_' + i ] ) {

            var bonus = {};
            bonus.periodFor = data[ 'Bonus_type_' + i + '_Period_For' ];
            bonus.type = data[ 'Bonus_type_' + i ];
            bonus.amount = data[ 'Bonus_' + i ];

            historyItem.bonus.push( bonus );

        }

    }

    for ( var i = 1; i < 4; i ++ ) {

        if ( data[ 'Address line ' + i ] ) {

            historyItem.address.push( data[ 'Address line ' + i ] );
            employee.contactInfo.address.push( data[ 'Address line ' + i ] );

        }

        if ( data[ 'Office Address_Line_' + i ] ) {

            historyItem.officeAddress.push( data[ 'Office Address_Line_' + i ] );

        }

    }

    for ( var i = 1; i < 21; i ++ ) {

        if ( data[ 'Skill' + i ] ) {

            historyItem.skills.push( data[ 'Skill' + i ] );

        }

        if ( data[ 'Group' + i ] ) {

            employee.groups.push( data[ 'Group' + i ] );

        }

        if ( data[ 'Role' + i ] ) {

            employee.roles.push( data[ 'Role' + i ] );

        }

    }

    //

    return {
        general: employee,
        history: historyItem
    };

};

function populateEmployeeDataByMonth ( employee ) {

    var startDate = employee.jobStartDate;
    var endDate = employee.jobEndDate;

    var populatedData = [];

    //

    var today = new Date();

    if ( ! startDate ) {

        startDate = new Date( today.getFullYear() - 2, 0, 1 );

    }

    if ( ! endDate ) {

        endDate = today;

    }

    if ( today.getFullYear() - startDate.getFullYear() > 2 ) {

        startDate = new Date( today.getFullYear() - 2, 0, 0 );

    }

    //

    var startYear = startDate.getFullYear();
    var startMonth = startDate.getMonth();

    var endYear = endDate.getFullYear();
    var endMonth = endDate.getMonth();

    for ( var year = startYear; year <= endYear; year ++ ) {

        var smonth = ( year === startYear ) ? startMonth : 0;
        var emonth = ( year === endYear ) ? endMonth : 11;

        for ( var month = smonth; month <= emonth; month ++ ) {

            populatedData.push({
                year: year,
                month: month
            });

        }

    }

    //

    return populatedData;

};

function convertDate ( dateToConvert ) {

    if ( ! dateToConvert || dateToConvert === 'NULL' ) return null;

    var date;
    var convertedDate = null;
    var dateArr = dateToConvert.split('/');

    if ( dateArr.length > 1 ) {

        if ( dateArr[ 2 ] < 1000 ) {

            if ( dateArr[ 2 ] > 50 ) {

                dateArr[ 2 ] = + dateArr[ 2 ] + 1900;

            } else {

                dateArr[ 2 ] = + dateArr[ 2 ] + 2000;

            }

        }

        convertedDate = new Date( dateArr[ 2 ], dateArr[ 0 ], dateArr[ 1 ] );

    } else {

        date = SSF.parse_date_code( + dateToConvert, { date1904: false } );
        convertedDate = new Date( date.y, date.m, date.d );

    }

    return convertedDate;

};

//

module.exports = Company;
