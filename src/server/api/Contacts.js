/*
 * @author ohmed
 * Users contacts service api
*/

var core = require('./../core/users/Contacts.js');

//

var Contacts = {
    groups:     {}
};

Contacts.addContact = function ( req, res ) {

    var userList = req.body.userList || [];
    var uid = req.cookies.uid || req.body.uid;

    if ( ! userList.length ) {

        return res.send({ code: 1, message: 'You need to specify userList of uid`s.' });

    }

    //

    core.add( uid, userList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Contacts.removeContact = function ( req, res ) {

    var userList = req.body.userList || [];
    var uid = req.cookies.uid || req.body.uid;

    if ( ! userList.length ) {

        return res.send({ code: 1, message: 'You need to specify userList of uid`s.' });

    }

    //

    core.remove( uid, userList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Contacts.getContactsList = function ( req, res ) {

    var params = {};

    params.uid = req.cookies.uid || req.query.uid;
    params.userId = req.query.userId;
    params.type = req.query.type;
    params.gid = req.query.gid;
    params.search = req.query.search;
    params.offset = + req.query.offset || 0;
    params.itemsPerPage = + req.query.itemsPerPage || 10;
    params.sortattr = req.query.sortattr;
    params.sortdir = req.query.sortdir;
    //

    core.getList( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send({ message: result });

    });

};

Contacts.getGeneralStatsInfo = function ( req, res ) {

    var userId = req.query.userId;
    var sortattr = req.query.sortattr;
    var sortdir = req.query.sortdir;

    //

    core.getGeneralStatsInfo( userId, sortattr, sortdir, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Contacts.follow = function ( req, res ) {

    var userList = req.body.userList || [];
    var uid = req.cookies.uid || req.body.uid;

    //

    core.follow( uid, userList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Contacts.unfollow = function ( req, res ) {

    var userList = req.body.userList || [];
    var uid = req.cookies.uid || req.body.uid;

    //

    core.unfollow( uid, userList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

// Contact groups

Contacts.groups.getList = function ( req, res ) {

    var userId = req.query.userId;

    //

    core.groups.getList( userId, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Contacts.groups.create = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var name = req.body.name;

    //

    core.groups.create( uid, name, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Contacts.groups.remove = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var groupId = req.body.groupId;

    //

    core.groups.remove( uid, groupId, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Contacts.groups.addContacts = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var usersList = req.body.usersList;
    var groupId = req.body.groupId;

    //

    core.groups.addContacts( uid, groupId, usersList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

Contacts.groups.removeContacts = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var usersList = req.body.usersList;
    var groupId = req.body.groupId;

    //

    core.groups.removeContacts( uid, groupId, usersList, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ message: result });

    });

};

//

module.exports = Contacts;
