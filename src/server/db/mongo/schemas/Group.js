/*
 * @author ohmed
 * Groups entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var GroupSchema = new Schema({

    name:               { type: String, unique: true, required: true },
    users:              [ String ],
    default:            Boolean,

    roles:              [ Number ],

    //

    __v:                { type: Number, select: false }

});

//

autoIncrement.initialize( MongoDB.connection );
GroupSchema.plugin( autoIncrement.plugin, {
    model: 'Group',
    field: 'groupId'
});

//

module.exports = GroupSchema;
