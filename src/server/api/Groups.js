/*
 * @author ohmed
 * Groups service api
*/

var core = require('./../core/groups/Groups.js');

//

var Groups = {};

Groups.create = function ( req, res ) {

    var name = req.body.name;

    if ( ! name ) {

        return res.send({ code: 1, message: 'Group name shouldn\'t be empty' });

    }

    //

    core.create( name, false, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, message: result });

    });

};

Groups.update = function ( req, res ) {

    var groupId = + req.body.groupId;
    var name = req.body.name;

    //

    core.update( groupId, name, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Groups.remove = function ( req, res ) {

    var groupId = + req.query.groupId;

    //

    core.remove( groupId, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Groups.addUsers = function ( req, res ) {

    var groupId = + req.body.gid;
    var usersList = req.body.usersList || [];

    if ( groupId === undefined || groupId === false ) {

        return res.send({ code: 1, message: 'GroupId field shouldn`t be empty.' })

    }

    //

    core.addUsers( groupId, usersList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Groups.removeUsers = function ( req, res ) {

    var groupId = + req.body.gid;
    var usersList = req.body.usersList || [];

    //

    core.removeUsers( groupId, usersList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Groups.getList = function ( req, res ) {

    core.getList( function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, message: result.groups });

    });

};

Groups.addRole = function ( req, res ) {

    var groupsList = req.body.groupsList || [];
    var roleId = + req.body.roleId;

    var updatedGroups = 0;
    var errors = [];

    if ( ! groupsList.length ) {

        return res.send({ code: 1, message: 'Groups list is empty.' });

    }

    //

    for ( var i = 0, il = groupsList.length; i < il; i ++ ) {

        core.addRole( + groupsList[ i ], roleId, function ( err, result ) {

            updatedGroups ++;

            if ( err ) {

                errors.push( err );

            }

            if ( groupsList.length === updatedGroups ) {

                return res.send({ success: true, errors: errors });

            }

        });

    }

};

Groups.removeRole = function ( req, res ) {

    var groupsList = req.body.groupsList || [];
    var roleId = + req.body.roleId;

    var updatedGroups = 0;
    var errors = [];

    if ( ! groupsList.length ) {

        return res.send({ code: 1, message: 'Groups list is empty.' });

    }

    //

    for ( var i = 0, il = groupsList.length; i < il; i ++ ) {

        core.removeRole( + groupsList[ i ], roleId, function ( err, result ) {

            updatedGroups ++;

            if ( err ) {

                errors.push( err );

            }

            if ( groupsList.length === updatedGroups ) {

                return res.send({ success: true, errors: errors });

            }

        });

    }

};

Groups.createDefault = function ( req, res ) {

    core.createDefault( function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

//

module.exports = Groups;
