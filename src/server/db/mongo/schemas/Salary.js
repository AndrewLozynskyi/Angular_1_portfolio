/*
 * @author ohmed
 * Salary countries entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var SalarySchema = new Schema({

    countries:      Object,

    year:           { type: Number, default: 0 },
    month:          { type: Number, default: 0 },

    //

    __v:            { type: Number, select: false }

});

autoIncrement.initialize( MongoDB.connection );
SalarySchema.plugin( autoIncrement.plugin, {
    model: 'Salary',
    field: '_id'
});

//

module.exports = SalarySchema;
