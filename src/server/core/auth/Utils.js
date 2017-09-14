/*
 * @author ohmed
 * Some utils functions
*/

var crypto = require('crypto');

//

var Utils = {};

Utils.genRandomString = function ( length ) {

    return crypto.randomBytes( Math.ceil( length / 2 ) ).toString( 'hex' ).slice( 0, length );

};

Utils.passwordHashing = function ( password, salt ) {

    var hash = crypto.createHmac( 'sha256', salt );
    hash.update( password );
    var value = hash.digest( 'hex' );

    return {
        salt: salt,
        passwordHash: value
    };

};

Utils.generateKey = function () {

    var sha = crypto.createHash( 'sha256' );
    sha.update( Math.random().toString() );

    return sha.digest( 'hex' );

};

//

module.exports = Utils;
