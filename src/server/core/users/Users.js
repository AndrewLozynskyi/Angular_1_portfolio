/*
 * @author ohmed
 * Users management sys
*/

var fs = require('fs');
var path = require('path');
var moment = require('moment');

var utils = require('../auth/Utils.js');

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var EmployeesSchema = require( './../../db/mongo/schemas/Employee.js' );
var EmployeeModel = MongoDB.mongoose.model( 'Employee', EmployeesSchema );

var RoleSchema = require( './../../db/mongo/schemas/Role.js' );
var RoleModel = MongoDB.mongoose.model( 'Role', RoleSchema );

var GroupSchema = require( './../../db/mongo/schemas/Group.js' );
var GroupModel = MongoDB.mongoose.model( 'Group', GroupSchema );

//

var Users = {};

Users.getScope = function ( uid, callback ) {

    var scopes = {
        countries:  {},
        user:       false
    };

    //

    UserModel
    .findOne({
        uid:    uid
    })
    .populate('eLink')
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid [' + uid + '] not found.' });

        }

        //

        scopes.user = user;

        RoleModel
        .find({
            'roleId': {
                $in:    user.roles
            }
        })
        .exec( function ( err, roles ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            for ( var i = 0; i < roles.length; i ++ ) {

                var scope = roles[ i ].scope;

                if ( scope.basedOn === 'no-restriction' ) {

                    scopes['no-restriction'] = true;

                } else if ( scope.basedOn === 'hierarchy' ) {

                    scopes['hierarchy'] = true;

                } else if ( scope.basedOn === 'country' ) {

                    for ( var countryName in scope.countries ) {

                        if ( scopes.countries[ countryName ] !== 'all' ) {

                            scopes.countries[ countryName ] = 'all';

                        }

                    }

                } else if ( scope.basedOn === 'department' ) {

                    scopes.countries['all'] = {};

                    for ( var departmentName in scope.countries['all'] ) {

                        scopes.countries[ 'all' ][ departmentName ] = scope.countries['all'][ departmentName ];

                    }

                } else if ( scope.basedOn === 'country-department' ) {

                    for ( var countryName in scope.countries ) {

                        for ( var departmentName in scope.countries[ countryName ] ) {

                            if ( scope.countries[ countryName ][ departmentName ] === true ) {

                                scopes.countries[ countryName ] = scopes.countries[ countryName ] || {};
                                scopes.countries[ countryName ][ departmentName ] = true;

                            }

                        }

                    }

                }

            }

            //

            return callback( null, scopes );

        });

    });

};

Users.create = function ( params, callback ) {

    UserModel
    .findOne({
        '$or': [
            {
                username:   params.username
            },
            {
                email:      params.email
            }
        ]
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( user ) {

            if ( user.email === params.email ) {

                return callback({ code: 1, message: 'User email ' + params.email + ' is already taken.' });

            } else if ( user.username === params.username ) {

                return callback({ code: 2, message: 'User username ' + params.username + ' is already taken.' });

            }

        }

        //

        var salt = utils.genRandomString( 16 );
        var passwordHashData = utils.passwordHashing( params.password, salt );

        var employeeRoleId = RolesList.getIdByName('Employee').roleId;
        var roles = [];

        if ( employeeRoleId !== undefined ) roles.push( employeeRoleId );

        //

        var searchIndex = params.firstName + ' | ' + params.lastName + ' | ' + params.username + ' | ' + params.email + ' | ' + params.eid;

        UserModel
        .create({

            _fullName:              params._fullName,
            _company:               params._company,
            _country:               params._country,
            _department:            params._department,
            _employmentDateStart:   params._employmentDateStart,
            _terminationDate:       params._terminationDate,
            _jobTitle:              params._jobTitle,

            eid:            params.eid,
            eLink:          params._id,
            username:       params.username,
            email:          params.email,
            hash:           passwordHashData.passwordHash,
            salt:           passwordHashData.salt,
            roles:          roles,
            contacts:       [],
            contactAdded:   [],
            contactsGroups: [
                {
                    name:       'Team Members',
                    default:    true,
                    users:      [],
                    list:       true
                },
                {
                    name:       'Friends',
                    default:    true,
                    users:      [],
                    list:       true
                },
                {
                    name:       'Colleagues',
                    default:    true,
                    users:      [],
                    list:       true
                },
                {
                    name:       'Project Contributors',
                    default:    true,
                    users:      [],
                    list:       true
                },
                {
                    name:       'people_you_may_know',
                    default:    true,
                    users:      [],
                    list:       false
                }
            ],
            searchIndex:    searchIndex

        }, function ( err, user ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            if ( ! roles.length ) {

                return callback( null, { uid: user.uid } );

            }

            //

            for ( var i = 0, il = roles.length; i < il; i ++ ) {

                RoleModel
                .findOne({ roleId: roles[ i ] })
                .exec( function ( err, role ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    //

                    role.users.push( user.uid );

                    role.save( function ( err ) {

                        if ( err ) {

                            return callback({ code: 0, message: err });

                        }

                        //

                        return callback( null, { uid: user.uid, _id: user._id } );

                    });

                });

            }

        });

    });

};

