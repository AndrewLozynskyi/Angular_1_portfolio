/*
 * @author ohmed
 * Admin service api
*/

var core = require('./../core/app/Admin.js');

//

var Admin = {};

Admin.getGeneralData = function ( req, res ) {

    core.getGeneralData( {}, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result );

    });

};

//

module.exports = Admin;
