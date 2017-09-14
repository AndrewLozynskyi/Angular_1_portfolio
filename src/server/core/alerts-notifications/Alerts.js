/*
 * @author ohmed
 * Alerts manager
*/

var AlertsSchema = require('./../../db/mongo/schemas/Alerts.js');
var AlertsModel = MongoDB.mongoose.model( 'Alerts', AlertsSchema );

//

var AlertsManager = function () {

    this.init();

};

//

AlertsManager.prototype.init = function () {

    console.log('HR-tools: Alerts manager initialized.');

};

AlertsManager.prototype.markAsRead = function ( uid, nid ) {

    // todo

};

AlertsManager.prototype.getList = function ( uid, callback ) {

    AlertsModel
    .find({
        uid:    uid
    })
    .exec( function ( err, alerts ) {

        if ( err ) {

            return callback( { code: 0, message: err } );

        }

        //

        var result = [];

        for ( var i = 0, il = alerts.length; i < il; i ++ ) {

            result.push({
                aid:    alerts[ i ].nid
            });

        }

        //

        return callback( null, result );

    });

};

//

module.exports = new AlertsManager();