Users.createAlt = function ( params, callback ) {

    var query = false;

    if ( params.facebookid ) query = { facebookid: params.facebookid };
    if ( params.googleid ) query = { googleid: params.googleid };
    if ( params.linkedinid ) query = { linkedinid: params.linkedinid };

    UserModel
    .findOne( query )
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( user ) {

            return callback( null, user );

        }

        //

        var employeeRoleId = RolesList.getIdByName('Employee').roleId;
        var managerRoleId = RolesList.getIdByName('Manager').roleId;

        var roles = [];
        if ( employeeRoleId !== undefined ) roles.push( employeeRoleId );

        //

        UserModel
        .create({
            eids:           params.eids,
            eid:            params.eid,
            username:       params.username,
            email:          params.email,
            facebookid:     params.facebookid,
            googleid:       params.googleid,
            linkedinid:     params.linkedinid,
            roles:          roles,
            contacts:       [],
            contactsGroups: [
                {
                    name:       'current',
                    default:    true,
                    users:      []
                },
                {
                    name:       'recent',
                    default:    true,
                    users:      []
                },
                {
                    name:       'people_you_may_know',
                    default:    true,
                    users:      []
                }
            ],
            searchIndex:    params.searchIndex
        }, function ( err, user ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            if ( ! roles.length ) {

                return callback( null, { uid: user.uid } );

            }

            //

            for ( var i = 0, il = roles.length, ii = 0; i < il; i ++ ) {

                RoleModel
                .findOne({ roleId: roles[ i ] })
                .exec( function ( err, role ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    //

                    role.users.push( user.uid );

                    role.save( function ( err ) {

                        if ( err ) {

                            return callback({ code: 0, message: err });

                        }

                        //

                        ii ++;

                        if ( ii === il ) {

                            return callback( null, user );

                        }

                    });

                });

            }

        });

    });

};

Users.updateSupervisorsRoles = function ( callback ) {

    var computed = 0;
    var managers = {};

    //

    UserModel
    .find()
    .populate('eLink')
    .exec( function ( err, users ) {

        if ( err ) {

            return callback({ code: 0, error: err });

        }

        if ( ! users || ! users.length ) {

            return finish();

        }

        //

        for ( var i = 0, il = users.length; i < il; i ++ ) {

            var employee = users[ i ].eLink;

            if ( ! employee ) {

                computed ++;

                if ( computed === users.length ) {

                    return finish();

                }

                continue;

            }

            var lastData = ( employee.history || [] ).pop() || {};

            if ( lastData && lastData.supervisorNumber ) {

                if ( managers[ lastData.supervisorNumber ] ) {

                    computed ++;
                    continue;

                }

                managers[ lastData.supervisorNumber ] = users[ i ].uid;
                updateUser( lastData.supervisorNumber, function () {

                    computed ++;

                    if ( computed === users.length ) {

                        return finish();

                    }

                });

            } else {

                computed ++;

                if ( computed === users.length ) {

                    return finish();

                }

            }

        }

    });

    function updateUser ( sn, cb ) {

        if ( ! sn ) return cb();

        //

        EmployeeModel
        .findOne({
            'eids':  sn
        })
        .populate('uid')
        .exec( function ( err, employee ) {

            if ( err ) {

                return cb();

            }

            var user = ( employee ) ? employee.uid : false;

            if ( user ) {

                var alreadyManager = false;
                managers[ sn ] = user.uid;

                for ( var j = 0, jl = user.roles.length; j < jl; j ++ ) {

                    if ( user.roles[ j ] === RolesList.getIdByName('Manager').roleId ) {

                        alreadyManager = true;
                        break;

                    }

                }

                if ( ! alreadyManager ) {

                    user.roles.push( RolesList.getIdByName('Manager').roleId );
                    user.save( function ( err ) {

                        return cb();

                    });

                } else {

                    return cb();

                }

            } else {

                return cb();

            }

        });

    };

    function finish () {

        RoleModel
        .findOne({ roleId: RolesList.getIdByName('Manager').roleId })
        .exec( function ( err, role ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            for ( var i in managers ) {

                role.users.push( managers[ i ] );

            }

            role.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                return callback( null, { success: true } );

            });

        });

    };

};

