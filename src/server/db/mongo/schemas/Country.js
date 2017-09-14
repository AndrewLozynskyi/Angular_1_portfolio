/*
 * @author ohmed
 * Country entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

var CountrySchema = new Schema({

    name:           String,
    departments:    { type: Array, default: [] },

    //

    __v:            { type: Number, select: false }

});

autoIncrement.initialize( MongoDB.connection );
CountrySchema.plugin( autoIncrement.plugin, {
    model: 'Country',
    field: '_id'
});

//

module.exports = CountrySchema;
