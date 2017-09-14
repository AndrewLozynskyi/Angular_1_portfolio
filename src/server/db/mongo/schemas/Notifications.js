/*
 * @author ohmed
 * Notifications entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var NotificationsSchema = new Schema({

    title:      String,
    content:    Object,
    uid:        String,
    status:     String,

    time: 		Date,

    //

    __v: { type: Number, select: false }

});

//

autoIncrement.initialize( MongoDB.connection );
NotificationsSchema.plugin( autoIncrement.plugin, {
    model: 'NotificationsSchema',
    field: 'nid'
});

//

module.exports = NotificationsSchema;
