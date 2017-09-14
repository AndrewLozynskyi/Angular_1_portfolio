/*
 * @author ohmed
 * Admin manager
*/

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var RoleSchema = require('./../../db/mongo/schemas/Role.js');
var RoleModel = MongoDB.mongoose.model( 'Role', RoleSchema );

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

//

var Admin = {};

Admin.getGeneralData = function ( params, callback ) {

    getRolesCount( function ( err, rolesCount ) {

        if ( err ) {

            return callback( err );

        }

        //

        getUserCount( function ( err, usersCount ) {

            if ( err ) {

                return callback( err );

            }

            //

            getActivity( function ( err, activity ) {

                if ( err ) {

                    return callback( err );

                }

                //

                return callback( null, { success: true, stats: { rolesCount: rolesCount, usersCount: usersCount, activity: activity } } );

            });

        });

    });

};

// internal function

function getRolesCount ( callback ) {

    RoleModel
    .find()
    .exec( function ( err, roles ) {

        if ( err ) {

            return callback( err );

        }

        //

        return callback( null, roles.length );

    });

};

function getUserCount ( callback ) {

    UserModel
    .find()
    .exec( function ( err, users ) {

        if ( err ) {

            return callback( err );

        }

        //

        return callback( null, users.length );

    });

};

function getActivity ( callback ) {

    // todo
    return callback( null, [] );

};

//

module.exports = Admin;
