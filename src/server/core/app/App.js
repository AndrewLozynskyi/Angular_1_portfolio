/*
 * @author ohmed
 * App management functionality
*/

var App = {};

App.roles = require('./Roles.js');
App.settings = require('./Settings.js');

//

App.shutdown = function ( callback ) {

    console.log( 'Shutting down.' );
    callback( null, { success: true } );
    process.exit();

};

App.roles.updateCache();

//

module.exports = App;
