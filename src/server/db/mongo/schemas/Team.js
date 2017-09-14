/*
 * @author ohmed
 * Team entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var TeamSchema = new Schema({

    name:           String,
    location:       String,
    creationDate:   Date,
    description:    String,

    type:           { type: String, default: '' },
    project:        { type: String, default: '' },
    manager:        { type: String, default: '' },
    description:    { type: String, default: '' },

    department:     String,
    employees:      [ String ],
    color:          [ Number ],

    //

    __v:        { type: Number, select: false }

});

//

autoIncrement.initialize( MongoDB.connection );
TeamSchema.plugin( autoIncrement.plugin, {
    model: 'Team',
    field: '_id'
});

//

module.exports = TeamSchema;
