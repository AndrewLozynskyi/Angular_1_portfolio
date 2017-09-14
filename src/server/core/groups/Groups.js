/*
 * @author ohmed
 * Groups management sys
*/

var GroupSchema = require( './../../db/mongo/schemas/Group.js' );
var GroupModel = MongoDB.mongoose.model( 'Group', GroupSchema );

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var RoleSchema = require('./../../db/mongo/schemas/Role.js');
var RoleModel = MongoDB.mongoose.model( 'Role', RoleSchema );

var Users = require('./../users/Users.js');

//

var Groups = {};

Groups.create = function ( name, isDefault, callback ) {

    GroupModel
    .findOne({
        name:   name
    })
    .exec( function ( err, group ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( group ) {

            return callback({ code: 1, message: 'Group with name \'' + name + '\' already exists.' });

        }

        //

        GroupModel
        .create({
            name:       name,
            default:    isDefault
        }, function ( err, group ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { groupId: group.groupId } );

        });

    });

};

Groups.update = function ( gid, name, callback ) {

    // todo
    callback( null, {} );

};

Groups.remove = function ( gid, callback ) {

    GroupModel
    .findOne({
        groupId:   gid
    })
    .exec( function ( err, group ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! group ) {

            return callback({ code: 1, message: 'Group with id \'' + gid + '\' not found.' });

        }

        if ( group.default ) {

            return callback({ code: 1, message: 'Group with id \'' + gid + '\' is default and can\'t be deleted.' });

        }

        group.remove( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null );

        });

    });

};

Groups.createDefault = function ( callback ) {

    var createdEntities = 0;
    var totalEntityies = 7;

    //

    Groups.create( 'Active', true, groupCreatedCallback );
    Groups.create( 'Inactive', true, groupCreatedCallback );
    Groups.create( 'Expired soon', true, groupCreatedCallback );
    Groups.create( 'Expired', true, groupCreatedCallback );
    Groups.create( 'Newcomers', true, groupCreatedCallback );
    Groups.create( 'Activated', true, groupCreatedCallback );
    Groups.create( 'Deactivated', true, groupCreatedCallback );

    //

    function groupCreatedCallback ( err ) {

        if ( err && err.code === 0 ) {

            return callback({ code: 0, message: err });

        }

        //

        createdEntities ++;

        if ( createdEntities === totalEntityies ) {

            return callback( null );

        }

    };

};

Groups.addUsers = function ( gid, usersUidList, callback, clear ) {

    var errors = [];
    var updatedUsersCount = 0;

    //

    GroupModel
    .findOne({
        groupId: gid
    })
    .exec( function ( err, group ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! group ) {

            return callback({ code: 1, message: 'Group with id \'' + gid + '\' not found.' });

        }

        //

        if ( ! clear ) {

            group.users = group.users || [];

        } else {

            group.users = [];

        }

        UserModel
        .find({
            uid: {
                '$in':  usersUidList
            }
        })
        .exec( function ( err, users ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            // updating group & users data

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                if ( group.users.indexOf( users[ i ].uid ) === -1 ) {

                    group.users.push( users[ i ].uid );

                } else {

                    errors.push( 'Group already has user with id: \'' + users[ i ].uid + '\'.' );

                }

                users[ i ].groups = users[ i ].groups || [];

                if ( users[ i ].groups.indexOf( gid ) == -1 ) {

                    users[ i ].groups.push( gid );

                }

            }

            // saving group & users changes to DB

            group.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                for ( var i = 0, il = users.length; i < il; i ++ ) {

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

        });

    });

};

Groups.removeUsers = function ( gid, usersUidList, callback ) {

    var errors = [];
    var updatedUsersCount = 0;

    //

    GroupModel
    .findOne({
        groupId: gid
    })
    .exec( function ( err, group ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! group ) {

            return callback({ code: 1, message: 'Group with id \'' + gid + '\' not found.' });

        }

        //

        group.users = group.users || [];

        UserModel
        .find({
            uid: {
                '$in':  usersUidList
            }
        })
        .exec( function ( err, users ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            // updating group & users data

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                if ( group.users.indexOf( users[ i ].uid ) !== -1 ) {

                    group.users = group.users.filter( function ( value ) { return value !== users[ i ].uid; } );

                } else {

                    errors.push( 'Group already don\'t have user with id: \'' + users[ i ].uid + '\'.' );

                }

                users[ i ].groups = users[ i ].groups || [];
                users[ i ].groups = users[ i ].groups.filter( function ( value ) { return value !== gid; } );

            }

            // saving group & users changes to DB

            group.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                for ( var i = 0, il = users.length; i < il; i ++ ) {

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

        });

    });

};

Groups.addRole = function ( gid, roleId, callback ) {

    GroupModel
    .findOne({
        groupId: gid
    })
    .exec( function ( err, group ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! group ) {

            return callback({ code: 1, message: 'Group with id \'' + gid + '\' not found.' });

        }

        RoleModel
        .findOne({ roleId: roleId })
        .exec( function ( err, role ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            if ( ! role ) {

                return callback({ code: 1, message: 'Role with id \'' + roleId + '\' not found.' });

            }

            // adding roleId to group.roles list

            for ( var i = 0, il = group.roles.length; i < il; i ++ ) {

                if ( group.roles[ i ] === roleId ) {

                    return callback({ code: 2, message: 'Group with id \'' + gid + '\' already has this role assigned.' });

                }

            }

            group.roles.push( roleId );

            //

            group.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                // adding group id to role.groups list

                role.groups.push( gid );

                role.save( function ( err ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    // adding all users to role

                    Users.addRole( roleId, group.users, function ( err, result ) {

                        if ( err ) {

                            return callback({ code: 0, message: err });

                        }

                        callback( null, { success: true } );

                    });

                });

            });

        });

    });

};

