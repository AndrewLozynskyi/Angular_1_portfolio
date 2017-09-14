/*
 * @author ohmed
 * App roles manager
*/

var RoleSchema = require('./../../db/mongo/schemas/Role.js');
var RoleModel = MongoDB.mongoose.model( 'Role', RoleSchema );

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var GroupSchema = require( './../../db/mongo/schemas/Group.js' );
var GroupModel = MongoDB.mongoose.model( 'Group', GroupSchema );

var DefaultRoles = require('./default-roles/DefaultRoles.js');

//

var Roles = {};

Roles.create = function ( name, description, permanent, permissions, scope, callback ) {

    var params = {
        name:           name,
        description:    description,
        permissions:    permissions || {},
        permanent:      ( permanent === Roles.Permanent ),
        scope:          scope
    };

    //

    RoleModel
    .findOne({
        name:      name
    })
    .exec( function ( err, role ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( role ) {

            return callback({ code: 1, message: 'Role with such name already exists.' });

        }

        RoleModel
        .create( params, function ( err, role ) {

            if ( err ) {

                return callback( err );

            }

            role = JSON.parse( JSON.stringify( role ) );

            delete role._id;
            delete role.__v;

            Roles.updateCache();
            return callback( null, role );

        });

    });

};

Roles.remove = function ( roleId, callback ) {

    RoleModel
    .findOne({ roleId: roleId })
    .exec( function ( err, role ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! role ) {

            return callback({ code: 1, message: 'Role with Id [' + roleId + '] not found.' })

        }

        if ( role.permanent ) {

            return callback({ code: 1, message: 'Role with Id [' + roleId + '] is permanent, it can`t be deleted.' })

        }

        role.remove( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            Roles.updateCache();

            return callback( null );

        });

    });

};

Roles.updateGeneral = function ( roleId, name, description, callback ) {

    RoleModel.findOne({
        roleId: roleId
    })
    .exec( function ( err, role ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! role ) {

            return callback({ code: 1, message: 'Role with Id [' + roleId + '] not found.' })

        }

        //

        role.name = name;
        role.description = description;

        role.save( function ( err, updatedRole ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            Roles.updateCache();
            return callback();

        });

    });

};

Roles.updatePermissions = function ( roleId, permissions, callback ) {

    RoleModel.findOne({
        roleId: roleId
    })
    .exec( function ( err, role ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! role ) {

            return callback({ code: 1, message: 'Role with Id [' + roleId + '] not found.' })

        }

        role.permissions = permissions;

        role.save( function ( err, updatedRole ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            Roles.updateCache();
            return callback();

        });

    });

};

Roles.updateScope = function ( roleId, scope, callback ) {

    RoleModel.findOne({
        roleId: roleId
    })
    .exec( function ( err, role ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! role ) {

            return callback({ code: 1, message: 'Role with Id [' + roleId + '] not found.' })

        }

        //

        if ( scope.basedOn !== 'country' && scope.basedOn !== 'department' && scope.basedOn !== 'country-department' && scope.basedOn !== 'hierarchy' && scope.basedOn !== 'no-restriction' ) {

            return callback({ code: 1, message: 'Unknown \'based on\' type \'' + scope.basedOn + '.' })

        }

        role.scope.basedOn = scope.basedOn;
        role.scope.countries = scope.countries;
        role.scope.departments = scope.departments;

        //

        role.save( function ( err, updatedRole ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            Roles.updateCache();
            return callback( null, { success: true } );

        });

    });

};

Roles.getList = function ( callback ) {

    RoleModel
    .find( {}, '-_id' )
    .exec( function ( err, roles ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var result = [];

        for ( var i = 0, il = roles.length; i < il; i ++ ) {

            result.push({
                roleId:         roles[ i ].roleId,
                name:           roles[ i ].name,
                permissions:    roles[ i ].permissions,
                default:        roles[ i ].default,
                userCount:      roles[ i ].users.length,
                permanent:      roles[ i ].permanent,
                basedOn:        'no base'
            });

        }

        return callback( result );

    });

};

Roles.createDefault = function ( callback ) {

    var createdEntities = 0;
    var totalEntityies = 4;

    // create 'Super Admin' type entity

    Roles.create( 'SuperAdmin', '', Roles.Permanent, DefaultRoles.SuperAdmin.permissions,   '', roleCreatedCallback );

    // create 'Super User' type entity

    Roles.create( 'SuperUser',  '', Roles.Permanent, DefaultRoles.SuperUser.permissions,    '', roleCreatedCallback );

    // create 'DCHead' type entity

    Roles.create( 'DCHead',     '', Roles.Permanent, DefaultRoles.DCHead.permissions,       '', roleCreatedCallback );

    // create 'Finance' type entity

    Roles.create( 'Finance',    '', Roles.Permanent, DefaultRoles.Finance.permissions,      '', roleCreatedCallback );

    // create 'Manager' type entity

    Roles.create( 'Manager',    '', Roles.Permanent, DefaultRoles.Manager.permissions,      '', roleCreatedCallback );

    // create 'Employee' type entity

    Roles.create( 'Employee',   '', Roles.Permanent, DefaultRoles.Employee.permissions,     '', roleCreatedCallback );

    // create 'HR' type entity

    Roles.create( 'HR',         '', Roles.Permanent, DefaultRoles.HR.permissions,           '', roleCreatedCallback );

    //

    function roleCreatedCallback ( err, role ) {

        if ( err && err.code === 0 ) {

            return callback({ code: 0, message: err });

        }

        //

        createdEntities ++;

        if ( createdEntities === totalEntityies ) {

            Roles.updateCache();
            return callback( null );

        }

    };

};

