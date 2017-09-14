/*
 * @author ohmed
 * Alerts entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var AlertsSchema = new Schema({

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
AlertsSchema.plugin( autoIncrement.plugin, {
    model: 'AlertsSchema',
    field: 'aid'
});

//

module.exports = AlertsSchema;
