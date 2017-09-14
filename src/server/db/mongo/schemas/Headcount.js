/*
 * @author ohmed
 * Headcount countries entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var HeadcountSchema = new Schema({

    countries:      Object,

    year:           { type: Number, default: 0 },
    month:          { type: Number, default: 0 },

    //

    __v:            { type: Number, select: false }

});

autoIncrement.initialize( MongoDB.connection );
HeadcountSchema.plugin( autoIncrement.plugin, {
    model: 'Headcount',
    field: '_id'
});

//

module.exports = HeadcountSchema;
