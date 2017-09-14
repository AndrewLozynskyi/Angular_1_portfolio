/*
 * @author ohmed
 * Dashboard filters management
*/

var FilterSchema = require('./../../db/mongo/schemas/Filter.js');
var FilterModel = MongoDB.mongoose.model( 'Filter', FilterSchema );

//

var Filter = {};

Filter.create = function ( uid, title, params, callback ) {

    FilterModel
    .create({
        ownerUid:   uid,
        title:      title
    }, function ( err, result ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        return callback( null, { filterId: result.filterId } );

    });

};

Filter.remove = function ( uid, filterId, callback ) {

    FilterModel
    .findOne({
        ownerUid:   uid,
        filterId:   filterId
    })
    .exec( function ( err, filter ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! filter ) {

            return callback({ code: 1, message: 'Filter with ID [' + filterId + '] does not exist.' });

        }

        filter.remove( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null );

        });

    });

};

Filter.update = function ( uid, filterId, title, params, callback ) {

    FilterModel
    .findOne({
        filterId:   filterId,
        uid:        uid
    })
    .exec( function ( err, filter ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        // todo: update filter params.

        return callback( null );

    });

};

Filter.getList = function ( uid, callback ) {

    FilterModel
    .find({
        ownerUid:        uid
    }, { _id: false, ownerUid: false, __v: false })
    .exec( function ( err, filters ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        return callback( null, filters );

    });

};

//

module.exports = Filter;
