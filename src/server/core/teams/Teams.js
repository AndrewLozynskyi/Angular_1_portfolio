/*
 * @author ohmed
 * Teams service api
*/

var EmployeesSchema = require( './../../db/mongo/schemas/Employee.js' );
var EmployeeModel = MongoDB.mongoose.model( 'Employee', EmployeesSchema );

var UserSchema = require( './../../db/mongo/schemas/User.js' );
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var TeamsSchema = require( './../../db/mongo/schemas/Team.js' );
var TeamsModel = MongoDB.mongoose.model( 'Team', TeamsSchema );

MongoDB.mongoose.Promise = require('bluebird');

//

var countryList = require('iso-3166-country-list')
var CountryLanguage = require('country-language');
var _ = require('lodash');

var Teams = {};

Teams.create = function ( teams, callback ) {

    TeamsModel.create( teams, function ( err ) {

        if ( err ) {

            return callback( err );

        }

        //

        return callback( null, { success: true } );

    });

};

Teams.remove = function ( params, callback ) {

    if ( params === 'all' ) {

        TeamsModel
        .find()
        .remove( function ( err ) {

            if ( err ) {

                return callback( err );

            }

            //

            return callback( null, { success: true } );

        });

    }

};

Teams.createFromEmployees = function ( callback ) {

    var teams = {};
    var teamsArray = [];

    //

    EmployeeModel
    .find()
    .exec( function ( err, employees ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        for ( var i = 0, il = employees.length; i < il; i ++ ) {

            var lastJob = employees[ i ].history[ employees[ i ].history.length - 1 ];

            teams[ lastJob.company ] = teams[ lastJob.company ] || { employees: [] };
            teams[ lastJob.company ].department = lastJob.department;
            teams[ lastJob.company ].name = lastJob.company;
            teams[ lastJob.company ].employees.push( employees[ i ].eid );
            teams[ lastJob.company ].color = [ Math.floor( Math.random() * 255 ), Math.floor( Math.random() * 255 ), Math.floor( Math.random() * 255 ) ];

        }

        for ( var teamName in teams ) {

            teamsArray.push( teams[ teamName ] );

        }

        //

        Teams.remove( 'all', function ( err ) {

            if ( err ) {

                return callback( err );

            }

            //

            Teams.create( teamsArray, function ( err ) {

                if ( err ) {

                    return callback( err );

                }

                //

                return callback( null, { success: true } );

            });

        });

    });

};

Teams.getList = function ( params, callback ) {

    var userId = params.userId;

    //

    EmployeeModel
    .findOne({
        uid:    userId
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'User with id \'' + userId + '\' not found.' });

        }

        //

        EmployeeModel
        .find()
        .exec( function ( err, employees ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            var result = [];
            var teamsNames = {};
            var lastJob;

            for ( var i = 0, il = employees.length; i < il; i ++ ) {

                if ( employees[ i ].leftIndex >= employee.leftIndex && employees[ i ].rightIndex <= employee.rightIndex ) {

                    lastJob = employees[ i ].history[ employees[ i ].history.length - 1 ];
                    teamsNames[ lastJob.company ] = true;

                }

            }

            teamsNames = Object.keys( teamsNames );

            //

            TeamsModel
            .find({
                name: {
                    '$in':  teamsNames
                }
            })
            .exec( function ( err, teams ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                //

                Array.prototype.contains = function ( v ) {

                    for ( var i = 0; i < this.length; i ++ ) {

                        if ( this[ i ] === v ) return true;

                    }

                    return false;

                };

                Array.prototype.unique = function () {

                    var arr = [];

                    for ( var i = 0; i < this.length; i ++ ) {

                        if ( !arr.contains( this[ i ] ) ) {

                            arr.push( this[ i ] );

                        }

                    }

                    return arr;

                };

                var employeesData = []
                var unicDepartments = [];
                var departmentsCount = [];

                for ( var i = 0, il = teams.length; i < il; i ++ ) {

                    employeesData.push( teams[ i ].department )
                    unicDepartments = employeesData.unique();

                }

                for ( var i = 0, il = unicDepartments.length; i < il; i ++ ) {

                    for ( var j = 0; j < teams.length; j ++ ) {

                        if ( unicDepartments[ i ] === teams[ j ].department ) {

                            departmentsCount.push({
                                department: unicDepartments[ i ],
                                count:      teams[ j ].employees.length ++
                            });

                        }

                    }

                }

                var resultData = _.chain( departmentsCount ).reduce( function ( memo, obj ) {

                    if ( typeof memo[ obj.department ] === 'undefined' ) {

                        memo[ obj.department ] = 0;

                    }

                    memo[ obj.department ] += obj.count;

                    return memo;

                }, {} ).map( function ( val, key ) {

                    return { department: key, count: val };

                })
                .value();

                for ( var i = 0, il = teams.length; i < il; i ++ ) {

                    result.push({
                        department:     teams[ i ].department,
                        id:             teams[ i ]._id,
                        name:           teams[ i ].name,
                        description:    teams[ i ].description,
                        manager:        teams[ i ].manager,
                        project:        teams[ i ].project,
                        type:           teams[ i ].type,
                        color:          teams[ i ].color,
                        currentMembers: teams[ i ].employees.length - 1,
                        totalMembers:   0
                    });

                }

                for ( var i = 0, il = result.length; i < il; i ++ ) {

                    for ( var j = 0; j < resultData.length; j ++ ) {

                        if ( result[ i ].department === resultData[ j ].department ) {

                            result[ i ].totalMembers = resultData[ j ].count

                        }

                    }

                }

                return callback( null, { success: true, teams: result } );

            });

        });

    });

};

