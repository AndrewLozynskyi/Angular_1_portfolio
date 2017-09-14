/*
 * @author ohmed
 * Notification manager
*/

var NotificationsSchema = require('./../../db/mongo/schemas/Notifications.js');
var NotificationsModel = MongoDB.mongoose.model( 'Notifications', NotificationsSchema );

//

var NotificationsManager = function () {

    this.init();

};

//

NotificationsManager.prototype.init = function () {

    console.log('HR-tools: Notification manager initialized.');

};

NotificationsManager.prototype.add = function ( uid, params ) {

    // todo

};

NotificationsManager.prototype.remove = function ( uid, nid ) {

    // todo

};

NotificationsManager.prototype.markAsRead = function ( uid, nid ) {

    // todo

};

NotificationsManager.prototype.getList = function ( uid, callback ) {

    NotificationsModel
    .find({
        uid:    uid
    })
    .exec( function ( err, notifications ) {

        if ( err ) {

            return callback( { code: 0, message: err } );

        }

        //

        var result = [];

        for ( var i = 0, il = notifications.length; i < il; i ++ ) {

            result.push({
                nid:    notifications[ i ].nid
            });

        }

        //

        return callback( null, result );

    });

};

//

module.exports = new NotificationsManager();
