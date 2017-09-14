/*
 * @author ohmed
 * Finance countries entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var FinanceSchema = new Schema({

    countries:      Object,

    year:           { type: Number, default: 0 },
    month:          { type: Number, default: 0 },

    //

    __v:            { type: Number, select: false }

});

autoIncrement.initialize( MongoDB.connection );
FinanceSchema.plugin( autoIncrement.plugin, {
    model: 'Finance',
    field: '_id'
});

//

module.exports = FinanceSchema;
