/*
 * @author ohmed
 * Users contacts groups management sys
*/

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

//

var ContactsGroups = {};

ContactsGroups.create = function ( uid, name, callback ) {

    UserModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with id:\'' + uid + '\' not found.' });

        }

        //

        user.contactsGroups = user.contactsGroups || [];

        for ( var i = 0, il = user.contactsGroups.length; i < il; i ++ ) {

            if ( user.contactsGroups[ i ].name === name ) {

                return callback({ code: 2, message: 'Contact group with name \'' + name + '\' already exists.' });

            }

        }

        user.contactsGroups.push({
            name:       name,
            users:      [],
            default:    false,
            list:       true
        });

        //

        user.save( function ( err, user ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            var gid = user.contactsGroups[ user.contactsGroups.length - 1 ].gid;

            return callback({ success: true, groupId: gid });

        });

    });

};

ContactsGroups.remove = function ( uid, gid, callback ) {

    UserModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with id:\'' + uid + '\' not found.' });

        }

        //

        user.contactsGroups = user.contactsGroups || [];
        var origLength = user.contactsGroups.length;
        user.contactsGroups = user.contactsGroups.filter( function ( value ) { return value.gid !== gid; } );

        if ( user.contactsGroups.length === origLength ) {

            return callback({ code: 2, message: 'Contact group with id: \'' + gid + '\' not found.' });

        }

        //

        user.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback({ success: true });

        });

    });

};

ContactsGroups.getList = function ( userId, callback ) {

    UserModel
    .findOne({
        uid:    userId
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with id:\'' + userId + '\' not found.' });

        }

        //

        var result = [];

        user.contactsGroups = user.contactsGroups || [];

        for ( var i = 0, il = user.contactsGroups.length; i < il; i ++ ) {

            if ( ! user.contactsGroups[ i ].list ) continue;

            result.push({
                groupId:    user.contactsGroups[ i ].gid,
                name:       user.contactsGroups[ i ].name,
                count:      user.contactsGroups[ i ].users.length
            });

        }

        callback({ success: true, groups: result });

    });

};

ContactsGroups.addContacts = function ( uid, gid, usersUidList, callback ) {

    var errors = [];

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

            return callback({ code: 1, message: 'User with id:\'' + uid + '\' not found.' });

        }

        //

        user.contactsGroups = user.contactsGroups || [];

        var addedToGroup = false;

        for ( var i = 0, il = user.contactsGroups.length; i < il; i ++ ) {

            if ( user.contactsGroups[ i ].gid === gid ) {

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

                    //

                    for ( var j = 0, jl = usersUidList.length; j < jl; j ++ ) {

                        var userFound = false;

                        for ( var k = 0, kl = users.length; k < kl; k ++ ) {

                            if ( users[ k ].uid === usersUidList[ j ] ) {

                                userFound = true;
                                break;

                            }

                        }

                        if ( ! userFound ) {

                            errors.push( 'User with id: \'' + usersUidList[ j ] + '\' not found.' );

                        }

                    }

                    //

                    for ( var j = 0, jl = users.length; j < jl; j ++ ) {

                        var error = false;

                        for ( var k = 0, kl = user.contactsGroups[ i ].users.length; k < kl; k ++ ) {

                            if ( user.contactsGroups[ i ].users[ k ] === users[ j ].uid ) {

                                errors.push( 'User with id: \'' + users[ j ].uid + '\' is already in this contacts group.' );
                                error = true;
                                continue;

                            }

                        }

                        if ( ! error ) {

                            user.contactsGroups[ i ].users.push( users[ j ].uid );

                        }

                    }

                    //

                    user.save( function ( err ) {

                        if ( err ) {

                            return callback({ code: 0, message: err });

                        }

                        return callback({ success: true, errors: errors });

                    });

                });

                addedToGroup = true;
                break;

            }

        }

        //

        if ( addedToGroup === false ) {

            return callback({ code: 2, message: 'Contact group with id: \'' + gid + '\' not found.' });

        }

    });

};

