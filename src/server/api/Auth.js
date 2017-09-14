/*
 * @author ohmed
 * Auth service api
*/

var core = require('./../core/auth/Auth.js');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;

//

var Auth = {};

Auth.ifUsernameExists = function ( req, res ) {

    var username = req.query.username;

    //

    core.ifUserExists( username, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Auth.login = function ( req, res ) {

    var email = req.body.email;
    var password = req.body.password;

    core.login( email, password, function ( err, result ) {

        if ( err ) {

            return res.send({ code: 0, message: err });

        }

        //

        res.cookie( 'email', email );
        res.cookie( 'uid', result.uid );
        res.cookie( 'session', result.session );

        return res.send({
            uid: result.uid,
            session: result.session,
            role: result.role
        });

    });

};

Auth.loginfb = function ( req, res, next ) {

    return passport.authenticate('facebook');

};

Auth.loginfbcb = function ( req, res, next ) {

    passport.authenticate('facebook', { failureRedirect: '/login' } , function ( err, user ) {

        if ( err ) {

            return next( err );

        }

        if ( ! user ) {

            return res.redirect('/login');

        }

        //

        res.cookie( 'uid', user.uid );
        res.cookie( 'session', user.session );

        //

        return res.redirect('/dashboard');

    })( req, res, next );

};

Auth.logingg = function ( req, res ) {

    return passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] });

};

Auth.loginggcb = function ( req, res, next ) {

    passport.authenticate('google', { failureRedirect: '/login' }, function ( err, user ) {

        if ( err ) {

            return next( err );

        }

        if ( ! user ) {

            return res.redirect('/login');

        }

        //

        res.cookie( 'uid', user.uid );
        res.cookie( 'session', user.session );

        //

        return res.redirect('/dashboard');

    })( req, res, next );

};

Auth.loginli = function ( req, res ) {

    return passport.authenticate('linkedin');

};

Auth.loginlicb = function ( req, res, next ) {

    passport.authenticate('linkedin', { failureRedirect: '/login' }, function ( err, user ) {

        if ( err ) {

            return next( err );

        }

        if ( ! user ) {

            return res.redirect('/login');

        }

        //

        res.cookie( 'uid', user.uid );
        res.cookie( 'session', user.session );

        //

        return res.redirect('/dashboard');

    })( req, res, next );

};

//

Auth.register = function ( req, res ) {

    var params = {
        eid:        req.body.eid,
        username:   req.body.username,
        email:      req.body.email,
        password:   req.body.password
    };

    core.register( params, function ( err, result ) {

        if ( err ) {

            return res.send({ code: 0, message: err });

        }

        return res.send({ message: result });

    });

};

Auth.logout = function ( req, res ) {

    var uid = req.cookies.uid || req.query.uid;
    var session = req.cookies.session || req.query.session;

    if ( ! uid ) {

        return res.send({ err: 1, message: 'You need to specify user UID.' });

    }

    if ( ! session ) {

        return res.send({ err: 2, message: 'You need to specify user session.' });

    }

    //

    core.logout( uid, session, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: 'success' });

    });

};

// Setup passport for social auth

passport.use( new FacebookStrategy( environment.social.facebook, function ( accessToken, refreshToken, profile, done ) {

    profile.facebookid = profile.id;

    core.altLogin( profile, function ( err, result ) {

        if ( err ) {

            return done( err );

        }

        return done( null, result );

    });

}));

passport.use( new GoogleStrategy( environment.social.google, function ( accessToken, refreshToken, profile, done ) {

    profile.googleid = profile.id;

    core.altLogin( profile, function ( err, result ) {

        if ( err ) {

            return done( err );

        }

        return done( null, result );

    });

}));

passport.use( new LinkedInStrategy( environment.social.linkedin, function ( token, tokenSecret, profile, done ) {

    profile.linkedinid = profile.id;

    core.altLogin( profile, function ( err, result ) {

        if ( err ) {

            return done( err );

        }

        return done( null, result );

    });

}));

//

module.exports = Auth;
