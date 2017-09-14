/*
 * @author ohmed
 * App service api
*/

var app = require('./../core/app/App.js');

//

var App = {
    roles:      {},
    settings:   {},
};

// General

App.shutdown = function ( req, res ) {

    if ( req.query.auth !== 'ohmed' ) {

        return res.send('Bad auth.');

    }

    //

    app.shutdown( function ( err, result ) {

        if ( err ) {

            return res.send({ code: 0, message: err });

        }

        res.send({ success: true });

    });

};

// Roles management

App.roles.createDefault = function ( req, res ) {

    app.roles.createDefault( function ( err ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

App.roles.create = function ( req, res ) {

    var name = req.body.name;
    var description = req.body.description || '';
    var parentRoleId = req.body.parentRoleId || false;
    var scope = req.body.scope || '';

    //

    if ( ! name ) {

        return res.send({ code: 1, message: 'Role name shouldn`t be empty.' })

    }

    //

    app.roles.getPermissions( parentRoleId, function ( err, permissions ) {

        if ( err && err.code !== 1 ) {

            return res.send( err );

        }

        permissions = permissions || {};

        app.roles.create( name, description, false, permissions, scope, function ( err, role ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send({ success: true, role: role });

        });

    });

};

App.roles.remove = function ( req, res ) {

    var rolesIds = req.query.roleId.split(',');
    var removedRoles = 0;
    var errors = [];

    //

    for ( var i = 0, il = rolesIds.length; i < il; i ++ ) {

        app.roles.remove( + rolesIds[ i ], function ( err ) {

            removedRoles ++;

            if ( err ) {

                errors.push( err );

            }

            if ( removedRoles === rolesIds.length ) {

                return res.send({ success: true, errors: errors });

            }

        });

    }

};

App.roles.getList = function ( req, res ) {

    app.roles.getList( function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

App.roles.updateGeneral = function ( req, res ) {

    var roleId = req.body.roleId;
    var name = req.body.name;
    var description = req.body.description;

    //

    app.roles.updateGeneral( roleId, name, description, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

App.roles.updatePermissions = function ( req, res ) {

    var roles = req.body.roles;
    var updatedRoles = 0;
    var errors = [];

    //

    for ( var i = 0, il = roles.length; i < il; i ++ ) {

        app.roles.updatePermissions( + roles[ i ].roleId, roles[ i ].permissions, function ( err, result ) {

            updatedRoles ++;

            if ( err ) {

                errors.push( err );

            }

            if ( updatedRoles === roles.length ) {

                return res.send({ success: true, errors: errors });

            }

        });

    }

};

App.roles.updateScope = function ( req, res ) {

    var roles = req.body.roles;
    var updatedRoles = 0;
    var errors = [];

    //

    for ( var i = 0, il = roles.length; i < il; i ++ ) {

        app.roles.updateScope( + roles[ i ].roleId, roles[ i ].scope, function ( err, result ) {

            updatedRoles ++;

            if ( err ) {

                return res.send( err );

            }

            if ( updatedRoles === roles.length ) {

                return res.send({ success: true, errors: errors });

            }

        });

    }

};

App.roles.getDetailes = function ( req, res ) {

    var roleId = + req.query.roleId;

    app.roles.getDetailes( roleId, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

App.roles.getUsers = function ( req, res ) {

    var roleId = + req.query.roleId;
    var offset = + req.query.offset || 0;
    var size = + req.query.size || 10;
    var search = req.query.search || false;

    //

    app.roles.getUsers( roleId, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

App.roles.getGroups = function ( req, res ) {

    var roleId = + req.query.roleId;
    var offset = + req.query.offset || 0;
    var size = + req.query.size || 10000000;
    var search = req.query.search || false;

    //

    app.roles.getGroups( roleId, offset, size, search, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

// Settings management

App.settings.createDefault = function ( req, res ) {

    app.settings.createDefault( function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

App.settings.getParams = function ( req, res ) {

    app.settings.getParams( function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

App.settings.setParams = function ( req, res ) {

    var params = req.body.params || {};

    //

    app.settings.setParams( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

//

module.exports = App;
