/*
 * @author ohmed
 * Users service api
*/

var core = require('./../core/users/Users.js');
var profile = require('./../core/users/Profile.js');
var settings = require('./../core/users/Settings.js');

//

var Users = {
    profile:    {},
    settings:   {}
};

Users.getScope = function ( req, res, next ) {

    var uid = req.cookies.uid || req.query.uid;

    //

    core.getScope( uid, function ( err, scopes ) {

        if ( err ) {

            return res.send( err );

        }

        //

        req.scopes = scopes;

        return next();

    });

};

Users.create = function ( req, res ) {

    var params = {};

    params.eid = req.body.eid;
    params.username = req.body.username;
    params.password = req.body.password;
    params.email = req.body.email;

    //

    core.create( params, function ( err, user ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, uid: user.uid });

    });

};

Users.remove = function ( req, res ) {

    var uid = req.query.uid;

    //

    core.remove( uid, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Users.update = function ( req, res ) {

    var params = req.body.params;

    //

    core.update( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Users.getList = function ( req, res ) {

    var offset = + req.query.offset || 0;
    var size = + req.query.size || 10;
    var roleId = + req.query.roleId;
    var groupId = + req.query.groupId;
    var search = req.query.search || false;
    var sortattr = req.query.sortattr;
    var sortdir = req.query.sortdir;

    if ( typeof roleId !== 'number' || isNaN( roleId ) ) roleId = false;
    if ( typeof groupId !== 'number' || isNaN( groupId ) ) groupId = false;

    //

    core.getList( offset, size, roleId, groupId, search, sortattr, sortdir, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, message: result });

    });

};

Users.addRole = function ( req, res ) {

    var usersList = req.body.usersList;
    var roleId = + req.body.roleId;

    if ( roleId === undefined || roleId === false ) {

        return res.send({ code: 1, message: 'RoleId field shouldn`t be empty.' })

    }

    //

    core.addRole( roleId, usersList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send({ success: true, message: result });

    });

};

Users.removeRole = function ( req, res ) {

    var usersList = req.body.usersList;
    var roleId = + req.body.roleId;

    if ( roleId === undefined || roleId === false ) {

        return res.send({ code: 1, message: 'RoleId field shouldn`t be empty.' })

    }

    //

    core.removeRole( roleId, usersList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send({ success: true, message: result });

    });

};

Users.updateSupervisorsRoles = function ( req, res ) {

    core.updateSupervisorsRoles( function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Users.getGeneralStatsInfo = function ( req, res ) {

    var roleId = req.query.roleId || false;

    //

    core.getGeneralStatsInfo( roleId, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Users.getRolePermissionsUpdateToken = function ( req, res ) {

    var uid = req.query.uid;
    var password = req.query.password;

    core.getRolePermissionsUpdateToken( uid, password, function ( err, token ) {

        if ( err ) {

            return res.send( err );

        }

        res.cookie( 'rolePermissionsUpdateToken', token );

        return res.send({ success: true, message: { token: token } });

    });

};

Users.isRolePermissionsUpdateTokenValid = function ( req, res ) {

    var uid = req.query.uid;
    var token = req.query.token;

    core.isRolePermissionsUpdateTokenValid( uid, token, function ( err, result ) {

        if ( err ) {

            return res.send( err )

        }

        return res.send( result );

    });

};

Users.setActivationStatus = function ( req, res ) {

    var usersList = req.body.usersList;
    var activationStatus = ( req.body.status === 'active' ) ? true : false;

    //

    core.setActivationStatus( usersList, activationStatus, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Users.setStatus = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var status = req.body.status;

    //

    core.setStatus( uid, status, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        redisDB.get( req.cookies.session, function ( err, data ) {

            if ( err ) {

                return res.send( err );

            }

            if ( ! data ) {

                return res.send({ code: 3, message: 'Provided session is not correct.' });

            }

            data = JSON.parse( data );
            data.status = status;

            redisDB.set( req.cookies.session, JSON.stringify( data ) );

        });

        return res.send({ result: result });

    });

};

Users.updateProfileInfo = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var info = req.body.info;

    //

    core.updateProfileInfo( uid, info, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Users.setUserpic = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var session = req.cookies.session || req.body.session;
    var userpic = req.body.userpic.replace( /^data:image\/png;base64,/, '' );

    if ( ! userpic ) {

        return res.send({ code: 0, message: 'Userpic image file not specified.' });

    }

    //

    core.setUserpic( uid, userpic, session, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Users.removeUserpic = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var session = req.cookies.session || req.body.session;

    //

    core.removeUserpic( uid, session, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

// User settings

Users.settings.get = function ( req, res ) {

    var uid = req.cookies.uid || req.query.uid;

    //

    settings.get( uid, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result );

    });

};

Users.settings.set = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var params = req.body.params || {};
    if ( typeof params === 'string' ) params = JSON.parse( params );

    //

    settings.set( uid, params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send({ success: true });

    });

};

// User profile

Users.profile.getInfo = function ( req, res ) {

    var userId = req.query.userId;
    var uid = req.cookies.uid || req.query.uid;
    var username = req.query.username;

    //

    profile.getInfo( uid, userId, username, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, message: result });

    });

};

Users.profile.updateGeneralInfo = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var info = req.body.info || {};

    //

    profile.updateGeneralInfo( uid, info, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Users.profile.updateContactsInfo = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var info = req.body.info || {};

    //

    profile.updateContactsInfo( uid, info, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Users.profile.updateSocialLinksInfo = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var info = req.body.info || {};

    //

    profile.updateSocialLinksInfo( uid, info, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Users.profile.updateJobSkills = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var jobId = req.body.jobId;
    var skillsList = req.body.skillsList || [];

    if ( jobId === undefined ) {

        return res.send({ code: 0, message: 'JobId not specified.' });

    }

    //

    profile.updateJobSkills( uid, jobId, skillsList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Users.profile.addSocialNetwork = function ( req, res ) {

    var userId = req.body.userId;
    var info = req.body.profileInSN;

    if ( ! userId ) {

        return res.send({ code: 0, message: 'You need to specify userId param.' });

    }

    //

    profile.addSocialNetwork( userId, info, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result );

    });

};

Users.profile.addCourse = function ( req, res ) {

    var userId = req.body.userId;
    var course = req.body.course;

    if ( ! userId ) {

        return res.send({ code: 0, message: 'You need to specify userId param.' });

    }

    //

    profile.addCourse( userId, course, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result );

    });

};

Users.profile.removeCourse = function ( req, res ) {

    var userId = req.body.userId;
    var courseId = req.body.courseId;

    if ( ! userId ) {

        return res.send({ code: 0, message: 'You need to specify userId param.' });

    }

    if ( ! courseId ) {

        return res.send({ code: 0, message: 'You need to specify courseId param.' });

    }

    //

    profile.removeCourse( userId, courseId, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result );

    });

};

Users.profile.uploadCourseCertificate = function ( req, res ) {

    // todo

};

//

module.exports = Users;
