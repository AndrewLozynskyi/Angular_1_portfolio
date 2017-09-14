/*
 * @author ohmed, vova
 * Atrittion countries entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var AttritionSchema = new Schema({

    countries:      Object,

    year:           { type: Number, default: 0 },
    month:          { type: Number, default: 0 },

    //

    __v:            { type: Number, select: false }

});

autoIncrement.initialize( MongoDB.connection );
AttritionSchema.plugin( autoIncrement.plugin, {
    model: 'Attrition',
    field: '_id'
});

//

module.exports = AttritionSchema;