Users.remove = function ( uid, callback ) {

    UserModel
    .findOne({
        uid: uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid [' + uid + '] not found.' });

        }

        user.remove( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null );

        });

    });

};

Users.getList = function ( offset, size, roleId, groupId, search, sortattr, sortdir, callback ) {

    var params = {
        '$and':     []
    };

    if ( roleId !== false ) {

        params[ '$and' ].push({
            roles:    roleId
        });

    }

    if ( groupId !== false ) {

        params[ '$and' ].push({
            groups:    groupId
        });

    }

    if ( search !== false && search !== '' ) {

        params[ '$and' ].push({
            'searchIndex': { '$regex': search, '$options': 'i' }
        });

    }

    if ( ! params[ '$and' ].length ) {

        delete params[ '$and' ];

    }

    var sort = {};

    if ( sortattr && sortdir ) {

        switch ( sortattr ) {

            case 'fullName':

                sortattr = '_fullName';
                break;

            case 'StartDate':

                sortattr = '_employmentDateStart';
                break;

            case 'TerminationDate':

                sortattr = '_terminationDate';
                break;

            case 'Department':

                sortattr = '_department';
                break;

            case 'country':

                sortattr = '_country';
                break;

            case 'status':

                sortattr = 'disabled';
                break;

        }

        sort[ sortattr ] = ( sortdir === 'true' ) ? 1 : -1;

    }

    //

    UserModel
    .find( params )
    .sort( sort )
    .populate( 'eLink' )
    .skip( offset )
    .limit( size )
    .exec( function ( err, users ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var result = [];
        users = JSON.parse( JSON.stringify( users ) );

        for ( var i = 0, il = users.length; i < il; i ++ ) {

            var employee = users[ i ].eLink || {};

            var historyItem = ( employee.history || [] ).pop();
            historyItem = historyItem || {};

            var startDate = ( historyItem && historyItem.employmentDateStart ) ? moment( historyItem.employmentDateStart ).format('YYYY-DD-MM') : '';
            var terminationDate = ( historyItem && historyItem.terminationDate ) ? moment( historyItem.terminationDate ).format('YYYY-DD-MM') : '';

            result.push({
                uid:                    users[ i ].uid,
                username:               users[ i ].username,
                userpic:                users[ i ].userpic || false,
                email:                  users[ i ].email,
                status:                 users[ i ].disabled ? 'inactive' : 'active',
                employee:   {
                    eid:                historyItem ? historyItem.eid : '',
                    firstName:          employee.firstName,
                    lastName:           employee.lastName,
                    startDate:          startDate,
                    terminationDate:    terminationDate,
                    country:            historyItem.country,
                    department:         historyItem.department
                }
            });

        }

        UserModel
        .count( params, function ( err, count ) {

            return callback( null, { users: result, total: count });

        });

    });

};

Users.getGeneralStatsInfo = function ( roleId, callback ) {

    var Groups = require('./../groups/Groups.js');
    Groups.filterToDefaultGroup( function () {} );

    //

    var result = {
        allCount:   0,
        main:       {},
        groups:     []
    };

    var params = {};

    if ( roleId != false && roleId != 'false' ) {

        params.roles = roleId;

    }

    function getAllCount ( callback ) {

        UserModel.count( params, function ( err, count ) {

            if ( err ) {

                return callback( err );

            }

            result.allCount = count;
            callback();

        });

    };

    function getOtherGroups ( callback ) {

        GroupModel
        .find({})
        .exec( function ( err, groups ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            for ( var i = 0, il = groups.length; i < il; i ++ ) {

                if ( ! groups[ i ].default ) {

                    result.groups.push({
                        groupId:    groups[ i ].groupId,
                        name:       groups[ i ].name,
                        count:      groups[ i ].users.length
                    });

                } else {

                    result.main[ groups[ i ].name.toLowerCase().replace( / /g, '' ) ] = {
                        groupId:    groups[ i ].groupId,
                        name:       groups[ i ].name,
                        count:      groups[ i ].users.length
                    };

                }

            }

            callback();

        });

    };

    getAllCount( function ( err ) {

        getOtherGroups( function ( err ) {

            if ( err ) {

                callback( err, null );

            }

            callback( null, result );

        });

    });

};

