/*
 * @author ohmed
 * Core methods for auth
*/

var utils = require('./Utils.js');
var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var Users = require('./../users/Users.js');

//

var AuthCore = {};

AuthCore.ifUserExists = function ( username, callback ) {

    UserModel
    .findOne({
        '$or': [
            { username:     username },
            { email:        username }
        ]
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback( null, { success: true, user: false } );

        }

        return callback( null, { success: true, user: { uid: user.uid, userpic: user.userpic || '', initials: user._fullName.split(' ')[0][0] + user._fullName.split(' ')[1][0] } } );

    });

};

AuthCore.login = function ( email, password, callback ) {

    UserModel
    .findOne({
        '$or': [
            {
                email:      email
            },
            {
                username:   email
            }
        ]
    })
    .populate('eLink')
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with this email not found.' });

        }

        //

        var passwordHashData = utils.passwordHashing( password, user.salt );
        var hashedPass = passwordHashData.passwordHash;

        if ( user.hash !== hashedPass && hashedPass ) {

            return callback({ code: 2, message: 'Wrong password.' } );

        }

        if ( user.disabled ) {

            return callback({ code: 3, message: 'Account is disabled.' });

        }

        //

        var currentSession = utils.generateKey();

        user.sessions.push( currentSession );

        user.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            redisDB.set( currentSession, JSON.stringify({
                expiration:     new Date(),
                uid:            user.uid,
                role:           user.roles,
                firstName:      ( user.eid ) ? user.eid.firstName : '',
                lastName:       ( user.eid ) ? user.eid.lastName : '',
                username:       user.username || '',
                email:          user.email || '',
                status:         user.status,
                userpic:        user.userpic
            }) );

            return callback( null, {
                uid:            user.uid,
                session:        currentSession,
                role:           user.roles,
                firstName:      ( user.eid ) ? user.eid.firstName : '',
                lastName:       ( user.eid ) ? user.eid.lastName : '',
                username:       user.username || '',
                email:          user.email || '',
                status:         user.status,
                userpic:        user.userpic
            } );

        });

    });

};

AuthCore.altLogin = function ( params, callback ) {

    var query = false;

    if ( params.facebookid ) query = { facebookid: params.facebookid };
    if ( params.googleid ) query = { googleid: params.googleid };
    if ( params.linkedinid ) query = { linkedinid: params.linkedinid };

    UserModel.findOne( query )
    .populate('eLink')
    .exec( function ( err, user ) {

        if ( err ) return callback( err );

        if ( !user ) {

            Users.createAlt( params, function ( error, newUser ) {

                user = newUser;

                var currentSession = utils.generateKey();

                user.sessions.push( currentSession );

                user.save( function ( err ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    //

                    redisDB.set( currentSession, JSON.stringify({
                        expiration:     new Date(),
                        uid:            user.uid,
                        role:           user.roles,
                        firstname:      '',
                        lastName:       '',
                        username:       user.username,
                        email:          user.email
                    }) );

                    return callback( null, {
                        uid:            user.uid,
                        session:        currentSession,
                        role:           user.roles,
                        firstname:      '',
                        lastName:       '',
                        username:       user.username,
                        email:          user.email
                    } );

                });

            });

        } else {

            var currentSession = utils.generateKey();

            user.sessions.push( currentSession );

            user.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                //

                redisDB.set( currentSession, JSON.stringify({
                    expiration:     new Date(),
                    uid:            user.uid,
                    role:           user.roles,
                    firstname:      '',
                    lastName:       '',
                    username:       user.username,
                    email:          user.email,
                    userpic:        user.userpic
                }) );

                return callback( null, {
                    uid:            user.uid,
                    session:        currentSession,
                    role:           user.roles,
                    firstname:      '',
                    lastName:       '',
                    username:       user.username,
                    email:          user.email,
                    userpic:        user.userpic
                } );

            });

        }

    });

};

AuthCore.register = function ( params, callback ) {

    Users.create( params, callback );

};

AuthCore.logout = function ( uid, session, callback ) {

    AuthCore.checkSesson( uid, session, function ( err ) {

        if ( err ) {

            return callback( err );

        }

        UserModel
        .findOne({
            uid:    uid
        })
        .exec( function ( err, user ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            if ( ! user ) {

                return callback({ code: 1, message: 'User with this email not found.' });

            }

            //

            var newSessionList = [];
            for ( var i = 0, il = user.sessions.length; i < il; i ++ ) {

                if ( user.sessions[ i ] === session ) continue;
                newSessionList.push( user.sessions[ i ] );

            }

            user.sessions = newSessionList;

            user.save( function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                redisDB.del( session, function ( err, data ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    return callback( null );

                });

            });

        });

    });

};

AuthCore.checkSesson = function ( uid, session, callback ) {

    if ( ! session ) {

        return callback({ code: 1, message: 'Provided session is not correct.' });

    }

    redisDB.get( session, function ( err, data ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! data ) {

            return callback({ code: 3, message: 'Provided session is not correct.' });

        }

        data = JSON.parse( data );

        if ( data.uid === uid ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, {
                permissions: RolesList.combineRolePermissions( data.role ),
                user: {
                    uid:        data.uid,
                    firstName:  data.firstName,
                    lastName:   data.lastName,
                    username:   data.username,
                    email:      data.email,
                    status:     data.status,
                    userpic:    data.userpic
                }
            });

        } else {

            return callback({ code: 3, message: 'Provided session or uid is not correct.' });

        }

    });

};

//

module.exports = AuthCore;