Roles.getDetailes = function ( roleId, callback ) {

    RoleModel
    .findOne( { roleId: roleId }, { '_id': 0 } )
    .exec( function ( err, role ) {

        if ( err ) {

            return callback( { code: 0, message: err } );

        }

        if ( ! role ) {

            return callback( { code: 1, message: 'Role with id=\'' + roleId + '\' not found.' } );

        }

        return callback( null, role );

    });

};

Roles.getPermissions = function ( roleId, callback ) {

    RoleModel
    .findOne( { roleId: roleId }, {} )
    .exec( function ( err, role ) {

        if ( err ) {

            return callback( { code: 0, message: err } );

        }

        if ( ! role ) {

            return callback( { code: 1, message: 'Role with id=\'' + roleId + '\' not found.' } );

        }

        return callback( null, role.permissions );

    });

};

Roles.getUsers = function ( roleId, callback ) {

    UserModel
    .find({ roles: roleId })
    .populate('eLink')
    .exec( function ( err, users ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var result = [];

        for ( var i = 0, il = users.length; i < il; i ++ ) {

            var employee = users[ i ].eid || {};

            result.push({
                uid:        users[ i ].uid,
                email:      users[ i ].email || '',
                username:   users[ i ].username || '',
                fullName:   ( users[ i ].eid ) ? users[ i ].eid.firstName + users[ i ].eid.lastName : '',
                country:    employee.country || '',
                department: employee.department || ''
            });

        }

        return callback( null, result );

    });

};

Roles.getGroups = function ( roleId, offset, size, search, callback ) {

    GroupModel
    .find({
        roles:  roleId
    })
    .exec( function ( err, groups ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var result = [];
        var total = 0;

        for ( var i = 0, il = groups.length; i < il; i ++ ) {

            if ( search !== undefined && search !== false ) {

                if ( groups[ i ].name.indexOf( search ) !== -1 ) {

                    result.push({
                        groupId:        groups[ i ].groupId,
                        name:           groups[ i ].name,
                        description:    groups[ i ].description || '',
                        usersCount:     groups[ i ].users.length
                    });

                }

            } else {

                result.push({
                    groupId:        groups[ i ].groupId,
                    name:           groups[ i ].name,
                    description:    groups[ i ].description || '',
                    usersCount:     groups[ i ].users.length
                });

            }

        }

        total = result.length;
        result = result.slice( offset, size );

        //

        return callback( null, { success: true, groups: result, total: total } );

    });

};

// App roles cache manipulation

Roles.cachedList = {};

Roles.clearCache = function () {

    for ( var propName in Roles.cachedList ) {

        if ( typeof Roles.cachedList[ propName ] === 'function' ) continue;
        delete Roles.cachedList[ propName ];

    }

};

Roles.updateCache = function () {

    Roles.clearCache();

    //

    RoleModel
    .find( {}, '-_id' )
    .exec( function ( err, roles ) {

        if ( err ) {

            console.log( 'Some error happened during Roles cache update: ', err );
            return;

        }

        for ( var i = 0, il = roles.length; i < il; i ++ ) {

            Roles.cachedList[ roles[ i ].name ] = roles[ i ];

        }

    });

};

global.RolesList = Roles.cachedList;

global.RolesList.getIdByName = function ( name ) {

    for ( var roleName in Roles.cachedList ) {

        if ( roleName === name ) {

            return Roles.cachedList[ roleName ];

        }

    }

    return false;

};

global.RolesList.getById = function ( id ) {

    for ( var roleName in Roles.cachedList ) {

        if ( Roles.cachedList[ roleName ].roleId === id ) {

            return Roles.cachedList[ roleName ];

        }

    }

    return false;

};

global.RolesList.combineRolePermissions = function ( rolesIds ) {

    var permissions = {};

    for ( var i = 0, il = rolesIds.length; i < il; i ++ ) {

        var rolePermissions = ( RolesList.getById( rolesIds[ i ] ) ) ? RolesList.getById( rolesIds[ i ] ).permissions : {};
        rolePermissions = JSON.parse( JSON.stringify( rolePermissions ) );

        traversePermission( rolePermissions, permissions );

    }

    function traversePermission ( rolePermission, permission ) {

        for ( var item in rolePermission ) {

            if ( typeof rolePermission[ item ] === 'object' ) {

                permission[ item ] = permission[ item ] || {};
                traversePermission( rolePermission[ item ], permission[ item ] );

            } else {

                permission[ item ] = permission[ item ] || rolePermission[ item ] || false;

            }

        }

    };

    return permissions;

};

//

global.RolesList = Roles.cachedList;
Roles.Permanent = 1;

//

module.exports = Roles;