Users.addRole = function ( roleId, usersUidList, callback ) {

    var errors = [];
    var updatedUsersCount = 0;

    //

    RoleModel
    .findOne({
        roleId: roleId
    })
    .exec( function ( err, role ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! role ) {

            return callback({ code: 1, message: 'Role with id \'' + roleId + '\' not found.' });

        }

        //

        UserModel
        .find({
            uid: {
                '$in': usersUidList
            }
        })
        .exec( function ( err, users ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            // updating role & users data

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                if ( role.users.indexOf( users[ i ].uid ) === -1 ) {

                    role.users.push( users[ i ].uid );

                } else {

                    errors.push( 'Role already has user with id: \'' + users[ i ].uid + '\'.' );

                }

                users[ i ].roles = users[ i ].roles || [];

                if ( users[ i ].roles.indexOf( roleId ) === -1 ) {

                    users[ i ].roles.push( roleId );

                }

            }

            // saving role & users changes to DB

            role.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                if ( users.length === 0 ) {

                    return callback( null, { success: true, errors: errors } );

                }

                //

                for ( var i = 0, il = users.length; i < il; i ++ ) {

                    users[ i ].save( function ( err, user ) {

                        updatedUsersCount ++;

                        if ( err ) {

                            errors.push( err );

                        }

                        user.sessions = user.sessions || [];

                        for ( var j = 0, jl = user.sessions.length; j < jl; j ++ ) {

                            updateRedisRecord( user, user.sessions[ j ] );

                        }

                        if ( updatedUsersCount === users.length ) {

                            return callback( null, { success: true, errors: errors } );

                        }

                    });

                }

            });

        });

    });

};

Users.removeRole = function ( roleId, usersUidList, callback ) {

    var errors = [];
    var updatedUsersCount = 0;

    //

    RoleModel
    .findOne({
        roleId: roleId
    })
    .exec( function ( err, role ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! role ) {

            return callback({ code: 1, message: 'Role with id \'' + gid + '\' not found.' });

        }

        //

        UserModel
        .find({
            uid: {
                '$in': usersUidList
            }
        })
        .exec( function ( err, users ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            // updating role & users data

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                if ( role.users.indexOf( users[ i ].uid ) !== -1 ) {

                    role.users = role.users.filter( function ( value ) { return value !== users[ i ].uid; } );

                } else {

                    errors.push( 'Role already don\'t have user with id: \'' + users[ i ].uid + '\'.' );

                }

                users[ i ].roles = users[ i ].roles || [];
                users[ i ].roles = users[ i ].roles.filter( function ( value ) { return value !== roleId; } );

            }

            // saving role & users changes to DB

            role.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                if ( users.length === 0 ) {

                    return callback( null, { success: true, errors: errors } );

                }

                //

                for ( var i = 0, il = users.length; i < il; i ++ ) {

                    users[ i ].save( function ( err, user ) {

                        updatedUsersCount ++;

                        if ( err ) {

                            errors.push( err );

                        }

                        user.sessions = user.sessions || [];

                        for ( var j = 0, jl = user.sessions.length; j < jl; j ++ ) {

                            updateRedisRecord( user, user.sessions[ j ] );

                        }

                        if ( updatedUsersCount === users.length ) {

                            return callback( null, { success: true, errors: errors } );

                        }

                    });

                }

            });

        });

    });

};

Users.getRolePermissionsUpdateToken = function ( uid, password, callback ) {

    UserModel
    .findOne({
        uid: uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid [' + uid + '] not found.' });

        }

        var passwordHashData = utils.passwordHashing( password, user.salt );
        var hashedPass = passwordHashData.passwordHash;

        if ( user.hash !== hashedPass && hashedPass ) {

            return callback({ code: 2, message: 'Wrong password.' } );

        }

        //

        var token = new Buffer( '' + Math.random() + Date.now() ).toString('base64').replace( /=/g, '' );
        user.rolePermissionsUpdateToken = token;

        user.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            return callback( null, token );

        });

    });

};

