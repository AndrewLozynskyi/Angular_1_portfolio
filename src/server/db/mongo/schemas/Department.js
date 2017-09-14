/*
 * @author ohmed
 * Department entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

var DepartmentSchema = new Schema({

    name:           String,
    countryName:    String,
    countryId:      { type: Number, ref: 'Country' },

    //

    __v:        { type: Number, select: false }

});

autoIncrement.initialize( MongoDB.connection );
DepartmentSchema.plugin( autoIncrement.plugin, {
    model: 'Department',
    field: '_id'
});

//

module.exports = DepartmentSchema;