Groups.removeRole = function ( gid, roleId, callback ) {

    GroupModel
    .findOne({
        groupId: gid
    })
    .exec( function ( err, group ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! group ) {

            return callback({ code: 1, message: 'Group with id \'' + gid + '\' not found.' });

        }

        RoleModel
        .findOne({ roleId: roleId })
        .exec( function ( err, role ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            if ( ! role ) {

                return callback({ code: 1, message: 'Role with id \'' + roleId + '\' not found.' });

            }

            if ( role.groups.indexOf( gid ) === -1 ) {

                return callback({ code: 2, message: 'Role with id \'' + roleId + '\' already doesn\'t have group id: ' + gid + ' assigned to it.' });

            }

            group.roles = group.roles.filter( function ( value ) { return value !== roleId; } );

            //

            group.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                role.groups = role.groups.filter( function ( value ) { return value !== gid; } );

                role.save( function ( err ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    // adding all users to role

                    Users.removeRole( roleId, group.users, function ( err, result ) {

                        if ( err ) {

                            return callback({ code: 0, message: err });

                        }

                        callback( null, { success: true } );

                    });

                });

            });

        });

    });

};

Groups.getList = function ( callback ) {

    GroupModel
    .find({ default: false }, { _id: false, __v: false })
    .exec( function ( err, groups ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var result = [];

        for ( var i = 0, il = groups.length; i < il; i ++ ) {

            result.push({
                groupId:        groups[ i ].groupId,
                name:           groups[ i ].name,
                description:    groups[ i ].description || '',
                default:        groups[ i ].default,
                roles:          groups[ i ].roles,
                users:          groups[ i ].users
            });

        }

        //

        return callback( null, { groups: result } );

    });

};

Groups.filterToDefaultGroup = function ( callback ) {

    GroupModel
    .find({ default: true })
    .exec( function ( err, groups ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var active = { gid: false, users: [] };
        var inactive = { gid: false, users: [] };
        var expired = { gid: false, users: [] };
        var expiredSoon = { gid: false, users: [] };
        var newcomers = { gid: false, users: [] };
        var activated = { gid: false, users: [] };
        var deactivated = { gid: false, users: [] };

        for ( var i = 0; i < groups.length; i ++ ) {

            if ( groups[ i ].name === 'Active' ) active.gid = groups[ i ].groupId;
            if ( groups[ i ].name === 'Inactive' ) inactive.gid = groups[ i ].groupId;
            if ( groups[ i ].name === 'Expired' ) expired.gid = groups[ i ].groupId;
            if ( groups[ i ].name === 'Expired soon' ) expiredSoon.gid = groups[ i ].groupId;
            if ( groups[ i ].name === 'Newcomers' ) newcomers.gid = groups[ i ].groupId;
            if ( groups[ i ].name === 'Activated' ) activated.gid = groups[ i ].groupId;
            if ( groups[ i ].name === 'Deactivated' ) deactivated.gid = groups[ i ].groupId;

        }

        //

        UserModel
        .find()
        .populate('eLink')
        .exec( function ( err, users ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            var dateNow = new Date();

            for ( var i = 0; i < users.length; i ++ ) {

                var activeBool = true;
                var expiredBool = false;

                var employee = users[ i ].eLink || {};
                var lastJob = ( employee.history || [] ).pop();

                if ( lastJob ) {

                    var jobStartDate = new Date( lastJob.jobStartDate );

                    if ( jobStartDate > dateNow ) {

                        newcomers.users.push( users[ i ].uid );

                    }

                    var jobEndDate = new Date( lastJob.jobEndDate );

                    if ( lastJob.jobEndDate ) {

                        if ( jobEndDate < dateNow ) {

                            expired.users.push( users[ i ].uid );
                            activeBool = false;
                            expiredBool = true;

                        } else {

                            var jobEndDate = new Date( lastJob.jobEndDate );
                            var jobEndDate15 = new Date( jobEndDate.getFullYear(), jobEndDate.getMonth(), jobEndDate.getDay() - 15 );

                            if ( jobEndDate15 < dateNow ) {

                                expiredSoon.users.push( users[ i ].uid );

                            }

                        }

                    }

                    if ( new Date( lastJob.absenceFrom ) < dateNow && dateNow < new Date( lastJob.absenceTo ) ) {

                        inactive.users.push( users[ i ].uid );
                        activeBool = false;

                    }

                    if ( ! expiredBool ) {

                        if ( users[ i ].disabled === true ) {

                            deactivated.users.push( users[ i ].uid );
                            activeBool = false;

                        } else {

                            activated.users.push( users[ i ].uid );

                        }

                    }

                }

                if ( activeBool ) {

                    active.users.push( users[ i ].uid );

                }

            }

            //

            var saveCount = 0;

            Groups.addUsers( active.gid, active.users, saveDefaultGroupCallback, true );
            Groups.addUsers( inactive.gid, inactive.users, saveDefaultGroupCallback, true );
            Groups.addUsers( expired.gid, expired.users, saveDefaultGroupCallback, true );
            Groups.addUsers( expiredSoon.gid, expiredSoon.users, saveDefaultGroupCallback, true );
            Groups.addUsers( newcomers.gid, newcomers.users, saveDefaultGroupCallback, true );
            Groups.addUsers( activated.gid, activated.users, saveDefaultGroupCallback, true );
            Groups.addUsers( deactivated.gid, deactivated.users, saveDefaultGroupCallback, true );

            //

            function saveDefaultGroupCallback ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                saveCount ++;

                if ( saveCount === 7 ) {

                    return callback( null );

                }

            };

        });

    });

};

//

module.exports = Groups;