Users.isRolePermissionsUpdateTokenValid = function ( uid, token, callback ) {

    UserModel
    .findOne({
        uid: uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid [' + uid + '] not found.' });

        }

        //

        if ( user.rolePermissionsUpdateToken === token ) {

            return callback( null, { success: true } );

        } else {

            return callback( { code: 1, message: 'Token not valid' } );

        }

    });

};

Users.setActivationStatus = function ( usersUidList, activationStatus, callback ) {

    var errors = [];
    var updatedUsersCount = 0;

    //

    UserModel
    .find({
        uid: {
            '$in': usersUidList
        }
    })
    .exec( function ( err, users ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        for ( var i = 0, il = users.length; i < il; i ++ ) {

            users[ i ].disabled = ! activationStatus;

            users[ i ].save( function ( err ) {

                updatedUsersCount ++;

                if ( err ) {

                    errors.push( err );

                }

                if ( updatedUsersCount === users.length ) {

                    return callback( null, { success: true, errors: errors } );

                }

            });

        }

    });

};

Users.setStatus = function ( uid, status, callback ) {

    UserModel
    .findOne({
        uid: uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        user.status = status;

        user.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            return callback( null, { success: true } );

        });

    });

};

Users.setUserpic = function ( uid, imageBase64, session, callback ) {

    if ( ! fs.existsSync( path.resolve( __dirname + '/../../usersData/' ) ) ){

        fs.mkdirSync( path.resolve( __dirname + '/../../usersData' ) );

    }

    if ( ! fs.existsSync( path.resolve( __dirname + '/../../usersData/' + uid ) ) ){

        fs.mkdirSync( path.resolve( __dirname + '/../../usersData/' + uid ) );

    }

    var imageName = new Buffer( '' + Math.random() + Date.now() ).toString('base64').replace( /=/g, '' ) + '.jpg';

    //

    fs.writeFile( path.resolve( __dirname + '/../../usersData/' + uid + '/' + imageName ), imageBase64, 'base64', function ( err ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        UserModel
        .findOne({
            uid:    uid
        })
        .exec( function ( err, user ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            if ( ! user ) {

                return callback({ code: 1, message: 'User with id: \'' + uid + '\' not found.' });

            }

            //

            user.userpic = imageName;

            user.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                //

                redisDB.get( session, function ( err, data ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    if ( ! data ) {

                        return callback({ code: 3, message: 'Provided session is not correct.' });

                    }

                    //

                    data = JSON.parse( data );
                    data.userpic = imageName;

                    //

                    redisDB.set( session, JSON.stringify( data ) );

                });

                //

                return callback( null, { success: true, userpic: imageName, uid: uid } );

            });

        });

    });

};

Users.removeUserpic = function ( uid, session, callback ) {

    var imageName = '';

    //

    UserModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with id: \'' + uid + '\' not found.' });

        }

        //

        user.userpic = imageName;

        user.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            redisDB.get( session, function ( err, data ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                if ( ! data ) {

                    return callback({ code: 3, message: 'Provided session is not correct.' });

                }

                data = JSON.parse( data );
                data.userpic = imageName;

                //

                redisDB.set( session, JSON.stringify( data ) );

            });

            //

            return callback( null, { success: true } );

        });

    });

};

Users.updateTeamMembers = function ( callback ) {

    UserModel
    .find()
    .populate('eLink')
    .exec( function ( err, users ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var teams = {};
        var currentJob;

        for ( var i = 0, il = users.length; i < il; i ++ ) {

            currentJob = users[ i ].eLink.history[ users[ i ].eLink.history.length - 1 ];
            teams[ currentJob.company ] = teams[ currentJob.company ] || [];
            teams[ currentJob.company ].push( users[ i ].uid );

        }

        for ( var i = 0, il = users.length; i < il; i ++ ) {

            currentJob = users[ i ].eLink.history[ users[ i ].eLink.history.length - 1 ];
            users[ i ].contactsGroups[0].users = teams[ currentJob.company ].filter( function ( value ) { return value !== users[ i ].uid; } );

            users[ i ].save( function ( err ) {} );

        }

        return callback( null, { success: true } );

    });

};

//

function updateRedisRecord ( user, session ) {

    redisDB.get( session, function ( err, data ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! data ) {

            return callback({ code: 3, message: 'Provided session is not correct.' });

        }

        data = JSON.parse( data );
        data.role = user.roles;

        //

        redisDB.set( session, JSON.stringify( data ) );

    });

};

//

module.exports = Users;
