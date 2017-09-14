/*
 * @author ohmed
 * Currencies entity schema
*/

var Schema = MongoDB.mongoose.Schema;

var CurrenciesSchema = new Schema({

    name:           String,
    value:          Number,

    //

    __v:            { type: Number, select: false }

});

//

module.exports = CurrenciesSchema;
