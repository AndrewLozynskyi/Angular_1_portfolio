/*
 * @author ohmed
 * Users contacts management sys
*/

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

//

var Contacts = {
    groups:     require('./ContactsGroups.js')
};

Contacts.getGeneralStatsInfo = function ( userId, sortattr, sortdir, callback ) {

    var sort = {};

    if ( sortattr && sortdir ) {

        sort[ sortattr ] = ( sortdir === 'true' ) ? 1 : -1;

    }

    var result = {

        allContactsCount:       0,
        contactsCount:          0,
        currentCount:           0,
        recentCount:            0,
        peopleYouMayKnowCount:  0,

        followersCount:         0,
        followingCount:         0,

        groups:                 []

    };

    //

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

        user.contactGroups = user.contactGroups || [];
        result.contactsCount = user.contacts.length;
        result.followersCount = user.followers.length;
        result.followingCount = user.following.length;
        result.recentCount = user.recentContacts.length;

        for ( var i = 0, il = user.contactsGroups.length; i < il; i ++ ) {

            if ( ! user.contactsGroups[ i ].list ) continue;

            result.groups.push({
                groupId:    user.contactsGroups[ i ].gid,
                name:       user.contactsGroups[ i ].name,
                count:      user.contactsGroups[ i ].users.length
            });

        }

        //

        UserModel
        .find()
        .sort( sort )
        .count( function ( err, count ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            result.allContactsCount = count;

            return callback( null, { success: true, message: result } );

        });

    });

};

Contacts.getList = function ( params, callback ) {

    switch ( params.type ) {

        case 'all':

            getAll( params, callback );
            break;

        case 'current':

            getCurrent( params, callback );
            break;

        case 'recent':

            getRecent( params, callback );
            break;

        case 'following':

            getFollowingList( params, callback );
            break;

        case 'followers':

            getFollowersList( params, callback );
            break;

        case 'group':

            Contacts.groups.getContactsList( params, callback );
            break;

        default:

            return callback({ code: 0, message: 'Query type not recognized.' });

    }

};

Contacts.add = function ( uid, usersUidList, callback ) {

    var errors = [];
    var updatedUsers = 0;

    //

    UserModel
    .findOne({
        uid:   uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid \'' + uid + '\' not found.' });

        }

        //

        UserModel
        .find({
            uid: {
                '$in':  usersUidList
            }
        })
        .exec( function ( err, users ) {

            if ( err ) {

                errors.push( err );

            }

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                if ( user.contacts.indexOf( users[ i ].uid ) !== -1 ) {

                    errors.push( 'User with uid ' + users[ i ].uid + ' is already in contact list.' );
                    updatedUsers ++;

                    if ( users.length === updatedUsers ) {

                        return callback( null, { success: true, errors: errors } );

                    }

                    continue;

                }

                users[ i ].contacts.push( user.uid );
                user.contacts.push( users[ i ].uid );

                user.recentContacts.push({
                    uid:    users[ i ].uid,
                    date:   new Date()
                });

                users[ i ].recentContacts.push({
                    uid:    user.uid,
                    date:   new Date()
                });

                //

                users[ i ].save( function ( err ) {

                    updatedUsers ++;

                    if ( err ) {

                        errors.push( err );

                    }

                    if ( users.length === updatedUsers ) {

                        user.save( function ( err ) {

                            if ( err ) {

                                errors.push( err );

                            }

                            return callback( null, { success: true, errors: errors } );

                        });

                    }

                });

            }

        });

    });

};

Contacts.remove = function ( uid, usersUidList, callback ) {

    var errors = [];
    var updatedUsers = 0;

    //

    UserModel
    .findOne({
        uid:   uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid \'' + uid + '\' not found.' });

        }

        //

        UserModel
        .find({
            uid: {
                '$in':  usersUidList
            }
        })
        .exec( function ( err, users ) {

            if ( err ) {

                errors.push( err );

            }

            //

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                for ( var j = 0, jl = user.contactsGroups.length; j < jl; j ++ ) {

                    user.contactsGroups[ j ].users = user.contactsGroups[ j ].users || [];
                    user.contactsGroups[ j ].users = user.contactsGroups[ j ].users.filter( function ( value ) { return value !== users[ i ].uid });

                }

                users[ i ].contactsGroups.users = users[ i ].contactsGroups.users || [];
                users[ i ].contactsGroups.users = users[ i ].contactsGroups.users.filter( function ( value ) { return value !== user.uid });

                //

                users[ i ].contacts = users[ i ].contacts.filter( function ( value ) { return value !== user.uid; });
                user.contacts = user.contacts.filter( function ( value ) { return value !== users[ i ].uid; });

                //

                users[ i ].recentContacts.users = users[ i ].recentContacts.users || [];
                users[ i ].recentContacts.users = users[ i ].recentContacts.users.filter( function ( value ) { return value.uid !== user.uid; } );

                user.recentContacts = user.recentContacts || [];
                user.recentContacts = user.recentContacts.filter( function ( value ) { return value.uid !== users[ i ].uid; } );

                //

                users[ i ].save( function ( err ) {

                    updatedUsers ++;

                    if ( err ) {

                        errors.push( err );

                    }

                    if ( users.length === updatedUsers ) {

                        user.save( function ( err ) {

                            if ( err ) {

                                errors.push( err );

                            }

                            return callback( null, { success: true, errors: errors } );

                        });

                    }

                });

            }

        });

    });

};

