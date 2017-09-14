/*
 * @author ohmed
 * Workforce entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var WorkforceSchema = new Schema({

    countries:      Object,

    year:           { type: Number, default: 0 },
    month:          { type: Number, default: 0 },

    //

    __v:            { type: Number, select: false }

});

autoIncrement.initialize( MongoDB.connection );
WorkforceSchema.plugin( autoIncrement.plugin, {
    model: 'Workforce',
    field: '_id'
});

//

module.exports = WorkforceSchema;