Teams.getDetails = function ( params, callback ) {

    var result = {};
    result.totalAvarage = {
        age:            {},
        gender:         {},
        nationality:    {},
        ethnicity:      {},
        headcount:      [ 0, 0 ],
        salary:         [ 0, 0 ],
        salaryBill:     [ 0, 0 ],
        seniority:      [ 0, 0 ],
        turnover:       [ 0, 0 ],
        payStructure: [
            { name:     'Custumer servece UK', minimum: 7500, median: 10000, maximum: 12500 },
            { name:     'Designers', minimum: 9500, median: 12000, maximum: 14500 },
            { name:     'Call centre', minimum: 11500, median: 14000, maximum: 16500 },
            { name:     'PMs', minimum: 14500, median: 17000, maximum: 20000 }
        ],
        gradesVsTotal: [
            { name:     'Custumer servece UK', prOfTeam: 19, median: 10000 },
            { name:     'Designers', prOfTeam: 23, median: 12000 },
            { name:     'Call centre', prOfTeam: 26, median: 14000 },
            { name:     'PMs', prOfTeam: 32, median: 17000 }
        ]
    };

    var teamData = false;

    //

    TeamsModel
    .findOne({
        _id:    params.teamId
    }).exec()
    .then( function ( team ) {

        if ( ! team ) {

            return callback({ code: 1, message: 'No team with id:\'' + params.teamId + '\' found.' });

        }

        //

        teamData = team;

        result.id = team._id;
        result.company = team.name;
        result.location = team.location;
        result.creationDate = team.creationDate;
        result.description = team.description;

        //

        return EmployeeModel.find({
            eid: {
                '$in':  team.employees
            }
        }).exec();

    })
    .then( function ( employees ) {

        for ( var i = 0, il = employees.length; i < il; i ++ ) {

            // age

            var ageRange = new Date( employees[ i ].dateOfBirth );
            ageRange = ( new Date() ).getFullYear() - ageRange.getFullYear();
            ageRange = Math.floor( ageRange / 10 ) * 10 + '-' + Math.floor( ageRange / 10 + 1 ) * 10

            result.totalAvarage.age[ ageRange ] = result.totalAvarage.age[ ageRange ] || 0;
            result.totalAvarage.age[ ageRange ] ++;

            // gender

            var gender = employees[ i ].gender;
            if ( gender === 'M' ) gender = 'Male';
            if ( gender === 'F' ) gender = 'Female';
            if ( gender === 'N' ) gender = 'Neutrois';
            if ( gender === 'B' ) gender = 'Bigender';

            result.totalAvarage.gender[ gender ] = result.totalAvarage.gender[ gender ] || 0;
            result.totalAvarage.gender[ gender ] ++;

            // nationality

            if ( employees[ i ].contactInfo.country === 'UK' ) {

                employees[ i ].contactInfo.country = 'UNITED KINGDOM';

            } else if ( employees[ i ].contactInfo.country === 'Dubai' ) {

                employees[ i ].contactInfo.country = 'UNITED ARAB EMIRATES';

            }

            var countryCode = employees[ i ].contactInfo.country
            countryCode = CountryLanguage.getCountry(countryList.code(countryCode)).code_3;

            result.totalAvarage.nationality[ countryCode ] = result.totalAvarage.nationality[ countryCode ] || 0;
            result.totalAvarage.nationality[ countryCode ] ++;

            // result.totalAvarage.nationality[ employees[ i ].nationality ] = result.totalAvarage.nationality[ employees[ i ].nationality ] || 0;
            // result.totalAvarage.nationality[ employees[ i ].nationality ] ++;

            // ethnicity

            result.totalAvarage.ethnicity[ employees[ i ].ethnicOrigin ] = result.totalAvarage.ethnicity[ employees[ i ].ethnicOrigin ] || 0;
            result.totalAvarage.ethnicity[ employees[ i ].ethnicOrigin ] ++;

        }

        result.totalAvarage.headcount[0] = employees.length;

        //

        return EmployeeModel.find({ department: teamData.department }).exec();

    })
    .then( function ( employees ) {

        result.totalAvarage.headcount[1] = employees.length;

        return callback( null, { success: true, team: result } );

    });

};

Teams.getEmployeesList = function ( params, callback ) {

    var teamId = params.teamId;
    var type = params.type;

    var result = {
        employees:  [],
        stats:      {
            department:     [],
            team:           []
        }
    };

    //

    TeamsModel
    .findOne({
        _id:    teamId
    })
    .exec()
    .then( function ( team ) {

        if ( ! team ) {

            return callback({ code: 1, message: 'No team with id:\'' + params.teamId + '\' found.' });

        }

        //

        return UserModel.find({
            eid: {
                '$in':  team.employees
            }
        }).populate('eLink');

    })
    .then( function ( users ) {

        for ( var i = 0, il = users.length; i < il; i ++ ) {

            var user = users[ i ];
            var employee = users[ i ].eLink || {};
            var lastJob = employee.history[ employee.history.length - 1 ] || {};

            result.employees.push({
                uid:        user.uid,
                userpic:    user.userpic || '',
                eid:        employee.eid,
                firstName:  employee.firstName,
                lastName:   employee.lastName,
                company:    lastJob.company,
                city:       employee.contactInfo.city,
                jobTitle:   lastJob.jobTitle,
                supervisor: lastJob.supervisorName
            });

        }

        //

        return callback( null, { success: true, employees: result.employees, stats: result.stats } );

    });

};

//

module.exports = Teams;
