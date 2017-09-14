/*
 * @author ohmed
 * Finance logic
*/

var FinanceSchema = require('./../../db/mongo/schemas/Finance.js');
var FinanceModel = MongoDB.mongoose.model( 'Finance', FinanceSchema );

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

//

var Finance = {};

Finance.getGeneralData = function ( params, callback ) {

    var year = params.date.year;
    var month = params.date.month;
    var day = params.date.day;

    var scopes = params.scopes;

    //

    return callback( null, { success: true } );

};

Finance.getEmployeeList = function ( params, callback ) {

    var year = params.date.year;
    var month = params.date.month;
    var day = params.date.day;
    var queryParam = params.queryParam;

    var scopes = params.scopes;

    //

    return callback( null, { success: true } );

};

//

module.exports = Finance;
