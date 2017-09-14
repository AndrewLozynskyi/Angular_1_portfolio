/*
 * @author ohmed
 * Company entity schema
*/

var Schema = MongoDB.mongoose.Schema;

var CompanySchema = new Schema({

    title:  String,

    //

    __v: { type: Number, select: false }

});

//

module.exports = UserSchema;