ContactsGroups.removeContacts = function ( uid, gid, usersUidList, callback ) {

    UserModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with id:\'' + uid + '\' not found.' });

        }

        //

        user.contactsGroups = user.contactsGroups || [];
        var group = false;

        for ( var i = 0, il = user.contactsGroups.length; i < il; i ++ ) {

            if ( user.contactsGroups[ i ].gid === gid ) {

                group = user.contactsGroups[ i ];

                for ( var j = 0, jl = usersUidList.length; j < jl; j ++ ) {

                    user.contactsGroups[ i ].users = user.contactsGroups[ i ].users || [];
                    user.contactsGroups[ i ].users = user.contactsGroups[ i ].users.filter( function ( value ) { return value !== usersUidList[ j ]; } );

                }

                break;

            }

        }

        if ( ! group ) {

            return callback({ code: 1, message: 'Group with id: \'' + gid + '\' not found.' });

        }

        //

        user.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback({ success: true });

        });

    });

};

ContactsGroups.getContactsList = function ( params, callback ) {

    var uid = params.uid;
    var userId = params.userId;
    var sortattr = params.sortattr;
    var sortdir = params.sortdir;
    var search = params.search;
    var offset = params.offset;
    var itemsPerPage = params.itemsPerPage;
    var gid = params.gid;

    //

    var sort = {};

    if ( sortattr && sortdir ) {

        sort[ sortattr ] = ( sortdir === 'true' ) ? 1 : -1;

    }

    //

    UserModel
    .findOne({
        uid:  userId
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with id:\'' + userId + '\' not found.' });

        }

        //

        user.contactsGroups = user.contactsGroups || [];

        var result = [];
        var groupFound = false;

        for ( var i = 0, il = user.contactsGroups.length; i < il; i ++ ) {

            if ( user.contactsGroups[ i ].gid === gid ) {

                var query;

                if ( search ) {

                    query = {
                        '$and': [
                            {
                                uid: {
                                    '$in':  user.contactsGroups[ i ].users
                                }
                            },
                            {
                                searchIndex:    { '$regex': search, '$options': 'i' }
                            }
                        ]
                    };

                } else {

                    query = {
                        uid: {
                            '$in':  user.contactsGroups[ i ].users
                        }
                    };

                }

                //

                UserModel
                .find( query )
                .count( function ( err, count ) {

                    if ( err ) {

                        return callback({ code: 0, message: err });

                    }

                    //

                    UserModel
                    .find( query )
                    .sort( sort )
                    .skip( offset )
                    .limit( itemsPerPage )
                    .populate('eLink')
                    .exec( function ( err, users ) {

                        if ( err ) {

                            return callback({ code: 0, message: err });

                        }

                        //

                        for ( var j = 0, jl = users.length; j < jl; j ++ ) {

                            var employeeData = users[ j ].eLink || {};
                            var historyItem = ( employeeData.history ) ? employeeData.history.pop() : {};
                            employeeData.contactInfo = employeeData.contactInfo || {};

                            var dStart = new Date( historyItem.jobStartDate );
                            var dEnd = ( historyItem.jobEndDate != null && new Date( historyItem.jobEndDate ) != 'Invalid Date' ) ? new Date( historyItem.jobEndDate ) : new Date();
                            var yearsDiff = dEnd.getYear() - dStart.getYear();
                            var monthsDiff = dEnd.getMonth() - dStart.getMonth();

                            if ( monthsDiff < 0 ) {

                                yearsDiff --;
                                monthsDiff += 12;

                            }

                            if ( yearsDiff ) {

                                yearsDiff += ' yrs.';

                            } else {

                                yearsDiff = '';

                            }

                            if ( monthsDiff ) {

                                if ( yearsDiff ) yearsDiff += ' ';
                                monthsDiff += ' mo.'

                            }

                            result.push({
                                uid:            users[ j ].uid,
                                username:       users[ j ].username,
                                userpic:        users[ j ].userpic || '',
                                status:         users[ j ].status || 'Online',
                                firstName:      employeeData.firstName,
                                lastName:       employeeData.lastName,
                                jobTitle:       historyItem.jobTitle,
                                comp:           historyItem.company,
                                company:        historyItem.company,
                                city:           employeeData.contactInfo.city,
                                department:     historyItem.department,
                                manager:        historyItem.supervisorName,
                                duration:       yearsDiff + monthsDiff
                            });

                        }

                        return callback( null, { success: true, contacts: result, total: count } );

                    });

                });

                groupFound = true;
                break;

            }

        }

        if ( groupFound === false ) {

            return callback({ code: 2, message: 'Contact group with id: \'' + gid + '\' not found.' });

        }

    });

};

//

module.exports = ContactsGroups;
