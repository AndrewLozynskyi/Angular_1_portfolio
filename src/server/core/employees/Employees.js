/*
 * @author ohmed
 * Employees management sys
*/

var moment = require('moment');
var SSF = require('xlsx').SSF;

var EmployeesSchema = require( './../../db/mongo/schemas/Employee.js' );
var EmployeeModel = MongoDB.mongoose.model( 'Employee', EmployeesSchema );

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var Users = require('./../users/Users.js');
var Groups = require('./../groups/Groups.js');

var DEFAULT_PASSWORD = '34tyhvf45g';
var defaultLogin     = 'SBenoumessad';

//

var Employees = {};

Employees.create = function ( params, callback ) {

    params.password = params.password || DEFAULT_PASSWORD;
    params.username = params.username || ( params.lastName + params.firstName );
    params.email = params.email || params.username + '@nwg.com';

    //

    EmployeeModel
    .findOne({
        username: params.username
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        if ( ! employee ) {

            EmployeeModel
            .create({

                uid:                    '',
                eids:                   params.eids,
                username:               params.username,

                firstName:              params.firstName,
                lastName:               params.lastName,

                gender:                 params.gender,
                dateOfBirth:            params.dateOfBirth,
                maritalStatus:          params.maritalStatus,
                nationality:            params.nationality,
                ethnicOrigin:           params.ethnicOrigin,

                contactInfo:            params.contactInfo,

                summary:                '',
                courses:                [],

                history:                params.historyData

            }, function ( err, createdEmployee ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                //

                params.eid = createdEmployee._id;
                params.searchIndex = params.firstName + ' | ' + params.lastName + ' | ' + params.username + ' | ' + params.email + ' | ' + params.eid;
                params.fullName = ( createdEmployee.firstName + ' ' + createdEmployee.lastName ).trim();

                if ( createdEmployee.history instanceof Array ) {

                    params.company  = createdEmployee.history [ createdEmployee.history.length - 1 ].company.trim();
                    params.jobTitle = createdEmployee.history [ createdEmployee.history.length - 1 ].jobTitle.trim();

                }

                //

                Users.create( params, function ( err, user ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    createdEmployee.uid = user._id;
                    createdEmployee.save( function ( err ) {

                        return callback( null, { success: true } );

                    });

                });

            });

        } else {

            if ( employee.eids.indexOf( params.eids ) === -1 ) {

                employee.eids.push( params.eids );

            }

            employee.history = employee.history || [];
            employee.history.push( params.historyData );

            employee.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                return callback( null, { success: true } );

            });

        }

    });

};

Employees.remove = function ( eid, callback ) {

    EmployeeModel
    .findOne({
        eid: eid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'User with uid [' + eid + '] not found.' });

        }

        //

        Users.remove( employee.uid, function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            employee.remove( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                return callback( null );

            });

        });

    });

};

Employees.updateUid = function ( employeeData, userData, callback ) {

    EmployeeModel
    .findOne({
        eid:    employeeData.eid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'Employee with eid \'' + employeeData.eid + '\' not found.' });

        }

        //

        employee.uid = userData.uid;

        employee.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            UserModel
            .findOne({
                uid:    userData.uid
            })
            .exec( function ( err, user ) {

                if ( err ) return;

                user.eLink = employeeData._id;

                //

                user.save( function ( err ) {

                    return callback( null, { success: true } );

                });

            });

        });

    });

};

Employees.linkToUsers = function ( employeeList, callback ) {

    var eidList = employeeList.map( function ( value ) { return value.eid; } );
    var eLinkList = employeeList.map( function ( value ) { return value._id; } );

    //

    UserModel
    .find({
        eid: {
            '$in':  eidList
        }
    })
    .exec( function ( err, users ) {

        if ( err ) {

            return callback( err );

        }

        //

        var missingUsersEmployees = [];
        var existingUsersEmployees = [];

        for ( var i = 0, il = eidList.length; i < il; i ++ ) {

            var found = false;

            for ( var j = 0, jl = users.length; j < jl; j ++ ) {

                if ( users[ j ].eid === eidList[ i ] ) {

                    found = users[ j ];
                    break;

                }

            }

            if ( ! found ) {

                missingUsersEmployees.push( employeeList[ i ] );

            } else {

                existingUsersEmployees.push({ eid: eidList[ i ], _id: eLinkList[ i ], user: found });

            }

        }

        //

        for ( var i = 0, il = missingUsersEmployees.length; i < il; i ++ ) {

            var lastJob = missingUsersEmployees[ i ].history[ missingUsersEmployees[ i ].history.length - 1 ];

            missingUsersEmployees[ i ]._fullName = missingUsersEmployees[ i ].firstName + ' ' + missingUsersEmployees[ i ].lastName;
            missingUsersEmployees[ i ]._country = lastJob.country;
            missingUsersEmployees[ i ]._department = lastJob.department;
            missingUsersEmployees[ i ]._company = lastJob.company;
            missingUsersEmployees[ i ]._employmentDateStart = lastJob.employmentDateStart;
            missingUsersEmployees[ i ]._terminationDate = lastJob.terminationDate;
            missingUsersEmployees[ i ]._jobTitle = lastJob.jobTitle;

            missingUsersEmployees[ i ].email = missingUsersEmployees[ i ].contactInfo.workEmail;
            missingUsersEmployees[ i ].password = DEFAULT_PASSWORD;

            (function ( eid ) {

                Users.create( missingUsersEmployees[ i ], function ( err, result ) {

                    if ( err ) {

                        return;

                    }

                    EmployeeModel
                    .findOne({
                        eid:    eid
                    })
                    .exec( function ( err, employee ) {

                        if ( err || ! employee ) return;

                        employee.uid = result.uid;
                        employee.save();

                    });

                });

            }) ( missingUsersEmployees[ i ].eid );

        }

        for ( var i = 0, il = existingUsersEmployees.length; i < il; i ++ ) {

            Employees.updateUid( existingUsersEmployees[ i ], existingUsersEmployees[ i ].user, function () {} );

        }

        //

        return callback( null, { success: true } );

    });

};