Contacts.follow = function ( uid, usersUidList, callback ) {

    var errors = [];
    var updatedUsers = 0;

    //

    UserModel
    .findOne({
        uid:   uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid \'' + uid + '\' not found.' });

        }

        //

        UserModel
        .find({
            uid: {
                '$in':  usersUidList
            }
        })
        .exec( function ( err, users ) {

            if ( err ) {

                errors.push( err );

            }

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                if ( user.following.indexOf( users[ i ].uid ) !== -1 ) {

                    errors.push( 'User with uid ' + users[ i ].uid + ' is already in followers list.' );
                    updatedUsers ++;

                    if ( users.length === updatedUsers ) {

                        return callback( null, { success: true, errors: errors } );

                    }

                    continue;

                }

                users[ i ].followers.push( user.uid );
                user.following.push( users[ i ].uid );

                users[ i ].save( function ( err ) {

                    updatedUsers ++;

                    if ( err ) {

                        errors.push( err );

                    }

                    if ( users.length === updatedUsers ) {

                        user.save( function ( err ) {

                            if ( err ) {

                                errors.push( err );

                            }

                            return callback( null, { success: true, errors: errors } );

                        });

                    }

                });

            }

        });

    });

};

Contacts.unfollow = function ( uid, usersUidList, callback ) {

    var errors = [];
    var updatedUsers = 0;

    //

    UserModel
    .findOne({
        uid:   uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid \'' + uid + '\' not found.' });

        }

        //

        UserModel
        .find({
            uid: {
                '$in':  usersUidList
            }
        })
        .exec( function ( err, users ) {

            if ( err ) {

                errors.push( err );

            }

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                users[ i ].followers = users[ i ].followers.filter( function ( value ) { return value !== user.uid; });
                user.following = user.following.filter( function ( value ) { return value !== users[ i ].uid; });

                users[ i ].save( function ( err ) {

                    updatedUsers ++;

                    if ( err ) {

                        errors.push( err );

                    }

                    if ( users.length === updatedUsers ) {

                        user.save( function ( err ) {

                            if ( err ) {

                                errors.push( err );

                            }

                            return callback( null, { success: true, errors: errors } );

                        });

                    }

                });

            }

        });

    });

};

Contacts.filterRecent = function ( recentContacts ) {

    var now = Date.now();

    recentContacts = recentContacts.filter( function ( value ) {

        return ( now - value.date.getTime() < 1000 * 60 * 60 * 24 * 3 );

    });

    return recentContacts;

};

// internal methods

