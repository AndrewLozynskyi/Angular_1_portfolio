/*
 * @author ohmed
 * Filter entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var DashboardFilterSchema = new Schema({

    title:      String,
    ownerUid:   String,

    //

    __v: { type: Number, select: false }

});

//

autoIncrement.initialize( MongoDB.connection );
DashboardFilterSchema.plugin( autoIncrement.plugin, {
    model: 'DashboardFilter',
    field: 'filterId'
});

//

module.exports = DashboardFilterSchema;