Employees.import = function ( data, callback ) {

    var errors = [];
    var eidList = data.map( function ( value ) { return value.eid; } );

    //

    Employees.removeBulk( eidList, function ( err ) {

        if ( err ) {

            return callback( err );

        }

        //

        EmployeeModel.create( data, function ( err, employees ) {

            if ( err ) {

                return callback( err );

            }

            //

            Employees.linkToUsers( employees, function ( err, result ) {

                if ( err ) {

                    return callback( err );

                }

                //

                return callback( null, { success: true, importedEmployees: data.length, errors: errors } );

            });

        });

    });

};

Employees.removeBulk = function ( eidList, callback ) {

    EmployeeModel
    .find({
        eid: {
            '$in':    eidList
        }
    })
    .remove( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        return callback( null, { success: true } );

    });

};

Employees.generateHierarchyIndex = function ( employees ) {

    var tree = false;
    var data = [];

    var prepareData = function () {

        for ( var i = 0, il = employees.length; i < il; i ++ ) {

            var lastJob = employees[ i ].history[ employees[ i ].history.length - 1 ];

            data.push({
                eid:                employees[ i ].eid,
                supervisorNumber:   lastJob.supervisorNumber,
                leftIndex:          false,
                rightIndex:         false,
                parent:             false,
                children:           []
            });

        }

    };

    var findRoot = function () {

        for ( var i = 0, il = data.length; i < il; i ++ ) {

            if ( data[ i ].eid === data[ i ].supervisorNumber ) {

                return data[ i ];

            }

        }

        return false;

    };

    var findItemChildren = function ( item ) {

        var children = [];

        for ( var i = 0, il = data.length; i < il; i ++ ) {

            if ( data[ i ].supervisorNumber === item.eid && data[ i ].eid !== item.eid ) {

                children.push( data[ i ] );

            }

        }

        return children;

    };

    var buildTree = function () {

        var stack = [ tree ];
        var currentItem;
        var visitedItems = {};

        while ( stack.length ) {

            currentItem = stack.pop();
            if ( visitedItems[ currentItem.eid ] ) continue;

            visitedItems[ currentItem.eid ] = true;

            var children = findItemChildren( currentItem );
            currentItem.children = children || [];

            for ( var i = 0, il = children.length; i < il; i ++ ) {

                children[ i ].parent = currentItem;
                stack.push( children[ i ] );

            }

        }

    };

    var setEmployeeIndex = function ( eid, left, right ) {

        for ( var i = 0, il = employees.length; i < il; i ++ ) {

            if ( employees[ i ].eid === eid ) {

                employees[ i ].leftIndex = left;
                employees[ i ].rightIndex = right;
                break;

            }

        }

    };

    var indexTree = function () {

        var currentItem = tree;
        var iters = 0;
        var index = 0;

        //

        while ( currentItem !== false ) {

            if ( currentItem.leftIndex === false ) {

                currentItem.leftIndex = index;
                index ++;

            }

            var gotCurrentItem = false;

            for ( var i = 0, il = currentItem.children.length; i < il; i ++ ) {

                if ( currentItem.children[ i ].leftIndex === false ) {

                    currentItem = currentItem.children[ i ];
                    gotCurrentItem = true;
                    break;

                }

            }

            if ( gotCurrentItem === false ) {

                currentItem.rightIndex = index;
                setEmployeeIndex( currentItem.eid, currentItem.leftIndex, currentItem.rightIndex );
                currentItem = currentItem.parent;
                index ++;

            }

        }

    };

    //

    prepareData();
    tree = findRoot();
    buildTree();
    indexTree();

    //

    return employees;

};

//

module.exports = Employees;