function getFollowersList ( params, callback ) {

    var uid = params.uid;
    var userId = params.userId;
    var sortattr = params.sortattr;
    var sortdir = params.sortdir;
    var search = params.search;
    var offset = params.offset;
    var itemsPerPage = params.itemsPerPage;

    //

    var sort = {};

    if ( sortattr && sortdir ) {

        sort[ sortattr ] = ( sortdir === 'true' ) ? 1 : -1;

    }

    //

    UserModel
    .findOne( {
        uid:    userId
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid \'' + userId + '\' not found.' });

        }

        //

        var query;

        if ( search ) {

            query = {
                '$and': [
                    {
                        uid: {
                            '$in':  user.followers
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
                    '$in':  user.followers
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

                var result = [];

                for ( var i = 0, il = users.length; i < il; i ++ ) {

                    var employeeData = users[ i ].eLink || {};
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
                        uid:            users[ i ].uid,
                        username:       users[ i ].username,
                        userpic:        users[ i ].userpic || '',
                        status:         users[ i ].status || 'Online',
                        firstName:      employeeData.firstName,
                        lastName:       employeeData.lastName,
                        jobTitle:       historyItem.jobTitle,
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

    });

};

function getFollowingList ( params, callback ) {

    var uid = params.uid;
    var userId = params.userId;
    var sortattr = params.sortattr;
    var sortdir = params.sortdir;
    var search = params.search;
    var offset = params.offset;
    var itemsPerPage = params.itemsPerPage;

    //

    var sort = {};

    if ( sortattr && sortdir ) {

        sort[ sortattr ] = ( sortdir === 'true' ) ? 1 : -1;

    }

    //

    UserModel
    .findOne({
        uid:    userId
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid \'' + userId + '\' not found.' });

        }

        //

        var query;

        if ( search ) {

            query = {
                '$and': [
                    {
                        uid: {
                            '$in':  user.following
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
                    '$in':  user.following
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

                var result = [];

                for ( var i = 0, il = users.length; i < il; i ++ ) {

                    var employeeData = users[ i ].eLink || {};
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
                        uid:            users[ i ].uid,
                        username:       users[ i ].username,
                        userpic:        users[ i ].userpic || '',
                        status:         users[ i ].status || 'Online',
                        firstName:      employeeData.firstName,
                        lastName:       employeeData.lastName,
                        jobTitle:       historyItem.jobTitle,
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

    });

};

function getCurrent ( params, callback ) {

    var uid = params.uid;
    var userId = params.userId;
    var sortattr = params.sortattr;
    var sortdir = params.sortdir;
    var search = params.search;
    var offset = params.offset;
    var itemsPerPage = params.itemsPerPage;

    //

    var sort = {};

    if ( sortattr && sortdir ) {

        sort[ sortattr ] = ( sortdir === 'true' ) ? 1 : -1;

    }

    //

    UserModel
    .findOne({
        uid:   userId
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid \'' + userId + '\' not found.' });

        }

        var query;

        if ( search ) {

            query = {
                '$and': [
                    {
                        uid: {
                            '$in':  user.contacts
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
                    '$in':  user.contacts
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

                var result = [];

                for ( var i = 0, il = users.length; i < il; i ++ ) {

                    var employeeData = users[ i ].eLink || {};
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
                        uid:            users[ i ].uid,
                        username:       users[ i ].username,
                        userpic:        users[ i ].userpic || false,
                        status:         users[ i ].status || 'Online',
                        firstName:      employeeData.firstName,
                        lastName:       employeeData.lastName,
                        jobTitle:       historyItem.jobTitle,
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

    });

};

function getAll ( params, callback ) {

    var uid = params.uid;
    var userId = params.userId;
    var sortattr = params.sortattr;
    var sortdir = params.sortdir;
    var search = params.search;
    var offset = params.offset;
    var itemsPerPage = params.itemsPerPage;

    //

    var query = {};

    if ( search ) {

        query[ 'searchIndex' ] = { '$regex': search, '$options': 'i' };

    }

    //

    var sort = {};

    if ( sortattr && sortdir ) {

        sort[ sortattr ] = ( sortdir === 'true' ) ? 1 : -1;

    }

    UserModel
    .find( query )
    .count( function ( err, count ) {

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

            var result = [];

            for ( var i = 0, il = users.length; i < il; i ++ ) {

                var employeeData = users[ i ].eLink || {};
                var historyItem = ( employeeData.history ) ? employeeData.history.pop() : {};
                var contactInfo = employeeData.contactInfo || {};

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
                    uid:            users[ i ].uid,
                    username:       users[ i ].username,
                    userpic:        users[ i ].userpic || false,
                    status:         users[ i ].status || 'Online',
                    firstName:      employeeData.firstName,
                    lastName:       employeeData.lastName,
                    jobTitle:       historyItem.jobTitle,
                    firstName:      employeeData.firstName,
                    lastName:       employeeData.lastName,
                    company:        historyItem.company,
                    city:           contactInfo.city,
                    department:     historyItem.department,
                    manager:        historyItem.supervisorName,
                    duration:       yearsDiff + monthsDiff
                });

            }

            return callback( null, { success: true, contacts: result, total: count } );

        });

    });

};

function getRecent ( params, callback ) {

    var uid = params.uid;
    var userId = params.userId;
    var sortattr = params.sortattr;
    var sortdir = params.sortdir;
    var search = params.search;
    var offset = params.offset;
    var itemsPerPage = params.itemsPerPage;

    //

    var sort = {};

    if ( sortattr && sortdir ) {

        sort[ sortattr ] = ( sortdir === 'true' ) ? 1 : -1;

    }

    //

    UserModel
    .findOne({
        uid:    userId
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with uid \'' + userId + '\' not found.' });

        }

        //

        var recentContacts = Contacts.filterRecent( user.recentContacts );

        user.recentContacts = recentContacts;
        user.save( function ( err ) {} );

        var recent = [];
        for ( var i = 0, il = recentContacts.length; i < il; i ++ ) {

            recent.push( recentContacts[ i ].uid );

        }

        //

        var query;

        if ( search ) {

            query = {
                '$and': [
                    {
                        uid: {
                            '$in':  recent
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
                    '$in':  recent
                }
            };

        }

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

                var result = [];

                for ( var i = 0, il = users.length; i < il; i ++ ) {

                    var employeeData = users[ i ].eLink || {};
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
                        uid:            users[ i ].uid,
                        username:       users[ i ].username,
                        userpic:        users[ i ].userpic || '',
                        status:         users[ i ].status || 'Online',
                        firstName:      employeeData.firstName,
                        lastName:       employeeData.lastName,
                        jobTitle:       historyItem.jobTitle,
                        company:        historyItem.company,
                        city:           employeeData.contactInfo.city,
                        department:     historyItem.department,
                        manager:        historyItem.supervisorName,
                        duration:       yearsDiff + monthsDiff
                    });

                }

                return callback( null, { success: true, contacts: result, total: count });

            });

        });

    });

};

//

module.exports = Contacts;
