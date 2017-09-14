/*
 * @author ohmed
 * Mongo DB connection setup
*/

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect( environment.mongodb.host + '/' + environment.mongodb.db );

var connection = mongoose.connection;

connection.on( 'error', console.error.bind ( console, 'connection error' ) );
connection.once( 'open', function ( callback ) {

    console.log( 'HR-tools: MongoDB connection succeeded.' );

});

//

module.exports = {
    mongoose: mongoose,
    connection: connection
};
